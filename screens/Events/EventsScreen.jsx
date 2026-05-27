'use client';

import { useMemo, useState } from 'react';
import { EVENTS } from '../../data/events';
import { COLLEGE_OPTIONS } from '../../data/onboardingOptions';
import { EventCard } from '../../components/EventCard/EventCard';
import { HeartIcon } from '../../components/Icon/NavIcons';
import { CampusFilter } from '../../components/CampusFilter/CampusFilter';
import { useEventFavourites } from '../../hooks/useEventFavourites';
import { useOnboardingProfile } from '../../hooks/useOnboardingProfile';
import { downloadIcsBulk } from '../../utils/ics';

/** @type {Array<import('../../data/events').EventCategory | 'All'>} */
const CATEGORIES = ['All', 'Talk', 'Tour', 'Social', 'Workshop'];

/** Catch-all college tag — events tagged this way apply to every campus
 *  and should remain visible regardless of which campuses the student
 *  has selected. Matches the value used in data/events.js. */
const ALL_CAMPUSES_TAG = 'All colleges';

/**
 * Events index screen.
 *
 * On first load the campus filter is pre-seeded with the student's own
 * college (from their onboarding profile) so they immediately see
 * relevant events. They can clear or change the filter at any time.
 *
 * Two additional layered filters:
 *  - "Saved" pill (top): when on, only show favourited events. Renders
 *    a bottom-anchored "Add events to calendar" CTA for bulk .ics export.
 *  - Category row: All / Talk / Tour / Social / Workshop.
 */
export function EventsScreen() {
  const { favourites, hydrated: favHydrated } = useEventFavourites();
  const { profile, hydrated: profileHydrated } = useOnboardingProfile();
  const [savedOnly, setSavedOnly] = useState(false);
  const [category, setCategory] = useState(
    /** @type {import('../../data/events').EventCategory | 'All'} */ ('All'),
  );
  // undefined = user hasn't touched the filter yet → fall back to profile college.
  // Once the user interacts, this becomes a string[] they fully control.
  const [userCampuses, setUserCampuses] = useState(/** @type {string[] | undefined} */ (undefined));

  const sorted = useMemo(
    () => [...EVENTS].sort((a, b) => a.startsAt.localeCompare(b.startsAt)),
    [],
  );

  // Build the campus picker options from colleges that actually appear
  // in the events dataset, sorted alphabetically.
  const campusOptions = useMemo(() => {
    const present = new Set(EVENTS.map((e) => e.college));
    return COLLEGE_OPTIONS.filter((c) => present.has(c.name)).sort((a, b) =>
      a.name.localeCompare(b.name),
    );
  }, []);

  const college = useMemo(
    () => COLLEGE_OPTIONS.find((c) => c.id === profile?.collegeId) ?? null,
    [profile?.collegeId],
  );

  // Derive the active campus list: use the user's explicit selection if
  // they've touched the filter, otherwise pre-seed from the profile college
  // once it has loaded. Falls back to [] (show all) if no profile.
  const campuses = useMemo(() => {
    if (userCampuses !== undefined) return userCampuses;
    if (profileHydrated && college) return [college.name];
    return [];
  }, [userCampuses, profileHydrated, college]);

  const savedSet = useMemo(() => new Set(favourites), [favourites]);
  const campusSet = useMemo(() => new Set(campuses), [campuses]);

  const visible = useMemo(() => {
    let list = sorted;
    if (savedOnly) list = list.filter((e) => savedSet.has(e.id));
    if (category !== 'All') list = list.filter((e) => e.category === category);
    // Campus filter — always include "All colleges" events alongside
    // the selected campuses since they're institution-wide.
    if (campuses.length > 0) {
      list = list.filter((e) => e.college === ALL_CAMPUSES_TAG || campusSet.has(e.college));
    }
    return list;
  }, [sorted, savedOnly, savedSet, category, campuses, campusSet]);

  // Always export the full saved list regardless of active category filter.
  const savedEvents = useMemo(() => sorted.filter((e) => savedSet.has(e.id)), [sorted, savedSet]);

  function handleDownload() {
    downloadIcsBulk(savedEvents);
  }

  return (
    <article className="prose has-lead flow" data-flow="l">
      <div className="flow" data-flow="s">
        <h1>Plan your events</h1>
        <p className="standfirst">
          {college
            ? `Welcome week events for ${college.name} and across UAL — tours, talks, workshops and socials.`
            : 'Welcome week events across all UAL colleges — tours, talks, workshops and socials.'}
        </p>
      </div>

      {/* "Saved" toggle — independent from the category row */}
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
          {favHydrated && favourites.length > 0 && (
            <span className="events-saved-toggle__count" aria-label={`${favourites.length} saved`}>
              {favourites.length}
            </span>
          )}
        </button>
      </div>

      <div className="cluster" role="group" aria-label="Filter events">
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

        <CampusFilter campuses={campusOptions} selected={campuses} onChange={setUserCampuses} />
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
        <ul className="event-list" role="list">
          {visible.map((event) => (
            <li key={event.id}>
              <EventCard event={event} />
            </li>
          ))}
        </ul>
      )}

      {/* Bulk export — only shown in Saved view when there are saved events */}
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
