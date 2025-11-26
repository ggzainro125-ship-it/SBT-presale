import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, DollarSign, Target, Calendar, Eye, Activity } from 'lucide-react';

const AnalyticsDashboard = ({ walletPubkey, isConnected }) => {
  const [analytics, setAnalytics] = useState({
    dailyStats: [],
    topBuyers: [],
    salesByStage: [],
    recentActivity: [],
    conversionRate: 0,
    averagePurchase: 0,
    totalVisitors: 0,
    bounceRate: 0
  });
  
  const [timeframe, setTimeframe] = useState('7d'); // 7d, 30d, 90d
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isConnected && walletPubkey) {
      fetchAnalytics();
    }
  }, [isConnected, walletPubkey, timeframe]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      // Simulate API call - replace with real endpoint
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data - replace with real API data
      const mockData = {
        dailyStats: generateDailyStats(),
        topBuyers: generateTopBuyers(),
        salesByStage: generateSalesByStage(),
        recentActivity: generateRecentActivity(),
        conversionRate: 12.5,
        averagePurchase: 5420,
        totalVisitors: 8945,
        bounceRate: 23.4
      };
      
      setAnalytics(mockData);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateDailyStats = () => {
    const days = timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : 90;
    return Array.from({ length: days }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (days - 1 - i));
      return {
        date: date.toISOString().split('T')[0],
        sales: Math.floor(Math.random() * 50000) + 10000,
        visitors: Math.floor(Math.random() * 500) + 100,
        conversions: Math.floor(Math.random() * 50) + 10
      };
    });
  };

  const generateTopBuyers = () => [
    { wallet: '7xKX...9mP2', amount: 125000, percentage: 15.2 },
    { wallet: '9kL4...3nQ8', amount: 98000, percentage: 11.8 },
    { wallet: '2mN7...6rT5', amount: 87500, percentage: 10.6 },
    { wallet: '5pR9...4sW1', amount: 76000, percentage: 9.2 },
    { wallet: '8qT3...7uY6', amount: 65000, percentage: 7.9 }
  ];

  const generateSalesByStage = () => [
    { stage: 1, name: 'Early Bird', sales: 180000, percentage: 35 },
    { stage: 2, name: 'Phase 1', sales: 150000, percentage: 29 },
    { stage: 3, name: 'Phase 2', sales: 120000, percentage: 23 },
    { stage: 4, name: 'Phase 3', sales: 67000, percentage: 13 },
    { stage: 5, name: 'Final', sales: 0, percentage: 0 }
  ];

  const generateRecentActivity = () => [
    { type: 'purchase', wallet: '7xKX...9mP2', amount: 25000, time: '2 minutes ago' },
    { type: 'whitelist', wallet: '9kL4...3nQ8', amount: null, time: '5 minutes ago' },
    { type: 'purchase', wallet: '2mN7...6rT5', amount: 15000, time: '8 minutes ago' },
    { type: 'referral', wallet: '5pR9...4sW1', amount: 5000, time: '12 minutes ago' },
    { type: 'purchase', wallet: '8qT3...7uY6', amount: 35000, time: '15 minutes ago' }
  ];

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toLocaleString();
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'purchase': return '💰';
      case 'whitelist': return '✅';
      case 'referral': return '🎁';
      default: return '📊';
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'purchase': return 'text-green-600';
      case 'whitelist': return 'text-blue-600';
      case 'referral': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  if (!isConnected) {
    return (
      <div className="glass-card p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <BarChart3 className="w-6 h-6 text-mono-text" />
          <h3 className="text-lg font-semibold text-mono-black">Analytics Dashboard</h3>
        </div>
        <p className="text-mono-text">Connect your wallet to view detailed analytics</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="glass-card p-6 mb-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-8 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
          <div className="h-40 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-6 h-6 text-primary-600" />
            <h3 className="text-xl font-bold text-mono-black">Analytics Dashboard</h3>
          </div>
          
          {/* Timeframe Selector */}
          <div className="flex gap-2">
            {[
              { id: '7d', label: '7 Days' },
              { id: '30d', label: '30 Days' },
              { id: '90d', label: '90 Days' }
            ].map((option) => (
              <button
                key={option.id}
                onClick={() => setTimeframe(option.id)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                  timeframe === option.id
                    ? 'bg-primary-500 text-white'
                    : 'bg-white/50 text-gray-600 hover:bg-white/80'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="stat-card">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="w-5 h-5 text-blue-500" />
              <span className="stat-label">Total Visitors</span>
            </div>
            <div className="stat-value text-blue-600">{formatNumber(analytics.totalVisitors)}</div>
            <div className="text-xs text-gray-500 mt-1">
              +12% vs last period
            </div>
          </div>

          <div className="stat-card">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-green-500" />
              <span className="stat-label">Conversion Rate</span>
            </div>
            <div className="stat-value text-green-600">{analytics.conversionRate}%</div>
            <div className="text-xs text-gray-500 mt-1">
              +2.3% vs last period
            </div>
          </div>

          <div className="stat-card">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-purple-500" />
              <span className="stat-label">Avg Purchase</span>
            </div>
            <div className="stat-value text-purple-600">{formatNumber(analytics.averagePurchase)}</div>
            <div className="text-xs text-gray-500 mt-1">
              SBT tokens
            </div>
          </div>

          <div className="stat-card">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-orange-500" />
              <span className="stat-label">Bounce Rate</span>
            </div>
            <div className="stat-value text-orange-600">{analytics.bounceRate}%</div>
            <div className="text-xs text-gray-500 mt-1">
              -5.2% vs last period
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Sales Chart */}
        <div className="glass-card p-6">
          <h4 className="text-lg font-bold text-mono-black mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary-600" />
            Daily Sales Trend
          </h4>
          
          <div className="space-y-3">
            {analytics.dailyStats.slice(-7).map((day, index) => (
              <div key={day.date} className="flex items-center gap-3">
                <div className="text-xs text-gray-500 w-16">
                  {new Date(day.date).toLocaleDateString('en', { weekday: 'short' })}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">{formatNumber(day.sales)} SBT</span>
                    <span className="text-xs text-gray-500">{day.conversions} buyers</span>
                  </div>
                  <div className="progress-bar h-2">
                    <div 
                      className="progress-fill h-2" 
                      style={{ 
                        width: `${(day.sales / Math.max(...analytics.dailyStats.map(d => d.sales))) * 100}%`,
                        animationDelay: `${index * 0.1}s`
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sales by Stage */}
        <div className="glass-card p-6">
          <h4 className="text-lg font-bold text-mono-black mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-primary-600" />
            Sales by Stage
          </h4>
          
          <div className="space-y-3">
            {analytics.salesByStage.map((stage, index) => (
              <div key={stage.stage} className="animate-slide-in-left" style={{animationDelay: `${index * 0.1}s`}}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Stage {stage.stage}: {stage.name}</span>
                  <span className="text-sm text-gray-600">{stage.percentage}%</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${stage.percentage}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {formatNumber(stage.sales)} SBT sold
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Buyers */}
        <div className="glass-card p-6">
          <h4 className="text-lg font-bold text-mono-black mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-primary-600" />
            Top Buyers
          </h4>
          
          <div className="space-y-3">
            {analytics.topBuyers.map((buyer, index) => (
              <div key={buyer.wallet} className="flex items-center justify-between p-3 bg-white/50 rounded-lg animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium text-mono-black">{buyer.wallet}</div>
                    <div className="text-xs text-gray-500">{buyer.percentage}% of total</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-primary-600">{formatNumber(buyer.amount)}</div>
                  <div className="text-xs text-gray-500">SBT</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass-card p-6">
          <h4 className="text-lg font-bold text-mono-black mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary-600" />
            Recent Activity
          </h4>
          
          <div className="space-y-3">
            {analytics.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-white/50 rounded-lg animate-slide-in-right" style={{animationDelay: `${index * 0.1}s`}}>
                <div className="text-lg">{getActivityIcon(activity.type)}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{activity.wallet}</span>
                    <span className={`text-sm capitalize ${getActivityColor(activity.type)}`}>
                      {activity.type}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">{activity.time}</div>
                </div>
                {activity.amount && (
                  <div className="text-right">
                    <div className="font-bold text-primary-600">{formatNumber(activity.amount)}</div>
                    <div className="text-xs text-gray-500">SBT</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
