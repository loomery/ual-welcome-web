'use client';

import { useMemo, useState } from 'react';
import { EVENTS } from '../../data/events';
import { EventCard } from '../../components/EventCard/EventCard';
import { HeartIcon } from '../../components/Icon/NavIcons';
import { useEventFavourites } from '../../hooks/useEventFavourites';
import { downloadIcsBulk } from '../../utils/ics';

/** @type {Array<import('../../data/events').EventCategory | 'All'>} */
const CATEGORIES = ['All', 'Talk', 'Tour', 'Social', 'Workshop'];

/**
 * Events index screen.
 *
 * Two layered filters:
 *  - "Saved" pill (top): when on, only show events the student has
 *    favourited. Renders a bottom-anchored "Add events to calendar" CTA
 *    that bulk-downloads the saved list as an .ics file.
 *  - Category row: All / Talk / Tour / Social / Workshop. Applied after
 *    Saved so a student can narrow their saved list by category too.
 *
 * Heart state is driven by useEventFavourites (persisted in localStorage)
 * and the cards toggle their own state — this screen just consumes the
 * read side via `favourites`.
 */
export function EventsScreen() {
  const { favourites, hydrated } = useEventFavourites();
  const [savedOnly, setSavedOnly] = useState(false);
  const [category, setCategory] = useState(
    /** @type {import('../../data/events').EventCategory | 'All'} */ ('All'),
  );

  const sorted = useMemo(
    () => [...EVENTS].sort((a, b) => a.startsAt.localeCompare(b.startsAt)),
    [],
  );

  const savedSet = useMemo(() => new Set(favourites), [favourites]);

  const visible = useMemo(() => {
    let list = sorted;
    if (savedOnly) list = list.filter((e) => savedSet.has(e.id));
    if (category !== 'All') list = list.filter((e) => e.category === category);
    return list;
  }, [sorted, savedOnly, savedSet, category]);

  // Events to hand to the calendar export — always the full saved list,
  // regardless of the category filter, so students don't accidentally
  // export a subset of what they thought they'd saved.
  const savedEvents = useMemo(() => sorted.filter((e) => savedSet.has(e.id)), [sorted, savedSet]);

  function handleDownload() {
    downloadIcsBulk(savedEvents);
  }

  return (
    <article className="prose has-lead flow" data-flow="l">
      <div className="flow" data-flow="s">
        <h1>Plan your events</h1>
        <p className="standfirst">
          A running list of what’s on for new students — tours, talks, workshops and socials across
          the six UAL colleges.
        </p>
      </div>

      {/* "Saved" toggle — independent from the category row so students can
          combine "saved + workshops" etc. */}
      <div>
        <button
          type="button"
          className="events-saved-toggle"
          aria-pressed={savedOnly}
          data-active={savedOnly || undefined}
          onClick={() => setSavedOnly((v) => !v)}
        >
          <HeartIcon
            filled={savedOnly}
            aria-hidden="true"
            width={16}
            height={16}
            className="events-saved-toggle__icon"
          />
          <span>Saved</span>
          {hydrated && favourites.length > 0 && (
            <span className="events-saved-toggle__count" aria-label={`${favourites.length} saved`}>
              {favourites.length}
            </span>
          )}
        </button>
      </div>

      <div className="cluster" role="group" aria-label="Filter events by category">
        {CATEGORIES.map((cat) => {
          const active = category === cat;
          return (
            <button
              key={cat}
              type="button"
              className="button"
              data-ghost-button={active ? undefined : ''}
              aria-pressed={active}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {visible.length === 0 ? (
        <div className="box" data-padding="l">
          <p>
            {savedOnly
              ? 'No saved events yet. Tap the heart on any event to save it here.'
              : 'No events match this filter yet.'}
          </p>
        </div>
      ) : (
        <ul className="grid" role="list">
          {visible.map((event) => (
            <li key={event.id}>
              <EventCard event={event} />
            </li>
          ))}
        </ul>
      )}

      {/* Bulk export — only meaningful in the Saved view and only when
          there's anything to export. Sits at the bottom of the list,
          matching the Figma "events saved" frame. */}
      {savedOnly && savedEvents.length > 0 && (
        <div className="events-bulk-export">
          <button type="button" className="button events-bulk-export__cta" onClick={handleDownload}>
            Add events to calendar
          </button>
        </div>
      )}
    </article>
  );
}
