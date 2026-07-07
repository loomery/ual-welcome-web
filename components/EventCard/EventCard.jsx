'use client';

import Link from 'next/link';
import { DAY_FMT, LONG_DATE_FMT, MONTH_FMT, TIME_FMT, WEEKDAY_FMT } from '../../utils/dates';
import { HeartIcon, PinIcon } from '../Icon/NavIcons';
import { useEventFavourites } from '../../hooks/useEventFavourites';

/**
 * Event card — UAL-branded.
 *
 * Anatomy (top-to-bottom):
 *  - Header row: a signature black date-stamp chip (stacked day + month)
 *    next to a meta row with category tag + weekday/time, and the title.
 *    On hover/focus the stamp flips to UAL orange so the whole card reads
 *    as an interactive surface.
 *  - Body: short description (hidden in the compact variant).
 *  - Footer: location-pin row pushed to the card's bottom edge so cards
 *    in a grid visually align regardless of content length.
 *  - Top-right heart toggle (non-compact only): saves the event to the
 *    student's favourites via useEventFavourites. The button is rendered
 *    as a sibling of the surface link (not nested inside it) so the
 *    save action doesn't navigate, and screen readers see them as two
 *    independent controls.
 *
 * The whole card surface is a link, following the UAL DS card pattern.
 *
 * @param {Object} props
 * @param {import('../../data/events').UalEvent} props.event
 * @param {boolean} [props.compact]  Compact variant used in horizontal reels.
 */
export function EventCard({ event, compact }) {
  const { isFavourite, toggle, hydrated } = useEventFavourites();

  const start = new Date(event.startsAt);
  const end = new Date(event.endsAt);

  const day = DAY_FMT.format(start);
  const month = MONTH_FMT.format(start).toUpperCase();
  const weekday = WEEKDAY_FMT.format(start);
  const timeRange = `${TIME_FMT.format(start)}–${TIME_FMT.format(end)}`;

  // Full, screen-reader-friendly label for the <time> element so assistive
  // tech reads "Monday 21 September 2026" rather than "21 Sep".
  const accessibleDate = LONG_DATE_FMT.format(start);

  const className = [
    'group relative flex h-full flex-col bg-ual-light outline outline-1 -outline-offset-1 outline-ual-dark transition-[background,transform] duration-150 ease-[ease] hover:bg-ual-dark-95 motion-reduce:transition-none',
    compact && 'w-72 max-w-[85vw]',
  ]
    .filter(Boolean)
    .join(' ');

  // Per-category tint on the tag chip — it mirrors UAL's editorial palette
  // (sage / peach / sand / sky) while keeping text legible in a single dark ink.
  const TAG_TINTS = {
    talk: 'bg-[#d6e7d0]',
    tour: 'bg-[#cfe0ec]',
    social: 'bg-[#f5d6c3]',
    workshop: 'bg-[#f0e2b6]',
  };
  const categorySlug = event.category.toLowerCase();
  const tagTint = TAG_TINTS[categorySlug] ?? 'bg-ual-dark-90';

  // Don't render a pressed state until the favourites list has hydrated
  // from localStorage — otherwise the heart flashes outlined → filled on
  // first paint of a saved event.
  const saved = hydrated && isFavourite(event.id);

  return (
    <article className={className}>
      <Link
        href={`/events/${event.id}`}
        className={[
          'group/link flex h-full flex-col space-y-6 text-inherit no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ual-orange',
          compact ? 'p-4' : 'p-6',
        ].join(' ')}
      >
        <header className="grid grid-cols-[auto_1fr] items-start gap-4 max-[22rem]:grid-cols-[1fr]">
          <time
            className="inline-flex min-w-14 flex-col items-center justify-center bg-ual-dark px-3 py-2 leading-ual-single text-ual-light transition-[background,color] duration-150 ease-[ease] group-hover:bg-ual-orange group-hover:text-ual-dark group-focus-visible/link:bg-ual-orange group-focus-visible/link:text-ual-dark motion-reduce:transition-none max-[22rem]:flex-row max-[22rem]:gap-1 max-[22rem]:px-2 max-[22rem]:py-1"
            dateTime={event.startsAt}
            aria-label={accessibleDate}
          >
            <span
              className="font-heading text-step-2/ual-single font-ual-bold tracking-ual-tight max-[22rem]:text-step-1"
              aria-hidden="true"
            >
              {day}
            </span>
            <span
              className="mt-[0.2rem] text-step-d1 font-ual-bold tracking-[0.08em] uppercase"
              aria-hidden="true"
            >
              {month}
            </span>
          </time>

          <div className="space-y-2">
            <p className="m-0 flex flex-wrap items-center gap-2">
              <span
                className={`w-fit ${tagTint} px-2 py-1 text-step-d1/ual-single font-ual-bold tracking-[0.06em] text-ual-dark uppercase`}
              >
                {event.category}
              </span>
              <span className="text-step-d1 tracking-[0.02em] text-ual-medium">
                {weekday} · {timeRange}
              </span>
            </p>
            {!compact && (
              <p className="m-0 text-step-d1/ual-condensed text-ual-medium">{event.college}</p>
            )}
            <h3 className="m-0 text-step-0/ual-condensed font-ual-bold text-balance group-hover:underline group-hover:decoration-2 group-hover:underline-offset-[3px] group-focus-visible/link:underline group-focus-visible/link:decoration-2 group-focus-visible/link:underline-offset-[3px]">
              {event.title}
            </h3>
          </div>
        </header>

        {!compact && (
          <p className="m-0 line-clamp-2 border-t border-ual-dark-90 py-4 text-step-d1/ual-default text-ual-medium">
            {event.description}
          </p>
        )}

        <p className="m-0 mt-auto flex items-center gap-1 border-t border-ual-dark-90 pt-4 text-step-d1/ual-condensed text-ual-medium">
          <PinIcon aria-hidden="true" width={16} height={16} className="shrink-0" />
          <span className="line-clamp-1 min-w-0">{event.location}</span>
        </p>
      </Link>

      {!compact && (
        <button
          type="button"
          className="absolute top-2 right-2 z-1 inline-flex min-h-9 min-w-9 items-center justify-center p-1 text-ual-dark hover:text-ual-orange focus-visible:text-ual-orange focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ual-orange"
          onClick={() => toggle(event.id)}
          aria-pressed={saved}
          aria-label={saved ? `Remove ${event.title} from saved events` : `Save ${event.title}`}
        >
          <HeartIcon filled={saved} aria-hidden="true" width={20} height={20} />
        </button>
      )}
    </article>
  );
}
