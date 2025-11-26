import React, { useState, useEffect } from 'react';
import { Users, Copy, Gift, TrendingUp, ExternalLink } from 'lucide-react';
import { toast } from 'react-toastify';

const ReferralSystem = ({ walletPubkey, isConnected }) => {
  const [referralData, setReferralData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [referralCode, setReferralCode] = useState('');

  useEffect(() => {
    if (isConnected && walletPubkey) {
      fetchReferralData();
    }
  }, [isConnected, walletPubkey]);

  const fetchReferralData = async () => {
    if (!walletPubkey) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/user/${walletPubkey}`);
      if (response.ok) {
        const userData = await response.json();
        if (userData.success && userData.data.referral_code) {
          setReferralCode(userData.data.referral_code);
          
          // Fetch referral stats
          const statsResponse = await fetch(`/api/referral/${userData.data.referral_code}`);
          if (statsResponse.ok) {
            const statsData = await statsResponse.json();
            if (statsData.success) {
              setReferralData(statsData.data);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error fetching referral data:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyReferralLink = () => {
    if (!referralCode) return;
    
    const referralLink = `${window.location.origin}?ref=${referralCode}`;
    navigator.clipboard.writeText(referralLink).then(() => {
      toast.success('🔗 Referral link copied!', {
        position: "top-right",
        autoClose: 2000,
      });
    }).catch(() => {
      toast.error('Failed to copy link');
    });
  };

  const shareOnTwitter = () => {
    if (!referralCode) return;
    
    const referralLink = `${window.location.origin}?ref=${referralCode}`;
    const tweetText = `🚀 Join the Shibartum (SBT) presale and get bonus tokens! Use my referral link: ${referralLink} #Shibartum #SBT #Crypto #Presale`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
    window.open(twitterUrl, '_blank');
  };

  if (!isConnected) {
    return (
      <div className="glass-card p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Users className="w-6 h-6 text-mono-text" />
          <h3 className="text-lg font-semibold text-mono-black">Referral Program</h3>
        </div>
        <p className="text-mono-text">Connect your wallet to access the referral program</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="glass-card p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Users className="w-6 h-6 text-mono-text animate-pulse" />
          <h3 className="text-lg font-semibold text-mono-black">Referral Program</h3>
        </div>
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-mono-light rounded"></div>
          <div className="h-4 bg-mono-light rounded w-3/4"></div>
          <div className="h-8 bg-mono-light rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 mb-6">
      <div className="flex items-center gap-3 mb-6">
        <Users className="w-6 h-6 text-mono-text" />
        <h3 className="text-lg font-semibold text-mono-black">Referral Program</h3>
        <div className="ml-auto bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
          5% Bonus
        </div>
      </div>

      {/* Referral Stats */}
      {referralData && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-mono-light p-4 rounded-lg border border-mono-border text-center">
            <div className="text-2xl font-bold text-mono-black">{referralData.total_referrals || 0}</div>
            <div className="text-mono-text text-sm">Total Referrals</div>
          </div>
          <div className="bg-mono-light p-4 rounded-lg border border-mono-border text-center">
            <div className="text-2xl font-bold text-mono-black">
              {referralData.total_bonus_tokens ? referralData.total_bonus_tokens.toLocaleString() : 0}
            </div>
            <div className="text-mono-text text-sm">Bonus Tokens Earned</div>
          </div>
          <div className="bg-mono-light p-4 rounded-lg border border-mono-border text-center">
            <div className="text-2xl font-bold text-mono-black">
              {referralData.total_volume ? `${referralData.total_volume.toFixed(4)} SOL` : '0 SOL'}
            </div>
            <div className="text-mono-text text-sm">Referral Volume</div>
          </div>
        </div>
      )}

      {/* Referral Link */}
      {referralCode && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-mono-black mb-2">
            Your Referral Link
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={`${window.location.origin}?ref=${referralCode}`}
              readOnly
              className="input-field flex-1 bg-mono-light"
            />
            <button
              onClick={copyReferralLink}
              className="px-4 py-2 bg-mono-black text-white rounded-lg hover:bg-mono-text transition-colors flex items-center gap-2"
            >
              <Copy className="w-4 h-4" />
              Copy
            </button>
          </div>
        </div>
      )}

      {/* Share Buttons */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={shareOnTwitter}
          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <ExternalLink className="w-4 h-4" />
          Share on Twitter
        </button>
        <button
          onClick={copyReferralLink}
          className="flex-1 gradient-button py-3 px-4 flex items-center justify-center gap-2"
        >
          <Copy className="w-4 h-4" />
          Copy Link
        </button>
      </div>

      {/* How it Works */}
      <div className="border-t border-mono-border pt-6">
        <h4 className="font-semibold text-mono-black mb-4 flex items-center gap-2">
          <Gift className="w-5 h-5" />
          How Referrals Work
        </h4>
        <div className="space-y-3 text-sm text-mono-text">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-mono-black text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
              1
            </div>
            <div>
              <div className="font-medium text-mono-black">Share Your Link</div>
              <div>Send your unique referral link to friends and community</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-mono-black text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
              2
            </div>
            <div>
              <div className="font-medium text-mono-black">They Purchase Tokens</div>
              <div>When someone uses your link to buy SBT tokens</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-mono-black text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
              3
            </div>
            <div>
              <div className="font-medium text-mono-black">Earn 5% Bonus</div>
              <div>You receive 5% of their purchase as bonus SBT tokens</div>
            </div>
          </div>
        </div>
      </div>

      {/* Terms */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center gap-2 text-blue-800 mb-2">
          <TrendingUp className="w-4 h-4" />
          <span className="font-medium">Referral Terms</span>
        </div>
        <ul className="text-blue-700 text-sm space-y-1">
          <li>• Bonus tokens are distributed automatically after each successful referral</li>
          <li>• No limit on the number of referrals you can make</li>
          <li>• Bonus tokens follow the same vesting schedule as purchased tokens</li>
          <li>• Self-referrals and fraudulent activity will result in disqualification</li>
        </ul>
      </div>
    </div>
  );
};

export default ReferralSystem;
