use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;
use chrono::{DateTime, Utc};
use validator::Validate;

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct User {
    pub id: Uuid,
    pub wallet_address: String,
    pub email: Option<String>,
    pub discord_username: Option<String>,
    pub twitter_username: Option<String>,
    pub referral_code: Option<String>,
    pub referred_by: Option<Uuid>,
    pub is_whitelisted: bool,
    pub whitelist_tier: i32,
    pub kyc_status: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Deserialize, Validate)]
pub struct CreateUserRequest {
    #[validate(length(min = 32, max = 44))]
    pub wallet_address: String,
    #[validate(email)]
    pub email: Option<String>,
    pub discord_username: Option<String>,
    pub twitter_username: Option<String>,
    pub referral_code: Option<String>,
}

#[derive(Debug, Deserialize, Validate)]
pub struct UpdateUserRequest {
    #[validate(email)]
    pub email: Option<String>,
    pub discord_username: Option<String>,
    pub twitter_username: Option<String>,
}

#[derive(Debug, Serialize)]
pub struct UserResponse {
    pub id: Uuid,
    pub wallet_address: String,
    pub email: Option<String>,
    pub discord_username: Option<String>,
    pub twitter_username: Option<String>,
    pub referral_code: Option<String>,
    pub is_whitelisted: bool,
    pub whitelist_tier: i32,
    pub kyc_status: String,
    pub total_purchased: Option<f64>,
    pub referral_count: Option<i64>,
}

impl User {
    pub fn generate_referral_code() -> String {
        use rand::Rng;
        const CHARSET: &[u8] = b"ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let mut rng = rand::thread_rng();
        (0..8)
            .map(|_| {
                let idx = rng.gen_range(0..CHARSET.len());
                CHARSET[idx] as char
            })
            .collect()
    }
}
