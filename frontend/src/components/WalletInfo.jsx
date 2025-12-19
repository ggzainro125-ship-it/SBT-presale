import React from 'react';
import { toast } from 'react-toastify';

const WalletInfo = ({ walletPubkey, balance, onDisconnect }) => {
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Address copied to clipboard!", {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (err) {
      toast.error("Failed to copy address", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const formatBalance = (balance) => {
    if (balance === null || balance === undefined) return 'Loading...';
    return `${balance.toFixed(4)} SOL`;
  };

  if (!walletPubkey) return null;

  return (
    <div className="wallet-info-card">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="text-mono-text text-sm">Wallet:</span>
          <span 
            className="text-mono-black font-medium cursor-pointer hover:text-mono-text transition-colors" 
            onClick={() => copyToClipboard(walletPubkey)}
            title="Click to copy full address"
          >
            {formatAddress(walletPubkey)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-mono-text text-sm">Balance:</span>
          <span className="text-mono-black font-medium">{formatBalance(balance)}</span>
        </div>
      </div>
      <button 
        className="w-8 h-8 rounded-full bg-mono-border hover:bg-mono-track text-mono-black hover:text-mono-text transition-all duration-200 flex items-center justify-center border border-mono-border" 
        onClick={onDisconnect}
        title="Disconnect wallet"
      >
        ✕
      </button>
    </div>
  );
};

export default WalletInfo;