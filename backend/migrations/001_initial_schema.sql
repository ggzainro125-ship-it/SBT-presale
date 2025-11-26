-- Initial database schema for Shibartum Presale Platform

-- Users table for managing presale participants
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_address VARCHAR(44) UNIQUE NOT NULL,
    email VARCHAR(255),
    discord_username VARCHAR(100),
    twitter_username VARCHAR(100),
    referral_code VARCHAR(20) UNIQUE,
    referred_by UUID REFERENCES users(id),
    is_whitelisted BOOLEAN DEFAULT FALSE,
    whitelist_tier INTEGER DEFAULT 0, -- 0: none, 1: basic, 2: premium, 3: vip
    kyc_status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transactions table for tracking all purchases
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    solana_signature VARCHAR(88) UNIQUE NOT NULL,
    amount_tokens DECIMAL(20, 8) NOT NULL,
    amount_sol DECIMAL(20, 8) NOT NULL,
    payment_method VARCHAR(20) DEFAULT 'SOL', -- SOL, USDC, USDT
    status VARCHAR(20) DEFAULT 'pending', -- pending, confirmed, failed, refunded
    block_height BIGINT,
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Whitelist entries for managing presale access
CREATE TABLE whitelist_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    tier INTEGER NOT NULL DEFAULT 1,
    max_allocation DECIMAL(20, 8) NOT NULL,
    used_allocation DECIMAL(20, 8) DEFAULT 0,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Referral tracking
CREATE TABLE referrals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    referrer_id UUID NOT NULL REFERENCES users(id),
    referred_id UUID NOT NULL REFERENCES users(id),
    bonus_tokens DECIMAL(20, 8) DEFAULT 0,
    bonus_percentage DECIMAL(5, 2) DEFAULT 5.0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(referrer_id, referred_id)
);

-- Vesting schedules for token distribution
CREATE TABLE vesting_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    transaction_id UUID NOT NULL REFERENCES transactions(id),
    total_tokens DECIMAL(20, 8) NOT NULL,
    released_tokens DECIMAL(20, 8) DEFAULT 0,
    cliff_duration_days INTEGER DEFAULT 30,
    vesting_duration_days INTEGER DEFAULT 365,
    start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin settings for presale configuration
CREATE TABLE presale_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT NOT NULL,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rate limiting table
CREATE TABLE rate_limits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    identifier VARCHAR(100) NOT NULL, -- IP address or wallet address
    endpoint VARCHAR(100) NOT NULL,
    request_count INTEGER DEFAULT 1,
    window_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(identifier, endpoint)
);

-- Indexes for performance
CREATE INDEX idx_users_wallet_address ON users(wallet_address);
CREATE INDEX idx_users_referral_code ON users(referral_code);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_signature ON transactions(solana_signature);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_whitelist_user_id ON whitelist_entries(user_id);
CREATE INDEX idx_referrals_referrer ON referrals(referrer_id);
CREATE INDEX idx_vesting_user_id ON vesting_schedules(user_id);
CREATE INDEX idx_rate_limits_identifier ON rate_limits(identifier, endpoint);

-- Insert default presale settings
INSERT INTO presale_settings (key, value, description) VALUES
('token_price_sol', '0.000045', 'Price per token in SOL'),
('max_supply', '1000000000', 'Maximum token supply'),
('presale_start', '2024-01-01T00:00:00Z', 'Presale start date'),
('presale_end', '2024-06-01T00:00:00Z', 'Presale end date'),
('min_purchase', '100', 'Minimum purchase amount'),
('max_purchase', '1000000', 'Maximum purchase amount'),
('whitelist_enabled', 'true', 'Enable whitelist functionality'),
('referral_bonus', '5.0', 'Referral bonus percentage');
