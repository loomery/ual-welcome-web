'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { visibleTasks, visibleOtherTasks, REPEATED_SERVICES } from '../../data/checklist';
import { usePersistedState } from '../../hooks/usePersistedState';
import { useOnboardingProfile } from '../../hooks/useOnboardingProfile';
import { ToDoList } from '../../components/Checklist/ToDoList';
import { InterestTile } from '../../components/Dashboard/InterestTile';
import { Button } from '../../components/Button/Button';
import { ArrowRightIcon } from '../../components/Icon/NavIcons';

const STATUS_KEY = 'ual:task:status:v1';

const INTRO =
  'There’s lots to think about and do as you begin your journey with us at UAL. Here are the key tasks you’ll need to complete to get started.';

/**
 * "Essentials" (/checklist) — the arrival to-do list. A short intro, then the
 * "Arrival essentials" to-do list card (each task has a completion checkbox, a
 * title/chevron linking to its destination, a description and an optional
 * availability note) and a list of "Other important tasks" links.
 */
export function TaskListScreen() {
  const router = useRouter();
  const { profile, isComplete, hydrated } = useOnboardingProfile();
  const [statuses, setStatuses] = usePersistedState(
    STATUS_KEY,
    /** @type {Record<string, import('../../data/checklist').TaskStatus>} */ ({}),
  );

  useEffect(() => {
    if (hydrated && !isComplete) {
      router.replace('/onboarding');
    }
  }, [hydrated, isComplete, router]);

  const tasks = useMemo(
    () => visibleTasks(profile?.studentType, profile?.studentStatus),
    [profile?.studentType, profile?.studentStatus],
  );
  const otherTasks = useMemo(() => visibleOtherTasks(profile?.studentType), [profile?.studentType]);

  const allComplete = tasks.length > 0 && tasks.every((t) => statuses[t.id] === 'complete');

  if (!hydrated || !isComplete) return null;

  function toggle(id) {
    setStatuses((prev) => ({
      ...prev,
      [id]: prev[id] === 'complete' ? 'not-started' : 'complete',
    }));
  }

  return (
    <article className="flex flex-col gap-12">
      <header className="flex flex-col gap-6">
        <h1 className="text-step-4/ual-condensed font-bold tracking-ual-tight text-ual-dark">
          Essentials
        </h1>
        <p className="max-w-200 text-step-2 text-ual-dark">{INTRO}</p>
      </header>

      <section aria-labelledby="arrival-heading" className="flex flex-col gap-4">
        <h2 id="arrival-heading" className="text-step-3 font-bold tracking-ual-tight text-ual-dark">
          Arrival essentials
        </h2>
        <p className="max-w-200 text-step-0 text-ual-dark">{INTRO}</p>

        <ToDoList tasks={tasks} statuses={statuses} onToggle={toggle} />

        {allComplete && (
          <div className="flex flex-col gap-6">
            <ul role="list" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {REPEATED_SERVICES.map((service) => (
                <li key={service.id}>
                  <InterestTile label={service.label} body={service.body} href={service.href} />
                </li>
              ))}
            </ul>
            <Button variant="solid" href="/studying" className="w-fit">
              View more study tools
              <ArrowRightIcon aria-hidden="true" />
            </Button>
          </div>
        )}
      </section>

      <section aria-labelledby="other-heading" className="flex flex-col gap-6">
        <h2 id="other-heading" className="text-step-3 font-bold tracking-ual-tight text-ual-dark">
          Other important tasks
        </h2>
        <ul role="list" className="flex flex-wrap gap-x-8 gap-y-3">
          {otherTasks.map((task) => (
            <li key={task.id}>
              <a
                href={task.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-step-0 text-ual-dark underline underline-offset-2 hover:text-ual-orange focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ual-orange [&>svg]:size-5"
              >
                {task.label}
                <ArrowRightIcon aria-hidden="true" />
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
