'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CloseIcon, ExternalLinkIcon } from '../Icon/NavIcons';

/**
 * Mobile "More" sheet — overflow navigation for every destination that doesn't
 * fit the bottom bar. Built on the native <dialog> element so focus trapping
 * and Escape-to-close come from the user agent; pinned to the bottom of the
 * viewport as a sheet (see `.nav-sheet` in globals.css).
 *
 * This is the scalable bucket: add as many items as you like (and group them
 * later, e.g. external UAL links) without ever crowding the bottom bar.
 * Internal routes render as <Link>; external links open in a new tab.
 *
 * @param {Object} props
 * @param {boolean} props.open
 * @param {() => void} props.onClose
 * @param {import('./navConfig').NavItem[]} props.items
 */
export function NavSheet({ open, onClose, items }) {
  const dialogRef = useRef(null);
  const pathname = usePathname();

  // Sync the native dialog with the `open` prop. showModal() gives us the
  // focus trap + Escape handling for free.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    else if (!open && dialog.open) dialog.close();
  }, [open]);

  // Mirror user-agent close (Escape / backdrop) back into parent state.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleClose = () => onClose();
    dialog.addEventListener('close', handleClose);
    return () => dialog.removeEventListener('close', handleClose);
  }, [onClose]);

  /**
   * @param {string | undefined} to
   * @returns {boolean}
   */
  const isActive = (to) => {
    if (!to) return false;
    if (to === '/') return pathname === '/';
    return pathname === to || pathname.startsWith(`${to}/`);
  };

  return (
    <dialog
      ref={dialogRef}
      className="nav-sheet"
      aria-label="More navigation"
      onClick={(e) => {
        if (e.target === dialogRef.current) dialogRef.current?.close();
      }}
    >
      <div className="nav-sheet__panel">
        <div className="nav-sheet__header">
          <h2 className="nav-sheet__title">More</h2>
          <button
            type="button"
            className="nav-sheet__close"
            onClick={() => dialogRef.current?.close()}
            aria-label="Close menu"
          >
            <CloseIcon className="nav-sheet__close-icon" aria-hidden="true" />
          </button>
        </div>

        <ul className="nav-sheet__list" role="list">
          {items.map((item) => {
            const isExternal = Boolean(item.href);
            const active = isActive(item.to);
            const key = item.href ?? item.to;

            return (
              <li key={key}>
                {isExternal ? (
                  <a
                    href={item.href}
                    className="nav-sheet__link"
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => dialogRef.current?.close()}
                  >
                    <item.Icon className="nav-sheet__icon" aria-hidden="true" />
                    <span className="nav-sheet__label">{item.label}</span>
                    <ExternalLinkIcon className="nav-sheet__trailing" aria-hidden="true" />
                    <span className="visually-hidden"> (opens in a new tab)</span>
                  </a>
                ) : (
                  <Link
                    href={item.to}
                    className="nav-sheet__link"
                    aria-current={active ? 'page' : undefined}
                    data-active={active ? '' : undefined}
                    onClick={() => dialogRef.current?.close()}
                  >
                    <item.Icon className="nav-sheet__icon" aria-hidden="true" />
                    <span className="nav-sheet__label">{item.label}</span>
                    {active && <span className="visually-hidden">(current page)</span>}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </dialog>
  );
}
