'use client';

import Link from 'next/link';
import { EVENTS } from '../../data/events';
import { Button } from '../../components/Button/Button';
import { downloadIcs } from '../../utils/ics';
import { formatRange } from '../../utils/dates';
import { ArrowRightIcon } from '../../components/Icon/NavIcons';

/**
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
          <p className="standfirst">We couldn’t find that event.</p>
        </div>
        <Link href="/events" className="button" data-ghost-button="">
          Back to events
        </Link>
      </article>
    );
  }

  return (
    <article className="prose has-lead flow" data-flow="l">
      <p>
        <Link href="/events">← Back to events</Link>
      </p>

      <div className="flow" data-flow="s">
        <p className="event__meta">
          {/* Same chip as the card on the events list — shares .event-tag
              so a "Talk" event reads identically here and on the listing. */}
          <span className="event-tag" data-category={event.category.toLowerCase()}>
            {event.category}
          </span>
        </p>
        <h1>{event.title}</h1>
        <p className="standfirst">
          <time dateTime={event.startsAt}>{formatRange(event.startsAt, event.endsAt, true)}</time>
        </p>
      </div>

      <section className="box flow" data-padding="l" data-flow="s" aria-labelledby="event-where">
        <h2 id="event-where" style={{ fontSize: 'var(--step-1)' }}>
          Where
        </h2>
        <p>
          {event.location}
          <br />
          {event.college}
        </p>
      </section>

      <section className="flow" data-flow="s" aria-labelledby="event-about">
        <h2 id="event-about">About</h2>
        <p>{event.description}</p>
      </section>

      <div className="cluster">
        <Button onClick={() => downloadIcs(event)}>
          Add to calendar
          <ArrowRightIcon aria-hidden="true" />
        </Button>
      </div>
    </article>
  );
}
