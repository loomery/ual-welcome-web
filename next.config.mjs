/**
 * next.config.mjs
 *
 * Two responsibilities:
 *
 *  1. Security headers (always on). Defined once and applied via the
 *     `headers()` async function so they wrap every route, including any
 *     PWA-generated ones below.
 *
 *  2. PWA wrapping (opt-in). Set `ENABLE_PWA=1` (production builds only)
 *     to wire next-pwa around the config; otherwise we ship a plain Next
 *     config so the app builds even if the next-pwa toolchain isn't
 *     installed.
 *
 * Why dynamic import for next-pwa? It pulls a fragile workbox dep tree
 * at require time; if anything in it fails resolution we'd otherwise
 * crash before next boots. The conditional + dynamic import is the
 * smallest viable shim.
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
 *  - frame-ancestors 'none' blocks click-jacking via iframe embedding.
 *  - base-uri 'self' blocks <base> tag injection.
 */
const isDev = process.env.NODE_ENV !== 'production';

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
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ');

const securityHeaders = [
  { key: 'Content-Security-Policy', value: CSP },
  { key: 'X-Frame-Options', value: 'DENY' },
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
  reactStrictMode: true,
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
    const { default: nextPwa } = await import('next-pwa');
    const withPWA = nextPwa({
      dest: 'public',
      disable: false,
      register: true,
      skipWaiting: true,
    });
    // withPWA wraps but preserves user-defined keys like `headers`, so
    // the security headers above continue to apply to PWA builds.
    exported = withPWA(nextConfig);
  } catch (err) {
    // Surface the failure but don't block the build — PWA is non-essential
    // for a beta and the rest of the app still ships.
    console.warn('[next.config] next-pwa unavailable, building without PWA:', err?.message);
  }
}

export default exported;
