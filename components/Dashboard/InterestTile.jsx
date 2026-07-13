import Link from 'next/link';
import { ArrowRightIcon } from '../Icon/NavIcons';

/**
 * InterestTile — the shared grey service card: a shade surface with a title,
 * a short description and a bottom-left arrow; the whole tile is a link that
 * shifts to UAL orange on hover/focus. Internal hrefs use next/link; external
 * ones open in a new tab.
 *
 * @param {Object} props
 * @param {string} props.label
 * @param {string} [props.body]  Short one-liner describing the destination.
 * @param {string} props.href
 */
export function InterestTile({ label, body, href }) {
  const external = !href.startsWith('/');
  const className =
    'group flex h-full flex-col gap-(--space-xs) bg-ual-shade p-(--space-m) text-ual-dark no-underline transition-colors hover:text-ual-orange focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ual-orange';

  const content = (
    <>
      <h3 className="text-step-1/ual-condensed font-ual-normal tracking-ual-tight">{label}</h3>
      {body && <p className="text-step-d1 text-ual-medium">{body}</p>}
      <span
        className="mt-auto inline-flex size-11 items-center text-current [&>svg]:size-6"
        aria-hidden="true"
      >
        <ArrowRightIcon />
      </span>
      {external && <span className="sr-only"> (opens in a new tab)</span>}
    </>
  );

  return external ? (
    <a href={href} target="_blank" rel="noreferrer" className={className}>
      {content}
    </a>
  ) : (
    <Link href={href} className={className}>
      {content}
    </Link>
  );
}
