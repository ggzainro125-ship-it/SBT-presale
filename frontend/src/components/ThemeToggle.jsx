import React, { useState, useEffect } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';

const ThemeToggle = () => {
  const [theme, setTheme] = useState('light');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Get saved theme from localStorage or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (newTheme) => {
    const root = document.documentElement;
    const body = document.body;
    
    // Remove existing theme classes
    root.classList.remove('dark', 'light');
    
    if (newTheme === 'dark') {
      root.classList.add('dark');
      // Change body background for dark theme
      body.style.background = 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)';
      
    } else if (newTheme === 'light') {
      root.classList.add('light');
      // Change body background for light theme
      body.style.background = 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 50%, #cbd5e1 100%)';
      
    } else if (newTheme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      applyTheme(prefersDark ? 'dark' : 'light');
      return;
    }
    
    console.log(`Theme applied: ${newTheme}`);
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
    setIsOpen(false);
  };

  const themes = [
    { id: 'light', name: 'Light', icon: Sun },
    { id: 'dark', name: 'Dark', icon: Moon },
    { id: 'auto', name: 'Auto', icon: Monitor }
  ];

  const currentTheme = themes.find(t => t.id === theme);
  const CurrentIcon = currentTheme?.icon || Sun;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg bg-white/90 backdrop-blur-sm border border-gray-200/50 hover:bg-white hover:shadow-md transition-all duration-200 group"
        title="Change theme"
      >
        <CurrentIcon className="w-5 h-5 text-gray-700 group-hover:scale-110 transition-transform" />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Theme Menu */}
          <div className="absolute top-full right-0 mt-2 z-50 animate-fade-in">
            <div className="bg-white/95 backdrop-blur-md border border-white/20 rounded-xl shadow-xl p-2 min-w-[150px]">
              {themes.map((themeOption) => {
                const Icon = themeOption.icon;
                const isActive = theme === themeOption.id;
                
                return (
                  <button
                    key={themeOption.id}
                    onClick={() => handleThemeChange(themeOption.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                      isActive 
                        ? 'bg-primary-500 text-white shadow-md' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{themeOption.name}</span>
                    {isActive && (
                      <div className="ml-auto w-2 h-2 bg-white rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>
            
            {/* Theme Preview */}
            <div className="mt-2 bg-white/95 backdrop-blur-md border border-white/20 rounded-xl p-3">
              <div className="text-xs text-gray-600 mb-2 font-medium">Preview:</div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"></div>
                  <div className="text-xs text-gray-700">Accent Colors</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}></div>
                  <div className="text-xs text-gray-700">Background</div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ThemeToggle;
