const CACHE = 'wh40k-tracker-v25';
const ASSETS = [
  './index.html',
  './warhammer-icon.svg',
  './Factions.csv',
  './Stratagems.csv',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  // Network-first for HTML so updates are picked up immediately
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE).then(cache => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }
  // Cache-first for all other assets (icons, etc.)
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});
