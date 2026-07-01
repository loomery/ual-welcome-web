/**
 * @param {string | null} pathname
 * @returns {boolean}
 */
export function isOnboardingRoute(pathname) {
  return pathname === '/onboarding' || Boolean(pathname?.startsWith('/onboarding/'));
}
