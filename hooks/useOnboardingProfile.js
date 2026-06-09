'use client';

import { useCallback } from 'react';
import { usePersistedState } from './usePersistedState';

/**
 * @typedef {Object} OnboardingProfile
 * @property {string} name
 * @property {string} collegeId           one of COLLEGE_OPTIONS[].id
 * @property {string} studentType         one of STUDENT_TYPE_OPTIONS[].id ('domestic' | 'international')
 * @property {string} [visaStatus]        one of VISA_STATUS_OPTIONS[].id — only set for international students
 * @property {string[]} interests         array of INTEREST_OPTIONS[].id
 * @property {string} completedAt         ISO timestamp of completion
 */

const STORAGE_KEY = 'ual:profile:v1';

/** @type {Partial<OnboardingProfile>} */
const EMPTY_PROFILE = {};

/**
 * Read/write the student's onboarding profile in localStorage.
 * Returns null while hydrating on the client so callers can gate UI on it.
 *
 * Keep the API minimal — the onboarding flow uses partial updates as the
 * student progresses, then commits the full profile on the final step.
 *
 * @returns {{
 *   profile: Partial<OnboardingProfile>,
 *   isComplete: boolean,
 *   hydrated: boolean,
 *   patch: (next: Partial<OnboardingProfile>) => void,
 *   commit: () => void,
 *   reset: () => void,
 * }}
 */
export function useOnboardingProfile() {
  const [profile, setProfile, hydrated] = usePersistedState(STORAGE_KEY, EMPTY_PROFILE);

  const patch = useCallback(
    (next) => {
      setProfile((prev) => ({ ...prev, ...next }));
    },
    [setProfile],
  );

  const commit = useCallback(() => {
    setProfile((prev) => ({ ...prev, completedAt: new Date().toISOString() }));
  }, [setProfile]);

  const reset = useCallback(() => {
    setProfile(EMPTY_PROFILE);
  }, [setProfile]);

  return {
    profile,
    isComplete: Boolean(profile?.completedAt),
    hydrated,
    patch,
    commit,
    reset,
  };
}
