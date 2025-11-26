import { getDevConfig, shouldUseDevConfig } from './utils/devConfig';

// Environment configuration
const envConfig = {
  OWNER_PUBLIC_KEY: import.meta.env.VITE_OWNER_PUBLIC_KEY || "REPLACE_WITH_OWNER_PUBLIC_KEY",
  TOKEN_PRICE_SOL: parseFloat(import.meta.env.VITE_TOKEN_PRICE_SOL) || 0.000045,
  SOLANA_NETWORK: import.meta.env.VITE_SOLANA_NETWORK || "devnet",
  TOKEN_SYMBOL: import.meta.env.VITE_TOKEN_SYMBOL || "SBT",
  TOKEN_NAME: import.meta.env.VITE_TOKEN_NAME || "Shibartum",
  TOTAL_SUPPLY: parseInt(import.meta.env.VITE_TOTAL_SUPPLY) || 1000000000,
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || "",
};

// Use dev config if in development and no valid config is provided
export const config = shouldUseDevConfig() ? getDevConfig() : envConfig;

// Validation
export const validateConfig = () => {
  const errors = [];
  
  if (!config.OWNER_PUBLIC_KEY || config.OWNER_PUBLIC_KEY.includes("REPLACE")) {
    errors.push("OWNER_PUBLIC_KEY is not configured");
  }
  
  if (config.TOKEN_PRICE_SOL <= 0) {
    errors.push("TOKEN_PRICE_SOL must be greater than 0");
  }
  
  return errors;
};

// Check if we're in development mode
export const isDevelopment = () => {
  return import.meta.env.DEV || import.meta.env.MODE === 'development';
};
