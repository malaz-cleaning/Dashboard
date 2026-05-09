const CACHE_NAME = 'malaz-cleaning-v1';
const urlsToCache = [
  new URL('./', self.location).href,
  new URL('./index.html', self.location).href,
  new URL('./login.html', self.location).href,
  new URL('./offline.html', self.location).href,
  new URL('./analytics.html', self.location).href,
  new URL('./orders.html', self.location).href,
  new URL('./clients.html', self.location).href,
  new URL('./chalets.html', self.location).href,
  new URL('./assets/styles-70MUTurc.css', self.location).href,
  new URL('./assets/manifest-DeqKMrzs.json', self.location).href,
  new URL('./assets/auth-BSM37I4d.js', self.location).href,
  new URL('./assets/common-DBXkofcI.js', self.location).href,
  new URL('./assets/main-CCNsLsoH.js', self.location).href,
  new URL('./assets/sidebar-DZfIzh0g.js', self.location).href,
  new URL('./assets/toast-CrpcpBgl.js', self.location).href,
  new URL('./assets/modal-JN-dnhWx.js', self.location).href,
  new URL('./assets/index-BuW1CxFr.js', self.location).href,
  new URL('./assets/orders-BYd0T6i5.js', self.location).href,
  new URL('./assets/clients-DAljZRK9.js', self.location).href,
  new URL('./assets/chalets-DdHajaCU.js', self.location).href,
  new URL('./assets/analytics-DbvfvDnJ.js', self.location).href,
  new URL('./assets/login-D_fHrbTq.js', self.location).href,
];

// Install Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
      .catch((error) => {
        console.error('SW install cache failed:', error);
      })
  );
});

// Fetch from cache
self.addEventListener('fetch', (event) => {
  // For assets (CSS, JS, images), try network first, then cache
  if (event.request.url.includes('/assets/') ||
      event.request.url.includes('.css') ||
      event.request.url.includes('.js') ||
      event.request.url.includes('.json')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Cache successful responses
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Fallback to cache if network fails
          return caches.match(event.request);
        })
    );
  } else {
    // For pages, try cache first, then network
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          return response || fetch(event.request)
            .catch(() => {
              // Return offline page for navigation requests
              if (event.request.mode === 'navigate') {
                return caches.match(new URL('./offline.html', self.location).href);
              }
            });
        })
    );
  }
});

// Update Service Worker
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
});

