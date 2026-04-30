/**
 * UAL Welcome Week — service worker entry (Serwist).
 *
 * This file is consumed by `@serwist/next` at build time and emitted as
 * `/sw.js` in the public folder. It's only registered on production
 * builds when `ENABLE_PWA=1` (see next.config.mjs).
 *
 * Behaviour:
 *   - Precaches the app shell + every route Serwist injects via
 *     `self.__SW_MANIFEST` (this is the workbox-style manifest variable
 *     Serwist substitutes during the build).
 *   - Uses Serwist's curated `defaultCache` runtime strategies (stale-
 *     while-revalidate for static assets, network-first for HTML, etc.),
 *     which match what next-pwa shipped before so we don't change PWA
 *     behaviour from a user-perceivable angle.
 *   - Skips the "waiting" phase so an updated SW takes over the next
 *     time the user reloads, rather than the time after.
 *   - Calls `clientsClaim()` so the new SW immediately controls open
 *     tabs once activated.
 *
 * Notes:
 *   - This file imports from "@serwist/next/worker" and "serwist", which
 *     are transitive deps. Don't import them anywhere else in the app
 *     bundle — they'd ship a duplicate copy of workbox to the client.
 *   - If we move off Serwist later, the migration boundary is this
 *     file plus next.config.mjs.
 */
import { defaultCache } from '@serwist/next/worker';
import { Serwist } from 'serwist';

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
});

serwist.addEventListeners();
