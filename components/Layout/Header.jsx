import Link from 'next/link';
import { UalLogo } from '../Icon/UalLogo';
import { MobileMenu } from './MobileMenu';

/**
 * Top bar — a slim black band with the `ual:` wordmark and, on mobile, the
 * hamburger menu that opens the primary navigation (the desktop side nav is
 * used at `md:` and above, so the hamburger is hidden there).
 *
 * Per the brief, the global UAL site controls that sit on the right of the
 * real arts.ac.uk bar (Subjects, Courses, Search, language, Accessibility
 * tools) are deliberately omitted — they aren't needed for this prototype.
 *
 * The bar shows at every breakpoint and stays pinned to the top.
 */
export function Header() {
  return (
    <header className="sticky top-0 z-300 bg-ual-dark py-2 text-ual-light md:py-3">
      <div className="flex items-center justify-between px-(--grid-gutter) md:pl-6">
        <Link
          href="/"
          className="inline-flex items-center text-ual-light no-underline"
          aria-label="UAL — home"
        >
          <UalLogo className="h-6 w-auto" />
        </Link>
        <MobileMenu />
      </div>
    </header>
  );
}
