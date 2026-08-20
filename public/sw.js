const CACHE_NAME = 'nexapay-cache-v1';

// Assets to cache immediately on install
const PRECACHE_ASSETS = [
  '/',
  '/manifest.json',
  '/favicon.ico',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(async (cache) => {
        await Promise.allSettled(
          PRECACHE_ASSETS.map(async (asset) => {
            try {
              const res = await fetch(asset);
              if (res.ok) await cache.put(asset, res);
            } catch (err) {
              console.warn(`[SW] Precache failed for ${asset}:`, err);
            }
          })
        );
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event handler
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Skip cross-origin requests, non-GET requests, and dev HMR requests
  if (
    url.origin !== location.origin ||
    event.request.method !== 'GET' ||
    url.pathname.includes('/_next/webpack-hmr') ||
    url.pathname.includes('/_next/static/webpack/')
  ) {
    return;
  }

  // API & RSC Requests: Network First, fallback to cache
  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/_next/data/') || event.request.headers.get('RSC')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200 && (response.type === 'basic' || response.type === 'cors')) {
            const resClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, resClone)).catch(() => {});
          }
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(event.request);
          return cached || new Response(JSON.stringify({ error: 'Offline' }), {
            status: 503,
            headers: { 'Content-Type': 'application/json' },
          });
        })
    );
    return;
  }

  // Static Assets (Images, JS, CSS): Stale-While-Revalidate
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && (networkResponse.type === 'basic' || networkResponse.type === 'cors')) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            }).catch(() => {});
          }
          return networkResponse;
        })
        .catch(() => {
          return cachedResponse || new Response('Offline', { status: 503, statusText: 'Offline' });
        });

      return cachedResponse || fetchPromise;
    })
  );
});

// ─── Web Push Notification Handlers ──────────────────────────────────────────

self.addEventListener('push', (event) => {
  if (!event.data) return;

  try {
    const data = event.data.json();
    const title = data.title || 'NexaPay — Update Transaksi';
    const options = {
      body: data.body || 'Ada pembaruan status transaksi pada akun NexaPay Anda.',
      icon: data.icon || '/favicon.ico',
      badge: '/favicon.ico',
      image: data.image || undefined,
      vibrate: [100, 50, 100],
      data: {
        url: data.url || '/',
        dateOfArrival: Date.now(),
        primaryKey: 1,
      },
      actions: [
        { action: 'open', title: 'Buka Detail 🚀' },
        { action: 'close', title: 'Tutup' },
      ],
      tag: data.tag || 'nexapay-notification',
      renotify: true,
    };

    event.waitUntil(self.registration.showNotification(title, options));
  } catch (err) {
    console.error('[SW] Failed to process push event:', err);
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'close') return;

  const targetUrl = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // If a window is already open, focus it and navigate
      for (const client of windowClients) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }
      // Otherwise open a new window
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
