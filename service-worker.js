const CACHE_NAME = 'todo-pwa-cache-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

// ติดตั้งและแคชไฟล์
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

// ดัก fetch
self.addEventListener('fetch', event => {
  if (event.request.mode === 'navigate') {
    // ถ้าเป็นการโหลดหน้าใหม่ → ดึงจาก network ก่อน ถ้าไม่มีให้ใช้ index.html จาก cache
    event.respondWith(
      fetch(event.request).catch(() => caches.match('/index.html'))
    );
  } else {
    // ไฟล์อื่น → cache first
    event.respondWith(
      caches.match(event.request).then(response => response || fetch(event.request))
    );
  }
});

// ล้าง cache เก่า
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});
