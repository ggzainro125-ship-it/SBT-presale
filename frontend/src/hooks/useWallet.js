import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

export const useWallet = () => {
  const [provider, setProvider] = useState(null);
  const [walletPubkey, setWalletPubkey] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [balance, setBalance] = useState(null);
  
  // Create connection to Solana mainnet
  const connection = new Connection('https://api.mainnet-beta.solana.com');

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

  // Fetch balance when wallet connects
  useEffect(() => {
    const fetchBalance = async () => {
      if (walletPubkey && connection) {
        try {
          const publicKey = new PublicKey(walletPubkey);
          const balance = await connection.getBalance(publicKey);
          const solBalance = balance / LAMPORTS_PER_SOL;
          setBalance(solBalance);
        } catch (error) {
          console.error('Error fetching balance:', error);
          setBalance(0);
        }
      }
    };

    if (walletPubkey) {
      fetchBalance();
      // Set up interval to refresh balance every 30 seconds
      const interval = setInterval(fetchBalance, 30000);
      return () => clearInterval(interval);
    }
  }, [walletPubkey, connection]);

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
      
      // Fetch balance immediately after connecting
      try {
        const publicKey = new PublicKey(pubkey);
        const balance = await connection.getBalance(publicKey);
        const solBalance = balance / LAMPORTS_PER_SOL;
        setBalance(solBalance);
      } catch (balanceError) {
        console.error('Error fetching balance after connect:', balanceError);
        setBalance(0);
      }
      
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

  const getBalance = async () => {
    if (!walletPubkey) return null;
    
    try {
      const publicKey = new PublicKey(walletPubkey);
      const balance = await connection.getBalance(publicKey);
      const solBalance = balance / LAMPORTS_PER_SOL;
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
