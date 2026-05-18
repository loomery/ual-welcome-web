'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Persist state in localStorage. SSR-safe: always starts with `initial`
 * so server and client first render match (no hydration mismatch).
 * After mount, loads the real value from localStorage and sets hydrated=true.
 * Updates write directly to localStorage via the setter.
 *
 * Returns [value, update, hydrated] — callers that gate on persisted data
 * (e.g. redirect guards) should wait for hydrated=true before acting.
 *
 * @template T
 * @param {string} key
 * @param {T} initial
 * @returns {[T, (next: T | ((prev: T) => T)) => void, boolean]}
 */
export function usePersistedState(key, initial) {
  const [value, setValue] = useState(initial);
  const [hydrated, setHydrated] = useState(false);
  // Track whether the post-mount read has completed so we never write
  // the initial value back to storage before we've loaded the real one.
  const hydratedRef = useRef(false);

  useEffect(() => {
    let parsed = null;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw !== null) parsed = JSON.parse(raw);
    } catch {
      /* storage unavailable or corrupt — keep initial */
    }

    // Defer setState so it runs outside the effect body (avoids cascading renders).
    queueMicrotask(() => {
      if (parsed !== null) setValue(parsed);
      hydratedRef.current = true;
      setHydrated(true);
    });
  }, [key]);

  const update = useCallback(
    (next) => {
      setValue((prev) => {
        const newVal = typeof next === 'function' ? next(prev) : next;
        // Only write to storage after hydration to avoid overwriting
        // existing data with the initial value on first render.
        if (hydratedRef.current) {
          try {
            window.localStorage.setItem(key, JSON.stringify(newVal));
          } catch {
            /* swallow: storage may be full or disabled */
          }
        }
        return newVal;
      });
    },
    [key],
  );

  return [value, update, hydrated];
}
