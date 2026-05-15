'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { Card } from '../Card/Card';
import { Countdown } from '../Countdown/Countdown';
import { EventCard } from '../EventCard/EventCard';
import { Progress } from '../Progress/Progress';
import { TASKS } from '../../data/checklist';
import { EVENTS } from '../../data/events';
import {
  COLLEGE_OPTIONS,
  INTEREST_TO_EVENT_CATEGORIES,
  STUDY_LEVEL_OPTIONS,
  YEAR_OPTIONS,
} from '../../data/onboardingOptions';
import { useOnboardingProfile } from '../../hooks/useOnboardingProfile';
import { usePersistedState } from '../../hooks/usePersistedState';

/**
 * Definitions for interest-driven optional sections.
 * Each entry maps an interest id to a section label and a render function.
 * Order here determines render order on the dashboard.
 */
const OPTIONAL_SECTIONS = [
  { id: 'social', label: 'Social' },
  { id: 'creative', label: 'Workshops & studios' },
  { id: 'study', label: 'Study skills' },
  { id: 'wellbeing', label: 'Wellbeing' },
  { id: 'career', label: 'Jobs & opportunities' },
  { id: 'area', label: 'Area guide' },
  { id: 'tech', label: 'Tech setup' },
];

/**
 * Personalised dashboard.
 *
 * Mandatory sections (always visible in both "My focus" and "Everything"):
 *   Hero, Your next step, Checklist.
 *
 * Optional sections are interest-driven:
 *   - "My focus": shows only sections matching the student's selected interests.
 *     If no interests were chosen, only mandatory sections are shown.
 *   - "Everything": shows all optional sections regardless of interests.
 *
 * The toggle state is persisted so a page refresh keeps the last choice.
 */
