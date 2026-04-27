/**
 * Skip links — WCAG 2.4.1 Bypass Blocks.
 * Visually hidden until focused; mirrored from UAL DS.
 */
export function SkipLinks() {
  return (
    <>
      <a className="visually-hidden skip-to-content" href="#main-content">
        Skip to content
      </a>
      <a className="visually-hidden skip-to-content" href="#primary-nav">
        Skip to navigation
      </a>
    </>
  );
}
