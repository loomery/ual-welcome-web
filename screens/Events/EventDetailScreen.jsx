'use client';

import Link from 'next/link';
import { EVENTS } from '../../data/events';
import { BUILDINGS } from '../../data/buildings';
import { VENUES } from '../../data/venues';
import { Button } from '../../components/Button/Button';
import { EventCard } from '../../components/EventCard/EventCard';
import { downloadIcs } from '../../utils/ics';
import { directionsUrl } from '../../utils/directions';
import { formatRange } from '../../utils/dates';
import { ArrowRightIcon, PinIcon, ExternalLinkIcon } from '../../components/Icon/NavIcons';

/**
 * Event detail page.
 *
 * Layout (top → bottom):
 *  - Back link
 *  - Eyebrow chip + title + date range
 *  - Where: address + abstract minimap + directions/map links
 *  - About: description
 *  - Calendar export
 *  - Related events (same college, excluding current)
 *
 * Visual language follows the rest of the app: prose flow + card + cluster
 * primitives, EventCard compact for the related strip, no shadow lifts.
 *
 * @param {Object} props
 * @param {string} props.id
 */
export function EventDetailScreen({ id }) {
  const event = EVENTS.find((e) => e.id === id);

  if (!event) {
    return (
      <article className="prose has-lead flow" data-flow="l">
        <div className="flow" data-flow="s">
          <h1>Event not found</h1>
          <p className="standfirst">We couldn&apos;t find that event.</p>
        </div>
        <Link href="/events" className="button" data-ghost-button="">
          Back to events
        </Link>
      </article>
    );
  }

  // Match event.college to a Building by name first; fall back to a Venue
  // for non-college spaces (e.g. Arts SU). Either gives us geo + address
  // for the directions link and the minimap.
  const building =
    BUILDINGS.find((b) => b.name === event.college) ??
    VENUES.find(
      (v) =>
        v.name === event.college ||
        event.location.toLowerCase().includes(v.college.toLowerCase()) ||
        event.location.toLowerCase().includes(v.name.toLowerCase()),
    );

  // Other events at the same college (or "All colleges" socials), excluding
  // this one. Sorted by start time so the next thing reads first.
  const related = EVENTS.filter((e) => e.id !== event.id)
    .filter((e) => e.college === event.college || e.college === 'All colleges')
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt))
    .slice(0, 3);

  return (
    <article className="prose has-lead flow" data-flow="l">
      <p>
        <Link href="/events">← Back to events</Link>
      </p>

      {/* Header: chip + title + date range */}
      <div className="flow" data-flow="s">
        <p className="event__meta">
          <span className="event-tag" data-category={event.category.toLowerCase()}>
            {event.category}
          </span>
        </p>
        <h1>{event.title}</h1>
        <p className="standfirst">
          <time dateTime={event.startsAt}>{formatRange(event.startsAt, event.endsAt, true)}</time>
        </p>
      </div>

      {/* Where — address + minimap + directions */}
      <section className="box flow" data-padding="l" data-flow="s" aria-labelledby="event-where">
        <h2 id="event-where" className="text-step-1">
          Where
        </h2>

        <div className="event-detail__where">
          <div className="flow" data-flow="2xs">
            <p>
              <strong>{event.location}</strong>
              <br />
              <span style={{ color: 'var(--color-medium)' }}>{event.college}</span>
              {building && (
                <>
                  <br />
                  <span style={{ color: 'var(--color-medium)' }}>{building.address}</span>
                </>
              )}
            </p>

            {building && (
              <div className="cluster" data-justify="flex-start">
                <a
                  href={directionsUrl(building)}
                  target="_blank"
                  rel="noreferrer"
                  className="event-detail__action"
                >
                  <PinIcon aria-hidden="true" width={16} height={16} />
                  Get directions
                  <ExternalLinkIcon aria-hidden="true" width={12} height={12} />
                  <span className="visually-hidden"> (opens in new tab)</span>
                </a>
                <Link href="/map" className="event-detail__action">
                  View on campus map
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            )}
          </div>

          {/* Abstract minimap — stylised, not interactive. Click jumps to
              the full /map. Uses lat/lng to visually offset the pin so
              different colleges feel different at a glance. */}
          {building && <Minimap building={building} />}
        </div>
      </section>

      {/* About */}
      <section className="flow" data-flow="s" aria-labelledby="event-about">
        <h2 id="event-about">About</h2>
        <p>{event.description}</p>
      </section>

      {/* Calendar */}
      <div className="cluster">
        <Button onClick={() => downloadIcs(event)}>
          Add to calendar
          <ArrowRightIcon aria-hidden="true" />
        </Button>
      </div>

      {/* Related events */}
      {related.length > 0 && (
        <section className="flow" data-flow="s" aria-labelledby="event-related">
          <div className="cluster" data-justify="space-between">
            <h2 id="event-related">More from {event.college}</h2>
            <Link className="home-section__cta" href="/events">
              See all events →
            </Link>
          </div>
          <div className="grid">
            {related.map((e) => (
              <EventCard key={e.id} event={e} compact />
            ))}
          </div>
        </section>
      )}

      {/* Local component styles. DS-token only. Migrate to globals.css
          when the design system migration lands. */}
      <style>{`
        .event-detail__where {
          align-items: stretch;
          display: grid;
          gap: var(--space-m);
          grid-template-columns: 1fr;
        }
        @media (min-width: 49.5rem) {
          .event-detail__where {
            grid-template-columns: 1fr auto;
          }
        }

        .event-detail__action {
          align-items: center;
          color: var(--color-dark);
          display: inline-flex;
          font-size: var(--step--1);
          font-weight: var(--font-weight-bold);
          gap: var(--space-3xs);
          min-height: 44px;
          text-decoration: underline;
          text-underline-offset: 4px;
        }
        .event-detail__action:hover,
        .event-detail__action:focus-visible {
          color: var(--color-orange);
        }
        .event-detail__action:focus-visible {
          outline: 2px solid var(--color-orange);
          outline-offset: 2px;
        }

        .event-minimap {
          aspect-ratio: 4 / 3;
          background: var(--color-shade);
          border: 1px solid var(--color-dark--tint-90);
          inline-size: 100%;
          max-inline-size: 14rem;
          overflow: hidden;
          position: relative;
        }
        @media (min-width: 49.5rem) {
          .event-minimap {
            max-inline-size: 18rem;
          }
        }
        .event-minimap svg {
          block-size: 100%;
          display: block;
          inline-size: 100%;
        }
        .event-minimap__grid line {
          stroke: var(--color-dark--tint-90);
          stroke-width: 0.5;
        }
        .event-minimap__pin-shadow {
          fill: var(--color-dark);
          opacity: 0.08;
        }
        .event-minimap__pin-stem {
          fill: var(--color-orange);
        }
        .event-minimap__pin-head {
          fill: var(--color-dark);
        }
        .event-minimap__label {
          background: var(--color-dark);
          color: var(--color-light);
          font-size: var(--step--1);
          font-weight: var(--font-weight-bold);
          inset-block-end: var(--space-2xs);
          inset-inline-start: var(--space-2xs);
          letter-spacing: 0.06em;
          padding: 0.2rem 0.4rem;
          position: absolute;
          text-transform: uppercase;
        }
      `}</style>
    </article>
  );
}

