import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Info, 
  Zap, 
  Users, 
  BarChart3, 
  Settings, 
  Menu, 
  X, 
  ChevronDown,
  Sparkles,
  Brain,
  Rocket,
  Shield,
  User,
  Wallet,
  LogOut,
  Copy
} from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { toast } from 'react-toastify';

const Navbar = ({ 
  currentPage, 
  setCurrentPage, 
  isConnected, 
  walletPubkey, 
  balance, 
  onDisconnect,
  onShowWelcome 
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  // Get wallet name from Phantom (if available)
  const getWalletName = () => {
    if (typeof window !== 'undefined' && window.solana?.isPhantom) {
      return 'Phantom Wallet';
    }
    return 'Wallet Not Detected';
  };
  
  // Get wallet status message
  const getWalletStatusMessage = () => {
    if (typeof window !== 'undefined' && window.solana?.isPhantom) {
      return 'Connected';
    }
    
    // Check if user is on mobile
    const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobileDevice) {
      return 'Tap to open Phantom app';
    }
    
    return 'Install Phantom Wallet';
  };
  
  // Copy wallet address to clipboard
  const copyWalletAddress = async () => {
    if (walletPubkey) {
      try {
        await navigator.clipboard.writeText(walletPubkey);
        toast.success('Wallet address copied to clipboard!', {
          position: 'top-right',
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } catch (err) {
        console.error('Failed to copy wallet address:', err);
        toast.error('Failed to copy wallet address', {
          position: 'top-right',
          autoClose: 3000,
        });
      }
    }
  };

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu && !event.target.closest('.user-menu-container')) {
        setShowUserMenu(false);
      }
    };
    
    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showUserMenu]);

  const navigationItems = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      description: 'Main dashboard and token purchase'
    },
    {
      id: 'features',
      label: 'Features',
      icon: Sparkles,
      description: 'Explore advanced features',
      dropdown: [
        { id: 'analytics', label: 'Advanced Analytics', icon: Brain },
        { id: 'smart-contracts', label: 'Smart Contracts', icon: Shield },
        { id: 'auto-trading', label: 'Automated Features', icon: Zap }
      ]
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      description: 'Advanced market insights'
    },
    {
      id: 'community',
      label: 'Community',
      icon: Users,
      description: 'Join our ecosystem'
    },
    {
      id: 'about',
      label: 'About',
      icon: Info,
      description: 'Learn about Shibartum'
    }
  ];

  const handleNavClick = (pageId) => {
    setCurrentPage(pageId);
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  };

  const toggleDropdown = (itemId) => {
    setActiveDropdown(activeDropdown === itemId ? null : itemId);
  };

  return (
    <>
      {/* Main Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/50' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo & Brand */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Rocket className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 bg-clip-text text-transparent">
                  Shibartum
                </h1>
                <p className="text-xs text-gray-500 -mt-1">Advanced Presale Platform</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                
                return (
                  <div key={item.id} className="relative">
                    <button
                      onClick={() => item.dropdown ? toggleDropdown(item.id) : handleNavClick(item.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 group ${
                        isActive
                          ? 'bg-primary-500 text-white shadow-lg'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-primary-600'
                      }`}
                      title={item.description}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-primary-500'}`} />
                      <span>{item.label}</span>
                      {item.dropdown && (
                        <ChevronDown className={`w-4 h-4 transition-transform ${
                          activeDropdown === item.id ? 'rotate-180' : ''
                        }`} />
                      )}
                    </button>

                    {/* Dropdown Menu */}
                    {item.dropdown && activeDropdown === item.id && (
                      <div className="absolute top-full left-0 mt-2 w-56 bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-gray-200/50 py-2 animate-fade-in">
                        {item.dropdown.map((dropdownItem) => {
                          const DropdownIcon = dropdownItem.icon;
                          return (
                            <button
                              key={dropdownItem.id}
                              onClick={() => handleNavClick(dropdownItem.id)}
                              className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                            >
                              <DropdownIcon className="w-4 h-4" />
                              <span className="font-medium">{dropdownItem.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              {/* Welcome Button */}
              <button
                onClick={onShowWelcome}
                className="hidden sm:flex items-center gap-2 px-3 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
              >
                <Info className="w-4 h-4" />
                <span>Welcome</span>
              </button>

              {/* User Button with Wallet Info */}
              {isConnected && (
                <div className="relative user-menu-container">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="hidden md:flex items-center gap-3 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-lg border border-gray-200/50 hover:bg-white hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-purple-500 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-medium text-gray-900">
                          {getWalletName()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {balance?.toFixed(4)} SOL
                        </div>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${
                        showUserMenu ? 'rotate-180' : ''
                      }`} />
                    </div>
                  </button>

                  {/* User Dropdown Menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-200/50 backdrop-blur-sm z-50 animate-slide-down">
                      <div className="p-4">
                        {/* User Info Header */}
                        <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-purple-500 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900">{getWalletName()}</div>
                            {!window.solana?.isPhantom && (
                              <div className="text-sm text-orange-500">{getWalletStatusMessage()}</div>
                            )}
                            {window.solana?.isPhantom && (
                              <div className="text-sm text-gray-500">Connected</div>
                            )}
                          </div>
                          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        </div>

                        {/* Wallet Details */}
                        <div className="py-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Balance</span>
                            <span className="font-medium text-gray-900">{balance?.toFixed(6)} SOL</span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Address</span>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-mono text-gray-900">
                                {walletPubkey?.slice(0, 6)}...{walletPubkey?.slice(-6)}
                              </span>
                              <button
                                onClick={copyWalletAddress}
                                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                                title="Copy address"
                              >
                                <Copy className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-4 border-t border-gray-100 space-y-2">
                          <button
                            onClick={() => {
                              setShowUserMenu(false);
                              onDisconnect();
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Disconnect Wallet</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Theme Toggle */}
              <div className="flex items-center">
                <ThemeToggle />
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white/95 backdrop-blur-md border-t border-gray-200/50 animate-slide-down">
            <div className="px-4 py-4 space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                
                return (
                  <div key={item.id}>
                    <button
                      onClick={() => item.dropdown ? toggleDropdown(item.id) : handleNavClick(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                        isActive
                          ? 'bg-primary-500 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                      {item.dropdown && (
                        <ChevronDown className={`w-4 h-4 ml-auto transition-transform ${
                          activeDropdown === item.id ? 'rotate-180' : ''
                        }`} />
                      )}
                    </button>

                    {/* Mobile Dropdown */}
                    {item.dropdown && activeDropdown === item.id && (
                      <div className="ml-8 mt-2 space-y-1">
                        {item.dropdown.map((dropdownItem) => {
                          const DropdownIcon = dropdownItem.icon;
                          return (
                            <button
                              key={dropdownItem.id}
                              onClick={() => handleNavClick(dropdownItem.id)}
                              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:text-primary-600 transition-colors"
                            >
                              <DropdownIcon className="w-4 h-4" />
                              <span>{dropdownItem.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Mobile User Info */}
              {isConnected && (
                <div className="mt-4 p-4 bg-gradient-to-r from-primary-50 to-purple-50 rounded-lg border border-primary-100">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-500 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{getWalletName()}</div>
                      <div className="text-sm text-gray-600">
                        {walletPubkey?.slice(0, 8)}...{walletPubkey?.slice(-8)}
                      </div>
                    </div>
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-600">Balance:</span>
                    <span className="font-medium text-gray-900">{balance?.toFixed(6)} SOL</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={copyWalletAddress}
                      className="flex-1 px-3 py-2 text-sm font-medium text-primary-600 bg-white rounded-lg hover:bg-primary-50 transition-colors"
                    >
                      Copy Address
                    </button>
                    <button
                      onClick={onDisconnect}
                      className="flex-1 px-3 py-2 text-sm font-medium text-red-600 bg-white rounded-lg hover:bg-red-50 transition-colors"
                    >
                      Disconnect
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Backdrop for mobile menu */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;
