# 🚀 Shibartum Presale Platform v2.0.0 - Setup Guide

## 📋 Overview

This is a complete production-ready token presale platform with:
- **Real SPL token integration** (no more mock!)
- **PostgreSQL database** for user management
- **Whitelist system** with tier-based access
- **Referral program** with automatic bonuses
- **Rate limiting** and security features
- **Modern React frontend** with enhanced UX

## 🛠️ Prerequisites

### Required Software
- **Rust** (1.70+) - [Install Rust](https://rustup.rs/)
- **Node.js** (18+) - [Install Node.js](https://nodejs.org/)
- **PostgreSQL** (13+) - [Install PostgreSQL](https://postgresql.org/download/)
- **Solana CLI** - [Install Solana CLI](https://docs.solana.com/cli/install-solana-cli-tools)

### Required Accounts
- **Solana Wallet** with SOL for transactions
- **PostgreSQL Database** (local or cloud)
- **Token Mint Address** (create SPL token first)

## 🔧 Setup Instructions

### 1. Database Setup

```bash
# Create database
createdb shibartum_presale

# Or using psql
psql -U postgres
CREATE DATABASE shibartum_presale;
\q
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
cargo build

# Copy environment file
cp .env.example .env

# Edit .env with your configuration
nano .env
```

**Required .env Configuration:**
```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/shibartum_presale

# Solana
SOLANA_NETWORK=devnet  # or mainnet
OWNER_KEYPAIR_PATH=./owner-keypair.json
TOKEN_MINT_ADDRESS=your_token_mint_address_here
OWNER_PUBLIC_KEY=your_owner_public_key_here
TOKEN_PRICE_SOL=0.000045

# Server
PORT=8080
RUST_LOG=info
```

### 3. Create SPL Token (First Time Only)

```bash
# Create token mint
spl-token create-token --decimals 9

# Create token account
spl-token create-account YOUR_TOKEN_MINT_ADDRESS

# Mint initial supply (optional)
spl-token mint YOUR_TOKEN_MINT_ADDRESS 1000000000
```

### 4. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your configuration
nano .env
```

**Required frontend .env:**
```env
VITE_OWNER_PUBLIC_KEY=your_owner_public_key_here
VITE_TOKEN_PRICE_SOL=0.000045
VITE_SOLANA_NETWORK=devnet
VITE_TOKEN_SYMBOL=SBT
VITE_TOKEN_NAME=Shibartum
VITE_TOTAL_SUPPLY=1000000000
VITE_API_BASE_URL=http://localhost:8080
```

### 5. Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
cargo run
```

**Terminal 2 - Frontend (Development):**
```bash
cd frontend
npm run dev
```

**Production Build:**
```bash
cd frontend
npm run build
# Built files will be served by the backend automatically
```

## 🎯 New Features Implemented

### ✅ **Phase 1 Completed**

1. **Real SPL Token Integration**
   - Actual token minting and distribution
   - Solana transaction verification
   - Automatic token transfers

2. **Database Integration**
   - PostgreSQL with comprehensive schema
   - User management and tracking
   - Transaction history and analytics

3. **Enhanced Security**
   - Rate limiting (10 req/sec, 20 burst)
   - Input validation and sanitization
   - CORS protection

4. **Whitelist System**
   - Tier-based access (Basic, Premium, VIP)
   - Allocation limits per tier
   - KYC status tracking

5. **Referral Program**
   - 5% bonus tokens for referrers
   - Automatic bonus distribution
   - Social sharing integration

## 🔗 API Endpoints

### Core Endpoints
- `GET /api/health` - Health check with database status
- `POST /api/confirm-purchase` - Process token purchases
- `GET /api/user/{wallet}` - Get user profile
- `POST /api/user/register` - Register new user

### Whitelist Endpoints
- `POST /api/whitelist/apply` - Apply for whitelist
- `GET /api/whitelist/status/{wallet}` - Check whitelist status

### Referral Endpoints
- `GET /api/referral/{code}` - Get referral information
- `POST /api/referral/track` - Track referral usage

### Analytics Endpoints
- `GET /api/stats` - Get presale statistics
- `GET /api/transactions/{wallet}` - Get user transactions

## 🎨 Frontend Enhancements

### New Components
- **WhitelistStatus** - Shows whitelist tier and benefits
- **ReferralSystem** - Referral link sharing and tracking
- **Tab Navigation** - Organized interface with Purchase/Whitelist/Referral tabs

### Enhanced Features
- Real-time whitelist status checking
- Referral link generation and sharing
- Social media integration (Twitter sharing)
- Improved error handling and user feedback

## 🔒 Security Features

1. **Rate Limiting** - Prevents abuse and DDoS attacks
2. **Input Validation** - Server-side validation for all inputs
3. **Transaction Verification** - Real Solana blockchain verification
4. **Database Security** - Prepared statements prevent SQL injection
5. **CORS Protection** - Proper cross-origin request handling

## 📊 Database Schema

### Key Tables
- **users** - User profiles and wallet addresses
- **transactions** - All purchase transactions
- **whitelist_entries** - Whitelist tiers and allocations
- **referrals** - Referral tracking and bonuses
- **vesting_schedules** - Token vesting management

## 🚀 Deployment

### Production Checklist
- [ ] Set up production PostgreSQL database
- [ ] Configure mainnet Solana settings
- [ ] Update environment variables for production
- [ ] Set up SSL/TLS certificates
- [ ] Configure domain and DNS
- [ ] Set up monitoring and logging

### Environment Variables for Production
```env
SOLANA_NETWORK=mainnet
DATABASE_URL=postgresql://prod_user:secure_password@prod_host:5432/shibartum_presale
JWT_SECRET=super-secure-production-secret
RUST_LOG=warn
```

## 🎯 Next Phase Features (Coming Soon)

### Phase 2 - Advanced Features
- [ ] Multi-payment support (USDC, USDT)
- [ ] Dynamic pricing stages
- [ ] Staking mechanism
- [ ] Admin dashboard

### Phase 3 - Premium Features
- [ ] NFT integration
- [ ] Cross-chain support
- [ ] DAO governance
- [ ] Mobile app

## 🆘 Troubleshooting

### Common Issues

**Database Connection Failed:**
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Check connection string
psql "postgresql://username:password@localhost:5432/shibartum_presale"
```

**Token Transfer Failed:**
- Ensure owner keypair has mint authority
- Check token mint address is correct
- Verify sufficient SOL for transaction fees

**Frontend Build Errors:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📞 Support

For technical support or questions:
- Check the logs: `tail -f backend/logs/app.log`
- Review database: `psql shibartum_presale`
- Test API endpoints: `curl http://localhost:8080/api/health`

---

**🎉 Your Shibartum Presale Platform v2.0.0 is now production-ready with real SPL tokens, database integration, whitelist system, and referral program!**
