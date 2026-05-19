'use client';

import { useCallback, useSyncExternalStore } from 'react';

const STORAGE_KEY = 'ual:events:favourites:v1';

/**
 * Shared external store for event favourites.
 *
 * Why this isn't `usePersistedState`: that hook creates an independent
 * `useState` per call, so two components calling `useEventFavourites`
 * (an EventCard toggling, an EventsScreen reading `favourites.length`)
 * end up with separate React state trees and never sync.
 *
 * Here we keep a single in-memory copy at module scope plus a Set of
 * subscribers, and bind every hook instance to it through React's
 * `useSyncExternalStore`. Toggling in any card immediately notifies
 * every subscriber so counts and pressed-states update in lockstep.
 *
 * Cross-tab sync is a bonus: a `storage` event on `window` (fired when
 * another tab writes our key) refreshes the in-memory copy and pings
 * subscribers, so saving on one tab updates the list on another.
 */

/** @type {string[] | null} */
let memoryValue = null;
/** @type {Set<() => void>} */
const subscribers = new Set();

function readFromStorage() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === null) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeToStorage(next) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* storage may be full or disabled — keep in memory only */
  }
}

/** Frozen reference returned during SSR / first hydration render. */
const SSR_SNAPSHOT = Object.freeze(/** @type {string[]} */ ([]));

function subscribe(onChange) {
  subscribers.add(onChange);

  // Lazily attach the cross-tab listener on first subscription so we
  // don't run any side effects at module import time.
  const onStorage = (e) => {
    if (e.key !== STORAGE_KEY) return;
    memoryValue = readFromStorage();
    subscribers.forEach((fn) => fn());
  };
  if (typeof window !== 'undefined') {
    window.addEventListener('storage', onStorage);
  }

  return () => {
    subscribers.delete(onChange);
    if (typeof window !== 'undefined') {
      window.removeEventListener('storage', onStorage);
    }
  };
}

function getSnapshot() {
  if (memoryValue === null) {
    memoryValue = readFromStorage();
  }
  return memoryValue;
}

function getServerSnapshot() {
  return SSR_SNAPSHOT;
}

function setShared(next) {
  memoryValue = next;
  writeToStorage(next);
  subscribers.forEach((fn) => fn());
}

/**
 * Persist the set of event ids the student has marked as favourites.
 * Stored as an array (not a Set) so it survives JSON round-trips in
 * localStorage; the API exposes a Set-like surface to callers.
 *
 * All hook instances share the same underlying store via
 * `useSyncExternalStore`, so toggling inside an EventCard immediately
 * updates the count badge inside the EventsScreen "Saved" pill.
 *
 * `hydrated` is true once we've moved past the SSR snapshot — useful
 * for components that want to avoid a flash of "no favourites" while
 * React is still in the hydration commit.
 *
 * @returns {{
 *   favourites: string[],
 *   hydrated: boolean,
 *   isFavourite: (eventId: string) => boolean,
 *   toggle: (eventId: string) => void,
 * }}
 */
export function useEventFavourites() {
  const favourites = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const hydrated = favourites !== SSR_SNAPSHOT;

  const isFavourite = useCallback((eventId) => favourites.includes(eventId), [favourites]);

  const toggle = useCallback((eventId) => {
    // Read from memoryValue (the source of truth) rather than the
    // closed-over `favourites` snapshot, so two rapid toggles in
    // different cards don't clobber each other's writes.
    const current = memoryValue ?? [];
    const next = current.includes(eventId)
      ? current.filter((id) => id !== eventId)
      : [...current, eventId];
    setShared(next);
  }, []);

  return { favourites, hydrated, isFavourite, toggle };
}
