# Rust Backend (Actix-web) for Shibartum Presale

## Overview
This backend:
- Serves the built React frontend from `./frontend/dist`
- Exposes POST /api/confirm-purchase to verify a SOL payment via RPC and then
  uses the `spl-token` CLI to transfer SPL tokens to the buyer.

## Requirements
- Rust toolchain (stable)
- `spl-token` CLI installed and in PATH (from Solana tool suite)
- Owner keypair JSON file accessible and configured via `OWNER_KEYPAIR_PATH`
- Configure `.env` values (copy `.env.example` to `.env`)

## Build & Run
1. Build frontend (from `frontend`):
   - `npm install`
   - edit `src/App.jsx` to set OWNER_PUBLIC_KEY
   - `npm run build` (this will output to `frontend/dist`)
2. Backend:
   - `cd backend`
   - `cargo build --release`
   - set environment variables or create `.env`
   - run: `./target/release/shibartum_presale_backend`
