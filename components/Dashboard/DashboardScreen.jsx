'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { Card } from '../Card/Card';
import { Countdown } from '../Countdown/Countdown';
import { EventCard } from '../EventCard/EventCard';
import { Progress } from '../Progress/Progress';
import { Button } from '../Button/Button';
import { CHECKLIST_ITEMS } from '../../data/checklist';
import { EVENTS } from '../../data/events';
import {
  COLLEGE_OPTIONS,
  INTEREST_OPTIONS,
  INTEREST_TO_CHECKLIST,
  INTEREST_TO_EVENT_CATEGORIES,
  STUDY_LEVEL_OPTIONS,
} from '../../data/onboardingOptions';
import { useOnboardingProfile } from '../../hooks/useOnboardingProfile';
import { usePersistedState } from '../../hooks/usePersistedState';

const CHECKLIST_STORAGE_KEY = 'ual:checklist:v1';

/**
 * Personalised dashboard.
 *
 * Visual language matches the rest of the app: typographic hero with
 * Countdown + h1 + standfirst (like Home), section pattern with
 * `<h2>` headings + cluster/grid/reel layouts, and shared components
 * (Card, EventCard, Progress, Button). Personalisation lives in the
 * data shown — events are filtered by college + interests, the
 * checklist is prioritised by interests, and the "next step" is the
 * first uncompleted task in that priority order.
 */
