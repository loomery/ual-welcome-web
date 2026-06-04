'use client';

import { useEffect, useId, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronIcon, CloseIcon, ExternalLinkIcon, SearchIcon } from '../Icon/NavIcons';
import { groupNavItems } from './navConfig';

/** Show the filter field only once the list is long enough to warrant it. */
const SEARCH_THRESHOLD = 6;

/**
 * Mobile "More" sheet — overflow navigation for every destination that doesn't
 * fit the bottom bar. Built on the native <dialog> element so focus trapping
 * and Escape-to-close come from the user agent; pinned to the bottom of the
 * viewport as a sheet (see `.nav-sheet` in globals.css).
 *
 * Items are bucketed into collapsible accordion sections (UAL DDS pattern) so a
 * long destination list stays scannable instead of overwhelming. Sections start
 * collapsed; the one holding the current route opens automatically, and an
 * active filter expands every section that still has a match.
 *
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
  const searchId = useId();
  const regionId = useId();
  const [query, setQuery] = useState('');
  // Sections the user has explicitly toggled open. Auto-open (active route /
  // active filter) is layered on top at render time, not stored here.
  const [openGroups, setOpenGroups] = useState(() => new Set());

  // Sync the native dialog with the `open` prop. showModal() gives us the
  // focus trap + Escape handling for free.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    else if (!open && dialog.open) dialog.close();
  }, [open]);

  // Mirror user-agent close (Escape / backdrop) back into parent state, and
  // reset the filter + section state so the menu opens fresh next time.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleClose = () => {
      onClose();
      setQuery('');
      setOpenGroups(new Set());
    };
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

  const toggleGroup = (name) =>
    setOpenGroups((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });

  // Plain case-insensitive substring filter over labels — enough for a short
  // navigation list (no fuzzy ranking needed here).
  const trimmed = query.trim().toLowerCase();
  const isFiltering = trimmed.length > 0;
  const filtered = isFiltering
    ? items.filter((item) => item.label.toLowerCase().includes(trimmed))
    : items;
  const showSearch = items.length > SEARCH_THRESHOLD;
  const groups = groupNavItems(filtered);

  /** @param {import('./navConfig').NavItem} item */
  const renderLink = (item) => {
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

        {showSearch && (
          <div className="nav-sheet__search">
            <SearchIcon className="nav-sheet__search-icon" aria-hidden="true" />
            <input
              id={searchId}
              type="text"
              className="nav-sheet__search-input"
              placeholder="Filter menu…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoComplete="off"
              spellCheck="false"
              aria-label="Filter menu"
            />
          </div>
        )}

        {groups.length === 0 ? (
          <p className="nav-sheet__empty">
            No matches for <span className="nav-sheet__empty-term">“{query.trim()}”</span>
          </p>
        ) : (
          <ul className="nav-sheet__list" role="list">
            {groups.map((group, index) => {
              const hasActive = group.items.some((item) => isActive(item.to));
              // Force-open while filtering (so matches are visible) or when the
              // section holds the current route; otherwise honour the toggle.
              const expanded = isFiltering || hasActive || openGroups.has(group.name);
              const panelId = `${regionId}-${index}`;

              return (
                <li
                  key={group.name}
                  className="nav-sheet__group"
                  data-open={expanded ? '' : undefined}
                >
                  <button
                    type="button"
                    className="nav-sheet__group-trigger"
                    aria-expanded={expanded}
                    aria-controls={panelId}
                    onClick={() => toggleGroup(group.name)}
                  >
                    <span className="nav-sheet__group-name">{group.name}</span>
                    <span className="nav-sheet__group-count" aria-hidden="true">
                      {group.items.length}
                    </span>
                    <ChevronIcon
                      className="nav-sheet__chevron"
                      data-open={expanded ? '' : undefined}
                      aria-hidden="true"
                    />
                  </button>
                  {expanded && (
                    <ul id={panelId} className="nav-sheet__sublist" role="list">
                      {group.items.map(renderLink)}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </dialog>
  );
}
