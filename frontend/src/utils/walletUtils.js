// Utility functions for wallet detection and handling

/**
 * Detects if Phantom wallet is available
 * @returns {Object|null} Phantom provider or null if not found
 */
export const detectPhantom = () => {
  if (typeof window === 'undefined') return null;
  
  if ('solana' in window) {
    const anyWindow = window;
    if (anyWindow.solana && anyWindow.solana.isPhantom) {
      return anyWindow.solana;
    }
  }
  
  return null;
};

/**
 * Waits for Phantom to be injected into the window object
 * @param {number} timeout - Maximum time to wait in milliseconds
 * @returns {Promise<Object|null>} Phantom provider or null if not found
 */
export const waitForPhantom = (timeout = 5000) => {
  return new Promise((resolve) => {
    const provider = detectPhantom();
    if (provider) {
      resolve(provider);
      return;
    }

    let elapsed = 0;
    const interval = 200;
    
    const check = setInterval(() => {
      const provider = detectPhantom();
      if (provider) {
        clearInterval(check);
        resolve(provider);
        return;
      }
      
      elapsed += interval;
      if (elapsed >= timeout) {
        clearInterval(check);
        resolve(null);
      }
    }, interval);
  });
};

/**
 * Attempts to connect to Phantom wallet
 * @param {Object} provider - Phantom provider instance
 * @returns {Promise<Object>} Connection result
 */
export const connectPhantom = async (provider) => {
  try {
    const response = await provider.connect();
    return {
      success: true,
      publicKey: response.publicKey.toString(),
      provider
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Checks if the user is on a mobile device
 * @returns {boolean} True if on mobile device
 */
export const isMobile = () => {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

/**
 * Checks if the user is on iOS
 * @returns {boolean} True if on iOS device
 */
export const isIOS = () => {
  if (typeof window === 'undefined') return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
};