// Service Worker Registration
// This file handles service worker registration and prevents Workbox errors in development

export function registerSW() {
  // Only register service worker in production
  if (import.meta.env.PROD && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    });
  }
}

// Unregister any existing service workers in development
export function unregisterSW() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
      for(let registration of registrations) {
        registration.unregister();
        console.log('Service worker unregistered:', registration);
      }
    });
  }
}

// Auto-run based on environment
if (import.meta.env.DEV) {
  // Unregister service workers in development to prevent Workbox errors
  unregisterSW();
} else {
  // Register service worker in production
  registerSW();
}
