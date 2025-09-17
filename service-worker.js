const CACHE_NAME = 'todo-pwa-cache-v3';
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
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// ใช้ไฟล์จาก cache เมื่อออฟไลน์
self.addEventListener('fetch', event => {
  if (event.request.mode === 'navigate') {
    // โหลดหน้า HTML → ถ้า offline ให้ใช้ index.html จาก cache
    event.respondWith(
      fetch(event.request).catch(() => caches.match('/index.html'))
    );
  } else {
    // ไฟล์อื่นใช้ cache-first
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || fetch(event.request);
      })
    );
  }
});

// ลบ cache เก่าเมื่อ activate
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

