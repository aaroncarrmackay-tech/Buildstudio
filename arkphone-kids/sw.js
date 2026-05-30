// Service worker — cache-first, offline-first.
// sw.js must live at the project root so its scope covers the whole app.

const CACHE_VERSION = 'arkphone-v0.2.0';

const PRECACHE_FILES = [
  '/',
  '/index.html',
  '/src/styles.css',
  '/src/data.js',
  '/src/app.js',
  '/public/manifest.webmanifest',
  '/public/icons/icon-192.svg',
  '/public/icons/icon-512.svg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then(cache => cache.addAll(PRECACHE_FILES))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(k => k !== CACHE_VERSION)
          .map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  // Only handle GET requests for same-origin resources.
  if (event.request.method !== 'GET') return;
  if (!event.request.url.startsWith(self.location.origin)) return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        // Cache successful responses for future offline use.
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE_VERSION).then(cache => cache.put(event.request, copy));
        }
        return response;
      });
    })
  );
});
