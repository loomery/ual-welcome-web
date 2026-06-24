'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { Card } from '../../components/Card/Card';
import { NextStepCard } from '../../components/Dashboard/NextStepCard';
import { ViewToggle } from '../../components/Dashboard/ViewToggle';
import { Progress } from '../../components/Progress/Progress';
import { ArrowRightIcon } from '../../components/Icon/NavIcons';
import { visibleTasks } from '../../data/checklist';
import { WELCOME_WEEK } from '../../data/welcomeWeek';
import { USEFUL_INFO } from '../../data/usefulInfo';
import { LONG_DATE_FMT } from '../../utils/dates';
import { asset } from '../../utils/asset';
import { useOnboardingProfile } from '../../hooks/useOnboardingProfile';
import { usePersistedState } from '../../hooks/usePersistedState';

const VIEW_OPTIONS = /** @type {const} */ ([
  { value: 'focus', label: 'My selected interests' },
  { value: 'all', label: 'All at UAL' },
]);

// Inline link-style button (was `.link-button`): looks like an underlined
// link but carries a click handler. `text-ual-dark` auto-swaps to white in
// dark mode via the token system, so no `dark:` override is needed.
const LINK_BUTTON =
  'cursor-pointer border-0 bg-transparent p-0 text-ual-dark underline underline-offset-4 hover:text-ual-orange focus-visible:text-ual-orange focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ual-orange';

/**
 * Interest-driven home sections. The `id`s match INTEREST_OPTIONS so the
 * "My focus" view can filter on the student's selected topics. Order here
 * is the render order.
 *
 * Cards use `to` for internal routes and `external` for off-site links;
 * a `to: '#'` placeholder marks a card whose real destination isn't built
 * yet (the design shows the tile, the link is a stub).
 *
 * @type {Array<{ id: string, label: string, cards: Array<{ title: string, to?: string, external?: string }> }>}
 */
const DASHBOARD_SECTIONS = [
  {
    id: 'course',
    label: 'Course and studying',
    cards: [
      { title: 'Course details via Moodle', external: 'https://moodle.arts.ac.uk' },
      { title: 'Resources', to: '/info/resources' },
      { title: 'What is Moodle', to: '#' },
    ],
  },
  {
    id: 'access',
    label: 'IT & UAL access',
    cards: [
      { title: 'Tools to set up', to: '/checklist' },
      { title: 'Resources', to: '/info/resources' },
      { title: 'Campus access', to: '/map' },
    ],
  },
  {
    id: 'life',
    label: 'Life at UAL',
    cards: [
      { title: 'Socials and events', to: '/events' },
      { title: 'Student union (SU)', external: 'https://www.arts.ac.uk/students/student-union' },
      { title: 'Area guide', to: '/map' },
    ],
  },
  {
    id: 'health',
    label: 'Health, wellbeing and safety',
    cards: [
      { title: 'Set up with a local doctor', to: '/info/local-doctor' },
      { title: 'Disability service', to: '#' },
      { title: 'Safety at UAL', to: '/info/safety-at-ual' },
      { title: 'Campus safety', to: '#' },
    ],
  },
  {
    id: 'finances',
    label: 'Finance',
    cards: [
      { title: 'Setting up a bank account', to: '#' },
      { title: 'Resources', to: '#' },
      { title: 'About your tuition fees', to: '#' },
      { title: 'Discounts', to: '#' },
    ],
  },
  {
    id: 'careers',
    label: 'Careers',
    cards: [
      { title: 'Job opportunities', to: '#' },
      { title: 'Career advice', to: '#' },
    ],
  },
];

/**
 * Personalised dashboard.
 *
 *   1. Hero            — countdown + greeting + college name
 *   2. Key information — Welcome week + term date rows
 *   3. Get Setup       — progress bar, next-step card, "Coming up" list
 *   4. View toggle     — My focus / All at UAL
 *   5. Sections        — six interest-driven link-card groups
 *
 * Section visibility:
 *   - "My focus":   only sections matching the student's interests.
 *   - "All at UAL": every section regardless of interests.
 */
