'use client';

import { useCallback } from 'react';
import { usePersistedState } from './usePersistedState';

const STORAGE_KEY = 'ual:events:favourites:v1';

/**
 * Persist the set of event ids the student has marked as favourites.
 * Stored as an array (not a Set) so it survives JSON round-trips in
 * localStorage; the API exposes a Set-like surface to callers.
 *
 * @returns {{
 *   favourites: string[],
 *   hydrated: boolean,
 *   isFavourite: (eventId: string) => boolean,
 *   toggle: (eventId: string) => void,
 * }}
 */
export function useEventFavourites() {
  const [favourites, setFavourites, hydrated] = usePersistedState(
    STORAGE_KEY,
    /** @type {string[]} */ ([]),
  );

  const isFavourite = useCallback(
    (eventId) => Array.isArray(favourites) && favourites.includes(eventId),
    [favourites],
  );

  const toggle = useCallback(
    (eventId) => {
      setFavourites((prev) => {
        const list = Array.isArray(prev) ? prev : [];
        return list.includes(eventId) ? list.filter((id) => id !== eventId) : [...list, eventId];
      });
    },
    [setFavourites],
  );

  return { favourites, hydrated, isFavourite, toggle };
}