export function DashboardScreen() {
  const { profile, reset } = useOnboardingProfile();
  const [taskStatuses] = usePersistedState('ual:task:status:v1', {});
  const [view, setView] = usePersistedState(
    'ual:dash:view:v1',
    /** @type {'focus'|'all'} */ ('focus'),
  );

  const college = useMemo(
    () => COLLEGE_OPTIONS.find((c) => c.id === profile?.collegeId),
    [profile?.collegeId],
  );

  const studyLevel = useMemo(
    () => STUDY_LEVEL_OPTIONS.find((s) => s.id === profile?.studyLevel),
    [profile?.studyLevel],
  );

  const year = useMemo(() => YEAR_OPTIONS.find((y) => y.id === profile?.year), [profile?.year]);

  const interests = useMemo(() => profile?.interests ?? [], [profile?.interests]);

  // Which optional sections to show depends on view mode and selected interests.
  const visibleSections = useMemo(() => {
    if (view === 'all') return OPTIONAL_SECTIONS;
    if (interests.length === 0) return []; // My focus, no interests → only mandatory
    return OPTIONAL_SECTIONS.filter((s) => interests.includes(s.id));
  }, [view, interests]);

  // Events filtered per section interest
  const eventsByInterest = useMemo(() => {
    const map = {};
    for (const section of OPTIONAL_SECTIONS) {
      const cats = new Set(INTEREST_TO_EVENT_CATEGORIES[section.id] ?? []);
      map[section.id] = EVENTS.filter(
        (e) =>
          cats.has(e.category) && (e.college === college?.name || e.college === 'All colleges'),
      ).slice(0, 3);
    }
    return map;
  }, [college?.name]);

  const nextTask = useMemo(() => {
    // Find first task that isn't complete yet
    const incomplete = TASKS.find((t) => taskStatuses[t.id] !== 'complete');
    return incomplete ?? null;
  }, [taskStatuses]);

  const totalTasks = TASKS.length;
  const doneTasks = TASKS.filter((t) => taskStatuses[t.id] === 'complete').length;

  const firstName = (profile?.name ?? '').split(' ')[0] || 'there';

  const standfirst = useMemo(() => {
    const parts = [];
    if (college) parts.push(college.name);
    if (studyLevel) parts.push(studyLevel.label.toLowerCase());
    if (year) parts.push(year.label.toLowerCase());
    return parts.length
      ? `${parts.join(' · ')}. Here's what's next for you this week.`
      : "Here's what's next for you this week.";
  }, [college, studyLevel, year]);

  function handleReset() {
    if (typeof window === 'undefined') return;
    if (window.confirm('Reset your hub? This clears your answers from this device.')) {
      reset();
      window.location.assign('/onboarding');
    }
  }

  return (
    <article className="flow" data-flow="l">
      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="home-hero flow" data-flow="m" aria-labelledby="dash-greeting">
        <Countdown />
        <h1 id="dash-greeting" className="home-hero__title">
          Hi {firstName}.
        </h1>
        <p className="standfirst home-hero__lede">{standfirst}</p>
      </section>

      {/* ── VIEW TOGGLE ──────────────────────────────────────────── */}
      <div className="dash-toggle" role="group" aria-label="Dashboard view">
        <button
          type="button"
          className="dash-toggle__btn"
          data-active={view === 'focus' || undefined}
          onClick={() => setView('focus')}
          aria-pressed={view === 'focus'}
        >
          My focus
        </button>
        <button
          type="button"
          className="dash-toggle__btn"
          data-active={view === 'all' || undefined}
          onClick={() => setView('all')}
          aria-pressed={view === 'all'}
        >
          Everything
        </button>
      </div>

      {/* ── MANDATORY: YOUR NEXT STEP ────────────────────────────── */}
      {nextTask && (
        <section className="flow" data-flow="s" aria-labelledby="dash-next">
          <h2 id="dash-next">Your next step</h2>
          <article className="flow card" data-flow="s">
            <span
              className="tag tag--essential"
              style={{
                display: 'inline-block',
                fontSize: 'var(--step--1)',
                fontWeight: 'var(--font-weight-bold)',
                padding: 'var(--space-3xs) var(--space-xs)',
                background: 'var(--color-dark)',
                color: 'var(--color-light)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Essential
            </span>
            <h3>{nextTask.title}</h3>
            <p>{nextTask.shortDescription}</p>
            <div className="cluster" data-justify="flex-start">
              <Link href={`/checklist/${nextTask.id}`} className="button">
                View task
              </Link>
            </div>
          </article>
        </section>
      )}

      {/* ── MANDATORY: CHECKLIST ─────────────────────────────────── */}
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
          {TASKS.map((task) => {
            const status = taskStatuses[task.id] ?? 'not-started';
            const isComplete = status === 'complete';
            return (
              <li key={task.id}>
                <Link href={`/checklist/${task.id}`} className="dash-checklist-row">
                  <span
                    className="dash-checklist-row__check"
                    data-checked={isComplete || undefined}
                    aria-hidden="true"
                  >
                    {isComplete && (
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
                  <span
                    data-checked={isComplete || undefined}
                    className="dash-checklist-row__label"
                  >
                    {task.title}
                  </span>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                    width="14"
                    height="14"
                    style={{
                      marginInlineStart: 'auto',
                      flexShrink: 0,
                      color: 'var(--color-medium)',
                    }}
                  >
                    <path
                      d="M9 6l6 6-6 6"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* ── OPTIONAL SECTIONS (interest-driven) ──────────────────── */}
      {visibleSections.map((section) => (
        <OptionalSection
          key={section.id}
          section={section}
          events={eventsByInterest[section.id] ?? []}
          college={college}
        />
      ))}

      {/* ── NO-INTERESTS PROMPT (My focus, nothing selected) ─────── */}
      {view === 'focus' && interests.length === 0 && (
        <section className="flow" data-flow="s" aria-labelledby="dash-empty">
          <h2 id="dash-empty">Nothing selected yet</h2>
          <p>
            Switch to <strong>Everything</strong> to browse all sections, or{' '}
            <button type="button" onClick={handleReset} className="link-button">
              update your interests
            </button>{' '}
            to personalise this view.
          </p>
        </section>
      )}

      {/* ── PROFILE FOOTER ───────────────────────────────────────── */}
      <section className="flow" data-flow="2xs" aria-label="Profile">
        <p>
          <span className="step--1">Saved on this device. </span>
          <button type="button" onClick={handleReset} className="link-button">
            Edit your answers
          </button>
        </p>
      </section>

      <style>{`
        /* ── View toggle ─────────────────────────────────────── */
        .dash-toggle {
          display: inline-flex;
          border: 2px solid var(--color-dark);
          overflow: hidden;
        }
        .dash-toggle__btn {
          background: var(--color-light);
          border: 0;
          color: var(--color-dark);
          cursor: pointer;
          font: inherit;
          font-size: var(--step--1);
          font-weight: var(--font-weight-bold);
          padding: var(--space-2xs) var(--space-s);
          transition: background 0.12s, color 0.12s;
        }
        .dash-toggle__btn + .dash-toggle__btn {
          border-inline-start: 2px solid var(--color-dark);
        }
        .dash-toggle__btn[data-active] {
          background: var(--color-dark);
          color: var(--color-light);
        }
        .dash-toggle__btn:hover:not([data-active]) {
          background: var(--color-shade);
        }
        .dash-toggle__btn:focus-visible {
          outline: 2px solid var(--color-orange);
          outline-offset: -2px;
        }

        /* ── Checklist rows ──────────────────────────────────── */
        .dash-checklist-row {
          display: flex;
          align-items: center;
          gap: var(--space-xs);
          inline-size: 100%;
          padding: var(--space-2xs) var(--space-xs);
          background: transparent;
          border: 0;
          color: inherit;
          font: inherit;
          text-align: start;
          text-decoration: none;
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

        /* ── Link button ─────────────────────────────────────── */
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

/* ─────────────────────────────────────────────────────────────────────────
 * OptionalSection
 * Renders one interest-driven section. Each section always shows its
 * heading + relevant cards/links. If there are matching events they
 * appear in a reel; otherwise only the link cards are shown.
 * ───────────────────────────────────────────────────────────────────────── */

const SECTION_CONTENT = {
  social: {
    cards: [
      {
        title: 'Welcome events',
        body: "Meet new people and see what's going on at the various campuses.",
        to: '/events',
      },
      {
        title: 'Student Union',
        body: 'Clubs, societies and student-led activity across UAL.',
        href: 'https://www.arts.ac.uk/students/student-union',
      },
    ],
  },
  creative: {
    cards: [
      {
        title: 'Workshops & studios',
        body: 'Book hands-on sessions and access specialist studio spaces.',
        href: 'https://www.arts.ac.uk/students/welcome/your-journey-to-UAL/get-connected',
      },
      {
        title: 'Facilities',
        body: 'Technical workshops and shared spaces at your college.',
        href: 'https://www.arts.ac.uk/students/student-services',
      },
    ],
  },
  study: {
    cards: [
      {
        title: 'Library Services',
        body: 'Borrow books, book study spaces, and access digital collections.',
        href: 'https://www.arts.ac.uk/students/welcome/your-journey-to-UAL/get-support/skills',
      },
      {
        title: 'Get started on Moodle',
        body: 'Your course materials, lecture recordings and assignments.',
        href: 'https://www.arts.ac.uk/students/get-started-on-moodle',
      },
      {
        title: 'Your timetable',
        body: 'Find out when and where your classes happen.',
        href: 'https://www.arts.ac.uk/students/student-timetables',
      },
    ],
  },
  wellbeing: {
    cards: [
      {
        title: 'Wellbeing Hub',
        body: 'Advice and support for your health and wellbeing while studying.',
        href: 'https://www.arts.ac.uk/students/student-services/health-wellbeing-and-support-for-students',
      },
      {
        title: 'Student Services',
        body: 'Counselling, mental health, and specialist support.',
        href: 'https://www.arts.ac.uk/students/student-services',
      },
    ],
  },
  career: {
    cards: [
      {
        title: 'Student Careers',
        body: 'Careers and Employability at UAL — jobs, mentoring, industry links.',
        href: 'https://www.arts.ac.uk/students/careers-and-employability',
      },
    ],
  },
  area: {
    cards: [
      {
        title: 'Area guide',
        body: 'Travel information, campus map and discounts near your college.',
        to: '/map',
      },
    ],
  },
  tech: {
    cards: [
      {
        title: 'IT Services',
        body: 'Set up your IT account, UAL email, and get tech support.',
        href: 'https://www.arts.ac.uk/students/welcome/your-journey-to-UAL/get-connected',
      },
    ],
  },
};

/**
 * @param {{ section: { id: string, label: string }, events: any[], college: any }} props
 */
function OptionalSection({ section, events, college: _college }) {
  const content = SECTION_CONTENT[section.id];
  const sectionId = `dash-section-${section.id}`;

  return (
    <section className="flow" data-flow="s" aria-labelledby={sectionId}>
      <div className="cluster" data-justify="space-between">
        <h2 id={sectionId}>{section.label}</h2>
        {events.length > 0 && (
          <Link className="home-section__cta" href="/events">
            See all →
          </Link>
        )}
      </div>

      {/* Events reel — only if there are matching events */}
      {events.length > 0 && (
        <div className="reel home-reel" role="list">
          {events.map((event) => (
            <div role="listitem" key={event.id}>
              <EventCard event={event} compact />
            </div>
          ))}
        </div>
      )}

      {/* Static link cards */}
      {content?.cards?.length > 0 && (
        <div className="grid">
          {content.cards.map((card) => (
            <Card
              key={card.title}
              title={card.title}
              to={card.to}
              external={card.href}
              body={<p>{card.body}</p>}
            />
          ))}
        </div>
      )}
    </section>
  );
}
