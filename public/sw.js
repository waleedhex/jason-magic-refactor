const CACHE_NAME = 'asra3-wahad-v1.1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/src/main.tsx',
  '/src/App.tsx',
  '/src/index.css',
  '/src/assets/store-sticker.png',
  '/src/data/codes.json',
  '/src/data/orders.json'
];

// تثبيت Service Worker
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching files');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error('[SW] Failed to cache files:', error);
      })
  );
  self.skipWaiting();
});

// تفعيل Service Worker
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// التعامل مع طلبات الشبكة
self.addEventListener('fetch', (event) => {
  // تخطي الطلبات غير HTTP
  if (!event.request.url.startsWith('http')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // إرجاع الملف المحفوظ إذا وُجد
        if (cachedResponse) {
          console.log('[SW] Serving from cache:', event.request.url);
          return cachedResponse;
        }

        // أو جلب من الشبكة وحفظ النسخة
        return fetch(event.request).then((response) => {
          // التأكد من صحة الاستجابة
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // حفظ نسخة من الاستجابة
          const responseToCache = response.clone();
          
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });

          return response;
        }).catch(() => {
          // في حالة فشل الشبكة، إرجاع صفحة أساسية
          if (event.request.destination === 'document') {
            return caches.match('/');
          }
        });
      })
  );
});