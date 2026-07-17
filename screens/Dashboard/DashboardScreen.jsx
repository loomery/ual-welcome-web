'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { EventCard } from '../../components/EventCard/EventCard';
import { TaskListCard } from '../../components/Dashboard/TaskListCard';
import { CompleteBanner } from '../../components/Dashboard/CompleteBanner';
import { KeyDateCard } from '../../components/Dashboard/KeyDateCard';
import { InterestTile } from '../../components/Dashboard/InterestTile';
import { Progress } from '../../components/Progress/Progress';
import { Button } from '../../components/Button/Button';
import { ArrowRightIcon, ChevronDownIcon } from '../../components/Icon/NavIcons';
import { visibleTasks } from '../../data/checklist';
import { WELCOME_WEEK } from '../../data/welcomeWeek';
import { USEFUL_INFO } from '../../data/usefulInfo';
import { INTEREST_OPTIONS } from '../../data/onboardingOptions';
import { EVENTS } from '../../data/events';
import { useOnboardingProfile } from '../../hooks/useOnboardingProfile';
import { usePersistedState } from '../../hooks/usePersistedState';

/**
 * Where each interest tile points. Interests map onto the primary nav
 * sections, so a tile takes the student straight to the relevant area.
 * @type {Record<string, string>}
 */
const INTEREST_HREF = {
  course: '/studying',
  access: '/essentials',
  health: '/help',
  safety: '/help',
  finances: '/help',
  'moving-uk': '/explore/moving-to-the-uk',
};

/** How many interest tiles show before the "View more" toggle expands the rest. */
const COLLAPSED_INTERESTS = 3;

/** How many essential tasks the home surfaces before "View all tasks". */
const HOME_TASKS = 3;

/** How many events the "What's on" reel shows. */
const HOME_EVENTS = 3;

/**
 * Personalised home.
 *
 *   1. Essential tasks — arrival checklist (progress + task card, or an
 *      "all complete" banner the student can dismiss for good).
 *   2. Key dates       — Welcome week + term-date cards with date-stamp bars.
 *   3. Selected interests — the student's picked interests as tiles, with a
 *      "View more" toggle that reveals the rest of the categories.
 *   4. What's on       — a reel of upcoming Welcome Week events.
 *
 * The greeting / college hero above this is rendered by the app shell.
 */
