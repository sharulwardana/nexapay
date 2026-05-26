// Minimal Service Worker for PWA Installation Requirements
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // A simple pass-through fetch handler is enough to trigger the "Add to Home Screen" prompt
  // In a production app, you might want caching strategies here (e.g., using Workbox)
  event.respondWith(fetch(event.request));
});
