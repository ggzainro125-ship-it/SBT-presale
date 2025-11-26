import React from 'react';
import { 
  Rocket, 
  Brain, 
  Shield, 
  Zap, 
  Users, 
  TrendingUp, 
  Target, 
  Award,
  Globe,
  Code,
  Heart,
  Star
} from 'lucide-react';

const AboutPage = () => {
  const teamMembers = [
    {
      name: 'Alex Chen',
      role: 'CEO & Founder',
      avatar: '👨‍💼',
      description: 'Blockchain visionary with 8+ years in DeFi'
    },
    {
      name: 'Sarah Kim',
      role: 'CTO',
      avatar: '👩‍💻',
      description: 'Technical expert and Solana core contributor'
    },
    {
      name: 'Mike Rodriguez',
      role: 'Head of Product',
      avatar: '👨‍🎨',
      description: 'UX designer focused on Web3 experiences'
    },
    {
      name: 'Emma Thompson',
      role: 'Marketing Director',
      avatar: '👩‍🚀',
      description: 'Growth hacker with crypto marketing expertise'
    }
  ];

  const milestones = [
    {
      date: 'Q1 2024',
      title: 'Project Inception',
      description: 'Shibartum concept and team formation',
      status: 'completed'
    },
    {
      date: 'Q2 2024',
      title: 'MVP Development',
      description: 'Core platform and analytics engine',
      status: 'completed'
    },
    {
      date: 'Q3 2024',
      title: 'Presale Launch',
      description: 'Public presale with advanced features',
      status: 'current'
    },
    {
      date: 'Q4 2024',
      title: 'Mainnet Launch',
      description: 'Full platform launch and token distribution',
      status: 'upcoming'
    },
    {
      date: 'Q1 2025',
      title: 'Ecosystem Expansion',
      description: 'DeFi integrations and partnerships',
      status: 'upcoming'
    }
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <div className="relative inline-block">
          <div className="w-24 h-24 bg-gradient-to-br from-primary-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Rocket className="w-12 h-12 text-white" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-pulse">
            <Star className="w-4 h-4 text-white" />
          </div>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          About Shibartum
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          We're revolutionizing the token presale landscape with advanced analytics 
          and cutting-edge blockchain technology to create the most sophisticated 
          and user-friendly platform in the industry.
        </p>
      </div>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card p-8">
          <div className="flex items-center gap-3 mb-6">
            <Target className="w-8 h-8 text-primary-600" />
            <h2 className="text-2xl font-bold text-mono-black">Our Mission</h2>
          </div>
          <p className="text-gray-600 leading-relaxed mb-6">
            To democratize access to advanced token presale technology by providing 
            sophisticated analytics, transparent pricing mechanisms, and seamless user 
            experiences that empower both projects and investors.
          </p>
          <div className="space-y-3">
            {[
              'Transparent and fair token distribution',
              'Advanced market insights for all users',
              'Secure and audited smart contracts',
              'Community-first approach to development'
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                <span className="text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-8">
          <div className="flex items-center gap-3 mb-6">
            <Globe className="w-8 h-8 text-purple-600" />
            <h2 className="text-2xl font-bold text-mono-black">Our Vision</h2>
          </div>
          <p className="text-gray-600 leading-relaxed mb-6">
            To become the leading platform for next-generation token presales, 
            setting new standards for innovation, security, and user experience 
            in the decentralized finance ecosystem.
          </p>
          <div className="space-y-3">
            {[
              'Global adoption of advanced DeFi tools',
              'Seamless integration across all blockchains',
              'Educational resources for crypto newcomers',
              'Sustainable and environmentally conscious operations'
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Key Features */}
      <div className="glass-card p-8">
        <h2 className="text-3xl font-bold text-center text-mono-black mb-8">
          What Makes Us Different
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: Shield,
              title: 'Military-Grade Security',
              description: 'Multi-layer security protocols and audited smart contracts protect your investments',
              color: 'from-green-500 to-blue-500'
            },
            {
              icon: Zap,
              title: 'Lightning Fast',
              description: 'Optimized for Solana blockchain ensuring instant transactions and low fees',
              color: 'from-yellow-500 to-orange-500'
            },
            {
              icon: Brain,
              title: 'Advanced Analytics',
              description: 'Sophisticated algorithms provide real-time market insights and predictive analysis',
              color: 'from-purple-500 to-pink-500'
            },
            {
              icon: TrendingUp,
              title: 'Dynamic Pricing',
              description: 'Smart pricing algorithms adapt to market conditions for fair token distribution',
              color: 'from-blue-500 to-purple-500'
            },
            {
              icon: Users,
              title: 'Community Driven',
              description: 'Referral systems and governance tokens give power back to the community',
              color: 'from-pink-500 to-red-500'
            },
            {
              icon: Code,
              title: 'Open Source',
              description: 'Transparent development with open-source components and public audits',
              color: 'from-indigo-500 to-purple-500'
            }
          ].map((feature, index) => (
            <div key={index} className="bg-white/50 border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 group">
              <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Team Section */}
      <div className="glass-card p-8">
        <h2 className="text-3xl font-bold text-center text-mono-black mb-8">
          Meet Our Team
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member, index) => (
            <div key={index} className="text-center group">
              <div className="relative mb-4">
                <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-purple-100 rounded-full flex items-center justify-center mx-auto text-4xl group-hover:scale-110 transition-transform">
                  {member.avatar}
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                  <Award className="w-4 h-4 text-white" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{member.name}</h3>
              <p className="text-primary-600 font-medium mb-2">{member.role}</p>
              <p className="text-sm text-gray-600">{member.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Roadmap */}
      <div className="glass-card p-8">
        <h2 className="text-3xl font-bold text-center text-mono-black mb-8">
          Development Roadmap
        </h2>
        <div className="space-y-6">
          {milestones.map((milestone, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className={`flex-shrink-0 w-4 h-4 rounded-full mt-2 ${
                milestone.status === 'completed' 
                  ? 'bg-green-500' 
                  : milestone.status === 'current'
                  ? 'bg-primary-500 animate-pulse'
                  : 'bg-gray-300'
              }`}></div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{milestone.title}</h3>
                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {milestone.date}
                  </span>
                  {milestone.status === 'current' && (
                    <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full font-medium">
                      In Progress
                    </span>
                  )}
                </div>
                <p className="text-gray-600">{milestone.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: 'Lines of Code', value: '50,000+', icon: Code },
          { label: 'Security Audits', value: '3', icon: Shield },
          { label: 'Team Members', value: '12', icon: Users },
          { label: 'Community Size', value: '5,000+', icon: Heart }
        ].map((stat, index) => (
          <div key={index} className="glass-card p-6 text-center">
            <stat.icon className="w-8 h-8 text-primary-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
            <div className="text-sm text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutPage;
