/**
 * next.config.mjs
 *
 * Two responsibilities:
 *
 *  1. Security headers (always on). Defined once and applied via the
 *     `headers()` async function so they wrap every route, including any
 *     PWA-generated ones below.
 *
 *  2. PWA wrapping via Serwist (opt-in). Set `ENABLE_PWA=1` (production
 *     builds only) to wire @serwist/next around the config; otherwise we
 *     ship a plain Next config so the app builds even if Serwist's
 *     dependencies aren't fully installed.
 *
 *     We use Serwist instead of next-pwa because next-pwa is unmaintained
 *     and incompatible with the Next 15+ App Router. Serwist is the
 *     spiritual successor — same workbox-based primitives, but with
 *     first-class App Router + Turbopack support.
 *
 * Why dynamic import for @serwist/next? It pulls a hefty workbox-style
 * dep tree at require time; if anything in it fails resolution we'd
 * otherwise crash before next boots. The conditional + dynamic import is
 * the smallest viable shim.
 */

/**
 * App-wide Content Security Policy.
 *
 * Dev vs. prod split is deliberate:
 *  - Next.js dev mode evaluates webpack source maps via `eval()`, opens
 *    a WebSocket for HMR, and rebuilds workers as `blob:` URLs. A
 *    production-grade CSP blocks all three, which silently breaks the
 *    client bundle (no hydration → static HTML only → r3f map dead and
 *    every onClick in the page becomes inert).
 *  - Production has none of those needs, so we keep the strict baseline
 *    and only relax what real runtime users need (worker blobs for
 *    Three.js loaders).
 *
 * Static notes:
 *  - 'unsafe-inline' on script-src is a concession to Next.js (inline
 *    boot script). Tighten with a nonce + middleware before public prod.
 *  - img-src allows data: for inline SVG icons and https: for any
 *    UAL-hosted imagery (events, building photos).
 *  - connect-src is 'self' only — the app is fully static and talks to
 *    no backends. When feedback moves to a real endpoint, add that
 *    origin here AND in form-action.
 *  - frame-ancestors 'self' blocks cross-origin click-jacking while still
 *    allowing the app to embed its own same-origin resources (the campus
 *    floor-plan PDF is shown in an <iframe> on the map screen). 'none' would
 *    block that legitimate same-origin embed too.
 *  - base-uri 'self' blocks <base> tag injection.
 */
const isDev = process.env.NODE_ENV !== 'production';

// Single source of truth for the deploy sub-path. Baked in at build time and
// re-exported to the client bundle (below) so plain references to public/
// assets — which Next does NOT auto-prefix — can resolve under the sub-path.
const basePath = process.env.DEPLOY_PATH ? `/${process.env.DEPLOY_PATH}` : '';

const CSP = [
  "default-src 'self'",
  "img-src 'self' data: https:",
  "style-src 'self' 'unsafe-inline'",
  // 'unsafe-eval' + blob: are dev-only (webpack source maps + HMR
  // worker bootstrap). Three.js itself doesn't need eval at runtime.
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval' blob:" : ''}`,
  "font-src 'self' data:",
  // Dev HMR opens a WebSocket on the same host; prod talks to nothing
  // external from the browser.
  `connect-src 'self'${isDev ? ' ws: wss:' : ''}`,
  "manifest-src 'self'",
  // Three.js / r3f loaders sometimes spin a worker from a blob URL
  // (e.g. KTX2, draco). Allow blob: in both dev and prod so we don't
  // get a surprise regression when adding GLTF/draco assets later.
  "worker-src 'self' blob:",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ');

const securityHeaders = [
  { key: 'Content-Security-Policy', value: CSP },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    // Deny the lot — this app needs none of these. interest-cohort
    // disables FLoC. browsing-topics is the successor knob; harmless to
    // include even on browsers that ignore it.
    value:
      'camera=(), microphone=(), geolocation=(), interest-cohort=(), browsing-topics=()',
  },
  {
    key: 'Strict-Transport-Security',
    // Two years, includeSubDomains, eligible for preload. Only meaningful
    // when served over HTTPS — browsers ignore HSTS on plain HTTP.
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  { key: 'X-DNS-Prefetch-Control', value: 'off' },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // No assetPrefix: with a baked-in basePath, Next already emits
  // `${basePath}/_next/...` absolute asset URLs that resolve correctly at
  // any route depth. A relative assetPrefix ('./') breaks on hard loads of
  // nested pages (e.g. /events/[id]) because './_next' resolves relative to
  // the page's own directory instead of the deploy root.
  basePath,
  // Expose the sub-path to the browser bundle so `asset()` (utils/asset.js)
  // can prefix public/ asset references (images, PDFs) that Next leaves alone.
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  // Export every route as a directory with an index.html (events/foo/index.html)
  // so a dumb static host (Apache DirectoryIndex) resolves extensionless,
  // clean URLs — and App Router prefetches stop 404-ing.
  trailingSlash: true,
  reactStrictMode: true,
  // Allow HMR WebSocket connections from local network devices (phones,
  // tablets, other machines on the same LAN) during development.
  allowedDevOrigins: ['192.168.0.167'],
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};

let exported = nextConfig;

if (process.env.ENABLE_PWA === '1' && process.env.NODE_ENV === 'production') {
  try {
    const { default: withSerwistInit } = await import('@serwist/next');
    const withSerwist = withSerwistInit({
      // Source service worker — written by us at app/sw.js. Serwist compiles
      // it (and our route precaches) into /sw.js at build time.
      swSrc: 'app/sw.js',
      swDest: 'public/sw.js',
      // App Router-friendly defaults: register the SW from the client
      // bundle, take control of any open clients on activation.
      register: true,
      reloadOnOnline: true,
      cacheOnNavigation: true,
      disable: false,
    });
    // withSerwist wraps but preserves user-defined keys like `headers`, so
    // the security headers above continue to apply to PWA builds.
    exported = withSerwist(nextConfig);
  } catch (err) {
    // Surface the failure but don't block the build — PWA is non-essential
    // for a beta and the rest of the app still ships.
    console.warn(
      '[next.config] @serwist/next unavailable, building without PWA:',
      err?.message,
    );
  }
}

export default exported;
