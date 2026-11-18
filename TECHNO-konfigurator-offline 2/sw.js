// TECHNO konfigurator: pełna praca offline (cache-first)
const CACHE = "techno-v8";
const FILES = ["./", "./fonts/montserrat-cyrillic-300-normal.woff2", "./fonts/montserrat-cyrillic-400-normal.woff2", "./fonts/montserrat-cyrillic-600-normal.woff2", "./fonts/montserrat-cyrillic-700-normal.woff2", "./fonts/montserrat-cyrillic-800-normal.woff2", "./fonts/montserrat-cyrillic-ext-300-normal.woff2", "./fonts/montserrat-cyrillic-ext-400-normal.woff2", "./fonts/montserrat-cyrillic-ext-600-normal.woff2", "./fonts/montserrat-cyrillic-ext-700-normal.woff2", "./fonts/montserrat-cyrillic-ext-800-normal.woff2", "./fonts/montserrat-latin-300-normal.woff2", "./fonts/montserrat-latin-400-normal.woff2", "./fonts/montserrat-latin-600-normal.woff2", "./fonts/montserrat-latin-700-normal.woff2", "./fonts/montserrat-latin-800-normal.woff2", "./fonts/montserrat-latin-ext-300-normal.woff2", "./fonts/montserrat-latin-ext-400-normal.woff2", "./fonts/montserrat-latin-ext-600-normal.woff2", "./fonts/montserrat-latin-ext-700-normal.woff2", "./fonts/montserrat-latin-ext-800-normal.woff2", "./icons/icon-180.png", "./icons/icon-192.png", "./icons/icon-512.png", "./icons/icon-maskable-512.png", "./index.html", "./lib/BufferGeometryUtils.js", "./lib/OrbitControls.js", "./lib/three.min.js", "./manifest.webmanifest"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(r => r || fetch(e.request).then(res => {
    if (res.ok && new URL(e.request.url).origin === location.origin) { const cp = res.clone(); caches.open(CACHE).then(c => c.put(e.request, cp)); }
    return res; }).catch(() => caches.match("./index.html"))));
});
