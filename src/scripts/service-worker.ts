import { clientsClaim, setCacheNameDetails } from 'workbox-core';
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { ExpirationPlugin } from 'workbox-expiration';
import { CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';

import { config } from './shared/config';

// Fix self: https://stackoverflow.com/questions/56356655/structuring-a-typescript-project-with-workers
declare let self: WindowOrWorkerGlobalScope;
export {};

setCacheNameDetails({
  prefix: config.cacheName,
  suffix: config.cacheVersion,
});

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
self.skipWaiting();
clientsClaim();

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
precacheAndRoute(self.__WB_MANIFEST); // eslint-disable-line no-underscore-dangle

registerRoute(
  ({ url }) => url.origin === 'https://kit.fontawesome.com',
  new CacheFirst({
    cacheName: 'fontawesome',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({ maxEntries: 1, maxAgeSeconds: 180 * 24 * 60 * 60 }),
    ],
  })
);

registerRoute(
  ({ url }) => url.origin === 'https://fonts.googleapis.com',
  new CacheFirst({
    cacheName: 'googlefont',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({ maxAgeSeconds: 180 * 24 * 60 * 60 }),
    ],
  })
);

registerRoute(
  ({ url }) => url.origin === 'https://restaurant-api.dicoding.dev',
  new StaleWhileRevalidate({
    cacheName: 'restaurant-dicoding',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({ maxAgeSeconds: 7 * 24 * 60 * 60 }),
    ],
  })
);
