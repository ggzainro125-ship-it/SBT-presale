use actix_web::{
    web, App, HttpServer, Responder, HttpResponse, middleware::Logger,
    middleware::DefaultHeaders, Result as ActixResult
};
use actix_files::Files;
use actix_governor::{Governor, GovernorConfigBuilder};
use serde::{Deserialize, Serialize};
use sqlx::{PgPool, Row};
use std::env;
use uuid::Uuid;
use validator::Validate;
use chrono::Utc;

mod models;
mod handlers;
mod services;
mod utils;

use models::*;
use handlers::*;
use services::*;
use utils::*;

#[derive(Serialize)]
struct ApiResponse<T = serde_json::Value> {
    success: bool,
    message: String,
    data: Option<T>,
}

#[derive(Clone)]
struct AppState {
    db: PgPool,
    solana_service: SolanaService,
}

// Health check endpoint with database status
async fn health(data: web::Data<AppState>) -> ActixResult<HttpResponse> {
    let db_status = match sqlx::query("SELECT 1")
        .fetch_one(&data.db)
        .await
    {
        Ok(_) => "connected",
        Err(_) => "disconnected",
    };

    Ok(HttpResponse::Ok().json(ApiResponse {
        success: true,
        message: "Shibartum Presale Backend is running".to_string(),
        data: Some(serde_json::json!({
            "version": "2.0.0",
            "database": db_status,
            "timestamp": Utc::now(),
            "features": [
                "real_spl_tokens",
                "database_integration",
                "rate_limiting",
                "whitelist_system",
                "referral_program"
            ]
        })),
    }))
}

