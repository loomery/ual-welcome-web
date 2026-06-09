import Link from 'next/link';
import { UalLogo } from '../Icon/UalLogo';

/**
 * Top bar — a slim black band with just the `ual:` wordmark, mirroring the
 * new home design.
 *
 * Per the brief, the global UAL site controls that sit on the right of the
 * real arts.ac.uk bar (Subjects, Courses, Search, language, Accessibility
 * tools, Menu) are deliberately omitted — they aren't needed for this
 * prototype. The product navigation (Home / Tasks / Events / Map) lives in
 * the desktop side nav and the mobile bottom tab bar, NOT here.
 *
 * The bar shows at every breakpoint and stays pinned to the top.
 */
export function Header() {
  return (
    <header className="header">
      <div className="wrapper">
        <Link href="/" className="header__link" aria-label="UAL — home">
          <UalLogo className="header__logo" />
        </Link>
      </div>
    </header>
  );
}
