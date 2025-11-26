import React from 'react';
import { Clock, ExternalLink, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const TransactionHistory = () => {
  const [transactions] = useLocalStorage('transactionHistory', []);
  
  // Demo data for testing (remove in production)
  const demoTransactions = [
    {
      amount: 10000,
      status: 'success',
      timestamp: Date.now() - 1000 * 60 * 30, // 30 minutes ago
      signature: '5J7X8K9L2M3N4P5Q6R7S8T9U0V1W2X3Y4Z5A6B7C8D9E0F1G2H3I4J5K6L7M8N9P0Q1R2S3T4U5V6W7X8Y9Z0A1B2',
      buyer: '7xKXvVqGhKjLmNpQrStUvWxYz1A2B3C4D5E6F7G8H9I0J1K2L3M4N5P6Q7R8S9T0U1V2W3X4Y5Z6A7B8C9D0E1F2G3H4',
      totalCost: 0.45
    },
    {
      amount: 5000,
      status: 'pending',
      timestamp: Date.now() - 1000 * 60 * 15, // 15 minutes ago
      signature: '2B3C4D5E6F7G8H9I0J1K2L3M4N5P6Q7R8S9T0U1V2W3X4Y5Z6A7B8C9D0E1F2G3H4I5J6K7L8M9N0P1Q2R3S4T5U6V7W8',
      buyer: '9kL4mNpQrStUvWxYz1A2B3C4D5E6F7G8H9I0J1K2L3M4N5P6Q7R8S9T0U1V2W3X4Y5Z6A7B8C9D0E1F2G3H4I5J6K7L8M9',
      totalCost: 0.225
    },
    {
      amount: 25000,
      status: 'failed',
      timestamp: Date.now() - 1000 * 60 * 60, // 1 hour ago
      signature: null,
      buyer: '2mN7pQrStUvWxYz1A2B3C4D5E6F7G8H9I0J1K2L3M4N5P6Q7R8S9T0U1V2W3X4Y5Z6A7B8C9D0E1F2G3H4I5J6K7L8M9N0',
      totalCost: 1.125
    }
  ];
  
  // Use demo data if no real transactions exist (for testing)
  const displayTransactions = transactions.length > 0 ? transactions : demoTransactions;

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatAmount = (amount) => {
    return Number(amount).toLocaleString();
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'pending': return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-50 border-green-200';
      case 'failed': return 'text-red-600 bg-red-50 border-red-200';
      case 'pending': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const openTransaction = (signature) => {
    const url = `https://explorer.solana.com/tx/${signature}?cluster=devnet`;
    window.open(url, '_blank');
  };

  if (!displayTransactions.length) {
    return (
      <div className="glass-card p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Clock className="w-6 h-6 text-primary-600" />
          <h3 className="text-xl font-bold text-mono-black">Transaction History</h3>
        </div>
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-mono-text mb-2">No transactions yet</p>
          <p className="text-sm text-gray-500">Your transaction history will appear here after your first purchase</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 mb-6">
      <div className="flex items-center gap-3 mb-6">
        <Clock className="w-6 h-6 text-primary-600" />
        <h3 className="text-xl font-bold text-mono-black">Transaction History</h3>
        <div className="ml-auto">
          <span className="badge badge-primary">{displayTransactions.length} transaction{displayTransactions.length !== 1 ? 's' : ''}</span>
        </div>
      </div>
      
      <div className="space-y-4">
        {displayTransactions.slice(0, 5).map((tx, index) => (
          <div key={index} className="bg-white/50 border border-mono-border rounded-lg p-4 hover:shadow-md transition-all duration-200 animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                {getStatusIcon(tx.status)}
                <div>
                  <div className="text-lg font-semibold text-mono-black">
                    {formatAmount(tx.amount)} SBT
                  </div>
                  <div className="text-sm text-mono-text">
                    {tx.totalCost ? `${tx.totalCost.toFixed(6)} SOL` : 'Cost not recorded'}
                  </div>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(tx.status)}`}>
                {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="text-sm text-mono-text">
                {formatDate(tx.timestamp)}
              </div>
              {tx.signature && (
                <button 
                  className="flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors text-sm font-medium"
                  onClick={() => openTransaction(tx.signature)}
                >
                  <ExternalLink className="w-4 h-4" />
                  View on Explorer
                </button>
              )}
            </div>
            
            {tx.buyer && (
              <div className="mt-2 pt-2 border-t border-mono-border">
                <div className="text-xs text-mono-text">
                  <span className="font-medium">Buyer:</span> {tx.buyer.slice(0, 8)}...{tx.buyer.slice(-8)}
                </div>
              </div>
            )}
          </div>
        ))}
        
        {displayTransactions.length > 5 && (
          <div className="text-center pt-4">
            <button className="text-primary-600 hover:text-primary-700 font-medium text-sm">
              View All {displayTransactions.length} Transactions
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;
