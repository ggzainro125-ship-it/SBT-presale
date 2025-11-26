import React from 'react';
import { CheckCircle, Download, ExternalLink, Copy } from 'lucide-react';
import { toast } from 'react-toastify';
import { config } from '../config';

const TransactionReceipt = ({ transaction, onClose }) => {
  if (!transaction) return null;

  const copyToClipboard = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied!`, {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (err) {
      toast.error("Failed to copy", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const openInExplorer = () => {
    const url = `https://explorer.solana.com/tx/${transaction.signature}?cluster=${config.SOLANA_NETWORK}`;
    window.open(url, '_blank');
  };

  const downloadReceipt = () => {
    const receiptData = {
      transactionId: transaction.signature,
      date: new Date(transaction.timestamp).toISOString(),
      buyer: transaction.buyer || 'Unknown',
      amount: transaction.amount,
      tokenSymbol: config.TOKEN_SYMBOL,
      pricePerToken: config.TOKEN_PRICE_SOL,
      totalCost: (transaction.amount * config.TOKEN_PRICE_SOL).toFixed(6),
      network: config.SOLANA_NETWORK,
      status: transaction.status
    };

    const dataStr = JSON.stringify(receiptData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sbt-receipt-${transaction.signature?.slice(0, 8)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="glass-card p-8 max-w-md w-full animate-slide-up">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Transaction Successful!</h2>
          <p className="text-white/60">Your SBT tokens have been purchased</p>
        </div>

        {/* Transaction Details */}
        <div className="space-y-4 mb-6">
          <div className="glass-card p-4 bg-white/5">
            <div className="flex justify-between items-center mb-2">
              <span className="text-white/60">Amount</span>
              <span className="text-white font-bold">{transaction.amount} {config.TOKEN_SYMBOL}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-white/60">Price per Token</span>
              <span className="text-white">{config.TOKEN_PRICE_SOL} SOL</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-white/60">Total Cost</span>
              <span className="text-white font-bold">{(transaction.amount * config.TOKEN_PRICE_SOL).toFixed(6)} SOL</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/60">Date</span>
              <span className="text-white">{new Date(transaction.timestamp).toLocaleString()}</span>
            </div>
          </div>

          {/* Transaction Hash */}
          {transaction.signature && (
            <div className="glass-card p-4 bg-white/5">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white/60">Transaction ID</span>
                <button
                  onClick={() => copyToClipboard(transaction.signature, 'Transaction ID')}
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              <div className="text-white font-mono text-sm break-all">
                {transaction.signature}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          {transaction.signature && (
            <button
              onClick={openInExplorer}
              className="gradient-button flex items-center justify-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              View on Solana Explorer
            </button>
          )}
          
          <button
            onClick={downloadReceipt}
            className="w-full py-3 px-4 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download Receipt
          </button>
          
          <button
            onClick={onClose}
            className="w-full py-3 px-4 bg-white/5 hover:bg-white/10 text-white/80 rounded-xl transition-all duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionReceipt;
