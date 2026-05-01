'use client';

import { useCallback } from 'react';

/**
 * Storage-key prefix for everything we persist on-device.
 * Keep the namespace shallow so a single sweep clears the whole app's
 * client-side state when the user hits Reset (shared computers, kiosk
 * machines in UAL labs, etc.).
 */
const STORAGE_PREFIX = 'ual:';

/**
 * Site-wide footer. Two jobs:
 *  1. Privacy disclosure — make it obvious that progress lives only on
 *     this device, not on a server. Helps the user reason about what
 *     "logging out" means here (there is no account).
 *  2. Reset progress — single button that clears every `ual:*` key from
 *     localStorage and reloads. Important for shared/kiosk devices.
 *
 * Rendered as <footer role="contentinfo"> so AT users can jump straight
 * to it via landmark navigation. Sits between <main> and the mobile
 * BottomNav; CSS keeps it clear of the bottom-nav overlay on mobile.
 */
export function Footer() {
  const handleReset = useCallback(() => {
    if (typeof window === 'undefined') return;

    const confirmed = window.confirm(
      'Reset everything stored on this device?\n\n' +
        'Your checklist progress and any feedback drafts will be cleared. ' +
        'This cannot be undone.',
    );
    if (!confirmed) return;

    try {
      // Collect first, mutate after — calling removeItem while iterating
      // localStorage shifts indices and can skip keys.
      const toRemove = [];
      for (let i = 0; i < window.localStorage.length; i += 1) {
        const key = window.localStorage.key(i);
        if (key && key.startsWith(STORAGE_PREFIX)) toRemove.push(key);
      }
      toRemove.forEach((key) => window.localStorage.removeItem(key));
    } catch {
      /* swallow: private mode / disabled storage — nothing to clear */
    }

    // Hard reload so any in-memory React state derived from storage is
    // dropped too. location.reload() is preferred over router.refresh()
    // because the latter only re-renders RSCs.
    window.location.reload();
  }, []);

  return (
    <footer className="app-footer" role="contentinfo">
      <div className="wrapper app-footer__inner">
        <p className="app-footer__note">
          This app stores your progress on this device only — nothing is sent to a server.
        </p>
        <button type="button" className="app-footer__reset" onClick={handleReset}>
          Reset progress on this device
        </button>
      </div>
    </footer>
  );
}
