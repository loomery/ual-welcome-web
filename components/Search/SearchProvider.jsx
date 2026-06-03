'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { CommandPalette } from './CommandPalette';

/**
 * @typedef {Object} SearchContextValue
 * @property {boolean} open
 * @property {() => void} openSearch
 * @property {() => void} closeSearch
 */

/** @type {import('react').Context<SearchContextValue | null>} */
const SearchContext = createContext(null);

/**
 * Owns the global search state and the single command palette instance.
 * Registers the Cmd/Ctrl+K shortcut once for the whole app and exposes
 * `openSearch()` to any descendant (e.g. the header search bar) via context.
 *
 * Wrap the app chrome in this once (see AppShell). Multiple triggers can open
 * the same palette — keep it a singleton so there's only ever one dialog.
 *
 * @param {Object} props
 * @param {import('react').ReactNode} props.children
 */
export function SearchProvider({ children }) {
  const [open, setOpen] = useState(false);

  const openSearch = useCallback(() => setOpen(true), []);
  const closeSearch = useCallback(() => setOpen(false), []);

  // Global Cmd/Ctrl+K. Capture phase so it works even when focus is in an
  // input elsewhere on the page.
  useEffect(() => {
    function onKeyDown(e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const value = useMemo(() => ({ open, openSearch, closeSearch }), [open, openSearch, closeSearch]);

  return (
    <SearchContext.Provider value={value}>
      {children}
      {/* `key` remounts the palette on each open so its query/selection state
          starts fresh — cheaper and cleaner than resetting via an effect. */}
      <CommandPalette key={open ? 'open' : 'closed'} open={open} onClose={closeSearch} />
    </SearchContext.Provider>
  );
}

/**
 * Access the global search controls. Returns a safe no-op fallback if used
 * outside a SearchProvider so a stray trigger never crashes the tree.
 *
 * @returns {SearchContextValue}
 */
export function useSearch() {
  return (
    useContext(SearchContext) ?? {
      open: false,
      openSearch: () => {},
      closeSearch: () => {},
    }
  );
}
