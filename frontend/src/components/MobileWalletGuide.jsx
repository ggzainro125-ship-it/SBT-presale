import React from 'react';
import { Smartphone, Download, Wallet, ArrowRight } from 'lucide-react';

const MobileWalletGuide = () => {
  return (
    <div className="glass-card p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Mobile Wallet Connection Guide</h2>
      
      <div className="space-y-6">
        <div className="text-center">
          <Smartphone className="w-16 h-16 mx-auto text-blue-500 mb-4" />
          <p className="text-gray-600 mb-6">
            Follow these steps to connect your Phantom wallet on mobile devices
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">1</div>
            <div>
              <h3 className="font-semibold mb-1">Install Phantom App</h3>
              <p className="text-gray-600 text-sm">
                Download and install the Phantom wallet app from the App Store (iOS) or Google Play Store (Android)
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">2</div>
            <div>
              <h3 className="font-semibold mb-1">Open Phantom Browser</h3>
              <p className="text-gray-600 text-sm">
                Open the dApp browser inside the Phantom app and navigate to this presale website
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">3</div>
            <div>
              <h3 className="font-semibold mb-1">Connect Wallet</h3>
              <p className="text-gray-600 text-sm">
                Click the "Connect Wallet" button - Phantom will automatically detect and connect
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">4</div>
            <div>
              <h3 className="font-semibold mb-1">Alternative Method</h3>
              <p className="text-gray-600 text-sm">
                If using your phone's default browser, click "Connect Wallet" and select "Open in Phantom App" when prompted
              </p>
            </div>
          </div>
        </div>
        
        <div className="pt-4 text-center">
          <a 
            href="https://phantom.app/download" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            Download Phantom
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default MobileWalletGuide;