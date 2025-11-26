import React, { useState, useEffect } from 'react';
import { Shield, TrendingUp, DollarSign, Target, Clock, Users, Activity, Award, Zap } from 'lucide-react';
import { config } from '../config';

const TokenStats = () => {
  const [stats, setStats] = useState({
    totalSupply: config.TOTAL_SUPPLY,
    tokensSold: 0,
    remainingTokens: config.TOTAL_SUPPLY,
    totalSales: 0,
    uniqueBuyers: 0,
    priceHistory: [],
    currentStage: 1,
    timeLeft: {
      days: 45,
      hours: 12,
      minutes: 34,
      seconds: 56
    },
    isLive: true
  });

  // Enhanced stats fetching with live updates
  useEffect(() => {
    const fetchStats = () => {
      // Get transaction history from localStorage
      const transactions = JSON.parse(localStorage.getItem('transactionHistory') || '[]');
      const successfulTxs = transactions.filter(tx => tx.status === 'success');
      
      const tokensSold = successfulTxs.reduce((sum, tx) => sum + (tx.amount || 0), 0);
      const totalSales = tokensSold * config.TOKEN_PRICE_SOL;
      const uniqueBuyers = new Set(successfulTxs.map(tx => tx.buyer)).size;
      const remainingTokens = config.TOTAL_SUPPLY - tokensSold;
      
      // Determine current stage based on tokens sold
      const currentStage = Math.min(5, Math.floor(tokensSold / (config.TOTAL_SUPPLY / 5)) + 1);

      // Enhanced price history with more data points
      const priceHistory = [
        { date: '2024-01-01', price: 0.000040, stage: 1 },
        { date: '2024-02-01', price: 0.000042, stage: 1 },
        { date: '2024-03-01', price: config.TOKEN_PRICE_SOL, stage: currentStage },
        { date: '2024-03-15', price: config.TOKEN_PRICE_SOL + 0.000005, stage: currentStage },
      ];

      setStats(prevStats => ({
        ...prevStats,
        totalSupply: config.TOTAL_SUPPLY,
        tokensSold: tokensSold + Math.floor(Math.random() * 100), // Simulate live updates
        remainingTokens,
        totalSales,
        uniqueBuyers: uniqueBuyers + Math.floor(Math.random() * 3),
        priceHistory,
        currentStage,
        isLive: true
      }));
    };

    fetchStats();
    
    // Update stats every 15 seconds for live feel
    const interval = setInterval(fetchStats, 15000);
    return () => clearInterval(interval);
  }, []);

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setStats(prevStats => {
        const { timeLeft } = prevStats;
        let { days, hours, minutes, seconds } = timeLeft;
        
        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        } else if (days > 0) {
          days--;
          hours = 23;
          minutes = 59;
          seconds = 59;
        }
        
        return {
          ...prevStats,
          timeLeft: { days, hours, minutes, seconds }
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toLocaleString();
  };

  const getProgressPercentage = () => {
    return ((stats.tokensSold / stats.totalSupply) * 100).toFixed(1);
  };

  const getStageProgress = () => {
    const stageSize = stats.totalSupply / 5;
    const stageStart = (stats.currentStage - 1) * stageSize;
    const stageEnd = stats.currentStage * stageSize;
    const progress = ((stats.tokensSold - stageStart) / (stageEnd - stageStart)) * 100;
    return Math.max(0, Math.min(100, progress)).toFixed(1);
  };

  const getStageInfo = () => {
    const stages = [
      { stage: 1, name: 'Early Bird', bonus: 20, color: 'text-green-600' },
      { stage: 2, name: 'Phase 1', bonus: 15, color: 'text-blue-600' },
      { stage: 3, name: 'Phase 2', bonus: 10, color: 'text-purple-600' },
      { stage: 4, name: 'Phase 3', bonus: 5, color: 'text-orange-600' },
      { stage: 5, name: 'Final', bonus: 0, color: 'text-red-600' }
    ];
    return stages.find(s => s.stage === stats.currentStage) || stages[0];
  };

  const stageInfo = getStageInfo();

  return (
    <div className="space-y-6">
      {/* Live Status Header */}
      <div className="glass-card p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Activity className="w-5 h-5 text-primary-600" />
            <h2 className="text-lg font-bold text-mono-black">Live Presale Dashboard</h2>
            {stats.isLive && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-600 font-medium">Live</span>
              </div>
            )}
          </div>
          <div className={`badge badge-primary ${stageInfo.color}`}>
            {stageInfo.name} - {stageInfo.bonus}% Bonus
          </div>
        </div>
      </div>

      {/* Enhanced Main Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Tokens Sold */}
        <div className="stat-card animate-bounce-in">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-primary-500" />
            <span className="stat-label">Tokens Sold</span>
          </div>
          <div className="stat-value">{formatNumber(stats.tokensSold)}</div>
          <div className="text-xs text-gray-500 mt-1">
            {getProgressPercentage()}% of total
          </div>
        </div>

        {/* SOL Raised */}
        <div className="stat-card animate-bounce-in" style={{animationDelay: '0.1s'}}>
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-green-500" />
            <span className="stat-label">SOL Raised</span>
          </div>
          <div className="stat-value text-green-600">{stats.totalSales.toFixed(1)}</div>
          <div className="text-xs text-gray-500 mt-1">
            ${(stats.totalSales * 100).toFixed(0)} USD
          </div>
        </div>

        {/* Participants */}
        <div className="stat-card animate-bounce-in" style={{animationDelay: '0.2s'}}>
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-blue-500" />
            <span className="stat-label">Participants</span>
          </div>
          <div className="stat-value text-blue-600">{stats.uniqueBuyers}</div>
          <div className="text-xs text-gray-500 mt-1">
            +{Math.floor(Math.random() * 10)} today
          </div>
        </div>

        {/* Current Stage */}
        <div className="stat-card animate-bounce-in" style={{animationDelay: '0.3s'}}>
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-5 h-5 text-purple-500" />
            <span className="stat-label">Current Stage</span>
          </div>
          <div className="stat-value text-purple-600">{stats.currentStage}</div>
          <div className="text-xs text-gray-500 mt-1">
            {getStageProgress()}% complete
          </div>
        </div>
      </div>

      {/* Enhanced Progress Section */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-mono-black">Overall Progress</h3>
          <span className="text-2xl font-bold text-primary-600">{getProgressPercentage()}%</span>
        </div>
        
        {/* Enhanced Progress Bar */}
        <div className="progress-bar mb-4">
          <div 
            className="progress-fill transition-all duration-1000"
            style={{ width: `${getProgressPercentage()}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between text-sm text-mono-text mb-6">
          <span>0</span>
          <span>{formatNumber(stats.totalSupply)} SBT</span>
        </div>

        {/* Stage Progress */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-mono-black">Stage {stats.currentStage} Progress</span>
            <span className="text-sm text-mono-text">{getStageProgress()}%</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${getStageProgress()}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Countdown Timer */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <Clock className="w-6 h-6 text-orange-500" />
          <h3 className="text-lg font-bold text-mono-black">Presale Ends In</h3>
        </div>
        
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Days', value: stats.timeLeft.days },
            { label: 'Hours', value: stats.timeLeft.hours },
            { label: 'Minutes', value: stats.timeLeft.minutes },
            { label: 'Seconds', value: stats.timeLeft.seconds }
          ].map((item, index) => (
            <div key={item.label} className="text-center animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
              <div className="bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-lg p-3 mb-2">
                <div className="text-xl font-bold">{item.value.toString().padStart(2, '0')}</div>
              </div>
              <div className="text-xs text-mono-text font-medium">{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Facts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-card-success p-4">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <div>
              <div className="font-semibold text-green-800">Next Price Increase</div>
              <div className="text-sm text-green-600">
                At {formatNumber((stats.currentStage * stats.totalSupply) / 5)} tokens sold
              </div>
            </div>
          </div>
        </div>
        
        <div className="glass-card-premium p-4">
          <div className="flex items-center gap-3">
            <Zap className="w-5 h-5 text-purple-600" />
            <div>
              <div className="font-semibold text-purple-800">Current Bonus</div>
              <div className="text-sm text-purple-600">
                {stageInfo.bonus}% extra tokens for {stageInfo.name} buyers
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Price History */}
      {stats.priceHistory.length > 0 && (
        <div className="glass-card p-6">
          <h3 className="text-lg font-bold text-mono-black mb-4">Price History & Stages</h3>
          <div className="space-y-3">
            {stats.priceHistory.map((entry, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-white/50 border border-mono-border rounded-lg hover:shadow-md transition-all duration-200 animate-slide-in-left" style={{animationDelay: `${index * 0.1}s`}}>
                <div>
                  <span className="text-mono-text font-medium">{new Date(entry.date).toLocaleDateString()}</span>
                  <span className="ml-2 badge badge-primary text-xs">Stage {entry.stage}</span>
                </div>
                <span className="text-lg font-bold text-mono-black">{entry.price.toFixed(6)} SOL</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TokenStats;
