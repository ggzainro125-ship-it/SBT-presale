// Development configuration helper
export const getDevConfig = () => {
  return {
    OWNER_PUBLIC_KEY: "11111111111111111111111111111112", // System program ID for demo
    TOKEN_PRICE_SOL: 0.000045,
    SOLANA_NETWORK: "devnet",
    TOKEN_SYMBOL: "SBT",
    TOKEN_NAME: "Shibartum",
    TOTAL_SUPPLY: 1000000000,
    API_BASE_URL: "",
  };
};

// Check if we should use dev config
export const shouldUseDevConfig = () => {
  const isDev = import.meta.env.DEV || import.meta.env.MODE === 'development';
  const hasValidConfig = import.meta.env.VITE_OWNER_PUBLIC_KEY && 
                        !import.meta.env.VITE_OWNER_PUBLIC_KEY.includes('REPLACE');
  
  return isDev && !hasValidConfig;
};