/**
 * Stylised minimap — not a real map. Renders a soft grid (suggests
 * cartography) with a pin positioned via the building's lat/lng. The
 * lat/lng is normalised over the bounding box of all UAL colleges +
 * known venues so each pin lands somewhere believable relative to the
 * others. Cheap to render, no third-party tiles, no API keys,
 * theme-respecting.
 */
function Minimap({ building }) {
  const allPlaces = [...BUILDINGS, ...VENUES];
  const lats = allPlaces.map((b) => b.geo.lat);
  const lngs = allPlaces.map((b) => b.geo.lng);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);

  // 8% padding so pins don't sit on the frame edge.
  const padX = 0.08;
  const padY = 0.08;

  // Map lat/lng → SVG % within the viewBox.
  // Latitude grows north → lower SVG y.
  const x = padX + (1 - 2 * padX) * ((building.geo.lng - minLng) / (maxLng - minLng || 1));
  const y = padY + (1 - 2 * padY) * (1 - (building.geo.lat - minLat) / (maxLat - minLat || 1));

  const px = x * 100;
  const py = y * 100;

  return (
    <div className="event-minimap" aria-hidden="true">
      <svg viewBox="0 0 100 75" preserveAspectRatio="xMidYMid slice">
        {/* Grid */}
        <g className="event-minimap__grid">
          <line x1="0" y1="15" x2="100" y2="15" />
          <line x1="0" y1="30" x2="100" y2="30" />
          <line x1="0" y1="45" x2="100" y2="45" />
          <line x1="0" y1="60" x2="100" y2="60" />
          <line x1="20" y1="0" x2="20" y2="75" />
          <line x1="40" y1="0" x2="40" y2="75" />
          <line x1="60" y1="0" x2="60" y2="75" />
          <line x1="80" y1="0" x2="80" y2="75" />
        </g>

        {/* Other place markers — small, subtle, for context */}
        {allPlaces
          .filter((b) => b.id !== building.id)
          .map((b) => {
            const ox = padX + (1 - 2 * padX) * ((b.geo.lng - minLng) / (maxLng - minLng || 1));
            const oy = padY + (1 - 2 * padY) * (1 - (b.geo.lat - minLat) / (maxLat - minLat || 1));
            return (
              <circle
                key={b.id}
                cx={ox * 100}
                cy={oy * 75}
                r="0.7"
                fill="var(--color-dark--tint-50)"
              />
            );
          })}

        {/* Pin shadow */}
        <ellipse
          className="event-minimap__pin-shadow"
          cx={px}
          cy={py * 0.75 + 0.6}
          rx="2.4"
          ry="0.6"
        />
        {/* Pin stem */}
        <path
          className="event-minimap__pin-stem"
          d={`M ${px} ${py * 0.75 - 6} L ${px - 1.4} ${py * 0.75} L ${px + 1.4} ${py * 0.75} Z`}
        />
        {/* Pin head */}
        <circle className="event-minimap__pin-head" cx={px} cy={py * 0.75 - 6} r="2" />
      </svg>
      <span className="event-minimap__label">{building.college}</span>
    </div>
  );
}
