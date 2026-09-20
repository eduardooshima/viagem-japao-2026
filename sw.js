const C='japao2026-v12';
const A=['./','./index.html','./manifest.json','./icon.svg'];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(C)
      .then(cache => cache.addAll(A))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(key => key !== C).map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (url.pathname.endsWith('/data.js') || url.pathname.endsWith('/data.json')) {
    event.respondWith(fetch(event.request, {cache:'no-store'}));
    return;
  }
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});
