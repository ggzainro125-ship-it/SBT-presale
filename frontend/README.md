# Shibartum Token Presale Frontend

A modern, production-ready React frontend for the Shibartum (SBT) token presale built with Vite, featuring advanced UI/UX, wallet integration, and comprehensive error handling.

## ✨ Features

### 🚀 **Modern Tech Stack**
- **React 18** with hooks and modern patterns
- **Vite** for lightning-fast development
- **Lucide React** for beautiful icons
- **React Toastify** for professional notifications

### 💎 **Advanced UI/UX**
- **Glassmorphism design** with gradient backgrounds
- **Responsive layout** for all devices
- **Loading states** and skeleton components
- **Smooth animations** and transitions
- **Professional toast notifications** (no more alerts!)

### 🔐 **Wallet Integration**
- **Phantom wallet** connection with persistence
- **Real-time balance** display
- **Copy-to-clipboard** functionality
- **Auto-reconnection** on page refresh

### 📊 **Smart Features**
- **Transaction history** tracking
- **Balance validation** before purchases
- **Configuration validation** with helpful errors
- **Error boundaries** for graceful failure handling
- **SEO optimization** with meta tags

## 🛠️ Setup & Installation

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Copy the example environment file and configure it:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
VITE_OWNER_PUBLIC_KEY=your_owner_public_key_here
VITE_TOKEN_PRICE_SOL=0.000045
VITE_SOLANA_NETWORK=devnet
VITE_TOKEN_SYMBOL=SBT
VITE_TOKEN_NAME=Shibartum
VITE_TOTAL_SUPPLY=1000000000
VITE_API_BASE_URL=http://localhost:8080
```

### 3. Development Server
```bash
npm run dev
```

### 4. Production Build
```bash
npm run build
```

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ErrorBoundary.jsx    # Error handling wrapper
│   ├── WalletInfo.jsx       # Wallet connection display
│   ├── TransactionHistory.jsx # Transaction tracking
│   └── LoadingSkeleton.jsx  # Loading placeholders
├── hooks/              # Custom React hooks
│   ├── useWallet.js         # Wallet connection logic
│   └── useLocalStorage.js   # Local storage management
├── config.js           # Environment configuration
├── App.jsx            # Main application component
├── main.jsx           # Application entry point
└── styles.css         # Global styles and components
```

## 🎨 Component Overview

### **WalletInfo Component**
- Displays connected wallet address (truncated)
- Shows real-time SOL balance
- Copy address to clipboard functionality
- Disconnect button

### **TransactionHistory Component**
- Tracks last 10 transactions
- Shows transaction status (success/failed/pending)
- Links to Solana Explorer
- Persistent storage

### **ErrorBoundary Component**
- Catches JavaScript errors
- Provides user-friendly error messages
- Reload/retry functionality
- Development error details

### **Custom Hooks**
- `useWallet`: Manages wallet connection, balance, and persistence
- `useLocalStorage`: Handles local storage with error handling

## 🔧 Configuration

The app uses environment variables for configuration:

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_OWNER_PUBLIC_KEY` | Recipient wallet address | Required |
| `VITE_TOKEN_PRICE_SOL` | Price per token in SOL | 0.000045 |
| `VITE_SOLANA_NETWORK` | Solana network (devnet/mainnet) | devnet |
| `VITE_TOKEN_SYMBOL` | Token symbol | SBT |
| `VITE_TOKEN_NAME` | Token full name | Shibartum |
| `VITE_TOTAL_SUPPLY` | Total token supply | 1000000000 |
| `VITE_API_BASE_URL` | Backend API URL | "" |

## 🎯 Key Improvements Made

### **User Experience**
- ✅ Replaced all `alert()` calls with beautiful toast notifications
- ✅ Added loading states and progress indicators
- ✅ Implemented form validation with helpful messages
- ✅ Added wallet balance checking before transactions
- ✅ Created responsive design for all screen sizes

### **Developer Experience**
- ✅ Modular component architecture
- ✅ Custom hooks for reusable logic
- ✅ Environment-based configuration
- ✅ Error boundaries for graceful error handling
- ✅ TypeScript-ready structure

### **Production Ready**
- ✅ SEO optimization with meta tags
- ✅ Performance optimizations
- ✅ Error logging and monitoring ready
- ✅ Comprehensive testing structure
- ✅ Security best practices

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

The build output will be in the `dist/` directory, ready to be served by the backend or any static hosting service.

### Preview Production Build
```bash
npm run preview
```

## 🔍 Troubleshooting

### Common Issues

**Wallet not connecting:**
- Ensure Phantom wallet is installed
- Check if wallet is unlocked
- Try refreshing the page

**Configuration errors:**
- Verify all environment variables are set
- Check that `VITE_OWNER_PUBLIC_KEY` is valid
- Ensure backend is running if using API

**Transaction failures:**
- Check wallet balance
- Verify network connection
- Ensure backend is properly configured

## 📱 Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**Built with ❤️ for the Solana ecosystem**
