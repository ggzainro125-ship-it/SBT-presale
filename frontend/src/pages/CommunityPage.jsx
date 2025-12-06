import React, { useState } from 'react';
import { 
  Users, 
  MessageCircle, 
  Twitter, 
  Github, 
  Send, 
  Award, 
  TrendingUp,
  Calendar,
  MapPin,
  ExternalLink,
  Heart,
  Star,
  Zap
} from 'lucide-react';

const CommunityPage = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const communityStats = [
    { label: 'Total Members', value: '12,547', icon: Users, color: 'text-blue-600' },
    { label: 'Active Today', value: '2,341', icon: TrendingUp, color: 'text-green-600' },
    { label: 'Messages Today', value: '8,923', icon: MessageCircle, color: 'text-purple-600' },
    { label: 'Countries', value: '67', icon: MapPin, color: 'text-orange-600' }
  ];

  const socialChannels = [
    {
      name: 'Discord',
      description: 'Join our main community hub for real-time discussions',
      members: '8,234',
      icon: '💬',
      link: '#',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      name: 'Telegram',
      description: 'Get instant updates and announcements',
      members: '5,678',
      icon: '📱',
      link: '#',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      name: 'Twitter',
      description: 'Follow us for the latest news and updates',
      members: '15,432',
      icon: '🐦',
      link: '#',
      color: 'from-blue-400 to-blue-600'
    },
    {
      name: 'Reddit',
      description: 'Deep discussions and community governance',
      members: '3,456',
      icon: '📋',
      link: '#',
      color: 'from-orange-500 to-red-500'
    }
  ];

  const events = [
    {
      title: 'AMA with the Team',
      date: 'Dec 15, 2024',
      time: '3:00 PM UTC',
      type: 'Live Event',
      description: 'Ask anything about our roadmap and future plans',
      attendees: 234
    },
    {
      title: 'Community Trading Competition',
      date: 'Dec 20, 2024',
      time: 'All Day',
      type: 'Competition',
      description: 'Win exclusive NFTs and bonus tokens',
      attendees: 567
    },
    {
      title: 'Technical Workshop',
      date: 'Dec 25, 2024',
      time: '2:00 PM UTC',
      type: 'Educational',
      description: 'Learn about DeFi and smart contracts',
      attendees: 123
    }
  ];

  const leaderboard = [
    { rank: 1, name: 'CryptoMaster', points: 15420, badge: '👑' },
    { rank: 2, name: 'BlockchainPro', points: 12340, badge: '🥈' },
    { rank: 3, name: 'DeFiExplorer', points: 9876, badge: '🥉' },
    { rank: 4, name: 'TokenHunter', points: 8765, badge: '⭐' },
    { rank: 5, name: 'CryptoTrader', points: 7654, badge: '⭐' }
  ];

  const achievements = [
    {
      title: 'Early Adopter',
      description: 'Joined during the first week',
      icon: '🚀',
      rarity: 'Legendary',
      holders: 127
    },
    {
      title: 'Community Champion',
      description: 'Helped 100+ community members',
      icon: '🏆',
      rarity: 'Epic',
      holders: 45
    },
    {
      title: 'Referral Master',
      description: 'Referred 50+ new members',
      icon: '🎯',
      rarity: 'Rare',
      holders: 234
    },
    {
      title: 'Content Creator',
      description: 'Created viral community content',
      icon: '✨',
      rarity: 'Uncommon',
      holders: 567
    }
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <div className="flex items-center justify-center gap-3 mb-6">
          <Users className="w-12 h-12 text-primary-600" />
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Join Our Community
          </h1>
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Connect with thousands of like-minded individuals, share insights, 
          and be part of the future of decentralized finance.
        </p>
      </div>

      {/* Community Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {communityStats.map((stat, index) => (
          <div key={index} className="glass-card p-6 text-center hover:shadow-lg transition-shadow">
            <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-3`} />
            <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
            <div className="text-sm text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Tab Navigation */}
      <div className="glass-card p-6">
        <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'channels', label: 'Social Channels' },
            { id: 'events', label: 'Events' },
            { id: 'leaderboard', label: 'Leaderboard' },
            { id: 'achievements', label: 'Achievements' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-600 hover:text-primary-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Our Ecosystem</h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Our community is the heart of Shibartum. Here, you'll find passionate 
                  individuals who share your interest in cutting-edge blockchain technology, 
                  advanced analytics, and the future of decentralized finance.
                </p>
                <div className="space-y-4">
                  {[
                    'Real-time market discussions and analysis',
                    'Exclusive access to beta features and updates',
                    'Direct communication with the development team',
                    'Educational content and trading strategies',
                    'Networking opportunities with industry experts'
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                      <span className="text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-primary-50 to-purple-50 p-6 rounded-xl">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Community Guidelines</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <Heart className="w-4 h-4 text-red-500 mt-0.5" />
                    <span>Be respectful and supportive of all community members</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <MessageCircle className="w-4 h-4 text-blue-500 mt-0.5" />
                    <span>Keep discussions relevant and constructive</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Award className="w-4 h-4 text-yellow-500 mt-0.5" />
                    <span>Share knowledge and help others learn</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Zap className="w-4 h-4 text-purple-500 mt-0.5" />
                    <span>Stay updated with announcements and news</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'channels' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {socialChannels.map((channel, index) => (
              <div key={index} className="bg-white/50 border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 group">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${channel.color} rounded-lg flex items-center justify-center text-2xl`}>
                    {channel.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{channel.name}</h3>
                    <p className="text-gray-600 text-sm mb-3">{channel.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">{channel.members} members</span>
                      <button className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors group-hover:scale-105">
                        Join Now
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'events' && (
          <div className="space-y-6">
            {events.map((event, index) => (
              <div key={index} className="bg-white/50 border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.title}</h3>
                    <p className="text-gray-600 mb-3">{event.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {event.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {event.attendees} attending
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-2">
                      {event.type}
                    </span>
                    <div className="text-sm text-gray-600">{event.time}</div>
                  </div>
                </div>
                <button className="w-full bg-gradient-to-r from-primary-500 to-purple-500 text-white py-2 rounded-lg font-medium hover:shadow-lg transition-all">
                  Register for Event
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'leaderboard' && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Community Champions</h3>
              <p className="text-gray-600">Top contributors this month</p>
            </div>
            
            <div className="space-y-4">
              {leaderboard.map((user, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-white/50 border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
                  <div className="text-2xl">{user.badge}</div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{user.name}</div>
                    <div className="text-sm text-gray-600">Rank #{user.rank}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary-600">{user.points.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">points</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {achievements.map((achievement, index) => (
              <div key={index} className="bg-white/50 border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{achievement.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">{achievement.description}</p>
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        achievement.rarity === 'Legendary' ? 'bg-yellow-100 text-yellow-700' :
                        achievement.rarity === 'Epic' ? 'bg-purple-100 text-purple-700' :
                        achievement.rarity === 'Rare' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {achievement.rarity}
                      </span>
                      <span className="text-sm text-gray-500">{achievement.holders} holders</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="glass-card p-8 text-center bg-gradient-to-br from-primary-50 to-purple-50">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Ready to Join Our Community?
        </h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Connect with thousands of crypto enthusiasts, get exclusive insights, 
          and be part of the Shibartum revolution.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="gradient-button px-8 py-3">
            Join Discord
          </button>
          <button className="btn-secondary px-8 py-3">
            Follow on Twitter
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;
