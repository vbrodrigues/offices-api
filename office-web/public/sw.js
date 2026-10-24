// Service worker of the portal. Registered only in production builds, as
// /sw.js?v=<build id>: every deploy installs a new worker, which takes over
// at once and drops the previous caches. Telling an open tab that a new
// version exists is the page's job (components/Pwa/ServiceWorker.tsx).
//
// - /_next/static (hashed, never changes) and /icons: cache first
// - page navigations: always the network, the /offline page when it fails
// - everything else (the API on another origin, signed file URLs, RSC
//   requests): not touched, so data is never stale or cached

const VERSION = new URL(self.location.href).searchParams.get("v") || "dev";
const STATIC_CACHE = `office-static-${VERSION}`;
const OFFLINE_URL = "/offline";
const MAX_STATIC_ENTRIES = 300;

self.addEventListener("install", (event) => {
  // Safe to take over at once: the cache holds only hashed assets, and
  // pages always come from the network
  self.skipWaiting();
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.add(OFFLINE_URL))
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith("office-") && key !== STATIC_CACHE)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

function isStaticAsset(url) {
  return (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/icons/")
  );
}

async function trimCache(cache) {
  const keys = await cache.keys();
  // Oldest first; OFFLINE_URL was added first, so keep index 0
  const extra = keys.length - MAX_STATIC_ENTRIES;
  for (let i = 1; i <= extra; i++) await cache.delete(keys[i]);
}

async function cacheFirst(request) {
  const cache = await caches.open(STATIC_CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;

  const response = await fetch(request);
  if (response.ok) {
    await cache.put(request, response.clone());
    trimCache(cache);
  }
  return response;
}

async function networkOrOffline(request) {
  try {
    return await fetch(request);
  } catch (err) {
    const cache = await caches.open(STATIC_CACHE);
    return (await cache.match(OFFLINE_URL)) || Response.error();
  }
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(networkOrOffline(request));
  } else if (isStaticAsset(url)) {
    event.respondWith(cacheFirst(request));
  }
});
