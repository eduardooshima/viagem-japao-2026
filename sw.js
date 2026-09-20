const C='japao2026-v12';
const A=['./','./index.html','./data.js','./manifest.json','./icon.svg'];

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
  const isDynamic = url.pathname.endsWith('/index.html') || url.pathname.endsWith('/data.js') || url.pathname === '/';

  if (isDynamic) {
    event.respondWith(
      fetch(event.request, { cache: 'no-store' })
        .then(response => {
          const copy = response.clone();
          caches.open(C).then(cache => cache.put(event.request, copy));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});
