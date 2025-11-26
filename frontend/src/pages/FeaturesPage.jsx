import React, { useState } from 'react';
import { 
  Brain, 
  Zap, 
  Shield, 
  TrendingUp, 
  Users, 
  Calculator,
  BarChart3,
  Sparkles,
  ChevronRight,
  Play,
  Pause,
  RefreshCw
} from 'lucide-react';

const FeaturesPage = () => {
  const [activeDemo, setActiveDemo] = useState(null);
  const [isPlaying, setIsPlaying] = useState({});

  const features = [
    {
      id: 'advanced-analytics',
      title: 'Advanced Analytics',
      description: 'Sophisticated algorithms analyze market trends, predict price movements, and provide real-time insights to help you make informed investment decisions',
      icon: TrendingUp,
      color: 'from-purple-500 to-pink-500',
      benefits: [
        'Real-time market sentiment analysis',
        'Predictive price modeling',
        'Risk assessment algorithms',
        'Automated trading signals'
      ],
      demo: {
        title: 'Live Market Analysis',
        description: 'Watch our analytics in action'
      }
    },
    {
      id: 'lightning-fast',
      title: 'Lightning Fast Transactions',
      description: 'Built on Solana blockchain for instant transactions with minimal fees. Experience the fastest token purchases in the industry.',
      icon: RefreshCw,
      color: 'from-yellow-500 to-orange-500',
      benefits: [
        'Sub-second transaction confirmation',
        'Ultra-low transaction fees',
        'Optimized smart contracts',
        'Batch transaction processing'
      ],
      demo: {
        title: 'Transaction Speed Test',
        description: 'See how fast our transactions complete compared to other platforms'
      }
    },
    {
      id: 'security',
      title: 'Military-Grade Security',
      description: 'Multi-layered security protocols protect your investments with audited smart contracts and advanced encryption.',
      icon: Shield,
      color: 'from-green-500 to-blue-500',
      benefits: [
        'Multi-signature wallet support',
        'Audited smart contracts',
        'End-to-end encryption',
        'Real-time fraud detection'
      ],
      demo: {
        title: 'Security Audit Report',
        description: 'View our comprehensive security audit results'
      }
    },
    {
      id: 'dynamic-pricing',
      title: 'Dynamic Pricing Engine',
      description: 'Smart pricing algorithms that adapt to market conditions, ensuring fair token distribution across all presale stages.',
      icon: TrendingUp,
      color: 'from-blue-500 to-purple-500',
      benefits: [
        'Market-responsive pricing',
        'Fair distribution algorithms',
        'Anti-whale mechanisms',
        'Bonus tier optimization'
      ],
      demo: {
        title: 'Pricing Algorithm Visualization',
        description: 'See how our pricing adapts to market conditions'
      }
    },
    {
      id: 'community',
      title: 'Community Ecosystem',
      description: 'Comprehensive referral system, governance tokens, and community rewards that put power back in the hands of users.',
      icon: Users,
      color: 'from-pink-500 to-red-500',
      benefits: [
        'Multi-tier referral system',
        'Governance token rewards',
        'Community voting rights',
        'Exclusive member benefits'
      ],
      demo: {
        title: 'Community Dashboard',
        description: 'Explore community features and rewards system'
      }
    },
    {
      id: 'advanced-calculator',
      title: 'Advanced Price Calculator',
      description: 'Sophisticated calculation engine with real-time USD conversion, bonus calculations, and investment planning tools.',
      icon: Calculator,
      color: 'from-indigo-500 to-purple-500',
      benefits: [
        'Real-time price conversion',
        'Bonus calculation engine',
        'Investment planning tools',
        'ROI projections'
      ],
      demo: {
        title: 'Calculator Demo',
        description: 'Try our advanced calculation features'
      }
    }
  ];

  const toggleDemo = (featureId) => {
    setActiveDemo(activeDemo === featureId ? null : featureId);
  };

  const togglePlayback = (featureId) => {
    setIsPlaying(prev => ({
      ...prev,
      [featureId]: !prev[featureId]
    }));
  };

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <div className="flex items-center justify-center gap-3 mb-6">
          <Sparkles className="w-12 h-12 text-primary-600" />
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Advanced Features
          </h1>
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Discover the cutting-edge technology and innovative features that make 
          Shibartum the most advanced token presale platform in the industry.
        </p>
      </div>

      {/* Feature Showcase */}
      <div className="space-y-8">
        {features.map((feature, index) => (
          <div key={feature.id} className="glass-card p-8 hover:shadow-xl transition-all duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Feature Content */}
              <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{feature.title}</h2>
                    <div className="w-12 h-1 bg-gradient-to-r from-primary-500 to-purple-500 rounded-full mt-2"></div>
                  </div>
                </div>
                
                <p className="text-gray-600 leading-relaxed mb-6">
                  {feature.description}
                </p>

                <div className="space-y-3 mb-6">
                  {feature.benefits.map((benefit, benefitIndex) => (
                    <div key={benefitIndex} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-gradient-to-r from-primary-500 to-purple-500 rounded-full"></div>
                      <span className="text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => toggleDemo(feature.id)}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-purple-500 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200"
                >
                  <Play className="w-4 h-4" />
                  Try Interactive Demo
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Feature Demo/Visualization */}
              <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border-2 border-dashed border-gray-300">
                  {activeDemo === feature.id ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">{feature.demo.title}</h3>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => togglePlayback(feature.id)}
                            className="p-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                          >
                            {isPlaying[feature.id] ? (
                              <Pause className="w-4 h-4 text-gray-600" />
                            ) : (
                              <Play className="w-4 h-4 text-gray-600" />
                            )}
                          </button>
                          <button className="p-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                            <RefreshCw className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="bg-white rounded-lg p-4 border">
                        <p className="text-sm text-gray-600 mb-4">{feature.demo.description}</p>
                        
                        {/* Demo Content Based on Feature */}
                        {feature.id === 'advanced-analytics' && (
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Market Sentiment</span>
                              <span className="text-green-600 font-medium">Bullish (78%)</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-green-500 h-2 rounded-full w-3/4 animate-pulse"></div>
                            </div>
                            <div className="text-xs text-gray-500">
                              Algorithm Confidence: 94% | Last Updated: 2 seconds ago
                            </div>
                          </div>
                        )}
                        
                        {feature.id === 'lightning-fast' && (
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Transaction Speed</span>
                              <span className="text-blue-600 font-medium">0.4s</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 bg-green-500 rounded-full animate-ping"></div>
                              <span className="text-sm text-green-600">Transaction Confirmed</span>
                            </div>
                          </div>
                        )}
                        
                        {feature.id === 'security' && (
                          <div className="space-y-2">
                            {['Smart Contract Audit', 'Multi-sig Verification', 'Encryption Check'].map((check, i) => (
                              <div key={i} className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                <span className="text-sm text-green-600">{check} ✓</span>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {feature.id === 'dynamic-pricing' && (
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-sm">Current Price</span>
                              <span className="font-medium">0.000045 SOL</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">Next Stage</span>
                              <span className="text-orange-600">0.000055 SOL</span>
                            </div>
                            <div className="text-xs text-gray-500">
                              Price adjusts based on demand and market conditions
                            </div>
                          </div>
                        )}
                        
                        {(feature.id === 'community' || feature.id === 'advanced-calculator') && (
                          <div className="text-center py-8">
                            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-500">Interactive demo coming soon</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <feature.icon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">{feature.demo.title}</h3>
                      <p className="text-gray-500 mb-4">{feature.demo.description}</p>
                      <button
                        onClick={() => toggleDemo(feature.id)}
                        className="text-primary-600 hover:text-primary-700 font-medium"
                      >
                        Click to view demo →
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Feature Comparison */}
      <div className="glass-card p-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Why Choose Shibartum?
        </h2>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-4">Feature</th>
                <th className="text-center py-4 px-4">Traditional Presales</th>
                <th className="text-center py-4 px-4 bg-gradient-to-r from-primary-50 to-purple-50 rounded-t-lg">
                  Shibartum
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Advanced Analytics', '❌', '✅'],
                ['Real-time Pricing', '❌', '✅'],
                ['Advanced Security', '⚠️', '✅'],
                ['Mobile Optimized', '⚠️', '✅'],
                ['Community Features', '❌', '✅'],
                ['24/7 Support', '❌', '✅']
              ].map(([feature, traditional, shibartum], index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-4 px-4 font-medium">{feature}</td>
                  <td className="py-4 px-4 text-center text-2xl">{traditional}</td>
                  <td className="py-4 px-4 text-center text-2xl bg-gradient-to-r from-primary-50 to-purple-50">
                    {shibartum}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CTA Section */}
      <div className="glass-card p-8 text-center bg-gradient-to-br from-primary-50 to-purple-50">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Ready to Experience the Future?
        </h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Join thousands of users who are already benefiting from our advanced features 
          and sophisticated analytics.
        </p>
        <button className="gradient-button text-lg px-8 py-4">
          Get Started Now
        </button>
      </div>
    </div>
  );
};

export default FeaturesPage;
