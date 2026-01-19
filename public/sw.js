const CACHE_NAME = "throwlive-v1";
const PRECACHE_URLS = [
  "/",
  "/offline",
  "/icons/icon-192.png",
  "/icons/icon-512.png"
];

// Install: Precache static assets
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

// Activate: Clean up old caches
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch: Network-first for navigation, cache-first for static assets
self.addEventListener("fetch", event => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle GET requests
  if (request.method !== "GET") return;

  // App navigation: network first, fallback to cache then offline page
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then(response => {
          // Optionally update cache
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put("/", copy));
          return response;
        })
        .catch(() =>
          caches.match("/").then(resp =>
            resp || caches.match("/offline")
          )
        )
    );
    return;
  }

  // Same-origin static assets: cache first
  if (
    url.origin === self.location.origin &&
    (url.pathname.startsWith("/icons/") || url.pathname === "/" || url.pathname === "/offline")
  ) {
    event.respondWith(
      caches.match(request).then(
        resp => resp ||
          fetch(request).then(networkResp => {
            // Cache the new asset
            if (networkResp && networkResp.status === 200) {
              const copy = networkResp.clone();
              caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
            }
            return networkResp;
          })
      )
    );
  }
});
