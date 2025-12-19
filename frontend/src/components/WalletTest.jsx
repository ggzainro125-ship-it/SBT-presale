import React from 'react';
import { useWallet } from '../hooks/useWallet';

const WalletTest = () => {
  const { 
    provider, 
    walletPubkey, 
    isConnecting, 
    isConnected, 
    connect, 
    disconnect 
  } = useWallet();

  return (
    <div className="glass-card p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Wallet Connection Test</h2>
      
      <div className="space-y-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">Connection Status</h3>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span>{isConnected ? 'Connected' : 'Not Connected'}</span>
          </div>
        </div>
        
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">Provider Status</h3>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${provider ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span>{provider ? 'Phantom Detected' : 'Phantom Not Detected'}</span>
          </div>
        </div>
        
        {walletPubkey && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Wallet Address</h3>
            <p className="font-mono text-sm break-all">{walletPubkey}</p>
          </div>
        )}
        
        <div className="flex gap-4 pt-4">
          {!isConnected ? (
            <button
              onClick={connect}
              disabled={isConnecting || !provider}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg disabled:opacity-50"
            >
              {isConnecting ? 'Connecting...' : 'Connect Wallet'}
            </button>
          ) : (
            <button
              onClick={disconnect}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg"
            >
              Disconnect Wallet
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default WalletTest;