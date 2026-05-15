'use client';

import Link from 'next/link';
import { EVENTS } from '../../data/events';
import { BUILDINGS } from '../../data/buildings';
import { VENUES } from '../../data/venues';
import { Button } from '../../components/Button/Button';
import { EventCard } from '../../components/EventCard/EventCard';
import { downloadIcs } from '../../utils/ics';
import { LONG_DATE_FMT, TIME_FMT } from '../../utils/dates';

/**
 * Event detail page — matches the Figma "15 Event Detail" frame.
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
      <article className="prose has-lead flow" data-flow="l">
        <h1>Event not found</h1>
        <Link href="/events" className="button" data-ghost-button="">
          ← Back to events
        </Link>
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
  const citymapperUrl = geo
    ? `https://citymapper.com/directions?endcoord=${geo.lat}%2C${geo.lng}&endname=${encodedLocation}`
    : `https://citymapper.com/directions?endaddress=${encodedLocation}`;
  const googleUrl = `https://www.google.com/maps/search/?api=1&query=${encodedGeo}`;
  const appleUrl = geo
    ? `https://maps.apple.com/?ll=${geo.lat},${geo.lng}&q=${encodedLocation}`
    : `https://maps.apple.com/?q=${encodedLocation}`;

  return (
    <article className="flow event-detail-page" data-flow="l">
      <Link href="/events" className="event-detail__back">
        ← Back to events
      </Link>

      {/* Category + title */}
      <div className="flow" data-flow="s">
        <span className="event-tag" data-category={event.category.toLowerCase()}>
          {event.category}
        </span>
        <h1>{event.title}</h1>
      </div>

      {/* Date / Time / Location */}
      <section className="flow" data-flow="s" aria-label="Event details">
        <dl className="event-detail__dl">
          <div className="event-detail__dl-row">
            <dt>Date</dt>
            <dd>
              <time dateTime={event.startsAt}>{dateStr}</time>
            </dd>
          </div>
          <div className="event-detail__dl-row">
            <dt>Time</dt>
            <dd>{timeStr}</dd>
          </div>
          <div className="event-detail__dl-row">
            <dt>Location</dt>
            <dd>{event.location}</dd>
          </div>
        </dl>
      </section>

      {/* Get directions */}
      <section className="flow" data-flow="2xs" aria-labelledby="directions-heading">
        <h2 id="directions-heading">Get directions</h2>
        <div className="cluster" data-justify="flex-start">
          <a
            href={citymapperUrl}
            target="_blank"
            rel="noreferrer"
            className="button event-detail__dir-btn"
          >
            Citymapper
          </a>
          <a
            href={googleUrl}
            target="_blank"
            rel="noreferrer"
            className="button event-detail__dir-btn"
          >
            Google Maps
          </a>
          <a
            href={appleUrl}
            target="_blank"
            rel="noreferrer"
            className="button event-detail__dir-btn"
          >
            Apple Maps
          </a>
        </div>
      </section>

      {/* About event */}
      <section className="flow" data-flow="2xs" aria-labelledby="about-heading">
        <h2 id="about-heading">About event</h2>
        <p>{event.description}</p>
      </section>

      {/* What do I need to bring? */}
      {event.whatToBring && (
        <section className="flow" data-flow="2xs" aria-labelledby="bring-heading">
          <h2 id="bring-heading">What do I need to bring?</h2>
          <p>{event.whatToBring}</p>
        </section>
      )}

      {/* CTAs */}
      <div className="flow" data-flow="2xs">
        {event.externalUrl && (
          <a
            href={event.externalUrl}
            target="_blank"
            rel="noreferrer"
            className="button event-detail__cta"
          >
            View more about this event →
            <span className="visually-hidden"> (opens in a new tab)</span>
          </a>
        )}
        <Button ghost onClick={() => downloadIcs(event)}>
          Add to calendar
        </Button>
      </div>

      {/* Related events */}
      {related.length > 0 && (
        <section className="flow" data-flow="s" aria-labelledby="related-heading">
          <div className="cluster" data-justify="space-between">
            <h2 id="related-heading">More from {event.college}</h2>
            <Link className="home-section__cta" href="/events">
              See all →
            </Link>
          </div>
          <div className="grid">
            {related.map((e) => (
              <EventCard key={e.id} event={e} compact />
            ))}
          </div>
        </section>
      )}

      <style>{`
        .event-detail__back {
          color: var(--color-dark);
          font-size: var(--step--1);
          text-decoration: none;
        }
        .event-detail__back:hover,
        .event-detail__back:focus-visible {
          color: var(--color-orange);
        }
        .event-detail__back:focus-visible {
          outline: 2px solid var(--color-orange);
          outline-offset: 2px;
        }

        .event-detail__dl {
          display: flex;
          flex-direction: column;
          gap: var(--space-s);
        }
        .event-detail__dl-row {
          display: grid;
          grid-template-columns: 6rem 1fr;
          gap: var(--space-xs);
        }
        .event-detail__dl-row dt {
          font-weight: var(--font-weight-bold);
          font-size: var(--step-0);
        }
        .event-detail__dl-row dd {
          margin: 0;
          font-size: var(--step-0);
        }

        .event-detail__dir-btn {
          font-size: var(--step--1);
          padding: var(--space-2xs) var(--space-s);
        }

        .event-detail__cta {
          display: inline-flex;
          width: 100%;
          justify-content: center;
        }
      `}</style>
    </article>
  );
}
