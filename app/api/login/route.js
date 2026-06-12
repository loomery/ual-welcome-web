import { NextResponse } from 'next/server';

/**
 * POST /api/login
 *
 * Body: { password: string }
 * Sets the `ual-prototype-auth` cookie on success.
 *
 * 30-day session is intentional — students may revisit the prototype
 * over a couple of weeks during research, and we don't want to make
 * them re-enter the password on every visit. Re-share defence is
 * "single password, single cookie", nothing more.
 */
const COOKIE_NAME = 'ual-prototype-auth';
const COOKIE_VALUE = 'ok';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

/** Centralised so the middleware and the route can read the same source. */
function expectedPassword() {
  // Set APP_PASSWORD in Vercel / .env.local before sharing the link.
  // The fallback exists only so the prototype keeps building on a
  // fresh checkout — rotate before showing to users.
  return process.env.APP_PASSWORD ?? 'welcome2026';
}

/** @param {Request} request */
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const submitted = typeof body?.password === 'string' ? body.password.trim() : '';
  if (!submitted || submitted !== expectedPassword()) {
    return NextResponse.json({ error: 'Wrong password.' }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(COOKIE_NAME, COOKIE_VALUE, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  });
  return response;
}
