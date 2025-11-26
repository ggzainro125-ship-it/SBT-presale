use anyhow::{Result, anyhow};
use solana_client::rpc_client::RpcClient;
use solana_sdk::{
    commitment_config::CommitmentConfig,
    pubkey::Pubkey,
    signature::Signature,
    transaction::Transaction,
    system_instruction,
    signer::{keypair::Keypair, Signer},
};
use spl_token::{
    instruction::{initialize_mint, mint_to, create_associated_token_account},
    state::Mint,
};
use spl_associated_token_account::get_associated_token_address;
use std::{env, str::FromStr};
use tokio::time::{sleep, Duration};

#[derive(Clone)]
pub struct SolanaService {
    client: RpcClient,
    owner_keypair: Keypair,
    token_mint: Pubkey,
    network: String,
}

#[derive(Debug)]
pub struct VerifiedTransaction {
    pub signature: String,
    pub slot: u64,
    pub amount: f64,
    pub from: String,
    pub to: String,
}

impl SolanaService {
    pub async fn new() -> Result<Self> {
        let network = env::var("SOLANA_NETWORK").unwrap_or_else(|_| "devnet".to_string());
        
        let rpc_url = match network.as_str() {
            "mainnet" => "https://api.mainnet-beta.solana.com",
            "devnet" => "https://api.devnet.solana.com",
            "testnet" => "https://api.testnet.solana.com",
            _ => "https://api.devnet.solana.com",
        };

        let client = RpcClient::new_with_commitment(rpc_url, CommitmentConfig::confirmed());

        // Load owner keypair
        let keypair_path = env::var("OWNER_KEYPAIR_PATH")
            .unwrap_or_else(|_| "./owner-keypair.json".to_string());
        
        let keypair_data = std::fs::read_to_string(&keypair_path)
            .map_err(|e| anyhow!("Failed to read keypair file {}: {}", keypair_path, e))?;
        
        let keypair_bytes: Vec<u8> = serde_json::from_str(&keypair_data)
            .map_err(|e| anyhow!("Failed to parse keypair JSON: {}", e))?;
        
        let owner_keypair = Keypair::from_bytes(&keypair_bytes)
            .map_err(|e| anyhow!("Failed to create keypair from bytes: {}", e))?;

        // Get token mint address
        let token_mint_str = env::var("TOKEN_MINT_ADDRESS")
            .map_err(|_| anyhow!("TOKEN_MINT_ADDRESS environment variable not set"))?;
        
        let token_mint = Pubkey::from_str(&token_mint_str)
            .map_err(|e| anyhow!("Invalid TOKEN_MINT_ADDRESS: {}", e))?;

        println!("✅ Solana service initialized:");
        println!("   Network: {}", network);
        println!("   RPC URL: {}", rpc_url);
        println!("   Owner: {}", owner_keypair.pubkey());
        println!("   Token Mint: {}", token_mint);

        Ok(Self {
            client,
            owner_keypair,
            token_mint,
            network,
        })
    }

    /// Verify a Solana transaction exists and matches expected parameters
    pub async fn verify_transaction(
        &self,
        signature: &str,
        expected_recipient: &str,
        expected_amount_tokens: f64,
    ) -> Result<VerifiedTransaction> {
        let sig = Signature::from_str(signature)
            .map_err(|e| anyhow!("Invalid signature format: {}", e))?;

        // Get transaction details with retries
        let mut attempts = 0;
        let max_attempts = 5;
        
        let transaction = loop {
            match self.client.get_transaction(&sig, solana_client::rpc_config::RpcTransactionConfig::default()) {
                Ok(tx) => break tx,
                Err(e) if attempts < max_attempts => {
                    attempts += 1;
                    println!("Attempt {}/{} to fetch transaction {}: {}", attempts, max_attempts, signature, e);
                    sleep(Duration::from_secs(2)).await;
                    continue;
                }
                Err(e) => return Err(anyhow!("Failed to fetch transaction after {} attempts: {}", max_attempts, e)),
            }
        };

        let tx_meta = transaction.transaction.meta
            .ok_or_else(|| anyhow!("Transaction metadata not available"))?;

        // Check if transaction was successful
        if tx_meta.err.is_some() {
            return Err(anyhow!("Transaction failed on-chain"));
        }

        // Parse transaction to verify payment details
        let tx_data = transaction.transaction.transaction;
        let message = tx_data.message;
        
        // Find the recipient (owner) in account keys
        let owner_pubkey = self.owner_keypair.pubkey();
        let recipient_index = message.account_keys.iter()
            .position(|key| *key == owner_pubkey)
            .ok_or_else(|| anyhow!("Owner not found in transaction recipients"))?;

        // Calculate expected SOL amount
        let token_price_sol: f64 = env::var("TOKEN_PRICE_SOL")
            .unwrap_or_else(|_| "0.000045".to_string())
            .parse()
            .unwrap_or(0.000045);
        
        let expected_lamports = (expected_amount_tokens * token_price_sol * 1_000_000_000.0) as u64;
        
        // Check balance changes
        let pre_balances = &tx_meta.pre_balances;
        let post_balances = &tx_meta.post_balances;
        
        if recipient_index >= pre_balances.len() || recipient_index >= post_balances.len() {
            return Err(anyhow!("Invalid balance data"));
        }

        let balance_change = post_balances[recipient_index] as i64 - pre_balances[recipient_index] as i64;
        
        // Allow for small variations due to fees (within 1%)
        let tolerance = (expected_lamports as f64 * 0.01) as i64;
        if balance_change < (expected_lamports as i64 - tolerance) {
            return Err(anyhow!(
                "Insufficient payment: expected ~{} lamports, got {} lamports change",
                expected_lamports, balance_change
            ));
        }

        // Verify sender
        let sender_pubkey = message.account_keys.get(0)
            .ok_or_else(|| anyhow!("No sender found in transaction"))?;
        
        let expected_sender = Pubkey::from_str(expected_recipient)
            .map_err(|e| anyhow!("Invalid expected recipient pubkey: {}", e))?;
        
        if *sender_pubkey != expected_sender {
            return Err(anyhow!("Transaction sender mismatch"));
        }

        Ok(VerifiedTransaction {
            signature: signature.to_string(),
            slot: transaction.slot,
            amount: expected_amount_tokens,
            from: sender_pubkey.to_string(),
            to: owner_pubkey.to_string(),
        })
    }

