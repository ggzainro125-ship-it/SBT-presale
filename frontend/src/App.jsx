import React, { useState, useEffect } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { Wallet, Copy, ExternalLink, Zap, Shield, TrendingUp, DollarSign, ShoppingCart, Info } from 'lucide-react'
import 'react-toastify/dist/ReactToastify.css'

// Components
import ErrorBoundary from './components/ErrorBoundary'
import Navbar from './components/Navbar'
import WelcomeModal from './components/WelcomeModal'
import FloatingActionButton from './components/FloatingActionButton'
import AnalyticsDashboard from './components/AnalyticsDashboard'

// Pages
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import FeaturesPage from './pages/FeaturesPage'
import CommunityPage from './pages/CommunityPage'

// Hooks
import { useWallet } from './hooks/useWallet'
import { useLocalStorage } from './hooks/useLocalStorage'

// Config
import { config, validateConfig, isDevelopment } from './config'

function App(){
  const { 
    provider, 
    walletPubkey, 
    balance, 
    connect, 
    disconnect, 
    isConnecting, 
    isConnected 
  } = useWallet();
  
  const [amount, setAmount] = useState(1000);
  const [status, setStatus] = useState("Ready to connect");
  const [isLoading, setIsLoading] = useState(false);
  const [transactionHistory, setTransactionHistory] = useLocalStorage('transactionHistory', []);
  const [configErrors, setConfigErrors] = useState([]);
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastTransaction, setLastTransaction] = useState(null);
  const [currentPage, setCurrentPage] = useState('home');
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [homeActiveTab, setHomeActiveTab] = useState('purchase');
  
  // Function to reset welcome modal (for testing)
  const resetWelcomeModal = () => {
    localStorage.removeItem('hasVisitedShibartum');
    setShowWelcomeModal(true);
  };
  
  // Show welcome modal on first visit
  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisitedShibartum');
    if (!hasVisited) {
      // Delay showing modal slightly to ensure page is loaded
      setTimeout(() => {
        setShowWelcomeModal(true);
        localStorage.setItem('hasVisitedShibartum', 'true');
      }, 1500); // Increased delay for better UX
    }
  }, []);
  
  // Manual welcome modal trigger (for testing)
  const showWelcomeManually = () => {
    setShowWelcomeModal(true);
  };

  useEffect(() => {
    // Validate configuration on mount
    const errors = validateConfig();
    setConfigErrors(errors);
    
    // Only show configuration errors in development mode or if critical
    if (errors.length > 0 && isDevelopment()) {
      console.warn('Configuration errors detected:', errors);
      // Show a single warning toast instead of multiple error toasts
      toast.warn(`Configuration issues detected (${errors.length}). Check console for details.`, {
        toastId: 'config-warning' // Prevent duplicate toasts
      });
    }
  }, []);

  useEffect(() => {
    if (isConnected && walletPubkey) {
      setStatus(`Connected to ${walletPubkey.slice(0, 8)}...${walletPubkey.slice(-8)}`);
    } else {
      setStatus("Ready to connect");
    }
  }, [isConnected, walletPubkey]);

  const handlePurchase = async () => {
    if (!isConnected || !provider || !walletPubkey) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!amount || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setIsLoading(true);
    setStatus('Preparing transaction...');

    try {
      // Create connection
      const connection = new Connection(config.SOLANA_RPC_URL, 'confirmed');
      
      // Calculate SOL amount to send
      const solAmount = amount * config.TOKEN_PRICE_SOL;
      const lamports = Math.floor(solAmount * LAMPORTS_PER_SOL);
      
      setStatus('Creating transaction...');
      
      // Create transaction
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: new PublicKey(walletPubkey),
          toPubkey: new PublicKey(config.OWNER_PUBLIC_KEY),
          lamports: lamports,
        })
      );

      // Get recent blockhash
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = new PublicKey(walletPubkey);

      setStatus('Waiting for wallet approval...');
      
      // Sign and send transaction
      const signedTransaction = await provider.signTransaction(transaction);
      
      setStatus('Sending transaction...');
      const signature = await connection.sendRawTransaction(signedTransaction.serialize());
      
      setStatus('Confirming transaction...');
      await connection.confirmTransaction(signature, 'confirmed');
      
      setStatus('Confirming purchase with backend...');
      
      // Call backend to confirm purchase
      const response = await fetch('/api/confirm-purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          signature,
          buyer: walletPubkey,
          amount: amount,
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Create transaction record
        const transactionRecord = {
          signature,
          amount,
          buyer: walletPubkey,
          timestamp: Date.now(),
          status: 'success',
          totalCost: solAmount,
        };

        // Update transaction history
        setTransactionHistory(prev => [transactionRecord, ...prev]);
        setLastTransaction(transactionRecord);
        setShowReceipt(true);
        
        toast.success(`Successfully purchased ${amount.toLocaleString()} SBT tokens!`);
        setStatus(`Purchase completed! Transaction: ${signature.slice(0, 8)}...`);
        
        // Reset amount
        setAmount(1000);
      } else {
        throw new Error(result.message || 'Backend confirmation failed');
      }
    } catch (error) {
      console.error('Purchase failed:', error);
      
      // Create failed transaction record
      const failedTransaction = {
        amount,
        buyer: walletPubkey,
        timestamp: Date.now(),
        status: 'failed',
        error: error.message,
        totalCost: amount * config.TOKEN_PRICE_SOL,
      };
      
      setTransactionHistory(prev => [failedTransaction, ...prev]);
      
      toast.error(`Purchase failed: ${error.message}`);
      setStatus('Purchase failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <HomePage 
            walletPubkey={walletPubkey}
            isConnected={isConnected}
            balance={balance}
            connect={connect}
            isConnecting={isConnecting}
            amount={amount}
            setAmount={setAmount}
            handlePurchase={handlePurchase}
            isLoading={isLoading}
            status={status}
            showReceipt={showReceipt}
            setShowReceipt={setShowReceipt}
            lastTransaction={lastTransaction}
            activeTab={homeActiveTab}
            setActiveTab={setHomeActiveTab}
          />
        );
      case 'about':
        return <AboutPage />;
      case 'features':
        return <FeaturesPage />;
      case 'community':
        return <CommunityPage />;
      case 'analytics':
        return (
          <div className="glass-card p-6">
            <AnalyticsDashboard 
              walletPubkey={walletPubkey} 
              isConnected={isConnected} 
            />
          </div>
        );
      default:
        return (
          <HomePage 
            walletPubkey={walletPubkey}
            isConnected={isConnected}
            balance={balance}
            connect={connect}
            isConnecting={isConnecting}
            amount={amount}
            setAmount={setAmount}
            handlePurchase={handlePurchase}
            isLoading={isLoading}
            status={status}
            showReceipt={showReceipt}
            setShowReceipt={setShowReceipt}
            lastTransaction={lastTransaction}
          />
        );
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 font-inter">
        {/* Navigation */}
        <Navbar 
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          isConnected={isConnected}
          walletPubkey={walletPubkey}
          balance={balance}
          onDisconnect={disconnect}
          onShowWelcome={() => setShowWelcomeModal(true)}
        />
        
        {/* Main Content */}
        <div className="pt-20 px-4 pb-8">
          <div className="max-w-7xl mx-auto">
            {renderCurrentPage()}
          </div>
        </div>

        {/* Welcome Modal */}
        <WelcomeModal 
          isOpen={showWelcomeModal}
          onClose={() => setShowWelcomeModal(false)}
        />

        {/* Toast Container */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss={false}
          draggable
          pauseOnHover
          theme="light"
          toastClassName="toast-base"
          limit={2}
          style={{
            top: '15px',
            right: '15px',
            zIndex: 9999
          }}
        />
        
        {/* Floating Action Button - Only show on home page */}
        {currentPage === 'home' && (
          <FloatingActionButton 
            activeTab={homeActiveTab}
            setActiveTab={setHomeActiveTab}
          />
        )}
      </div>
    </ErrorBoundary>
  )
}

export default App
