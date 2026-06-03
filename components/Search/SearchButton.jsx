'use client';

import { useSyncExternalStore } from 'react';
import clsx from 'clsx';
import { SearchIcon } from '../Icon/NavIcons';
import { useSearch } from './SearchProvider';

/** No-op subscribe — the platform never changes within a session. */
const noopSubscribe = () => () => {};

/** Client-only modifier label. Server renders '' so hydration always matches. */
function useShortcutLabel() {
  return useSyncExternalStore(
    noopSubscribe,
    () =>
      /mac|iphone|ipad|ipod/i.test(navigator.platform || navigator.userAgent) ? '⌘K' : 'Ctrl K',
    () => '',
  );
}

/**
 * Entry point for the global search. Renders as a faux search field on
 * tablet/desktop (square, hairline border, icon + label + shortcut hint —
 * matching the UAL DDS input styling) and collapses to an icon-only button on
 * mobile, where the bottom nav owns horizontal space. Opening is delegated to
 * the SearchProvider — this is just a trigger. Colour tokens auto-invert for
 * dark mode, so no `dark:` overrides are needed.
 *
 * @param {Object} [props]
 * @param {string} [props.className]  Extra classes (e.g. `w-full` in the sidebar).
 */
export function SearchButton({ className } = {}) {
  const { openSearch } = useSearch();
  const shortcut = useShortcutLabel();

  return (
    <button
      type="button"
      onClick={openSearch}
      aria-label="Search the app"
      aria-keyshortcuts="Meta+K Control+K"
      className={clsx(
        `flex min-h-11 items-center gap-2xs text-ual-medium transition-colors ease-ual hover:text-ual-dark focus-visible:outline-2 focus-visible:outline-ual-orange md:gap-xs md:border-2 md:border-ual-dark-90 md:bg-ual-light md:px-s md:py-xs md:hover:border-ual-dark`,
        className,
      )}
    >
      <SearchIcon className="size-5 shrink-0" aria-hidden="true" />
      <span className="hidden text-step-d1 md:inline">Search</span>
      {shortcut && (
        <kbd className="hidden text-step-d1 font-ual-bold md:ml-auto md:inline" aria-hidden="true">
          {shortcut}
        </kbd>
      )}
    </button>
  );
}