    /// Transfer SPL tokens to buyer
    pub async fn transfer_tokens(&self, recipient: &str, amount: f64) -> Result<String> {
        let recipient_pubkey = Pubkey::from_str(recipient)
            .map_err(|e| anyhow!("Invalid recipient pubkey: {}", e))?;

        // Get or create associated token account for recipient
        let recipient_ata = get_associated_token_address(&recipient_pubkey, &self.token_mint);
        
        // Check if ATA exists
        let ata_exists = match self.client.get_account(&recipient_ata) {
            Ok(_) => true,
            Err(_) => false,
        };

        let mut instructions = Vec::new();

        // Create ATA if it doesn't exist
        if !ata_exists {
            let create_ata_ix = create_associated_token_account(
                &self.owner_keypair.pubkey(),
                &recipient_pubkey,
                &self.token_mint,
                &spl_token::id(),
            );
            instructions.push(create_ata_ix);
        }

        // Convert token amount to smallest unit (considering decimals)
        let token_decimals = self.get_token_decimals().await?;
        let amount_units = (amount * 10_f64.powi(token_decimals as i32)) as u64;

        // Create mint instruction
        let mint_ix = mint_to(
            &spl_token::id(),
            &self.token_mint,
            &recipient_ata,
            &self.owner_keypair.pubkey(),
            &[&self.owner_keypair.pubkey()],
            amount_units,
        )?;
        instructions.push(mint_ix);

        // Create and send transaction
        let recent_blockhash = self.client.get_latest_blockhash()?;
        let transaction = Transaction::new_signed_with_payer(
            &instructions,
            Some(&self.owner_keypair.pubkey()),
            &[&self.owner_keypair],
            recent_blockhash,
        );

        let signature = self.client.send_and_confirm_transaction(&transaction)?;
        
        println!("✅ Transferred {} tokens to {}, signature: {}", amount, recipient, signature);
        
        Ok(signature.to_string())
    }

    /// Get token mint decimals
    async fn get_token_decimals(&self) -> Result<u8> {
        let mint_account = self.client.get_account(&self.token_mint)?;
        let mint_data = Mint::unpack(&mint_account.data)?;
        Ok(mint_data.decimals)
    }

    /// Create a new SPL token mint (for initial setup)
    pub async fn create_token_mint(&self, decimals: u8, initial_supply: u64) -> Result<Pubkey> {
        // This would be used for initial token creation
        // Implementation depends on your specific token requirements
        todo!("Implement token mint creation if needed")
    }

    /// Get current token supply and other stats
    pub async fn get_token_stats(&self) -> Result<serde_json::Value> {
        let mint_account = self.client.get_account(&self.token_mint)?;
        let mint_data = Mint::unpack(&mint_account.data)?;
        
        Ok(serde_json::json!({
            "mint_address": self.token_mint.to_string(),
            "supply": mint_data.supply,
            "decimals": mint_data.decimals,
            "is_initialized": mint_data.is_initialized,
            "freeze_authority": mint_data.freeze_authority.map(|k| k.to_string()),
            "mint_authority": mint_data.mint_authority.map(|k| k.to_string()),
        }))
    }
}
