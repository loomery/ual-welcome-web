'use client';

import { useEffect, useState } from 'react';

/**
 * Tracks prefers-reduced-motion user preference.
 * Used to disable auto-rotation in the 3D map (WCAG 2.3.3 Animation from Interactions).
 *
 * @returns {boolean}
 */
export function usePrefersReducedMotion() {
  const [prefers, setPrefers] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setPrefers(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return prefers;
}
