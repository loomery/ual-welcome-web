import { NextResponse } from 'next/server';

/**
 * Prototype password gate.
 *
 * This is a prototype that's shared with students for usability research.
 * To stop the link from being re-shared widely, every page is gated
 * behind a single shared password. It's a friction layer — not real auth.
 *
 * How it works:
 *  - Proxy checks for the `ual-prototype-auth` cookie on every
 *    non-asset request.
 *  - Missing or wrong cookie → redirect to /login.
 *  - /login POSTs to /api/login, which validates the password and sets
 *    the cookie (httpOnly, sameSite=lax, 30 days).
 *
 * The password is read from `APP_PASSWORD` (set in Vercel / .env.local).
 * A fallback exists so the prototype keeps working in environments where
 * the env var hasn't been wired up yet — rotate it before sharing.
 */

const COOKIE_NAME = 'ual-prototype-auth';
const COOKIE_VALUE = 'ok';

/**
 * @param {import('next/server').NextRequest} request
 */
export function proxy(request) {
  const { pathname, search } = request.nextUrl;

  // `trailingSlash: true` canonicalises /login → /login/ with a 308 before
  // this proxy sees it again — normalise before matching, or the allowlist
  // below misses and the gate redirect-loops on its own login page.
  const path = pathname !== '/' && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;

  // Allow the login page itself and its API route through, otherwise
  // we'd redirect-loop on the gate.
  if (path === '/login' || path === '/api/login') {
    return NextResponse.next();
  }

  const cookie = request.cookies.get(COOKIE_NAME);
  if (cookie?.value === COOKIE_VALUE) {
    return NextResponse.next();
  }

  // Preserve where the user was heading so we can bounce them back
  // after a successful login.
  const loginUrl = new URL('/login', request.url);
  if (pathname !== '/' || search) {
    loginUrl.searchParams.set('redirect', `${pathname}${search}`);
  }
  return NextResponse.redirect(loginUrl);
}

/**
 * Matcher — run on everything except Next internals, the PWA service
 * worker, and any common static asset extensions. Keeping these out
 * means the login page itself can still serve fonts, the favicon, and
 * the offline SW registration.
 */
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|icon\\.svg|manifest\\.webmanifest|sw\\.js|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|map|pdf)).*)',
  ],
};
