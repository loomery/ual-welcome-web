'use client';

import { useCallback } from 'react';
import { asset } from '../../utils/asset';

/**
 * Storage-key prefix for everything we persist on-device.
 * Keep the namespace shallow so a single sweep clears the whole app's
 * client-side state when the user hits Reset (shared computers, kiosk
 * machines in UAL labs, etc.).
 */
const STORAGE_PREFIX = 'ual:';

/**
 * UAL corporate footer.
 *
 * Mirrors the arts.ac.uk footer used in the new design: a black band with
 * the "Because the world needs creativity" line-up, three columns of
 * informational links, a social row and the copyright line.
 *
 * Links are external UAL pages; some point at the site root as
 * placeholders for this prototype. The on-device privacy note + reset
 * affordance (important for shared/kiosk machines) is preserved as a slim
 * row at the very bottom so we don't lose that capability in the reskin.
 */

/** @type {Array<Array<{ label: string, href: string }>>} */
const FOOTER_COLUMNS = [
  [
    { label: 'Privacy information', href: 'https://www.arts.ac.uk/' },
    { label: 'General Data Processing Information', href: 'https://www.arts.ac.uk/' },
    { label: 'Cookies', href: 'https://www.arts.ac.uk/' },
    { label: 'Disclaimer', href: 'https://www.arts.ac.uk/' },
  ],
  [
    { label: 'Public information', href: 'https://www.arts.ac.uk/about-ual/public-information' },
    { label: 'Feedback', href: 'https://www.arts.ac.uk/' },
    { label: 'Contact us', href: 'https://www.arts.ac.uk/contact-us' },
    { label: 'Press Office', href: 'https://www.arts.ac.uk/about-ual/press-office' },
  ],
  [
    { label: 'Working at UAL', href: 'https://www.arts.ac.uk/about-ual/jobs' },
    { label: 'Accessibility statement', href: 'https://www.arts.ac.uk/' },
    { label: 'UAL Prospectus 2023/24', href: 'https://www.arts.ac.uk/' },
    { label: 'Modern slavery statement', href: 'https://www.arts.ac.uk/' },
  ],
];

/** @type {Array<{ label: string, href: string, path: string }>} */
const SOCIALS = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/uniofthearts/',
    path: 'M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 3.5A4.5 4.5 0 1 1 7.5 12 4.5 4.5 0 0 1 12 7.5Zm0 2A2.5 2.5 0 1 0 14.5 12 2.5 2.5 0 0 0 12 9.5ZM17.5 6a1 1 0 1 1-1 1 1 1 0 0 1 1-1Z',
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/UniversityoftheArtsLondon',
    path: 'M13.5 22v-8h2.7l.4-3h-3.1V9.1c0-.9.3-1.5 1.6-1.5H17V5c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.1H8v3h2.8v8h2.7Z',
  },
  {
    label: 'X',
    href: 'https://twitter.com/UAL',
    path: 'M17.7 3h3.3l-7.2 8.2L22 21h-6.6l-5.2-6.8L4.3 21H1l7.7-8.8L2 3h6.8l4.7 6.2L17.7 3Zm-1.2 16h1.8L7.6 4.9H5.7L16.5 19Z',
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/school/university-of-the-arts-london/',
    path: 'M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm6 0h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.4c0-1.3 0-2.95-1.8-2.95s-2.07 1.4-2.07 2.85V21H9V9Z',
  },
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/user/UniversityArtsLondon',
    path: 'M22 12s0-3.2-.4-4.7a2.5 2.5 0 0 0-1.77-1.77C18.3 5.1 12 5.1 12 5.1s-6.3 0-7.83.43A2.5 2.5 0 0 0 2.4 7.3C2 8.8 2 12 2 12s0 3.2.4 4.7a2.5 2.5 0 0 0 1.77 1.77C5.7 18.9 12 18.9 12 18.9s6.3 0 7.83-.43a2.5 2.5 0 0 0 1.77-1.77C22 15.2 22 12 22 12Zm-12 3.2V8.8l5.2 3.2-5.2 3.2Z',
  },
  {
    label: 'TikTok',
    href: 'https://www.tiktok.com/@uniofthearts',
    path: 'M16 3c.3 2.2 1.6 3.9 3.8 4.2v2.8c-1.3 0-2.6-.4-3.8-1.1v5.6A5.7 5.7 0 1 1 10.3 8.8v2.9a2.8 2.8 0 1 0 2 2.7V3H16Z',
  },
];

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

    // Hard navigation (not router.push) so every in-memory copy of the
    // cleared state is dropped too, landing on a fresh onboarding intro.
    // asset() prefixes the deploy sub-path — window.location bypasses
    // Next's basePath handling.
    window.location.assign(asset('/onboarding'));
  }, []);

  return (
    <footer className="ual-footer" role="contentinfo">
      <div className="wrapper ual-footer__inner">
        <p className="ual-footer__headline">
          Because the world
          <br />
          needs creativity
        </p>

        <nav className="ual-footer__columns" aria-label="Footer">
          {FOOTER_COLUMNS.map((column, i) => (
            <ul key={i} className="ual-footer__column" role="list">
              {column.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="ual-footer__link" target="_blank" rel="noreferrer">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          ))}
        </nav>

        <div className="ual-footer__base">
          <ul className="ual-footer__socials" role="list">
            {SOCIALS.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  className="ual-footer__social"
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${s.label} (opens in a new tab)`}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path d={s.path} fill="currentColor" />
                  </svg>
                </a>
              </li>
            ))}
          </ul>
          <p className="ual-footer__copyright">
            © {new Date().getFullYear()} University of the Arts London. All Rights Reserved.
          </p>
        </div>

        <div className="ual-footer__device">
          <p className="ual-footer__note">
            This app stores your progress on this device only — nothing is sent to a server.
          </p>
          <button type="button" className="ual-footer__reset" onClick={handleReset}>
            Reset progress on this device
          </button>
        </div>
      </div>
    </footer>
  );
}
