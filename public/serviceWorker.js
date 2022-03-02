const CACHE_NAME = "version-4";
const urlsToCache = [
  //"/",
  "index.html", //este guarda todas las paginas
  "offline.html",
];
//const PaginaQuieroCachear = "index.html";
const OFFLINE_URL = "offline.html";

const self = this;

// Install SW
self.addEventListener("install", (event) => {
  //pasos de instalacion
  event.waitUntil(
    //retorna el cache guardado de nobre xx y lo abre
    caches.open(CACHE_NAME).then((cache) => {
      // Setting {cache: 'reload'} in the new request will ensure that the response isn't fulfilled from the HTTP cache; or keep cache up to date. bellow we also ensuer data is serve from network.
      console.log("Opened cache");

      return cache.addAll(urlsToCache);
      // return cache.addAll(new Request(urlsToCache, { cache: "reload" })); // toca en un await
    })
  );
  //self.skipWaiting(); //In order to activate the new service worker, you have to close all pages, which are controlled by the old service worker. If we want to avoid that, we can skip the waiting phase by adding self.skipWaiting()
  // Force the waiting service worker to become the active service worker.
  self.skipWaiting();
});

// Listen for requests, se le dice al service worker, que hacer con las paginas cacheadas
self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          // First, try to use the navigation preload response if it's supported.
          const preloadResponse = await event.preloadResponse;
          if (preloadResponse) {
            return preloadResponse;
          }

          // Always try the network first.
          const networkResponse = await fetch(event.request);
          return networkResponse;
        } catch (error) {
          // catch is only triggered if an exception is thrown, which is likely
          // due to a network error.
          // If fetch() returns a valid HTTP response with a response code in
          // the 4xx or 5xx range, the catch() will NOT be called.
          console.log("Fetch failed; returning cached page instead.", error);

          //* otro codigo que devuelve la pagina guardada en cache de cualquier ruta,o la ofline si hay un error
          caches.match(event.request).then(() => {
            //return fetch(event.request).catch(() => caches.match(OFFLINE_URL)); // retorna el cache de la pagina pedida
            return caches.match(OFFLINE_URL); // retorna siempre offline
          });

          //* ejemplo otra forma de hacerlo,pero con paginas convnecionales nrutas .html
          // const cache = await caches.open(CACHE_NAME);
          // if (event.request.url.includes(PaginaQuieroCachear)) {
          //   return await cache.match(PaginaQuieroCachear);
          // }
          // return await cache.match(OFFLINE_URL);
        }
      })()
    );
  }

  // If our if() condition is false, then this fetch handler won't intercept the
  // request. If there are any other fetch handlers registered, they will get a
  // chance to call event.respondWith(). If no fetch handlers call
  // event.respondWith(), the request will be handled by the browser as if there
  // were no service worker involvement.
});

// Activate the SW,
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [];
  cacheWhitelist.push(CACHE_NAME);

  event.waitUntil(
    (async () => {
      // Enable navigation preload if it's supported.
      // See https://developers.google.com/web/updates/2017/02/navigation-preload
      if ("navigationPreload" in self.registration) {
        await self.registration.navigationPreload.enable();
      }

      //*elimina caches viejos
      caches.keys().then((cacheNames) =>
        Promise.all(
          cacheNames.map((cacheName) => {
            if (!cacheWhitelist.includes(cacheName)) {
              return caches.delete(cacheName);
            }
          })
        )
      );
    })()
  );
  // Tell the active service worker to take control of the page immediately.
  self.clients.claim();
});

//!json manifest
//* toca poner un aaskable icon
////Maskable icons is a new icon format that ensures that your PWA icon looks great on all Android devices. On newer Android devices, PWA icons that don't follow the maskable icon format are given a white background. When you use a maskable icon, it ensures that the icon takes up all of the space that Android provides for it.
