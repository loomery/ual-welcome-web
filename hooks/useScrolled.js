'use client';

import { useEffect, useState } from 'react';

/**
 * useScrolled — true once the window has scrolled past `threshold` pixels.
 *
 * Used to drive the header transition: the full hero band scrolls away and the
 * compact hero fades into the sticky sidebar once the page is scrolled.
 *
 * @param {number} [threshold=120]  ScrollY (px) past which it flips to true.
 * @returns {boolean}
 */
export function useScrolled(threshold = 120) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  return scrolled;
}
