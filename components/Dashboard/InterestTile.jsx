import Link from 'next/link';
import { ArrowRightIcon } from '../Icon/NavIcons';

/**
 * InterestTile — a single "Selected interests" card. A shade surface with a
 * title, a short description and a bottom-left arrow; the whole tile is a
 * link that shifts to UAL orange on hover/focus.
 *
 * @param {Object} props
 * @param {string} props.label
 * @param {string} props.body   Short one-liner describing the interest.
 * @param {string} props.href   Internal route.
 */
export function InterestTile({ label, body, href }) {
  return (
    <Link
      href={href}
      className="group flex h-full flex-col gap-3 bg-ual-shade p-6 text-ual-dark no-underline transition-colors hover:text-ual-orange focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ual-orange"
    >
      <h3 className="text-step-1/ual-condensed font-ual-bold tracking-ual-tight">{label}</h3>
      {body && <p className="text-step-d1 text-ual-medium">{body}</p>}
      <span
        className="mt-auto inline-flex size-11 items-center text-current [&>svg]:size-6"
        aria-hidden="true"
      >
        <ArrowRightIcon />
      </span>
    </Link>
  );
}