export function DashboardScreen() {
  const router = useRouter();
  const { profile } = useOnboardingProfile();
  const [taskStatuses] = usePersistedState('ual:task:status:v1', {});
  const [tasksDismissed, setTasksDismissed] = usePersistedState(
    // Shared with the Essentials to-do list: one app-wide "tasks complete,
    // stop showing me the completed list" preference.
    'ual:tasks-complete-dismissed:v1',
    false,
  );
  const [interestsExpanded, setInterestsExpanded] = useState(false);

  // ── Essential tasks ────────────────────────────────────────────────────
  const tasks = useMemo(
    () => visibleTasks(profile?.studentType, profile?.studentStatus),
    [profile?.studentType, profile?.studentStatus],
  );
  const completeCount = useMemo(
    () => tasks.filter((t) => taskStatuses[t.id] === 'complete').length,
    [tasks, taskStatuses],
  );
  const allComplete = tasks.length > 0 && completeCount === tasks.length;

  // Surface the first few incomplete tasks; each "View task" keeps the student
  // in-app (its own internal route, else the checklist) and is numbered by its
  // running position in the visible list.
  const taskItems = useMemo(
    () =>
      tasks
        .filter((t) => taskStatuses[t.id] !== 'complete')
        .slice(0, HOME_TASKS)
        .map((t, i) => ({
          id: t.id,
          number: i + 1,
          title: t.title,
          description: t.shortDescription,
          // Open the actual task: its own detail page if it has one, else an
          // internal cta, else fall back to the essentials list.
          href: t.detail
            ? `/essentials/${t.id}`
            : t.cta?.href?.startsWith('/')
              ? t.cta.href
              : '/essentials',
        })),
    [tasks, taskStatuses],
  );

  // ── Key dates ──────────────────────────────────────────────────────────
  const termInfo = useMemo(() => USEFUL_INFO.find((i) => i.id === 'term-dates'), []);

  // ── Selected interests ─────────────────────────────────────────────────
  const interestIds = useMemo(() => profile?.interests ?? [], [profile?.interests]);
  // Only the topics the student actually selected. "View more" appears only
  // when they picked more than the collapsed count, and reveals the rest of
  // their own selection (not every category).
  const selectedInterests = useMemo(
    () => INTEREST_OPTIONS.filter((o) => interestIds.includes(o.id)),
    [interestIds],
  );
  const visibleInterests = interestsExpanded
    ? selectedInterests
    : selectedInterests.slice(0, COLLAPSED_INTERESTS);

  // ── What's on ──────────────────────────────────────────────────────────
  const upcoming = useMemo(
    () => [...EVENTS].sort((a, b) => a.startsAt.localeCompare(b.startsAt)).slice(0, HOME_EVENTS),
    [],
  );

  return (
    <article className="mx-auto max-w-6xl space-y-12">
      {/* ── PAGE INTRO ─────────────────────────────────────────────────── */}
      <header className="space-y-6">
        <h1 className="text-step-4/ual-condensed font-bold tracking-ual-tight text-ual-dark">
          Welcome to UAL
        </h1>
        <p className="max-w-200 text-step-2 text-ual-dark">
          There&rsquo;s a lot to learn when starting at university. Let&rsquo;s kick start your
          journey
        </p>
      </header>

      {/* ── ESSENTIAL TASKS ────────────────────────────────────────────── */}
      {!(allComplete && tasksDismissed) && (
        <section className="space-y-6" aria-labelledby="home-tasks">
          <div className="space-y-2">
            <h2 id="home-tasks">Essential tasks</h2>
            <p className="text-step-1 text-ual-medium">
              Complete this to do list before the course start
            </p>
          </div>

          {allComplete ? (
            <>
              <div className="space-y-2">
                <p className="text-step-0 text-ual-dark">
                  {completeCount} of {tasks.length} complete
                </p>
                <Progress
                  value={completeCount}
                  max={tasks.length}
                  label={`${completeCount} of ${tasks.length} tasks complete`}
                  tone="success"
                />
              </div>
              <CompleteBanner
                onView={() => router.push('/essentials')}
                onDismiss={() => setTasksDismissed(true)}
              />
            </>
          ) : (
            <>
              <div className="space-y-6 bg-ual-shade p-6">
                <div className="space-y-2">
                  <p className="text-step-0 text-ual-dark">
                    {completeCount} of {tasks.length} complete
                  </p>
                  <Progress
                    value={completeCount}
                    max={tasks.length}
                    label={`${completeCount} of ${tasks.length} tasks complete`}
                    tone="success"
                  />
                </div>

                <TaskListCard items={taskItems} />

                <Link
                  href="/essentials"
                  className="inline-flex min-h-11 items-center gap-2 text-step-0 font-ual-normal text-ual-dark underline underline-offset-2 hover:text-ual-orange focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ual-orange [&>svg]:size-6"
                >
                  View all tasks
                  <ArrowRightIcon aria-hidden="true" />
                </Link>
              </div>
            </>
          )}
        </section>
      )}

      {/* ── KEY DATES ──────────────────────────────────────────────────── */}
      <section className="space-y-6" aria-labelledby="home-key-dates">
        <h2 id="home-key-dates">Key dates</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <KeyDateCard
            title="Welcome week dates"
            description="See what's going on at UAL and get ready for term"
            label="Welcome"
            startsAt={WELCOME_WEEK.startsAt}
            endsAt={WELCOME_WEEK.endsAt}
          />
          {termInfo?.dates && (
            <KeyDateCard
              title="Term dates"
              description="View your term dates for the academic year"
              label={termInfo.eyebrow ?? 'Autumn'}
              startsAt={termInfo.dates.startsAt}
              endsAt={termInfo.dates.endsAt}
              href={termInfo.href}
            />
          )}
        </div>
      </section>

      {/* ── SELECTED INTERESTS ─────────────────────────────────────────── */}
      <section className="space-y-6" aria-labelledby="home-interests">
        <div className="space-y-2">
          <h2 id="home-interests">Selected interests</h2>
          <p className="text-step-1 text-ual-medium">
            Showing {interestIds.length} of {INTEREST_OPTIONS.length} interests based on your
            student centre space set up.
          </p>
          <Link
            href="/profile"
            className="inline-flex min-h-11 items-center text-step-0 font-ual-normal text-ual-dark underline underline-offset-2 hover:text-ual-orange focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ual-orange"
          >
            Edit your preferences
          </Link>
        </div>

        <ul
          className="grid list-none grid-cols-1 gap-6 p-0 md:grid-cols-2 lg:grid-cols-3"
          role="list"
        >
          {visibleInterests.map((interest) => (
            <li key={interest.id}>
              <InterestTile
                label={interest.label}
                body={interest.body}
                href={INTEREST_HREF[interest.id] ?? '/help'}
              />
            </li>
          ))}
        </ul>

        {selectedInterests.length > COLLAPSED_INTERESTS && (
          <button
            type="button"
            onClick={() => setInterestsExpanded((v) => !v)}
            aria-expanded={interestsExpanded}
            className="inline-flex min-h-11 cursor-pointer items-center gap-2 text-step-0 font-ual-normal text-ual-dark underline underline-offset-2 hover:text-ual-orange focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ual-orange [&>svg]:size-5"
          >
            {interestsExpanded ? 'View less' : 'View more'}
            <ChevronDownIcon aria-hidden="true" className={interestsExpanded ? 'rotate-180' : ''} />
          </button>
        )}
      </section>

      {/* ── WHAT'S ON ──────────────────────────────────────────────────── */}
      <section className="space-y-6" aria-labelledby="home-whats-on">
        <h2 id="home-whats-on">What&apos;s on</h2>
        <ul
          className="-mx-(--grid-gutter) flex snap-x snap-mandatory scroll-px-(--grid-gutter) list-none gap-6 overflow-x-auto px-(--grid-gutter) pb-2 md:mx-0 md:scroll-px-0 md:px-0"
          role="list"
        >
          {upcoming.map((event) => (
            <li key={event.id} className="snap-start">
              <EventCard event={event} compact />
            </li>
          ))}
        </ul>
        <Button href="/explore/student-life/events" className="w-full justify-center md:w-auto">
          View more events
          <ArrowRightIcon aria-hidden="true" />
        </Button>
      </section>
    </article>
  );
}
