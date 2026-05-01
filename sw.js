// Hades Tour PWA — Service Worker
// Caches all assets so the app works fully offline.

const CACHE_NAME = 'hades-tour-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png',
  './icons/icon-maskable-1024.png',
  // Google Fonts CSS + woff2 — prefetched on first visit
  'https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&family=Pirata+One&family=Special+Elite&display=swap'
];

// Install: pre-cache the core assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      // Use addAll but tolerate individual failures (e.g. font CSS occasionally rate-limited)
      return Promise.allSettled(ASSETS.map(url => cache.add(url)));
    }).then(() => self.skipWaiting())
  );
});

// Activate: clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

// Fetch: cache-first for our assets, network-first for fonts (with cache fallback)
self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  const isFontResource = url.hostname.includes('fonts.googleapis.com')
                      || url.hostname.includes('fonts.gstatic.com');

  if (isFontResource) {
    // Network first, fall back to cache, and update cache on success
    event.respondWith(
      fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(req, copy));
        return res;
      }).catch(() => caches.match(req))
    );
    return;
  }

  // Cache-first for everything else
  event.respondWith(
    caches.match(req).then(cached => {
      if (cached) return cached;
      return fetch(req).then(res => {
        // Cache successful same-origin responses for next time
        if (res && res.status === 200 && res.type === 'basic') {
          const copy = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(req, copy));
        }
        return res;
      });
    })
  );
});
