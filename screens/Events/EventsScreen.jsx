'use client';

import { useMemo, useState } from 'react';
import { EVENTS } from '../../data/events';
import { EventCard } from '../../components/EventCard/EventCard';

/** @type {Array<import('../../data/events').EventCategory | 'All'>} */
const CATEGORIES = ['All', 'Talk', 'Tour', 'Social', 'Workshop'];

export function EventsScreen() {
  const [filter, setFilter] = useState(/** @type {import('../../data/events').EventCategory | 'All'} */ ('All'));

  const sorted = useMemo(
    () => [...EVENTS].sort((a, b) => a.startsAt.localeCompare(b.startsAt)),
    []
  );

  const filtered = filter === 'All' ? sorted : sorted.filter((e) => e.category === filter);

  return (
    <article className="prose has-lead flow" data-flow="l">
      <div className="flow" data-flow="s">
        <h1>Welcome Week events</h1>
        <p className="standfirst">
          A running list of what’s on for new students — tours, talks, workshops and socials
          across the six UAL colleges.
        </p>
      </div>

      <div
        className="cluster"
        role="group"
        aria-label="Filter events by category"
      >
        {CATEGORIES.map((cat) => {
          const active = filter === cat;
          return (
            <button
              key={cat}
              type="button"
              className="button"
              data-ghost-button={active ? undefined : ''}
              aria-pressed={active}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="box" data-padding="l">
          <p>No events match this filter yet.</p>
        </div>
      ) : (
        <ul className="grid" role="list">
          {filtered.map((event) => (
            <li key={event.id}>
              <EventCard event={event} />
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