export function DashboardScreen() {
  const { profile, reset } = useOnboardingProfile();
  const [taskStatuses] = usePersistedState('ual:task:status:v1', {});
  const [view, setView] = usePersistedState(
    'ual:dash:view:v1',
    /** @type {'focus'|'all'} */ ('focus'),
  );

  const interests = useMemo(() => profile?.interests ?? [], [profile?.interests]);

  const visibleSections = useMemo(() => {
    if (view === 'all') return DASHBOARD_SECTIONS;
    if (interests.length === 0) return [];
    return DASHBOARD_SECTIONS.filter((s) => interests.includes(s.id));
  }, [view, interests]);

  const tasks = useMemo(() => visibleTasks(profile?.studentType), [profile?.studentType]);
  const completeCount = useMemo(
    () => tasks.filter((t) => taskStatuses[t.id] === 'complete').length,
    [tasks, taskStatuses],
  );
  const incompleteTasks = useMemo(
    () => tasks.filter((t) => taskStatuses[t.id] !== 'complete'),
    [tasks, taskStatuses],
  );
  const nextTask = incompleteTasks[0] ?? null;
  const comingUp = incompleteTasks.slice(1, 3);

  const termInfo = useMemo(() => USEFUL_INFO.find((i) => i.id === 'term-dates'), []);

  function handleReset() {
    if (typeof window === 'undefined') return;
    if (window.confirm('Reset your hub? This clears your answers from this device.')) {
      reset();
      // asset() prefixes the deploy sub-path — window.location bypasses Next's
      // basePath handling, so a bare '/onboarding' lands on the host root.
      window.location.assign(asset('/onboarding'));
    }
  }

  return (
    <article className="space-y-8">
      {/* The greeting/college hero is rendered by the app shell (AppHero). */}
      <div className="mx-auto max-w-6xl space-y-8">
        {/* ── KEY INFORMATION ────────────────────────────────────── */}
        <section className="space-y-4" aria-labelledby="dash-key-info">
          <h2 id="dash-key-info">Key information</h2>
          <div className="flex flex-col">
            <KeyInfoRow
              title="Welcome week dates"
              startsAt={WELCOME_WEEK.startsAt}
              endsAt={WELCOME_WEEK.endsAt}
            />
            {termInfo?.dates && (
              <KeyInfoRow
                title="Term dates"
                eyebrow={termInfo.eyebrow}
                startsAt={termInfo.dates.startsAt}
                endsAt={termInfo.dates.endsAt}
                href={termInfo.href}
              />
            )}
          </div>
        </section>

        {/* ── GET SETUP ──────────────────────────────────────────── */}
        <section className="space-y-4" aria-labelledby="dash-get-setup">
          <div className="flex items-baseline justify-between gap-4">
            <h2 id="dash-get-setup">Get setup</h2>
            <Link
              href="/checklist"
              className="text-step-d1 font-bold text-ual-dark underline underline-offset-2 hover:text-ual-orange dark:text-ual-light"
            >
              View all tasks
            </Link>
          </div>

          <Progress
            value={completeCount}
            max={tasks.length}
            label={`${completeCount} of ${tasks.length} tasks complete`}
          />
          <p className="text-step-d1 text-ual-medium">
            {completeCount} of {tasks.length} complete
          </p>

          {nextTask && (
            <NextStepCard
              title={nextTask.title}
              body={nextTask.shortDescription}
              primary={{
                // The home next-step keeps the student inside the app: it
                // follows the task's own internal route (e.g. MFA →
                // /checklist/mfa) but falls back to the checklist page when
                // the task's cta is an external link (e.g. "Setup email").
                label: nextTask.cta?.label ?? 'View task',
                href: nextTask.cta?.href?.startsWith('/') ? nextTask.cta.href : '/checklist',
              }}
            />
          )}

          {comingUp.length > 0 && (
            <div className="space-y-2">
              <p className="text-step-d1 font-bold text-ual-dark dark:text-ual-light">Coming up</p>
              <ol className="flex flex-col gap-1">
                {comingUp.map((task, i) => (
                  <li key={task.id} className="text-step-d1 text-ual-medium">
                    {i + 1}. {task.title}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </section>

        {/* ── VIEW TOGGLE ────────────────────────────────────────── */}
        <div className="space-y-1">
          <ViewToggle value={view} onChange={setView} options={VIEW_OPTIONS} />
          <p className="m-0 text-step-d1 text-ual-medium">
            {view === 'all' ? 'Showing everything at UAL' : 'Showing your selected interests'}
          </p>
        </div>

        {/* ── INTEREST SECTIONS ──────────────────────────────────── */}
        {visibleSections.map((section) => (
          <section
            key={section.id}
            className="space-y-4"
            aria-labelledby={`dash-section-${section.id}`}
          >
            <h2 id={`dash-section-${section.id}`}>{section.label}</h2>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(250px,100%),1fr))] gap-(--grid-gutter)">
              {section.cards.map((card) => (
                <Card key={card.title} title={card.title} to={card.to} external={card.external} />
              ))}
            </div>
          </section>
        ))}

        {/* ── NO-INTERESTS PROMPT ────────────────────────────────── */}
        {view === 'focus' && interests.length === 0 && (
          <section className="space-y-4" aria-labelledby="dash-empty">
            <h2 id="dash-empty">Nothing selected yet</h2>
            <p>
              Switch to <strong>All at UAL</strong> to browse everything, or{' '}
              <button type="button" onClick={handleReset} className={LINK_BUTTON}>
                update your interests
              </button>{' '}
              to personalise this view.
            </p>
          </section>
        )}

        {/* ── PROFILE FOOTER ─────────────────────────────────────── */}
        <section className="space-y-2" aria-label="Profile">
          <p>
            <span className="text-step-d1">Saved on this device. </span>
            <button type="button" onClick={handleReset} className={LINK_BUTTON}>
              Edit your answers
            </button>
          </p>
        </section>
      </div>
    </article>
  );
}

/**
 * One row in the Key information list: a title (optionally a link with an
 * arrow), an optional eyebrow, and a Start / End date pair.
 *
 * @param {Object} props
 * @param {string} props.title
 * @param {string} props.startsAt
 * @param {string} props.endsAt
 * @param {string} [props.eyebrow]
 * @param {string} [props.href]
 */
function KeyInfoRow({ title, startsAt, endsAt, eyebrow, href }) {
  const start = LONG_DATE_FMT.format(new Date(startsAt));
  const end = LONG_DATE_FMT.format(new Date(endsAt));

  return (
    <div className="flex flex-col gap-2 py-6">
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-between gap-4 text-step-1 font-bold tracking-ual-tight text-ual-dark hover:text-ual-orange dark:text-ual-light"
        >
          <span>
            {title}
            <span className="sr-only"> (opens in a new tab)</span>
          </span>
          <ArrowRightIcon width={28} height={28} aria-hidden="true" className="shrink-0" />
        </a>
      ) : (
        <span className="text-step-1 font-bold tracking-ual-tight text-ual-dark dark:text-ual-light">
          {title}
        </span>
      )}
      {eyebrow && <p className="text-step-d1 font-bold text-ual-medium">{eyebrow}</p>}
      <div className="flex flex-col gap-1 text-step-d1 text-ual-medium md:flex-row md:items-center md:gap-4">
        <span className="md:shrink-0">Start: {start}</span>
        <span
          aria-hidden="true"
          className="hidden h-px grow bg-ual-dark/15 md:block dark:bg-ual-light/20"
        />
        <span className="md:shrink-0">End: {end}</span>
      </div>
    </div>
  );
}
