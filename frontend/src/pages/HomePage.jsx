import React, { useState } from 'react';
import { Zap, Info } from 'lucide-react';
import TokenStats from '../components/TokenStats';
import PriceCalculator from '../components/PriceCalculator';
import WhitelistStatus from '../components/WhitelistStatus';
import ReferralSystem from '../components/ReferralSystem';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import TransactionHistory from '../components/TransactionHistory';
import TransactionReceipt from '../components/TransactionReceipt';
import { config } from '../config';

const HomePage = ({ 
  walletPubkey, 
  isConnected, 
  balance, 
  connect, 
  isConnecting, 
  amount, 
  setAmount, 
  handlePurchase, 
  isLoading, 
  status,
  showReceipt,
  setShowReceipt,
  lastTransaction,
  activeTab: propActiveTab,
  setActiveTab: propSetActiveTab
}) => {
  // Use internal state if props are not provided (fallback)
  const [internalActiveTab, setInternalActiveTab] = useState('purchase');
  const activeTab = propActiveTab || internalActiveTab;
  const setActiveTab = propSetActiveTab || setInternalActiveTab;

  const handleAmountChange = (e) => {
    const value = Math.max(1, parseInt(e.target.value) || 0);
    setAmount(value);
  };

  const totalCost = (amount * config.TOKEN_PRICE_SOL).toFixed(6);

  // Render the tabbed section
  const renderTabbedSection = () => (
    <div className="glass-card p-6">
      <div className="flex border-b border-mono-border mb-6 overflow-x-auto">
        {[
          { id: 'purchase', label: 'Purchase', icon: Zap },
          { id: 'calculator', label: 'Calculator' },
          { id: 'whitelist', label: 'Whitelist' },
          { id: 'referral', label: 'Referrals' },
          { id: 'analytics', label: 'Analytics' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 font-medium transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'text-mono-black border-b-2 border-mono-black'
                : 'text-mono-text hover:text-mono-black'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'purchase' && (
        <div>
          {/* Transaction History */}
          <div className="mb-6">
            <TransactionHistory />
          </div>
          
          <div className="mb-6">
            <label htmlFor="amount" className="block text-sm font-medium text-mono-black mb-2">
              Amount (SBT):
            </label>
            <input
              id="amount"
              type="number"
              value={amount}
              onChange={handleAmountChange}
              placeholder="Enter amount"
              className="input-field"
              disabled={isLoading}
              min="1"
              step="1"
            />
          </div>

          <div className="mb-6 p-4 bg-mono-light border border-mono-border rounded-xl">
            <div className="flex justify-between items-center text-lg">
              <span className="text-mono-text">Total Cost:</span>
              <span className="font-bold text-mono-black">{totalCost} SOL</span>
            </div>
          </div>

          {isConnected ? (
            <button
              onClick={handlePurchase}
              disabled={isLoading || amount <= 0}
              className="gradient-button w-full py-4 text-lg"
            >
              {isLoading ? 'Processing...' : `Buy ${amount.toLocaleString()} SBT Tokens`}
            </button>
          ) : (
            <button
              onClick={connect}
              disabled={isConnecting}
              className="gradient-button w-full py-4 text-lg"
            >
              {isConnecting ? 'Connecting...' : 'Connect Wallet'}
            </button>
          )}
        </div>
      )}

      {activeTab === 'calculator' && (
        <PriceCalculator 
          tokenPrice={config.TOKEN_PRICE_SOL}
          currentStage={1}
        />
      )}

      {activeTab === 'whitelist' && (
        <WhitelistStatus 
          walletPubkey={walletPubkey} 
          isConnected={isConnected} 
        />
      )}

      {activeTab === 'referral' && (
        <ReferralSystem 
          walletPubkey={walletPubkey} 
          isConnected={isConnected} 
        />
      )}

      {activeTab === 'analytics' && (
        <AnalyticsDashboard 
          walletPubkey={walletPubkey} 
          isConnected={isConnected} 
        />
      )}
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="glass-card p-8 text-center bg-gradient-to-br from-primary-50 to-purple-50">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Welcome to the Future of Token Presales
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Experience advanced analytics, dynamic pricing, and seamless blockchain integration 
            in the most sophisticated presale platform ever built.
          </p>
          
          {!isConnected && (
            <button
              onClick={connect}
              disabled={isConnecting}
              className="gradient-button text-lg px-8 py-4 mb-6"
            >
              {isConnecting ? 'Connecting...' : 'Connect Wallet to Begin'}
            </button>
          )}
        </div>
      </div>

      {/* Show Tabbed Section at the top when wallet is connected */}
      {isConnected && renderTabbedSection()}

      {/* Token Stats */}
      <TokenStats />

      {/* Show Tabbed Section here when wallet is not connected */}
      {!isConnected && renderTabbedSection()}

      {/* Status Display */}
      <div className="glass-card p-4 bg-mono-light border-mono-border">
        <div className="flex items-center gap-3">
          <Info className="w-5 h-5 text-mono-text flex-shrink-0" />
          <span className="text-mono-text text-sm">{status}</span>
        </div>
      </div>

      {/* How it works */}
      <div className="glass-card p-8">
        <h2 className="text-2xl font-bold text-mono-black mb-6 text-center">How it works</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              step: 1,
              title: 'Connect Wallet',
              description: 'Connect your Phantom wallet to get started'
            },
            {
              step: 2,
              title: 'Enter Amount',
              description: 'Specify how many SBT tokens you want to purchase'
            },
            {
              step: 3,
              title: 'Confirm Payment',
              description: 'Confirm the SOL payment transaction'
            },
            {
              step: 4,
              title: 'Receive Tokens',
              description: 'Get your SBT tokens instantly in your wallet'
            }
          ].map((item) => (
            <div key={item.step} className="glass-card p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">
                {item.step}
              </div>
              <h3 className="text-lg font-semibold text-mono-black mb-2">{item.title}</h3>
              <p className="text-mono-text text-sm">{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction Receipt Modal */}
      {showReceipt && lastTransaction && (
        <TransactionReceipt 
          transaction={lastTransaction}
          onClose={() => setShowReceipt(false)}
        />
      )}
    </div>
  );
};

export default HomePage;