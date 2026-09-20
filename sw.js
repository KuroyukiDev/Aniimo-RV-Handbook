// sw.js
const CACHE_NAME = 'aniimo-rv-v2.0.2';

const ASSETS_TO_CACHE = [
  '/Aniimo-RV-Handbook/',
  '/Aniimo-RV-Handbook/index.html',
  '/Aniimo-RV-Handbook/main.js', // <--- Added for offline support
  '/Aniimo-RV-Handbook/manifest.json',
  '/Aniimo-RV-Handbook/icons/windows/icon.ico',
  '/Aniimo-RV-Handbook/icons/mobile/icon-180x180.png',
  '/Aniimo-RV-Handbook/icons/mobile/icon-192x192.png',
  '/Aniimo-RV-Handbook/icons/mobile/icon-512x512.png',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      for (const asset of ASSETS_TO_CACHE) {
        try {
          await cache.add(asset);
        } catch (err) {
          console.warn(`[PWA SW] Pre-cache skipped: ${asset}`, err);
        }
      }
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).catch(() => {
        if (event.request.mode === 'navigate') {
          return caches.match('/Aniimo-RV-Handbook/index.html');
        }
      });
    })
  );
});