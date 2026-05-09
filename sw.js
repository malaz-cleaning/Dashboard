const CACHE_NAME = 'malaz-cleaning-v3';
const urlsToCache = [
  new URL('./', self.location).href,
  new URL('./index.html', self.location).href,
  new URL('./login.html', self.location).href,
  new URL('./offline.html', self.location).href,
  new URL('./analytics.html', self.location).href,
  new URL('./orders.html', self.location).href,
  new URL('./clients.html', self.location).href,
  new URL('./chalets.html', self.location).href,
];

function isSameOrigin(request) {
  return new URL(request.url).origin === self.location.origin;
}

// Install Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error('SW install cache failed:', error);
      })
  );
  self.skipWaiting();
});

// Fetch from network or cache
self.addEventListener('fetch', (event) => {
  const request = event.request;

  // Only handle same-origin requests in the SW
  if (!isSameOrigin(request)) {
    return;
  }

  const acceptHeader = request.headers.get('Accept') || '';
  const isNavigation = request.mode === 'navigate' || acceptHeader.includes('text/html');
  const isStaticAsset = request.url.includes('/assets/') || request.url.endsWith('.css') || request.url.endsWith('.js') || request.url.endsWith('.json');

  if (isNavigation) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.ok) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
          }
          return response;
        })
        .catch(() => {
          return caches.match(request)
            .then((cacheResponse) => cacheResponse || caches.match(new URL('./offline.html', self.location).href));
        })
    );
    return;
  }

  if (isStaticAsset) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        const networkFetch = fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.ok) {
              const cloned = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(request, cloned));
            }
            return networkResponse;
          })
          .catch(() => cachedResponse);

        return cachedResponse || networkFetch;
      })
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      return cachedResponse || fetch(request).catch(() => {
        if (request.mode === 'navigate') {
          return caches.match(new URL('./offline.html', self.location).href);
        }
      });
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

