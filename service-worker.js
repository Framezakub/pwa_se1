const CACHE_NAME = 'todo-pwa-cache-v1';
const urlsToCache = [
  '/',             // root path
  '/index.html',   // main HTML
  '/style.css',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

// ติดตั้งและแคชไฟล์ทั้งหมด
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// ใช้งานไฟล์จาก cache
self.addEventListener('fetch', event => {
  if (event.request.mode === 'navigate') {
    // ถ้าเป็นการโหลดหน้า (index.html) → ใช้ cache ก่อน
    event.respondWith(
      caches.match('/index.html').then(response => {
        return response || fetch(event.request);
      })
    );
  } else {
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || fetch(event.request);
      })
    );
  }
});

// ลบ cache เก่า
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});
