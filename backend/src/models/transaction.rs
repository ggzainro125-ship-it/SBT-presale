use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;
use chrono::{DateTime, Utc};
use validator::Validate;

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct Transaction {
    pub id: Uuid,
    pub user_id: Uuid,
    pub solana_signature: String,
    pub amount_tokens: rust_decimal::Decimal,
    pub amount_sol: rust_decimal::Decimal,
    pub payment_method: String,
    pub status: String,
    pub block_height: Option<i64>,
    pub processed_at: Option<DateTime<Utc>>,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Deserialize, Validate)]
pub struct CreateTransactionRequest {
    #[validate(length(min = 80, max = 90))]
    pub signature: String,
    #[validate(length(min = 32, max = 44))]
    pub buyer: String,
    #[validate(range(min = 1.0))]
    pub amount: f64,
    pub payment_method: Option<String>,
}

#[derive(Debug, Serialize)]
pub struct TransactionResponse {
    pub id: Uuid,
    pub signature: String,
    pub amount_tokens: f64,
    pub amount_sol: f64,
    pub payment_method: String,
    pub status: String,
    pub block_height: Option<i64>,
    pub processed_at: Option<DateTime<Utc>>,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Serialize)]
pub struct TransactionStats {
    pub total_transactions: i64,
    pub total_tokens_sold: f64,
    pub total_sol_raised: f64,
    pub successful_transactions: i64,
    pub pending_transactions: i64,
    pub failed_transactions: i64,
}

impl From<Transaction> for TransactionResponse {
    fn from(tx: Transaction) -> Self {
        Self {
            id: tx.id,
            signature: tx.solana_signature,
            amount_tokens: tx.amount_tokens.to_string().parse().unwrap_or(0.0),
            amount_sol: tx.amount_sol.to_string().parse().unwrap_or(0.0),
            payment_method: tx.payment_method,
            status: tx.status,
            block_height: tx.block_height,
            processed_at: tx.processed_at,
            created_at: tx.created_at,
        }
    }
}
