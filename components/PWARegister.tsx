'use client';

import { useEffect } from 'react';

export default function PWARegister() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      const handleLoad = () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('Service Worker registered successfully with scope:', registration.scope);
          })
          .catch((error) => {
            console.error('Service Worker registration failed:', error);
          });
      };

      // Register service worker after the window load event to avoid blocking critical paint
      if (document.readyState === 'complete') {
        handleLoad();
      } else {
        window.addEventListener('load', handleLoad);
        return () => window.removeEventListener('load', handleLoad);
      }
    }
  }, []);

  return null;
}
