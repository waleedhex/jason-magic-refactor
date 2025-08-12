const CACHE_NAME = 'asra3-wahad-v2.1';
const STATIC_CACHE = 'asra3-static-v2.1';
const DYNAMIC_CACHE = 'asra3-dynamic-v2.1';

// جميع الملفات الحيوية للتطبيق - يجب تحميلها فوراً
const CRITICAL_FILES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/robots.txt',
  '/src/data/codes.json',
  '/src/data/orders.json',
  '/src/assets/store-sticker.png'
];

// ملفات اللعبة المهمة
const GAME_FILES = [
  '/src/components/game/GameScreen.tsx',
  '/src/components/game/SetupScreen.tsx',
  '/src/components/game/LoginScreen.tsx',
  '/src/components/game/ResultsScreen.tsx',
  '/src/components/game/TimeUpModal.tsx',
  '/src/components/game/WinnerDialog.tsx',
  '/src/components/ui/game-button.tsx',
  '/src/components/ui/game-card.tsx'
];

// تثبيت Service Worker وتخزين الملفات فوراً
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker v2.1 - Instant Load...');
  
  event.waitUntil(
    (async () => {
      try {
        // فتح الكاش
        const cache = await caches.open(STATIC_CACHE);
        console.log('[SW] Caching ALL critical files instantly...');
        
        // تحميل جميع الملفات الحيوية فوراً بالتوازي الكامل
        await Promise.all([
          ...CRITICAL_FILES.map(file => 
            cache.add(file).catch(err => {
              console.warn(`[SW] Failed to cache critical file ${file}:`, err);
              return null;
            })
          ),
          ...GAME_FILES.map(file => 
            cache.add(file).catch(err => {
              console.warn(`[SW] Failed to cache game file ${file}:`, err);
              return null;
            })
          )
        ]);
        
        console.log('[SW] All critical files cached instantly!');
        self.skipWaiting();
        
      } catch (error) {
        console.error('[SW] Critical error during install:', error);
        // حتى لو فشل بعض الملفات، نكمل التثبيت
        self.skipWaiting();
      }
    })()
  );
});

// تفعيل Service Worker وتنظيف الكاش القديم
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker v2.1...');
  
  event.waitUntil(
    (async () => {
      try {
        // تنظيف الكاش القديم
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map((cacheName) => {
            if (![STATIC_CACHE, DYNAMIC_CACHE].includes(cacheName)) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
        
        console.log('[SW] Service Worker activated - All files ready instantly!');
        await self.clients.claim();
        
      } catch (error) {
        console.error('[SW] Activation error:', error);
      }
    })()
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
    // استراتيجية Cache First للملفات الحيوية والألعاب والبيانات
    if (isStaticFile(url.pathname) || isGameFile(url.pathname) || isDataFile(url.pathname)) {
      return await instantCacheFirst(request);
    }
    
    // استراتيجية Network First للملفات الديناميكية (JS, CSS)
    if (isDynamicFile(url.pathname)) {
      return await networkFirst(request);
    }
    
    // استراتيجية Cache First للملفات الأخرى
    return await instantCacheFirst(request);
    
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

// Instant Cache First - فوري من الكاش بدون تأخير
async function instantCacheFirst(request) {
  // جرب الكاش فوراً
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    console.log('[SW] ⚡ INSTANT from cache:', request.url);
    return cachedResponse;
  }
  
  // إذا لم توجد في الكاش، احضرها من الشبكة واحفظها فوراً
  console.log('[SW] 🌐 Fetching and caching instantly:', request.url);
  try {
    const response = await fetch(request);
    
    if (response && response.status === 200) {
      const cache = await caches.open(STATIC_CACHE);
      // حفظ فوري بدون انتظار
      cache.put(request, response.clone()).catch(err => 
        console.warn('[SW] Cache put failed:', err)
      );
    }
    
    return response;
  } catch (error) {
    console.error('[SW] Network fetch failed:', error);
    throw error;
  }
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
  return CRITICAL_FILES.some(file => pathname === file || pathname.endsWith(file));
}

function isGameFile(pathname) {
  return GAME_FILES.some(file => pathname.includes(file.replace('/src/', '/src/'))) ||
         pathname.includes('/components/game/') ||
         pathname.includes('/components/ui/game-');
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