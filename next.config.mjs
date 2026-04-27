/**
 * next.config.mjs
 *
 * PWA wrapping is opt-in via env. Set `ENABLE_PWA=1` (production builds only)
 * to wire next-pwa around the config; otherwise we ship a plain Next config so
 * the app builds even if the next-pwa toolchain isn't installed.
 *
 * Why dynamic import? next-pwa pulls a fragile workbox dep tree at require
 * time; if anything in it fails resolution we'd otherwise crash before next
 * boots. The conditional + dynamic import is the smallest viable shim.
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
    exported = withPWA(nextConfig);
  } catch (err) {
    // Surface the failure but don't block the build — PWA is non-essential
    // for a beta and the rest of the app still ships.
    console.warn('[next.config] next-pwa unavailable, building without PWA:', err?.message);
  }
}

export default exported;
