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

  const className = compact ? 'event-card event-card--compact' : 'event-card';

  // data-category drives per-category tint on the tag chip — it mirrors
  // UAL's editorial palette (sage / peach / sand / sky) while keeping text
  // legible in a single dark ink.
  const categorySlug = event.category.toLowerCase();

  // Don't render a pressed state until the favourites list has hydrated
  // from localStorage — otherwise the heart flashes outlined → filled on
  // first paint of a saved event.
  const saved = hydrated && isFavourite(event.id);

  return (
    <article className={className}>
      <Link href={`/events/${event.id}`} className="event-card__link flow" data-flow="s">
        <header className="event-card__head">
          <time
            className="event-card__datestamp"
            dateTime={event.startsAt}
            aria-label={accessibleDate}
          >
            <span className="event-card__day" aria-hidden="true">
              {day}
            </span>
            <span className="event-card__month" aria-hidden="true">
              {month}
            </span>
          </time>

          <div className="event-card__heading flow" data-flow="2xs">
            <p className="event-card__meta">
              <span className="event-tag" data-category={categorySlug}>
                {event.category}
              </span>
              <span className="event-card__when">
                {weekday} · {timeRange}
              </span>
            </p>
            <h3 className="event-card__title">{event.title}</h3>
          </div>
        </header>

        {!compact && <p className="event-card__body">{event.description}</p>}

        <p className="event-card__foot">
          <PinIcon aria-hidden="true" width={16} height={16} className="event-card__foot-icon" />
          <span>
            {event.location} · {event.college}
          </span>
        </p>
      </Link>

      {!compact && (
        <button
          type="button"
          className="event-card__favourite"
          onClick={() => toggle(event.id)}
          aria-pressed={saved}
          aria-label={saved ? `Remove ${event.title} from saved events` : `Save ${event.title}`}
          data-saved={saved || undefined}
        >
          <HeartIcon
            filled={saved}
            aria-hidden="true"
            width={20}
            height={20}
            className="event-card__favourite-icon"
          />
        </button>
      )}
    </article>
  );
}
