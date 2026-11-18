// TECHNO konfigurator: praca offline. Strona (index) – najpierw sieć, żeby nowa wersja pojawiała się od razu; reszta – z pamięci podręcznej.
const CACHE = "techno-v9";
const FILES = ["./", "./fonts/montserrat-cyrillic-300-normal.woff2", "./fonts/montserrat-cyrillic-400-normal.woff2", "./fonts/montserrat-cyrillic-600-normal.woff2", "./fonts/montserrat-cyrillic-700-normal.woff2", "./fonts/montserrat-cyrillic-800-normal.woff2", "./fonts/montserrat-cyrillic-ext-300-normal.woff2", "./fonts/montserrat-cyrillic-ext-400-normal.woff2", "./fonts/montserrat-cyrillic-ext-600-normal.woff2", "./fonts/montserrat-cyrillic-ext-700-normal.woff2", "./fonts/montserrat-cyrillic-ext-800-normal.woff2", "./fonts/montserrat-latin-300-normal.woff2", "./fonts/montserrat-latin-400-normal.woff2", "./fonts/montserrat-latin-600-normal.woff2", "./fonts/montserrat-latin-700-normal.woff2", "./fonts/montserrat-latin-800-normal.woff2", "./fonts/montserrat-latin-ext-300-normal.woff2", "./fonts/montserrat-latin-ext-400-normal.woff2", "./fonts/montserrat-latin-ext-600-normal.woff2", "./fonts/montserrat-latin-ext-700-normal.woff2", "./fonts/montserrat-latin-ext-800-normal.woff2", "./icons/icon-180.png", "./icons/icon-192.png", "./icons/icon-512.png", "./icons/icon-maskable-512.png", "./index.html", "./lib/BufferGeometryUtils.js", "./lib/OrbitControls.js", "./lib/three.min.js", "./manifest.webmanifest"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES.map(u => new Request(u, { cache: "reload" })))).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
const isPage = req => req.mode === "navigate" || /\/(index\.html)?$/.test(new URL(req.url).pathname);
self.addEventListener("fetch", e => {
  const req = e.request; if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;
  if (isPage(req)) {
    e.respondWith(Promise.race([
      fetch(req, { cache: "no-store" }).then(res => { if (res.ok) { const cp = res.clone(); caches.open(CACHE).then(c => c.put("./index.html", cp)); } return res; }),
      new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), 4000))
    ]).catch(() => caches.match("./index.html").then(r => r || caches.match("./"))));
    return;
  }
  e.respondWith(caches.match(req, { ignoreSearch: true }).then(r => r || fetch(req).then(res => {
    if (res.ok) { const cp = res.clone(); caches.open(CACHE).then(c => c.put(req, cp)); } return res; })));
});
