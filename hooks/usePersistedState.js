'use client';

import { useCallback, useEffect, useState } from 'react';

/**
 * Persist state in localStorage. SSR-safe and StrictMode-safe.
 * Silently falls back to in-memory if storage is unavailable (private mode, etc.).
 *
 * @template T
 * @param {string} key
 * @param {T} initial
 * @returns {[T, (next: T | ((prev: T) => T)) => void]}
 */
export function usePersistedState(key, initial) {
  const [value, setValue] = useState(() => {
    if (typeof window === 'undefined') return initial;
    try {
      const raw = window.localStorage.getItem(key);
      return raw === null ? initial : JSON.parse(raw);
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* swallow: storage may be full or disabled */
    }
  }, [key, value]);

  const update = useCallback((next) => {
    setValue((prev) => (typeof next === 'function' ? next(prev) : next));
  }, []);

  return [value, update];
}
