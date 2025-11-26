import React, { useState, useEffect } from 'react';
import { Calculator, TrendingUp, DollarSign, Zap, Info } from 'lucide-react';

const PriceCalculator = ({ tokenPrice = 0.000045, currentStage = 1 }) => {
  const [amount, setAmount] = useState('');
  const [solAmount, setSolAmount] = useState('');
  const [usdValue, setUsdValue] = useState(0);
  const [solPrice, setSolPrice] = useState(100); // Mock SOL price in USD
  const [calculationMode, setCalculationMode] = useState('tokens'); // 'tokens' or 'sol'

  // Price stages for dynamic pricing
  const priceStages = [
    { stage: 1, price: 0.000045, bonus: 20, label: 'Early Bird', color: 'text-green-600' },
    { stage: 2, price: 0.000055, bonus: 15, label: 'Phase 1', color: 'text-blue-600' },
    { stage: 3, price: 0.000065, bonus: 10, label: 'Phase 2', color: 'text-purple-600' },
    { stage: 4, price: 0.000075, bonus: 5, label: 'Phase 3', color: 'text-orange-600' },
    { stage: 5, price: 0.000085, bonus: 0, label: 'Final', color: 'text-red-600' }
  ];

  const currentStageInfo = priceStages.find(s => s.stage === currentStage) || priceStages[0];

  useEffect(() => {
    // Mock fetch SOL price from API
    const fetchSolPrice = async () => {
      try {
        // In real app, fetch from CoinGecko or similar
        // const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd');
        // const data = await response.json();
        // setSolPrice(data.solana.usd);
        setSolPrice(100); // Mock price
      } catch (error) {
        console.error('Failed to fetch SOL price:', error);
      }
    };

    fetchSolPrice();
    const interval = setInterval(fetchSolPrice, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (calculationMode === 'tokens' && amount) {
      const tokens = parseFloat(amount);
      if (!isNaN(tokens)) {
        const solCost = tokens * currentStageInfo.price;
        const bonusTokens = tokens * (currentStageInfo.bonus / 100);
        const totalTokens = tokens + bonusTokens;
        const usdCost = solCost * solPrice;
        
        setSolAmount(solCost.toFixed(6));
        setUsdValue(usdCost);
      }
    } else if (calculationMode === 'sol' && solAmount) {
      const sol = parseFloat(solAmount);
      if (!isNaN(sol)) {
        const tokens = sol / currentStageInfo.price;
        const bonusTokens = tokens * (currentStageInfo.bonus / 100);
        const totalTokens = tokens + bonusTokens;
        const usdCost = sol * solPrice;
        
        setAmount(Math.floor(tokens).toString());
        setUsdValue(usdCost);
      }
    }
  }, [amount, solAmount, calculationMode, currentStageInfo, solPrice]);

  const calculateBonus = () => {
    const tokens = parseFloat(amount) || 0;
    return tokens * (currentStageInfo.bonus / 100);
  };

  const calculateTotal = () => {
    const tokens = parseFloat(amount) || 0;
    const bonus = calculateBonus();
    return tokens + bonus;
  };

  const getNextStageInfo = () => {
    const nextStage = priceStages.find(s => s.stage === currentStage + 1);
    if (nextStage) {
      const priceIncrease = ((nextStage.price - currentStageInfo.price) / currentStageInfo.price * 100).toFixed(1);
      return { nextStage, priceIncrease };
    }
    return null;
  };

  const nextStageInfo = getNextStageInfo();

  return (
    <div className="glass-card p-6 mb-6">
      <div className="flex items-center gap-3 mb-6">
        <Calculator className="w-6 h-6 text-primary-600" />
        <h3 className="text-xl font-bold text-mono-black">Price Calculator</h3>
        <div className={`badge badge-primary ${currentStageInfo.color}`}>
          {currentStageInfo.label}
        </div>
      </div>

      {/* Current Stage Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="stat-card">
          <div className="stat-value">{currentStageInfo.price.toFixed(6)}</div>
          <div className="stat-label">SOL per Token</div>
        </div>
        <div className="stat-card">
          <div className="stat-value text-green-600">{currentStageInfo.bonus}%</div>
          <div className="stat-label">Bonus Tokens</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">${solPrice}</div>
          <div className="stat-label">SOL Price (USD)</div>
        </div>
      </div>

      {/* Calculation Mode Toggle */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setCalculationMode('tokens')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            calculationMode === 'tokens'
              ? 'bg-primary-500 text-white shadow-md'
              : 'bg-white text-primary-600 border border-primary-200 hover:bg-primary-50'
          }`}
        >
          Calculate by Tokens
        </button>
        <button
          onClick={() => setCalculationMode('sol')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            calculationMode === 'sol'
              ? 'bg-primary-500 text-white shadow-md'
              : 'bg-white text-primary-600 border border-primary-200 hover:bg-primary-50'
          }`}
        >
          Calculate by SOL
        </button>
      </div>

      {/* Input Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="input-group">
          <label className="input-label">
            {calculationMode === 'tokens' ? 'SBT Tokens to Buy' : 'SOL Amount to Spend'}
          </label>
          <input
            type="number"
            value={calculationMode === 'tokens' ? amount : solAmount}
            onChange={(e) => {
              if (calculationMode === 'tokens') {
                setAmount(e.target.value);
              } else {
                setSolAmount(e.target.value);
              }
            }}
            placeholder={calculationMode === 'tokens' ? 'Enter token amount' : 'Enter SOL amount'}
            className="input-field"
            min="0"
            step={calculationMode === 'tokens' ? '1' : '0.000001'}
          />
        </div>
        
        <div className="input-group">
          <label className="input-label">
            {calculationMode === 'tokens' ? 'SOL Cost' : 'SBT Tokens Received'}
          </label>
          <input
            type="text"
            value={calculationMode === 'tokens' ? solAmount : amount}
            readOnly
            className="input-field bg-gray-50"
            placeholder="Calculated automatically"
          />
        </div>
      </div>

      {/* Calculation Results */}
      {amount && (
        <div className="glass-card-premium p-4 mb-6">
          <h4 className="font-semibold text-mono-black mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            Purchase Summary
          </h4>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-mono-text">Base Tokens:</span>
              <span className="font-semibold">{parseFloat(amount || 0).toLocaleString()} SBT</span>
            </div>
            
            {currentStageInfo.bonus > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-mono-text">Bonus Tokens ({currentStageInfo.bonus}%):</span>
                <span className="font-semibold text-green-600">+{calculateBonus().toLocaleString()} SBT</span>
              </div>
            )}
            
            <div className="border-t border-mono-border pt-3">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-mono-black">Total Tokens:</span>
                <span className="font-bold text-lg text-primary-600">{calculateTotal().toLocaleString()} SBT</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-mono-text">SOL Cost:</span>
              <span className="font-semibold">{solAmount} SOL</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-mono-text">USD Value:</span>
              <span className="font-semibold">${usdValue.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Next Stage Warning */}
      {nextStageInfo && (
        <div className="bg-warning-50 border border-warning-200 p-4 rounded-lg">
          <div className="flex items-center gap-2 text-warning-800 mb-2">
            <TrendingUp className="w-4 h-4" />
            <span className="font-medium">Price Increase Alert</span>
          </div>
          <p className="text-warning-700 text-sm">
            Price will increase to {nextStageInfo.nextStage.price.toFixed(6)} SOL per token 
            (+{nextStageInfo.priceIncrease}%) in the next phase. 
            Buy now to secure the current {currentStageInfo.label} price!
          </p>
        </div>
      )}

      {/* Quick Amount Buttons */}
      <div className="mt-6">
        <label className="input-label mb-3">Quick Select:</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[1000, 5000, 10000, 50000].map((quickAmount) => (
            <button
              key={quickAmount}
              onClick={() => {
                setAmount(quickAmount.toString());
                setCalculationMode('tokens');
              }}
              className="btn-secondary py-2 text-sm"
            >
              {quickAmount.toLocaleString()} SBT
            </button>
          ))}
        </div>
      </div>

      {/* Price History Chart Placeholder */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <div className="text-center text-gray-500">
          <TrendingUp className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Price Chart Coming Soon</p>
          <p className="text-xs">Track token price progression across stages</p>
        </div>
      </div>
    </div>
  );
};

export default PriceCalculator;
