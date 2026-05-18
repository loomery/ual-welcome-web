'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

/**
 * Password prompt for the prototype gate.
 *
 * Layout uses inline `style` props rather than globals.css classes so the
 * page renders correctly regardless of build / cache state during the
 * prototype phase. Tokens are still referenced via `var(--…)` so dark
 * mode and the rest of the UAL DS continue to swap.
 *
 * On success the auth cookie is set by /api/login; we then push the
 * student to wherever they were heading (or `/` if they hit /login
 * directly) and `router.refresh()` re-runs the middleware so the next
 * paint sees the new cookie.
 */
export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = sanitiseRedirect(searchParams.get('redirect'));

  const [password, setPassword] = useState('');
  const [error, setError] = useState(/** @type {string|null} */ (null));
  const [submitting, setSubmitting] = useState(false);

  /** @param {import('react').FormEvent<HTMLFormElement>} e */
  async function handleSubmit(e) {
    e.preventDefault();
    if (submitting) return;
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        setError('Wrong password — try again.');
        setSubmitting(false);
        return;
      }
      router.replace(redirect);
      router.refresh();
    } catch {
      setError('Could not reach the server. Check your connection and try again.');
      setSubmitting(false);
    }
  }

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <header style={styles.brand}>
          <span style={styles.wordmark}>UAL</span>
          <h1 style={styles.title}>Student Centre</h1>
        </header>

        <p style={styles.lede}>
          This prototype is in research preview. Enter the password you were given to continue.
        </p>

        <form style={styles.form} onSubmit={handleSubmit} noValidate>
          <div style={styles.field}>
            <label htmlFor="login-password" style={styles.label}>
              Password
            </label>

            <input
              id="login-password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? 'login-error' : undefined}
              style={{
                ...styles.input,
                ...(error ? styles.inputInvalid : null),
              }}
            />
          </div>

          {error && (
            <p id="login-error" role="alert" style={styles.error}>
              {error}
            </p>
          )}

          <button
            type="submit"
            className="button"
            style={styles.submit}
            disabled={submitting || !password.trim()}
            aria-busy={submitting || undefined}
          >
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </main>
  );
}

/**
 * Only allow same-origin path redirects so a crafted ?redirect=https://evil
 * can't bounce people off our domain after a successful login.
 *
 * @param {string|null} value
 * @returns {string}
 */
function sanitiseRedirect(value) {
  if (!value) return '/';
  if (!value.startsWith('/')) return '/';
  if (value.startsWith('//')) return '/';
  return value;
}

/**
 * Inline style map. Kept at module scope so React doesn't re-allocate
 * the objects on every render. Token names are CSS custom properties
 * defined in app/globals.css :root + [data-theme='dark'] blocks, so
 * dark mode keeps swapping automatically.
 */
const styles = /** @type {const} */ ({
  page: {
    alignItems: 'center',
    background: 'var(--color-shade)',
    color: 'var(--color-dark)',
    display: 'flex',
    justifyContent: 'center',
    minHeight: '100dvh',
    padding: 'var(--space-l) var(--space-m)',
    boxSizing: 'border-box',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-l)',
    width: '100%',
    maxWidth: '26rem',
  },
  brand: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-3xs)',
  },
  wordmark: {
    color: 'var(--color-medium)',
    fontFamily: 'var(--font-heading)',
    fontSize: 'var(--step-0)',
    fontWeight: 'var(--font-weight-bold)',
    letterSpacing: '0.04em',
    lineHeight: 1,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 'var(--step-3)',
    fontWeight: 'var(--font-weight-bold)',
    letterSpacing: 'var(--letter-spacing-tight)',
    lineHeight: 'var(--line-height-condensed)',
    margin: 0,
  },
  lede: {
    color: 'var(--color-medium)',
    fontSize: 'var(--step-0)',
    margin: 0,
    maxWidth: '36ch',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-m)',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-2xs)',
  },
  label: {
    fontSize: 'var(--step--1)',
    fontWeight: 'var(--font-weight-bold)',
  },
  input: {
    background: 'var(--color-light)',
    borderWidth: '2px',
    borderStyle: 'solid',
    borderColor: 'var(--color-dark)',
    boxSizing: 'border-box',
    color: 'var(--color-dark)',
    font: 'inherit',
    fontSize: 'var(--step-0)',
    minHeight: '44px',
    padding: 'var(--space-xs) var(--space-s)',
    width: '100%',
  },
  inputInvalid: {
    borderColor: 'var(--color-utility-red)',
  },
  error: {
    color: 'var(--color-utility-red)',
    fontSize: 'var(--step--1)',
    fontWeight: 'var(--font-weight-bold)',
    margin: 0,
  },
  submit: {
    alignSelf: 'flex-start',
  },
});
