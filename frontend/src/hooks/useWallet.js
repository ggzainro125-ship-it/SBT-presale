import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export const useWallet = () => {
  const [provider, setProvider] = useState(null);
  const [walletPubkey, setWalletPubkey] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    // Check for Phantom wallet
    if ("solana" in window) {
      const anyWindow = window;
      if (anyWindow.solana && anyWindow.solana.isPhantom) {
        setProvider(anyWindow.solana);
        
        // Check if already connected
        anyWindow.solana.connect({ onlyIfTrusted: true })
          .then((response) => {
            setWalletPubkey(response.publicKey.toString());
          })
          .catch(() => {
            // User not connected, ignore
          });
      }
    }
  }, []);

  const connect = async () => {
    if (!provider) {
      toast.error("👻 Install Phantom", {
        position: "top-right",
        autoClose: 3000,
      });
      return false;
    }
    
    setIsConnecting(true);
    try {
      const resp = await provider.connect();
      const pubkey = resp.publicKey.toString();
      setWalletPubkey(pubkey);
      
      // Store in localStorage for persistence
      localStorage.setItem('walletConnected', 'true');
      localStorage.setItem('walletPubkey', pubkey);
      
      toast.success("✓ Connected", {
        position: "top-right",
        autoClose: 2000,
      });
      
      return true;
    } catch (e) {
      console.error(e);
      toast.error("⚠️ Connect failed", {
        position: "top-right",
        autoClose: 3000,
      });
      return false;
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    if (provider) {
      provider.disconnect();
    }
    setWalletPubkey(null);
    setBalance(null);
    localStorage.removeItem('walletConnected');
    localStorage.removeItem('walletPubkey');
    toast.info("🔌 Disconnected", {
      position: "top-right",
      autoClose: 2000,
    });
  };

  const getBalance = async (connection) => {
    if (!provider || !walletPubkey) return null;
    
    try {
      const balance = await connection.getBalance(provider.publicKey);
      const solBalance = balance / 1e9; // Convert lamports to SOL
      setBalance(solBalance);
      return solBalance;
    } catch (error) {
      console.error('Error fetching balance:', error);
      return null;
    }
  };

  return {
    provider,
    walletPubkey,
    isConnecting,
    balance,
    connect,
    disconnect,
    getBalance,
    isConnected: !!walletPubkey
  };
};
