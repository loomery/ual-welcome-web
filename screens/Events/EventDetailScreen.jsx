'use client';

import Link from 'next/link';
import { EVENTS } from '../../data/events';
import { BUILDINGS } from '../../data/buildings';
import { VENUES } from '../../data/venues';
import { Button } from '../../components/Button/Button';
import { EventCard } from '../../components/EventCard/EventCard';
import { downloadIcs } from '../../utils/ics';
import { LONG_DATE_FMT, TIME_FMT } from '../../utils/dates';

/** Shared category-tag chip classes — mirrors `.event-tag` + per-category
 *  tint so the label reads identically to EventCard. */
const TAG_TINTS = {
  talk: 'bg-[#d6e7d0]',
  tour: 'bg-[#cfe0ec]',
  social: 'bg-[#f5d6c3]',
  workshop: 'bg-[#f0e2b6]',
};
function eventTagClasses(category) {
  const tint = TAG_TINTS[category] ?? 'bg-ual-dark-90';
  return `w-fit ${tint} px-2 py-1 text-step-d1/ual-single font-ual-bold uppercase tracking-[0.06em] text-ual-dark`;
}

/**
 * Event detail page.
 *
 * Layout:
 *  - Back link
 *  - Category tag + title
 *  - Date / Time / Location sections with labels
 *  - Get directions (Citymapper, Google Maps, Apple Maps)
 *  - About event
 *  - What do I need to bring?
 *  - View more CTA + Add to calendar
 *  - Related events
 *
 * @param {{ id: string }} props
 */
export function EventDetailScreen({ id }) {
  const event = EVENTS.find((e) => e.id === id);

  if (!event) {
    return (
      <article>
        <h1>Event not found</h1>
        <Button href="/events" variant="ghost" className="mt-8">
          ← Back to events
        </Button>
      </article>
    );
  }

  const building =
    BUILDINGS.find((b) => b.name === event.college) ??
    VENUES.find(
      (v) =>
        v.name === event.college ||
        event.location.toLowerCase().includes(v.college?.toLowerCase() ?? '') ||
        event.location.toLowerCase().includes(v.name.toLowerCase()),
    );

  const related = EVENTS.filter((e) => e.id !== event.id)
    .filter((e) => e.college === event.college || e.college === 'All colleges')
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt))
    .slice(0, 3);

  const start = new Date(event.startsAt);
  const end = new Date(event.endsAt);
  const dateStr = LONG_DATE_FMT.format(start);
  const timeStr = `${TIME_FMT.format(start)} – ${TIME_FMT.format(end)}`;

  // Directions URLs
  const geo = building?.geo;
  const encodedLocation = encodeURIComponent(event.location);
  const encodedGeo = geo ? `${geo.lat},${geo.lng}` : encodedLocation;
  // Citymapper web URL — endcoord must use a literal comma (not %2C).
  const citymapperUrl = geo
    ? `https://citymapper.com/directions?endcoord=${geo.lat},${geo.lng}&endname=${encodedLocation}`
    : `https://citymapper.com/directions?endaddress=${encodedLocation}`;
  const googleUrl = `https://www.google.com/maps/search/?api=1&query=${encodedGeo}`;
  const appleUrl = geo
    ? `https://maps.apple.com/?ll=${geo.lat},${geo.lng}&q=${encodedLocation}`
    : `https://maps.apple.com/?q=${encodedLocation}`;

  return (
    <article>
      <Link
        href="/events"
        className="text-step-d1 text-ual-dark no-underline hover:text-ual-orange focus-visible:text-ual-orange focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ual-orange"
      >
        ← Back to events
      </Link>

      {/* Category + title */}
      <div className="mt-8 space-y-4">
        <span className={eventTagClasses(event.category.toLowerCase())}>{event.category}</span>
        <h1>{event.title}</h1>
      </div>

      {/* Date / Time / Location */}
      <section className="mt-8 space-y-4" aria-label="Event details">
        <dl className="flex flex-col gap-4">
          <div className="grid grid-cols-[6rem_1fr] gap-3">
            <dt className="text-step-0 font-ual-bold">Date</dt>
            <dd className="m-0 text-step-0">
              <time dateTime={event.startsAt}>{dateStr}</time>
            </dd>
          </div>
          <div className="grid grid-cols-[6rem_1fr] gap-3">
            <dt className="text-step-0 font-ual-bold">Time</dt>
            <dd className="m-0 text-step-0">{timeStr}</dd>
          </div>
          <div className="grid grid-cols-[6rem_1fr] gap-3">
            <dt className="text-step-0 font-ual-bold">Location</dt>
            <dd className="m-0 text-step-0">{event.location}</dd>
          </div>
        </dl>
      </section>

      {/* Get directions */}
      <section className="mt-8 space-y-2" aria-labelledby="directions-heading">
        <h2 id="directions-heading">Get directions</h2>
        <div className="flex flex-wrap items-center gap-4">
          <Button href={citymapperUrl} target="_blank" rel="noreferrer" size="sm">
            Citymapper
          </Button>
          <Button href={googleUrl} target="_blank" rel="noreferrer" size="sm">
            Google Maps
          </Button>
          <Button href={appleUrl} target="_blank" rel="noreferrer" size="sm">
            Apple Maps
          </Button>
        </div>
      </section>

      {/* About event */}
      <section className="mt-8 space-y-2" aria-labelledby="about-heading">
        <h2 id="about-heading">About event</h2>
        <p>{event.description}</p>
      </section>

      {/* What do I need to bring? */}
      {event.whatToBring && (
        <section className="mt-8 space-y-2" aria-labelledby="bring-heading">
          <h2 id="bring-heading">What do I need to bring?</h2>
          <p>{event.whatToBring}</p>
        </section>
      )}

      {/* CTAs */}
      <div className="mt-8 space-y-2">
        {event.externalUrl && (
          <Button href={event.externalUrl} target="_blank" rel="noreferrer">
            View more about this event →<span className="sr-only"> (opens in a new tab)</span>
          </Button>
        )}
        <Button variant="ghost" onClick={() => downloadIcs(event)}>
          Add to calendar
        </Button>
      </div>

      {/* Related events — full cards so the description helps users decide
          whether to attend. The compact variant is designed for horizontal
          reels (fixed 18 rem width); in a grid it leaves awkward whitespace.
          A hairline separator + extra block-start breathing room gives the
          section a clear visual break from the main article content. */}
      {related.length > 0 && (
        <section
          className="mt-8 space-y-4 border-t border-ual-dark-90 pt-8"
          aria-labelledby="related-heading"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Scaled one step down from the default h2 — supplementary content. */}
            <h2 id="related-heading" className="text-step-1">
              More from {event.college}
            </h2>
            <Link
              className="text-step-d1 font-ual-bold no-underline hover:underline focus-visible:underline"
              href="/events"
            >
              See all →
            </Link>
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(250px,100%),1fr))] gap-(--grid-gutter)">
            {related.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
