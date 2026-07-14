'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_ITEMS, MENU_SECONDARY } from './navConfig';
import { MenuIcon, CloseIcon } from '../Icon/NavIcons';

/**
 * Mobile navigation — a hamburger button in the header that opens the standard
 * UAL dark dropdown panel (slides in from the right, below the header). Mobile
 * only; the desktop side nav is unaffected. Replaces the old bottom tab bar.
 *
 * Accessibility: the toggle exposes `aria-expanded`/`aria-controls`; Escape and
 * the scrim close the panel; body scroll locks while open; focus moves into the
 * panel on open and back to the toggle on close; the panel is `inert` when
 * closed so its links stay out of the tab order.
 */
export function MobileMenu() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);
  const buttonRef = useRef(null);

  /** @param {string | undefined} to */
  const isActive = (to) => {
    if (!to) return false;
    if (to === '/') return pathname === '/';
    return pathname === to || pathname.startsWith(`${to}/`);
  };

  const close = () => {
    setOpen(false);
    buttonRef.current?.focus();
  };

  // While open: Escape closes, body scroll locks, focus moves into the panel.
  useEffect(() => {
    if (!open) return;

    const onKey = (e) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panelRef.current?.querySelector('a')?.focus();

    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  // Orange is a press affordance only — it appears while an item is being
  // clicked (:active), not on the selected/current item and not on hover.
  const primaryClass =
    'block px-4 py-3.5 text-step-1 leading-ual-condensed text-ual-light no-underline active:text-ual-orange focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ual-orange';
  const secondaryClass =
    'block px-4 py-3.5 text-step-0 text-ual-light no-underline active:text-ual-orange focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ual-orange';

  return (
    <div className="md:hidden">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? 'Close menu' : 'Menu'}
        className="inline-flex size-11 items-center justify-center text-ual-light focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ual-orange"
      >
        {open ? (
          <CloseIcon className="size-6" aria-hidden="true" />
        ) : (
          <MenuIcon className="size-6" aria-hidden="true" />
        )}
      </button>

      {/* Off-canvas layer: fixed to the viewport and clipped, so the closed
          drawer (translated off-screen right) can't create horizontal scroll. */}
      <div
        className={[
          'fixed top-15 bottom-0 left-0 z-40 w-screen overflow-hidden',
          open ? '' : 'pointer-events-none',
        ].join(' ')}
      >
        <div
          onClick={close}
          aria-hidden="true"
          className={[
            'absolute inset-0 bg-ual-dark/40 transition-opacity duration-200 ease-ual',
            open ? 'opacity-100' : 'pointer-events-none opacity-0',
          ].join(' ')}
        />

        <nav
          id="mobile-menu"
          ref={panelRef}
          aria-label="Primary"
          inert={!open}
          className={[
            // Stays on-screen (right-aligned) and reveals via clip-path rather
            // than translating off-screen — a translated-off drawer would add
            // horizontal scroll to the whole page.
            'absolute top-0 right-0 bottom-0 w-[318px] max-w-[85vw] overflow-y-auto bg-ual-dark pt-4 transition-[clip-path] duration-200 ease-ual',
            open ? '[clip-path:inset(0)]' : '[clip-path:inset(0_0_0_100%)]',
          ].join(' ')}
        >
          <ul role="list" className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.to);
              return (
                <li key={item.to}>
                  <Link
                    href={item.to}
                    onClick={() => setOpen(false)}
                    aria-current={active ? 'page' : undefined}
                    className={[primaryClass, active ? 'font-ual-bold' : ''].join(' ')}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <hr className="m-4 border-t border-ual-light/20" />

          <ul role="list" className="flex flex-col gap-1 pb-6">
            {MENU_SECONDARY.map((item) => {
              const isExternal = Boolean(item.href);
              return (
                <li key={item.label}>
                  {isExternal ? (
                    <a
                      href={item.href}
                      onClick={() => setOpen(false)}
                      target="_blank"
                      rel="noreferrer"
                      className={secondaryClass}
                    >
                      {item.label}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  ) : (
                    <Link href={item.to} onClick={() => setOpen(false)} className={secondaryClass}>
                      {item.label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
}
