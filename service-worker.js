const CACHE_NAME = 'todo-pwa-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

// ติดตั้ง SW + แคชไฟล์
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

// ดึงข้อมูลจากแคชก่อน ถ้าไม่มีค่อย fetch
self.addEventListener('fetch', event => {
  if (event.request.mode === 'navigate') {
    // สำหรับหน้า index.html ให้โหลดจาก network ก่อน ถ้าไม่มีค่อยใช้ cache
    event.respondWith(
      fetch(event.request).catch(() => caches.match('/index.html'))
    );
  } else {
    event.respondWith(
      caches.match(event.request).then(response => response || fetch(event.request))
    );
  }
});


// ลบแคชเก่าเมื่อ activate
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// อัพเดทแคชเมื่อกดปุ่ม
self.addEventListener('message', event => {
  if (event.data.action === 'updateCache') {
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache));
  }
});
