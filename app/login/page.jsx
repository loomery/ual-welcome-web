import { Suspense } from 'react';
import { LoginForm } from './LoginForm';

export const metadata = {
  title: 'Sign in | UAL Welcome Week',
  // No login indexing — this isn't a public page, it's the prototype gate.
  robots: { index: false, follow: false },
};

/**
 * Prototype password gate page.
 *
 * The form itself is a client island (LoginForm) so we can `fetch`
 * /api/login and react to the response inline. The Suspense wrapper is
 * required because `useSearchParams()` inside the form needs an explicit
 * boundary during SSR.
 */
export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
