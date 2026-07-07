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

  const primaryClass =
    'block px-4 py-3.5 text-step-1 leading-ual-condensed text-ual-light no-underline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ual-orange';
  const secondaryClass =
    'block px-4 py-3.5 text-step-0 text-ual-light no-underline hover:text-ual-orange focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ual-orange';

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

      <div
        onClick={close}
        aria-hidden="true"
        className={[
          'fixed inset-x-0 top-15 bottom-0 z-40 bg-ual-dark/40 transition-opacity duration-200 ease-ual',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        ].join(' ')}
      />

      <nav
        id="mobile-menu"
        ref={panelRef}
        aria-label="Primary"
        inert={!open}
        className={[
          'fixed top-15 right-0 bottom-0 z-40 w-[318px] max-w-[85vw] overflow-y-auto bg-ual-dark pt-4 transition-transform duration-200 ease-ual',
          open ? 'translate-x-0' : 'translate-x-full',
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
                  className={[
                    primaryClass,
                    active
                      ? 'font-ual-bold text-[var(--color-orange-pressed)]'
                      : 'hover:text-ual-orange',
                  ].join(' ')}
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
            const isExternal = item.href.startsWith('http');
            return (
              <li key={item.label}>
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noreferrer' : undefined}
                  className={secondaryClass}
                >
                  {item.label}
                  {isExternal && <span className="sr-only"> (opens in a new tab)</span>}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
