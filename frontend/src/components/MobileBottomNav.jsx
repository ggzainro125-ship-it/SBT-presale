import React from 'react';
import { 
  Home, 
  Zap, 
  BarChart3, 
  Users, 
  Wallet
} from 'lucide-react';

const MobileBottomNav = ({ currentPage, setCurrentPage, isConnected }) => {
  // Navigation items with Home in the center
  const navItems = [
    { id: 'features', label: 'Features', icon: Zap },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'home', label: 'Home', icon: Home },
    { id: 'community', label: 'Community', icon: Users },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around items-center py-2">
        {/* Features Button */}
        <button
          onClick={() => setCurrentPage('features')}
          className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 flex-1 ${
            currentPage === 'features' 
              ? 'text-primary-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Zap className={`w-5 h-5 ${currentPage === 'features' ? 'text-primary-600' : 'text-gray-500'}`} />
          <span className="text-xs mt-1 font-medium">Features</span>
        </button>
        
        {/* Analytics Button */}
        <button
          onClick={() => setCurrentPage('analytics')}
          className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 flex-1 ${
            currentPage === 'analytics' 
              ? 'text-primary-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <BarChart3 className={`w-5 h-5 ${currentPage === 'analytics' ? 'text-primary-600' : 'text-gray-500'}`} />
          <span className="text-xs mt-1 font-medium">Analytics</span>
        </button>
        
        {/* Center Home button - larger and more prominent */}
        <button
          onClick={() => setCurrentPage('home')}
          className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 flex-[2] py-3 ${
            currentPage === 'home' 
              ? 'text-primary-600 scale-105' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Home className="w-7 h-7 text-primary-600" />
          <span className="text-xs mt-1 font-bold">Home</span>
        </button>
        
        {/* Community Button */}
        <button
          onClick={() => setCurrentPage('community')}
          className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 flex-1 ${
            currentPage === 'community' 
              ? 'text-primary-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Users className={`w-5 h-5 ${currentPage === 'community' ? 'text-primary-600' : 'text-gray-500'}`} />
          <span className="text-xs mt-1 font-medium">Community</span>
        </button>
        
        {/* Wallet Button */}
        <button
          onClick={() => setCurrentPage('wallet')}
          className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 flex-1 ${
            currentPage === 'wallet' 
              ? 'text-primary-600 scale-105' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Wallet className={`w-5 h-5 ${currentPage === 'wallet' ? 'text-primary-600' : 'text-gray-500'}`} />
          <span className="text-xs mt-1 font-medium">Wallet</span>
        </button>
      </div>
    </div>
  );
};

export default MobileBottomNav;