const CACHE_NAME = 'asra3-wahad-v2.0';
const STATIC_CACHE = 'asra3-static-v2.0';
const DYNAMIC_CACHE = 'asra3-dynamic-v2.0';

// جميع الملفات الثابتة للتطبيق
const STATIC_FILES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/robots.txt'
];

// البيانات والأصول الثابتة
const DATA_FILES = [
  '/src/data/codes.json',
  '/src/data/orders.json',
  '/src/assets/store-sticker.png'
];

// تثبيت Service Worker وتخزين الملفات
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker v2.0...');
  
  event.waitUntil(
    Promise.all([
      // تخزين الملفات الثابتة
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('[SW] Caching static files');
        return cache.addAll(STATIC_FILES);
      }),
      
      // تخزين البيانات والأصول
      caches.open(DYNAMIC_CACHE).then((cache) => {
        console.log('[SW] Caching data files');
        return cache.addAll(DATA_FILES).catch((error) => {
          console.warn('[SW] Some data files failed to cache:', error);
          // نحاول إضافة الملفات واحداً تلو الآخر
          return Promise.allSettled(
            DATA_FILES.map(file => cache.add(file))
          );
        });
      })
    ]).then(() => {
      console.log('[SW] All files cached successfully');
      self.skipWaiting();
    }).catch((error) => {
      console.error('[SW] Failed to cache files:', error);
    })
  );
});

// تفعيل Service Worker وتنظيف الكاش القديم
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (![STATIC_CACHE, DYNAMIC_CACHE].includes(cacheName)) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[SW] Service Worker activated and ready');
      self.clients.claim();
    })
  );
});

// استراتيجية Cache First للملفات الثابتة والبيانات
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // تخطي الطلبات غير HTTP
  if (!request.url.startsWith('http')) {
    return;
  }

  // تخطي طلبات التطوير
  if (url.pathname.includes('/@vite/') || 
      url.pathname.includes('/node_modules/') ||
      url.pathname.includes('/__vite_ping')) {
    return;
  }

  event.respondWith(
    handleRequest(request)
  );
});

async function handleRequest(request) {
  const url = new URL(request.url);
  
  try {
    // استراتيجية Cache First للملفات الثابتة والبيانات
    if (isStaticFile(url.pathname) || isDataFile(url.pathname)) {
      return await cacheFirst(request);
    }
    
    // استراتيجية Network First للملفات الديناميكية (JS, CSS)
    if (isDynamicFile(url.pathname)) {
      return await networkFirst(request);
    }
    
    // استراتيجية Cache First للملفات الأخرى
    return await cacheFirst(request);
    
  } catch (error) {
    console.error('[SW] Request failed:', error);
    
    // إرجاع صفحة رئيسية في حالة فشل طلب الصفحات
    if (request.destination === 'document') {
      const cachedResponse = await caches.match('/');
      if (cachedResponse) return cachedResponse;
    }
    
    // إرجاع رد فعل أساسي
    return new Response('التطبيق غير متوفر حالياً', {
      status: 503,
      statusText: 'Service Unavailable',
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });
  }
}

// Cache First - جرب الكاش أولاً ثم الشبكة
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    console.log('[SW] Serving from cache:', request.url);
    return cachedResponse;
  }
  
  console.log('[SW] Fetching from network:', request.url);
  const response = await fetch(request);
  
  if (response && response.status === 200) {
    const cache = await caches.open(DYNAMIC_CACHE);
    cache.put(request, response.clone());
  }
  
  return response;
}

// Network First - جرب الشبكة أولاً ثم الكاش
async function networkFirst(request) {
  try {
    console.log('[SW] Trying network first:', request.url);
    const response = await fetch(request);
    
    if (response && response.status === 200) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', request.url);
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    throw error;
  }
}

// فحص نوع الملف
function isStaticFile(pathname) {
  return STATIC_FILES.some(file => pathname === file || pathname.endsWith(file));
}

function isDataFile(pathname) {
  return pathname.includes('/data/') || 
         pathname.includes('/assets/') ||
         pathname.endsWith('.json') ||
         pathname.endsWith('.png') ||
         pathname.endsWith('.jpg') ||
         pathname.endsWith('.jpeg') ||
         pathname.endsWith('.svg');
}

function isDynamicFile(pathname) {
  return pathname.endsWith('.js') || 
         pathname.endsWith('.ts') ||
         pathname.endsWith('.tsx') ||
         pathname.endsWith('.jsx') ||
         pathname.endsWith('.css') ||
         pathname.includes('/src/');
}

// إشعار بالتحديثات
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

console.log('[SW] Service Worker script loaded');