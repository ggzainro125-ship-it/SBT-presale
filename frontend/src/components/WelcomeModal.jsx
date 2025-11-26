import React, { useState, useEffect } from 'react';
import { 
  X, 
  Rocket, 
  Zap, 
  Shield, 
  Brain, 
  TrendingUp, 
  Users, 
  Star,
  ChevronRight,
  Play,
  CheckCircle
} from 'lucide-react';

const WelcomeModal = ({ isOpen, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  // Reset slide to 0 when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentSlide(0);
      setIsPaused(false);
    }
  }, [isOpen]);
  
  // Auto-progression through slides - always active when modal is open
  useEffect(() => {
    if (!isOpen || isPaused) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => {
        if (prev < slides.length - 1) {
          return prev + 1;
        } else {
          // Loop back to first slide or stay on last slide
          return prev; // Stay on last slide
        }
      });
    }, 3000); // Change slide every 3 seconds
    
    return () => clearInterval(interval);
  }, [isOpen, isPaused, currentSlide]);

  const slides = [
    {
      id: 'welcome',
      title: 'Welcome to Shibartum',
      subtitle: 'The Future of Decentralized Token Presales',
      content: (
        <div className="text-center space-y-6">
          <div className="relative mx-auto w-32 h-32">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-full animate-spin-slow opacity-75"></div>
            <div className="relative bg-white rounded-full w-full h-full flex items-center justify-center">
              <Rocket className="w-16 h-16 text-primary-600" />
            </div>
          </div>
          <p className="text-lg text-gray-600 leading-relaxed">
            Experience the next generation of token presales with advanced analytics, 
            dynamic pricing, and cutting-edge blockchain technology.
          </p>
          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
              <Brain className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="font-semibold text-blue-900">Advanced</div>
              <div className="text-sm text-blue-600">Smart Analytics</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg">
              <Shield className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="font-semibold text-green-900">Secure</div>
              <div className="text-sm text-green-600">Blockchain Protected</div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'features',
      title: 'Revolutionary Features',
      subtitle: 'Built for the Modern Era',
      content: (
        <div className="space-y-6">
          <div className="grid gap-4">
            {[
              {
                icon: Brain,
                title: 'Advanced Analytics',
                description: 'Real-time market analysis and predictive insights with sophisticated algorithms',
                color: 'text-purple-600 bg-purple-50'
              },
              {
                icon: Zap,
                title: 'Lightning Fast Transactions',
                description: 'Instant token purchases with optimized Solana blockchain integration',
                color: 'text-yellow-600 bg-yellow-50'
              },
              {
                icon: TrendingUp,
                title: 'Dynamic Pricing',
                description: 'Intelligent pricing algorithms that adapt to market conditions in real-time',
                color: 'text-green-600 bg-green-50'
              },
              {
                icon: Users,
                title: 'Community Driven',
                description: 'Referral system and whitelist tiers that reward early supporters',
                color: 'text-blue-600 bg-blue-50'
              }
            ].map((feature, index) => (
              <div key={index} className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                <div className={`p-3 rounded-lg ${feature.color}`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">{feature.title}</h4>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'how-it-works',
      title: 'How It Works',
      subtitle: 'Simple Steps to Join the Future',
      content: (
        <div className="space-y-6">
          <div className="relative">
            {[
              {
                step: 1,
                title: 'Connect Your Wallet',
                description: 'Link your Phantom wallet to access the presale platform',
                icon: Shield
              },
              {
                step: 2,
                title: 'Choose Your Tier',
                description: 'Select from multiple presale stages with different bonuses',
                icon: Star
              },
              {
                step: 3,
                title: 'Purchase Tokens',
                description: 'Buy SBT tokens with SOL using our optimized pricing system',
                icon: Zap
              },
              {
                step: 4,
                title: 'Track & Earn',
                description: 'Monitor your investments and earn through referrals',
                icon: TrendingUp
              }
            ].map((step, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                  {step.step}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">{step.title}</h4>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
                <step.icon className="w-6 h-6 text-primary-500" />
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'get-started',
      title: 'Ready to Begin?',
      subtitle: 'Join Thousands of Early Adopters',
      content: (
        <div className="text-center space-y-6">
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">1,247</div>
              <div className="text-sm text-gray-500">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">45M</div>
              <div className="text-sm text-gray-500">Tokens Sold</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">2,025</div>
              <div className="text-sm text-gray-500">SOL Raised</div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-primary-50 to-purple-50 p-6 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">🎉 Early Bird Bonus</h4>
            <p className="text-sm text-gray-600 mb-4">
              Get 20% bonus tokens when you join during the current presale stage!
            </p>
            <div className="flex items-center justify-center gap-2 text-green-600">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Limited Time Offer</span>
            </div>
          </div>

          <div className="space-y-3">
            <button 
              onClick={onClose}
              className="w-full bg-gradient-to-r from-primary-500 to-purple-500 text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Rocket className="w-5 h-5" />
              Start Your Journey
            </button>
            <p className="text-xs text-gray-500">
              By continuing, you agree to our terms of service and privacy policy
            </p>
          </div>
        </div>
      )
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => Math.min(prev + 1, slides.length - 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => Math.max(prev - 1, 0));
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  if (!isOpen) return null;

  const currentSlideData = slides[currentSlide];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500 p-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">{currentSlideData.title}</h2>
            <p className="text-white/90">{currentSlideData.subtitle}</p>
          </div>

          {/* Progress Indicators */}
          <div className="flex justify-center items-center gap-3 mt-4">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentSlide ? 'bg-white w-8' : 'bg-white/50 w-2'
                }`}
              />
            ))}
            
            {/* Auto-play indicator - always shows it's auto-playing */}
            <div className="ml-3 flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse opacity-75" />
              <div className="text-xs text-white/75">Auto</div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div 
          className="p-8 overflow-y-auto max-h-[60vh]"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="min-h-[300px]">
            {currentSlideData.content}
          </div>
        </div>

        {/* Footer Navigation */}
        <div 
          className="flex items-center justify-between p-6 bg-gray-50 border-t"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <button
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              currentSlide === 0
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            Previous
          </button>

          <div className="text-sm text-gray-500">
            {currentSlide + 1} of {slides.length}
          </div>

          {currentSlide < slides.length - 1 ? (
            <button
              onClick={nextSlide}
              className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg font-medium hover:shadow-lg transition-all"
            >
              <Play className="w-4 h-4" />
              Get Started
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal;
