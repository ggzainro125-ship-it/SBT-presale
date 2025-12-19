import React from 'react';
import MobileBottomNav from './MobileBottomNav';

const MobileNavDemo = () => {
  return (
    <div className="lg:hidden fixed inset-0 bg-gray-100 z-50 flex flex-col">
      {/* Demo header */}
      <div className="bg-white p-4 border-b">
        <h1 className="text-xl font-bold text-center">Mobile Navigation Demo</h1>
      </div>
      
      {/* Demo content */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="font-semibold mb-2">Home Page</h2>
            <p className="text-gray-600 text-sm">This is where the main content would appear.</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="font-semibold mb-2">Features</h2>
            <p className="text-gray-600 text-sm">Access different features of the application.</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="font-semibold mb-2">Analytics</h2>
            <p className="text-gray-600 text-sm">View charts and data visualizations.</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="font-semibold mb-2">Community</h2>
            <p className="text-gray-600 text-sm">Connect with other users and the community.</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="font-semibold mb-2">Wallet</h2>
            <p className="text-gray-600 text-sm">Manage your wallet connection and transactions.</p>
          </div>
        </div>
      </div>
      
      {/* Mobile bottom navigation */}
      <MobileBottomNav currentPage="home" setCurrentPage={() => {}} isConnected={true} />
    </div>
  );
};

export default MobileNavDemo;