var CACHE_NAME = "stopwatch-cache-v0";
var CACHED_URLS = [
  "http://localhost:8080/node-course/index.html",
  "http://localhost:8080/node-course/utils.js",
  "http://localhost:8080/node-course/css/main.css",
  "http://localhost:8080/node-course/css/pwabanner.css",
  "http://localhost:8080/node-course/controller.js",
  "http://localhost:8080/node-course/circleinterface.js",
  "http://localhost:8080/node-course/device.js",
  "http://localhost:8080/node-course/manifest.webmanifest",
  "http://localhost:8080/node-course/sw.js",
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    CACHED_URLS.forEach((url) => {
      fetch(url).then(function (response) {
        caches.open(CACHE_NAME).then(function (cache) {
          return cache.put(url, response);
        });
      });
    })
  );
});
/* self.addEventListener("install", function (event) {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(function (cache) {
        return cache.addAll(CACHED_URLS);
      })
      .catch(function () {
        console.log("couldn't cache files");
      })
  );
}); */
/* self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches
      .keys()
      .then(function (keys) {
        return Promise.all(
          keys
            .filter(function (key) {
              return !cacheIDs.includes(key);
            })
            .map(function (key) {
              return caches.delete(key);
            })
        );
      })
      .then(function () {
        return self.clients.claim();
      })
  );
}); */
self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.match(event.request).then(function (cachedResponse) {
        var fetchPromise = fetch(event.request).then(function (
          networkResponse
        ) {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
        return cachedResponse || fetchPromise;
      });
    })
  );
});