export function DashboardScreen() {
  const { profile, reset } = useOnboardingProfile();
  const [checked, setChecked] = usePersistedState(
    CHECKLIST_STORAGE_KEY,
    /** @type {Record<string, boolean>} */ ({}),
  );

  const college = useMemo(
    () => COLLEGE_OPTIONS.find((c) => c.id === profile?.collegeId),
    [profile?.collegeId],
  );

  const studyLevel = useMemo(
    () => STUDY_LEVEL_OPTIONS.find((s) => s.id === profile?.studyLevel),
    [profile?.studyLevel],
  );

  const interests = profile?.interests ?? [];

  const nextTask = useMemo(() => {
    const undone = CHECKLIST_ITEMS.filter((item) => !checked[item.id]);
    if (undone.length === 0) return null;
    if (undone.find((i) => i.id === 'enrol')) {
      return undone.find((i) => i.id === 'enrol');
    }
    const interestIds = interests.flatMap((i) => INTEREST_TO_CHECKLIST[i] ?? []).filter(Boolean);
    const matched = undone.find((i) => interestIds.includes(i.id));
    return matched ?? undone[0];
  }, [checked, interests]);

  // Show the full checklist in its natural order — must mirror /checklist
  // exactly so students see the same list in both places. The priority
  // logic still drives `nextTask` above, but the visible list is the
  // canonical one.
  const priorityChecklist = CHECKLIST_ITEMS;

  const totalTasks = CHECKLIST_ITEMS.length;
  const doneTasks = CHECKLIST_ITEMS.filter((i) => checked[i.id]).length;

  const personalisedEvents = useMemo(() => {
    const interestCats = new Set(interests.flatMap((i) => INTEREST_TO_EVENT_CATEGORIES[i] ?? []));
    const score = (event) => {
      let s = 0;
      if (event.college === college?.name || event.college === 'All colleges') s += 10;
      if (interestCats.has(event.category)) s += 5;
      // Prefer earlier events.
      s -= new Date(event.startsAt).getTime() / 1e13;
      return s;
    };
    return [...EVENTS].sort((a, b) => score(b) - score(a)).slice(0, 4);
  }, [college?.name, interests]);

  const firstName = (profile?.name ?? '').split(' ')[0] || 'there';

  function handleToggle(e) {
    const id = e.currentTarget.dataset.id;
    if (!id) return;
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function toggle(id) {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function handleReset() {
    if (typeof window === 'undefined') return;
    if (window.confirm('Reset your hub? This clears your answers from this device.')) {
      reset();
      window.location.assign('/onboarding');
    }
  }

  // Standfirst line: "{College} · {Level}" — concise context restated as
  // a sentence so the page reads as a personalised continuation of the
  // same content brief, not a separate "app shell".
  const standfirst = useMemo(() => {
    const parts = [];
    if (college) parts.push(college.name);
    if (studyLevel) parts.push(studyLevel.label.toLowerCase());
    if (profile?.studentType === 'returning') parts.push('returning student');
    return parts.length
      ? `${parts.join(' · ')}. Here's what's next for you this week.`
      : "Here's what's next for you this week.";
  }, [college, studyLevel, profile?.studentType]);

  return (
    <article className="flow" data-flow="l">
      {/* Hero — typographic, mirrors Home */}
      <section className="home-hero flow" data-flow="m" aria-labelledby="dash-greeting">
        <Countdown />
        <h1 id="dash-greeting" className="home-hero__title">
          Hi {firstName}.
        </h1>
        <p className="standfirst home-hero__lede">{standfirst}</p>
      </section>

      {/* Your next step — single highlighted task */}
      {nextTask && (
        <section className="flow" data-flow="s" aria-labelledby="dash-focus">
          <h2 id="dash-focus">Your next step</h2>
          <article className="flow card" data-flow="s">
            <h3>{nextTask.title}</h3>
            <p>{nextTask.body}</p>
            <div className="cluster" data-justify="flex-start">
              <a href={nextTask.cta.href} target="_blank" rel="noreferrer" className="button">
                {nextTask.cta.label}
              </a>
              <Button ghost onClick={() => toggle(nextTask.id)}>
                Mark done
              </Button>
            </div>
          </article>
        </section>
      )}

      {/* Checklist progress */}
      <section className="flow" data-flow="s" aria-labelledby="dash-checklist">
        <div className="cluster" data-justify="space-between">
          <h2 id="dash-checklist">Your checklist</h2>
          <Link className="home-section__cta" href="/checklist">
            See all →
          </Link>
        </div>
        <p>
          {doneTasks} of {totalTasks} done.
        </p>
        <Progress
          value={doneTasks}
          max={totalTasks}
          label={`Checklist progress: ${doneTasks} of ${totalTasks} complete`}
        />
        <ul className="flow" data-flow="2xs" role="list">
          {priorityChecklist.map((item) => {
            const isDone = Boolean(checked[item.id]);
            return (
              <li key={item.id}>
                <button
                  type="button"
                  data-id={item.id}
                  onClick={handleToggle}
                  aria-pressed={isDone}
                  className="dash-checklist-row"
                >
                  <span
                    className="dash-checklist-row__check"
                    data-checked={isDone || undefined}
                    aria-hidden="true"
                  >
                    {isDone && (
                      <svg
                        viewBox="0 0 12 12"
                        fill="none"
                        style={{ display: 'block', width: '0.625rem', height: '0.625rem' }}
                      >
                        <path
                          d="M2.5 6L5 8.5L9.5 4"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </span>
                  <span data-checked={isDone || undefined} className="dash-checklist-row__label">
                    {item.title}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      {/* For you this week — events as a horizontal reel, mirrors Home */}
      {personalisedEvents.length > 0 && (
        <section className="flow" data-flow="s" aria-labelledby="dash-events">
          <div className="cluster" data-justify="space-between">
            <h2 id="dash-events">For you this week</h2>
            <Link className="home-section__cta" href="/events">
              See all events →
            </Link>
          </div>
          <div className="reel home-reel" role="list">
            {personalisedEvents.map((event) => (
              <div role="listitem" key={event.id}>
                <EventCard event={event} compact />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Jump in — quick actions as a card grid, mirrors Home "Start here" */}
      <section className="flow" data-flow="s" aria-labelledby="dash-quick">
        <h2 id="dash-quick">Jump in</h2>
        <div className="grid">
          <Card
            title="Find your campus"
            to="/map"
            body={<p>{college ? `Open ${college.short} on the 3D map.` : 'Explore UAL in 3D.'}</p>}
          />
          <Card
            title="Your timetable"
            external="https://www.arts.ac.uk/students/student-timetables"
            body={<p>Check when and where your classes start.</p>}
          />
          <Card
            title="Student Services"
            external="https://www.arts.ac.uk/students/student-services"
            body={<p>Wellbeing, funding, and academic support.</p>}
          />
          <Card
            title="Full checklist"
            to="/checklist"
            body={<p>Every induction task, with progress saved on this device.</p>}
          />
        </div>
      </section>

      {/* Interests recap — only if any chosen */}
      {interests.length > 0 && (
        <section className="flow" data-flow="s" aria-labelledby="dash-interests">
          <h2 id="dash-interests">Your interests</h2>
          <p className="cluster" data-justify="flex-start">
            {interests.map((id) => {
              const opt = INTEREST_OPTIONS.find((o) => o.id === id);
              if (!opt) return null;
              return (
                <span key={id} className="tag" data-tag-type="standard">
                  {opt.emoji} {opt.label}
                </span>
              );
            })}
          </p>
        </section>
      )}

      {/* Profile footer — discreet, matches Footer voice */}
      <section className="flow" data-flow="2xs" aria-label="Profile">
        <p>
          <span className="step--1">Saved on this device. </span>
          <button type="button" onClick={handleReset} className="link-button">
            Edit your answers
          </button>
        </p>
      </section>

      {/* Local styles — small additions only. Migrate to globals.css when
          the design system tokens are agreed. */}
      <style>{`
        .dash-checklist-row {
          display: flex;
          align-items: center;
          gap: var(--space-xs);
          inline-size: 100%;
          padding: var(--space-2xs) var(--space-xs);
          background: transparent;
          border: 0;
          border-radius: var(--space-2xs);
          color: inherit;
          font: inherit;
          text-align: start;
          cursor: pointer;
        }
        .dash-checklist-row:hover,
        .dash-checklist-row:focus-visible {
          background: var(--color-shade);
        }
        .dash-checklist-row:focus-visible {
          outline: 2px solid var(--color-orange);
          outline-offset: 2px;
        }
        .dash-checklist-row__check {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          inline-size: 1.125rem;
          block-size: 1.125rem;
          border-radius: 999px;
          border: 2px solid var(--color-dark--tint-50);
          flex-shrink: 0;
        }
        .dash-checklist-row__check[data-checked] {
          background: var(--color-orange);
          border-color: var(--color-orange);
          /* Always white on orange — orange is brand-fixed across themes,
             so we can't rely on var(--color-light) which flips in dark. */
          color: #fff;
        }
        .dash-checklist-row__label {
          font-weight: var(--font-weight-bold);
        }
        .dash-checklist-row__label[data-checked] {
          text-decoration: line-through;
          color: var(--color-dark--tint-50);
          font-weight: var(--font-weight-normal);
        }
        .link-button {
          background: transparent;
          border: 0;
          padding: 0;
          color: var(--color-dark);
          font: inherit;
          text-decoration: underline;
          text-underline-offset: 4px;
          cursor: pointer;
        }
        .link-button:hover,
        .link-button:focus-visible {
          color: var(--color-orange);
        }
      `}</style>
    </article>
  );
}
