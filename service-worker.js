// service-worker.js
const CACHE_NAME = 'hisbah-v1';
const ASSETS = [
  '/', '/index.html', '/css/style.css',
  '/js/auth.js' // add other assets
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
});

self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});

// service-worker.js
const CACHE = "hisbah-cache-v1";
const assets = [
  "/",
  "/index.html",
  "/register.html",
  "/css/style.css",
  "/assets/logo.png",
  // add other critical files you want cached
];

self.addEventListener("install", (evt) => {
  evt.waitUntil(
    caches.open(CACHE).then((cache) => {
      return cache.addAll(assets);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (evt) => {
  evt.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (evt) => {
  evt.respondWith(
    caches.match(evt.request).then((resp) => {
      return resp || fetch(evt.request);
    })
  );
});