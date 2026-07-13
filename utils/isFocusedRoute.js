import { isOnboardingRoute } from './isOnboardingRoute';

/**
 * "Focused" routes render chrome-light: no side nav, breadcrumbs or hero, and a
 * centered single column (header + beta notice + footer only). Used by the
 * onboarding flow and the profile-edit page.
 *
 * @param {string | null} pathname
 * @returns {boolean}
 */
export function isFocusedRoute(pathname) {
  return isOnboardingRoute(pathname) || pathname === '/profile' || pathname === '/profile/';
}