// Production purchase confirmation with real SPL token transfer
async fn confirm_purchase(
    req: web::Json<CreateTransactionRequest>,
    data: web::Data<AppState>,
) -> ActixResult<HttpResponse> {
    // Validate request
    if let Err(validation_errors) = req.validate() {
        return Ok(HttpResponse::BadRequest().json(ApiResponse::<()> {
            success: false,
            message: format!("Validation error: {:?}", validation_errors),
            data: None,
        }));
    }

    println!("Processing purchase: signature={}, buyer={}, amount={}", 
             req.signature, req.buyer, req.amount);

    // Get or create user
    let user = match get_or_create_user(&data.db, &req.buyer).await {
        Ok(user) => user,
        Err(e) => {
            return Ok(HttpResponse::InternalServerError().json(ApiResponse::<()> {
                success: false,
                message: format!("User error: {}", e),
                data: None,
            }));
        }
    };

    // Check whitelist if enabled
    if let Err(e) = check_whitelist_eligibility(&data.db, &user, req.amount).await {
        return Ok(HttpResponse::Forbidden().json(ApiResponse::<()> {
            success: false,
            message: format!("Whitelist error: {}", e),
            data: None,
        }));
    }

    // Verify Solana transaction
    match data.solana_service.verify_transaction(&req.signature, &req.buyer, req.amount).await {
        Ok(verified_tx) => {
            // Create transaction record
            let transaction = create_transaction(&data.db, &user.id, &req).await
                .map_err(|e| {
                    eprintln!("Failed to create transaction: {}", e);
                    HttpResponse::InternalServerError().json(ApiResponse::<()> {
                        success: false,
                        message: "Failed to record transaction".to_string(),
                        data: None,
                    })
                })?;

            // Transfer SPL tokens to buyer
            match data.solana_service.transfer_tokens(&req.buyer, req.amount).await {
                Ok(token_signature) => {
                    // Update transaction as successful
                    let _ = update_transaction_status(
                        &data.db, 
                        &transaction.id, 
                        "confirmed", 
                        Some(verified_tx.slot as i64)
                    ).await;

                    // Process referral bonus if applicable
                    if let Some(referrer_id) = user.referred_by {
                        let _ = process_referral_bonus(&data.db, &referrer_id, req.amount).await;
                    }

                    Ok(HttpResponse::Ok().json(ApiResponse {
                        success: true,
                        message: format!("Successfully purchased {} SBT tokens!", req.amount),
                        data: Some(serde_json::json!({
                            "transaction_id": transaction.id,
                            "payment_signature": req.signature,
                            "token_signature": token_signature,
                            "buyer": req.buyer,
                            "amount_tokens": req.amount,
                            "amount_sol": req.amount * 0.000045, // Get from settings
                            "status": "confirmed"
                        })),
                    }))
                }
                Err(e) => {
                    // Update transaction as failed
                    let _ = update_transaction_status(&data.db, &transaction.id, "failed", None).await;
                    
                    Ok(HttpResponse::InternalServerError().json(ApiResponse::<()> {
                        success: false,
                        message: format!("Token transfer failed: {}", e),
                        data: None,
                    }))
                }
            }
        }
        Err(e) => {
            Ok(HttpResponse::BadRequest().json(ApiResponse::<()> {
                success: false,
                message: format!("Transaction verification failed: {}", e),
                data: None,
            }))
        }
    }
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // Load environment variables
    dotenv::dotenv().ok();
    
    // Initialize logger
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));
    
    // Database connection
    let database_url = env::var("DATABASE_URL")
        .expect("DATABASE_URL must be set");
    
    let pool = sqlx::PgPool::connect(&database_url)
        .await
        .expect("Failed to connect to database");
    
    // Run migrations
    sqlx::migrate!("./migrations")
        .run(&pool)
        .await
        .expect("Failed to run migrations");
    
    // Initialize Solana service
    let solana_service = SolanaService::new().await
        .expect("Failed to initialize Solana service");
    
    let app_state = AppState {
        db: pool,
        solana_service,
    };
    
    let port = env::var("PORT").unwrap_or_else(|_| "8080".to_string());
    let addr = format!("0.0.0.0:{}", port);

    // Rate limiting configuration
    let governor_conf = GovernorConfigBuilder::default()
        .per_second(10)
        .burst_size(20)
        .finish()
        .unwrap();

    println!("🚀 Starting Shibartum Presale Backend v2.0.0 at {}", addr);
    println!("📋 Available endpoints:");
    println!("   GET  /api/health - Health check with database status");
    println!("   POST /api/confirm-purchase - Confirm token purchase (with real SPL tokens)");
    println!("   GET  /api/user/:wallet - Get user profile");
    println!("   POST /api/user/register - Register new user");
    println!("   GET  /api/transactions/:wallet - Get user transactions");
    println!("   GET  /api/stats - Get presale statistics");
    println!("   POST /api/whitelist/apply - Apply for whitelist");
    println!("   GET  /api/referral/:code - Get referral info");
    println!("✨ Features: Real SPL tokens, Database, Rate limiting, Whitelist, Referrals");
    
    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(app_state.clone()))
            .wrap(Logger::default())
            .wrap(Governor::new(&governor_conf))
            .wrap(DefaultHeaders::new()
                .add(("X-Version", "2.0.0"))
                .add(("Access-Control-Allow-Origin", "*"))
                .add(("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS"))
                .add(("Access-Control-Allow-Headers", "Content-Type, Authorization"))
            )
            // API routes
            .service(web::resource("/api/health").route(web::get().to(health)))
            .service(web::resource("/api/confirm-purchase").route(web::post().to(confirm_purchase)))
            .service(web::resource("/api/user/register").route(web::post().to(register_user)))
            .service(web::resource("/api/user/{wallet}").route(web::get().to(get_user)))
            .service(web::resource("/api/transactions/{wallet}").route(web::get().to(get_user_transactions)))
            .service(web::resource("/api/stats").route(web::get().to(get_presale_stats)))
            .service(web::resource("/api/whitelist/apply").route(web::post().to(apply_whitelist)))
            .service(web::resource("/api/referral/{code}").route(web::get().to(get_referral_info)))
            // Serve static files (frontend build)
            .service(Files::new("/", "./frontend/dist").index_file("index.html"))
    })
    .bind(addr)?
    .run()
    .await
}
