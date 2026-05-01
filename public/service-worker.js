const CACHE_NAME = 'calhub-v2';
const urlsToCache = [
  '/SmartCalculatorHub/',
  '/SmartCalculatorHub/index.html',
  '/SmartCalculatorHub/manifest.json',
];

// Install
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('SW: Opened cache');
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// Activate
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((key) => {
        if (key !== CACHE_NAME) {
          console.log('SW: Deleting old cache', key);
          return caches.delete(key);
        }
      }))
    )
  );
  self.clients.claim();
});

// Fetch (Offline Support with Cache-First then Network fallback)
self.addEventListener('fetch', (event) => {
  // Ignore non-get requests and potential chrome-extension urls
  if (event.request.method !== 'GET' || !event.request.url.startsWith('http')) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;

      return fetch(event.request).then((networkResponse) => {
        // Cache success responses
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Silent fail or return offline fallback if needed
      });
    })
  );
});
