/**
 * Skip links — WCAG 2.4.1 Bypass Blocks.
 * Visually hidden until focused.
 */
export function SkipLinks() {
  const skipLinkClass =
    'sr-only focus:not-sr-only focus:fixed focus:left-s focus:top-s focus:z-[300] inline-block bg-ual-dark px-s py-xs font-ual-bold text-ual-light no-underline focus:outline-2 focus:outline-offset-2 focus:outline-ual-orange';

  return (
    <>
      <a className={skipLinkClass} href="#main-content">
        Skip to content
      </a>
      <a className={skipLinkClass} href="#primary-nav">
        Skip to navigation
      </a>
    </>
  );
}
