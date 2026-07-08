import { DateStampBar } from './DateStampBar';
import { ArrowRightIcon } from '../Icon/NavIcons';

/**
 * KeyDateCard — a "Key dates" tile: a heading and short description on a
 * light shade surface, with the dark date-stamp bar pinned to its bottom
 * edge so cards in a row align regardless of copy length.
 *
 * When `href` is supplied the whole card becomes an external link with a
 * top-right arrow that turns UAL orange on hover/focus.
 *
 * @param {Object} props
 * @param {string} props.title
 * @param {string} props.description
 * @param {string} props.label       Date-stamp category label.
 * @param {string} props.startsAt    ISO-8601 start date.
 * @param {string} props.endsAt      ISO-8601 end date.
 * @param {string} [props.href]       External link — renders a top-right arrow.
 */
export function KeyDateCard({ title, description, label, startsAt, endsAt, href }) {
  const body = (
    <>
      <div className="flex grow flex-col gap-2 p-4 pb-6">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-step-1/ual-condensed font-ual-bold tracking-ual-tight text-ual-dark">
            {title}
          </h3>
          {href && (
            <span
              className="inline-flex size-11 shrink-0 items-center justify-center text-current [&>svg]:size-6"
              aria-hidden="true"
            >
              <ArrowRightIcon />
            </span>
          )}
        </div>
        <p className="text-step-d1 text-ual-medium">{description}</p>
      </div>
      <DateStampBar label={label} startsAt={startsAt} endsAt={endsAt} />
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="group flex h-full flex-col bg-ual-shade text-ual-dark no-underline transition-colors hover:text-ual-orange focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ual-orange"
      >
        {body}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    );
  }

  return <div className="flex h-full flex-col bg-ual-shade text-ual-dark">{body}</div>;
}
