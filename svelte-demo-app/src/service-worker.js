var cacheName = 'Tf' + Date.now();
var filesToCache = [
  '/',
  '/index.html',
  '/static/favicon.png',
  '/static/index.css',
  '/static/index.js',
  // 'https://fonts.googleapis.com/css?family=Oswald|Roboto&display=swap',
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(cacheName).then(function (cache) {
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (thisCacheName) {
          if (thisCacheName !== cacheName) {
            return caches.delete(thisCacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    (async function () {
      const response = await caches.match(e.request);
      return response || fetch(e.request);
    })()
  );
});
