import React, { useState } from 'react';
import { Plus, Zap, Calculator, Users, BarChart3, X } from 'lucide-react';

const FloatingActionButton = ({ activeTab, setActiveTab }) => {
  const [isOpen, setIsOpen] = useState(false);

  const quickActions = [
    { id: 'purchase', icon: Zap, label: 'Quick Buy', color: 'bg-green-500 hover:bg-green-600' },
    { id: 'calculator', icon: Calculator, label: 'Calculator', color: 'bg-blue-500 hover:bg-blue-600' },
    { id: 'referral', icon: Users, label: 'Referrals', color: 'bg-purple-500 hover:bg-purple-600' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics', color: 'bg-orange-500 hover:bg-orange-600' }
  ];

  const handleActionClick = (tabId) => {
    setActiveTab(tabId);
    setIsOpen(false);
    
    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Action Buttons */}
      <div className="fixed bottom-8 right-8 z-50">
        {isOpen && (
          <div className="absolute bottom-16 right-0 space-y-3 animate-fade-in">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              const isActive = activeTab === action.id;
              
              return (
                <div
                  key={action.id}
                  className="flex items-center gap-3 animate-slide-in-right"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Label */}
                  <div className="bg-white/95 backdrop-blur-md px-3 py-2 rounded-lg shadow-lg border border-white/20">
                    <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                      {action.label}
                    </span>
                  </div>
                  
                  {/* Action Button */}
                  <button
                    onClick={() => handleActionClick(action.id)}
                    className={`w-12 h-12 rounded-full ${action.color} text-white shadow-xl transition-all duration-300 hover:scale-110 ${
                      isActive ? 'ring-4 ring-white/30 scale-110' : ''
                    }`}
                    title={action.label}
                  >
                    <Icon className="w-5 h-5 mx-auto" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Main FAB */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`fab transition-all duration-300 ${
            isOpen ? 'rotate-45 bg-red-500 hover:bg-red-600' : ''
          }`}
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Plus className="w-6 h-6" />
          )}
        </button>
      </div>
    </>
  );
};

export default FloatingActionButton;
