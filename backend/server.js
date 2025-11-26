const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Backend is running',
    data: null
  });
});

// Mock confirm purchase endpoint
app.post('/api/confirm-purchase', (req, res) => {
  console.log('Received purchase request:', req.body);
  
  const { signature, buyer, amount } = req.body;
  
  // Load environment variables
  const ownerPub = process.env.OWNER_PUBLIC_KEY || '';
  const tokenMint = process.env.TOKEN_MINT_ADDRESS || '';
  const tokenPrice = parseFloat(process.env.TOKEN_PRICE_SOL) || 0.000045;
  
  // Basic validation
  if (!ownerPub || ownerPub.includes('REPLACE')) {
    return res.status(500).json({
      success: false,
      message: 'OWNER_PUBLIC_KEY not configured on server',
      data: null
    });
  }
  
  // Mock implementation - in real app you would:
  // 1. Verify the Solana transaction
  // 2. Check if payment was received
  // 3. Transfer SBT tokens to buyer
  
  res.json({
    success: true,
    message: `Mock: Purchase confirmed for ${amount} SBT tokens`,
    data: {
      signature,
      buyer,
      amount,
      token_price: tokenPrice,
      total_cost: amount * tokenPrice
    }
  });
});

// Serve frontend for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Starting Shibartum Presale Backend at http://localhost:${PORT}`);
  console.log('📋 Available endpoints:');
  console.log('   GET  /api/health - Health check');
  console.log('   POST /api/confirm-purchase - Confirm token purchase');
});
