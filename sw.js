/* Torres Vet · guarda la app en el aparato para que abra sin internet */
var C = 'torresvet-v1', F = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png'];
self.addEventListener('install', function (e) { e.waitUntil(caches.open(C).then(function (c) { return c.addAll(F); })); self.skipWaiting(); });
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (K) { return Promise.all(K.filter(function (k) { return k !== C; }).map(function (k) { return caches.delete(k); })); }));
  self.clients.claim();
});
self.addEventListener('fetch', function (e) {
  var u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(function (r) {
    var red = fetch(e.request).then(function (x) { if (x && x.ok) { var y = x.clone(); caches.open(C).then(function (c) { c.put(e.request, y); }); } return x; }).catch(function () { return r; });
    return r || red;
  }));
});
