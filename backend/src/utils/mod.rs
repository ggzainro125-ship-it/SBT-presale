use sqlx::PgPool;
use uuid::Uuid;
use anyhow::Result;
use crate::models::*;

/// Get or create user by wallet address
pub async fn get_or_create_user(pool: &PgPool, wallet_address: &str) -> Result<User> {
    // Try to find existing user
    if let Ok(user) = sqlx::query_as::<_, User>(
        "SELECT * FROM users WHERE wallet_address = $1"
    )
    .bind(wallet_address)
    .fetch_one(pool)
    .await
    {
        return Ok(user);
    }

    // Create new user
    let referral_code = User::generate_referral_code();
    let user = sqlx::query_as::<_, User>(
        r#"
        INSERT INTO users (wallet_address, referral_code, created_at, updated_at)
        VALUES ($1, $2, NOW(), NOW())
        RETURNING *
        "#
    )
    .bind(wallet_address)
    .bind(&referral_code)
    .fetch_one(pool)
    .await?;

    Ok(user)
}

/// Check whitelist eligibility
pub async fn check_whitelist_eligibility(
    pool: &PgPool, 
    user: &User, 
    amount: f64
) -> Result<()> {
    // Check if whitelist is enabled
    let whitelist_enabled: bool = sqlx::query_scalar(
        "SELECT value::boolean FROM presale_settings WHERE key = 'whitelist_enabled'"
    )
    .fetch_optional(pool)
    .await?
    .unwrap_or(false);

    if !whitelist_enabled {
        return Ok(());
    }

    if !user.is_whitelisted {
        return Err(anyhow::anyhow!("User not whitelisted"));
    }

    // Check allocation limits
    if let Ok(entry) = sqlx::query_as::<_, WhitelistEntry>(
        "SELECT * FROM whitelist_entries WHERE user_id = $1 AND (expires_at IS NULL OR expires_at > NOW())"
    )
    .bind(user.id)
    .fetch_one(pool)
    .await
    {
        let remaining = entry.max_allocation - entry.used_allocation;
        if amount > remaining.to_string().parse::<f64>().unwrap_or(0.0) {
            return Err(anyhow::anyhow!(
                "Exceeds allocation limit. Remaining: {}", 
                remaining
            ));
        }
    }

    Ok(())
}

/// Create transaction record
pub async fn create_transaction(
    pool: &PgPool,
    user_id: &Uuid,
    req: &CreateTransactionRequest,
) -> Result<Transaction> {
    let token_price: f64 = sqlx::query_scalar(
        "SELECT value::float FROM presale_settings WHERE key = 'token_price_sol'"
    )
    .fetch_optional(pool)
    .await?
    .unwrap_or(0.000045);

    let transaction = sqlx::query_as::<_, Transaction>(
        r#"
        INSERT INTO transactions (
            user_id, solana_signature, amount_tokens, amount_sol, 
            payment_method, status, created_at
        )
        VALUES ($1, $2, $3, $4, $5, 'pending', NOW())
        RETURNING *
        "#
    )
    .bind(user_id)
    .bind(&req.signature)
    .bind(rust_decimal::Decimal::from_f64_retain(req.amount).unwrap())
    .bind(rust_decimal::Decimal::from_f64_retain(req.amount * token_price).unwrap())
    .bind(req.payment_method.as_deref().unwrap_or("SOL"))
    .fetch_one(pool)
    .await?;

    Ok(transaction)
}

/// Update transaction status
pub async fn update_transaction_status(
    pool: &PgPool,
    transaction_id: &Uuid,
    status: &str,
    block_height: Option<i64>,
) -> Result<()> {
    sqlx::query(
        r#"
        UPDATE transactions 
        SET status = $1, block_height = $2, processed_at = NOW(), updated_at = NOW()
        WHERE id = $3
        "#
    )
    .bind(status)
    .bind(block_height)
    .bind(transaction_id)
    .execute(pool)
    .await?;

    Ok(())
}

/// Process referral bonus
pub async fn process_referral_bonus(
    pool: &PgPool,
    referrer_id: &Uuid,
    purchase_amount: f64,
) -> Result<()> {
    let bonus_percentage: f64 = sqlx::query_scalar(
        "SELECT value::float FROM presale_settings WHERE key = 'referral_bonus'"
    )
    .fetch_optional(pool)
    .await?
    .unwrap_or(5.0);

    let bonus_tokens = purchase_amount * (bonus_percentage / 100.0);

    sqlx::query(
        r#"
        UPDATE referrals 
        SET bonus_tokens = bonus_tokens + $1
        WHERE referrer_id = $2 AND is_active = true
        "#
    )
    .bind(bonus_tokens)
    .bind(referrer_id)
    .execute(pool)
    .await?;

    Ok(())
}

#[derive(sqlx::FromRow)]
pub struct WhitelistEntry {
    pub id: Uuid,
    pub user_id: Uuid,
    pub tier: i32,
    pub max_allocation: rust_decimal::Decimal,
    pub used_allocation: rust_decimal::Decimal,
}
