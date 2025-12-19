import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { detectPhantom, waitForPhantom, connectPhantom, isMobile, isIOS } from '../utils/walletUtils';

export const useWallet = () => {
  const [provider, setProvider] = useState(null);
  const [walletPubkey, setWalletPubkey] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [balance, setBalance] = useState(null);
  
  // Create connection to Solana mainnet
  const connection = new Connection('https://api.mainnet-beta.solana.com');

  useEffect(() => {
    // Check for Phantom wallet provider
    const initProvider = async () => {
      // First check if already available
      let phantomProvider = detectPhantom();
      
      // If not available and on mobile, wait a bit longer as it might be loading
      if (!phantomProvider && isMobile()) {
        phantomProvider = await waitForPhantom(3000);
      }
      
      if (phantomProvider) {
        setProvider(phantomProvider);
        
        // Check if already connected
        try {
          const response = await phantomProvider.connect({ onlyIfTrusted: true });
          setWalletPubkey(response.publicKey.toString());
        } catch (err) {
          // User not connected, ignore
          console.log('Phantom not connected yet:', err.message);
        }
      }
    };

    initProvider();
    
    // Set up periodic checking for Phantom (especially important for mobile)
    const interval = setInterval(async () => {
      if (!provider) {
        const newProvider = detectPhantom();
        if (newProvider) {
          setProvider(newProvider);
          // Try to auto-connect if user previously connected
          try {
            const response = await newProvider.connect({ onlyIfTrusted: true });
            setWalletPubkey(response.publicKey.toString());
          } catch (err) {
            // User not connected, ignore
            console.log('Phantom detected but not connected:', err.message);
          }
        }
      }
    }, 1000);
    
    return () => clearInterval(interval);
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
    // If provider is available, use it directly
    if (provider) {
      setIsConnecting(true);
      try {
        const response = await provider.connect();
        const pubkey = response.publicKey.toString();
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
    }
    
    // If no provider and on mobile, try to open Phantom app
    if (isMobile()) {
      toast.info("Opening Phantom app...", {
        position: "top-right",
        autoClose: 2000,
      });
      
      // Try to open Phantom app with deep link
      const deepLink = `phantom://browse/${encodeURIComponent(window.location.href)}`;
      const fallbackUrl = 'https://phantom.app/download';
      
      // For iOS, we need to use a different approach
      if (isIOS()) {
        // Try to open the app directly
        window.location.href = deepLink;
        
        // Fallback for iOS (can't detect if app is installed)
        setTimeout(() => {
          window.open(fallbackUrl, '_blank');
        }, 2000);
      } else {
        // For Android, try to open the app
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = deepLink;
        document.body.appendChild(iframe);
        
        // Fallback for Android
        setTimeout(() => {
          document.body.removeChild(iframe);
          window.open(fallbackUrl, '_blank');
        }, 1000);
      }
      
      // After attempting to open the app, wait a bit and check if Phantom became available
      setTimeout(async () => {
        const newProvider = await waitForPhantom(5000);
        if (newProvider) {
          setProvider(newProvider);
          // Try to auto-connect
          try {
            const response = await newProvider.connect({ onlyIfTrusted: true });
            setWalletPubkey(response.publicKey.toString());
            toast.success("✓ Connected to Phantom", {
              position: "top-right",
              autoClose: 2000,
            });
          } catch (err) {
            // Still need user interaction to connect
            console.log('Phantom available but not connected:', err.message);
          }
        }
      }, 3000);
      
      return false;
    }
    
    // For desktop without Phantom installed
    toast.info("Redirecting to Phantom Wallet installation...", {
      position: "top-right",
      autoClose: 2000,
    });
    
    // Give the toast a moment to display before redirecting
    setTimeout(() => {
      window.open('https://phantom.app/download', '_blank');
    }, 2000);
    
    return false;
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