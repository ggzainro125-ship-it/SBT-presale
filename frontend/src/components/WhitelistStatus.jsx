import React, { useState, useEffect } from 'react';
import { Shield, CheckCircle, XCircle, Clock, Star } from 'lucide-react';
import { toast } from 'react-toastify';

const WhitelistStatus = ({ walletPubkey, isConnected }) => {
  const [whitelistStatus, setWhitelistStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    if (isConnected && walletPubkey) {
      checkWhitelistStatus();
    }
  }, [isConnected, walletPubkey]);

  const checkWhitelistStatus = async () => {
    if (!walletPubkey) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/user/${walletPubkey}`);
      if (response.ok) {
        const userData = await response.json();
        if (userData.success) {
          setWhitelistStatus({
            isWhitelisted: userData.data.is_whitelisted,
            tier: userData.data.whitelist_tier,
            kycStatus: userData.data.kyc_status
          });
        }
      }
    } catch (error) {
      console.error('Error checking whitelist status:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyForWhitelist = async () => {
    if (!walletPubkey) {
      toast.error('Please connect your wallet first');
      return;
    }

    setApplying(true);
    try {
      const response = await fetch('/api/whitelist/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          wallet_address: walletPubkey,
          tier: 1 // Basic tier
        }),
      });

      const result = await response.json();
      if (result.success) {
        toast.success('Whitelist application submitted! 🎉');
        setWhitelistStatus({
          isWhitelisted: false,
          tier: 0,
          kycStatus: 'pending'
        });
      } else {
        toast.error(result.message || 'Application failed');
      }
    } catch (error) {
      toast.error('Failed to submit application');
      console.error('Whitelist application error:', error);
    } finally {
      setApplying(false);
    }
  };

  const getTierInfo = (tier) => {
    const tiers = {
      0: { name: 'None', color: 'text-gray-500', icon: XCircle },
      1: { name: 'Basic', color: 'text-blue-500', icon: Shield, allocation: '10,000 SBT' },
      2: { name: 'Premium', color: 'text-purple-500', icon: Star, allocation: '50,000 SBT' },
      3: { name: 'VIP', color: 'text-yellow-500', icon: Star, allocation: '100,000 SBT' }
    };
    return tiers[tier] || tiers[0];
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'text-green-500';
      case 'pending': return 'text-yellow-500';
      case 'rejected': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return CheckCircle;
      case 'pending': return Clock;
      case 'rejected': return XCircle;
      default: return Shield;
    }
  };

  if (!isConnected) {
    return (
      <div className="glass-card p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-6 h-6 text-mono-text" />
          <h3 className="text-lg font-semibold text-mono-black">Whitelist Status</h3>
        </div>
        <p className="text-mono-text">Connect your wallet to check whitelist status</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="glass-card p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-6 h-6 text-mono-text animate-pulse" />
          <h3 className="text-lg font-semibold text-mono-black">Whitelist Status</h3>
        </div>
        <div className="animate-pulse">
          <div className="h-4 bg-mono-light rounded mb-2"></div>
          <div className="h-4 bg-mono-light rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  const tierInfo = getTierInfo(whitelistStatus?.tier || 0);
  const StatusIcon = getStatusIcon(whitelistStatus?.kycStatus);

  return (
    <div className="glass-card p-6 mb-6">
      <div className="flex items-center gap-3 mb-4">
        <Shield className="w-6 h-6 text-mono-text" />
        <h3 className="text-lg font-semibold text-mono-black">Whitelist Status</h3>
      </div>

      {whitelistStatus ? (
        <div className="space-y-4">
          {/* Status Overview */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <StatusIcon className={`w-5 h-5 ${getStatusColor(whitelistStatus.kycStatus)}`} />
              <span className="font-medium">
                Status: <span className={getStatusColor(whitelistStatus.kycStatus)}>
                  {whitelistStatus.kycStatus.charAt(0).toUpperCase() + whitelistStatus.kycStatus.slice(1)}
                </span>
              </span>
            </div>
            {whitelistStatus.isWhitelisted && (
              <div className="flex items-center gap-2">
                <tierInfo.icon className={`w-5 h-5 ${tierInfo.color}`} />
                <span className={`font-semibold ${tierInfo.color}`}>
                  {tierInfo.name} Tier
                </span>
              </div>
            )}
          </div>

          {/* Tier Benefits */}
          {whitelistStatus.isWhitelisted && tierInfo.allocation && (
            <div className="bg-mono-light p-4 rounded-lg border border-mono-border">
              <div className="flex justify-between items-center">
                <span className="text-mono-text">Max Allocation:</span>
                <span className="font-bold text-mono-black">{tierInfo.allocation}</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {!whitelistStatus.isWhitelisted && whitelistStatus.kycStatus !== 'pending' && (
            <button
              onClick={applyForWhitelist}
              disabled={applying}
              className="gradient-button w-full py-3 flex items-center justify-center gap-2"
            >
              {applying ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Applying...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  Apply for Whitelist
                </>
              )}
            </button>
          )}

          {whitelistStatus.kycStatus === 'pending' && (
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-yellow-800">
                <Clock className="w-4 h-4" />
                <span className="font-medium">Application Under Review</span>
              </div>
              <p className="text-yellow-700 text-sm mt-1">
                Your whitelist application is being reviewed. You'll be notified once approved.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-4">
          <p className="text-mono-text mb-4">You're not currently whitelisted</p>
          <button
            onClick={applyForWhitelist}
            disabled={applying}
            className="gradient-button px-6 py-3 flex items-center justify-center gap-2 mx-auto"
          >
            {applying ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Applying...
              </>
            ) : (
              <>
                <Shield className="w-4 h-4" />
                Apply for Whitelist
              </>
            )}
          </button>
        </div>
      )}

      {/* Whitelist Benefits */}
      <div className="mt-6 pt-4 border-t border-mono-border">
        <h4 className="font-semibold text-mono-black mb-3">Whitelist Benefits</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Early Access</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Higher Allocations</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Bonus Rewards</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhitelistStatus;
