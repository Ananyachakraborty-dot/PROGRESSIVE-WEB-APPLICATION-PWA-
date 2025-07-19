const CACHE_NAME = 'shopnow-cache-v1';
const OFFLINE_URLS = [
  '/',
  '/index.html',
  '/style.css',
  '/app.js',
  '/images/icons/icon-192x192.png'
];

// Install
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[SW] Caching files');
      return cache.addAll(OFFLINE_URLS);
    })
  );
});

// Activate
self.addEventListener('activate', event => {
  console.log('[SW] Activated');
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    )
  );
});

// Fetch
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() =>
      caches.match(event.request).then(response => response || caches.match('/index.html'))
    )
  );
});
// STEP 7: Handle incoming push messages
self.addEventListener('push', event => {
  const data = event.data?.json() || {};

  const title = data.title || "ShopNow Notification";
  const options = {
    body: data.message || "You have a new update!",
    icon: '/images/icons/icon-192x192.png'
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});
