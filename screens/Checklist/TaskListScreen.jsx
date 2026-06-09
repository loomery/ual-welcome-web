'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { visibleTasks } from '../../data/checklist';
import { usePersistedState } from '../../hooks/usePersistedState';
import { useOnboardingProfile } from '../../hooks/useOnboardingProfile';
import { StatusCircle } from '../../components/StatusCircle/StatusCircle';
import { TaskAction } from '../../components/Checklist/TaskAction';

const STATUS_KEY = 'ual:task:status:v1';

/**
 * "Get set up for term" — lists the essential setup tasks inline. Each row
 * has a toggleable completion circle, a title, a short description, and an
 * inline action (link, app buttons, and/or an availability note). There is
 * no separate detail page except MFA, whose "Get started" action links to
 * /checklist/mfa.
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

  const tasks = useMemo(() => visibleTasks(profile?.studentType), [profile?.studentType]);

  const completeCount = useMemo(
    () => tasks.filter((t) => statuses[t.id] === 'complete').length,
    [tasks, statuses],
  );

  if (!hydrated || !isComplete) return null;

  function toggle(id) {
    setStatuses((prev) => ({
      ...prev,
      [id]: prev[id] === 'complete' ? 'not-started' : 'complete',
    }));
  }

  return (
    <article className="flex flex-col gap-l">
      <header className="flex flex-col gap-xs">
        <h1 className="text-step-4/ual-condensed font-bold tracking-ual-tight text-ual-dark dark:text-ual-light">
          Get set up for term
        </h1>
        <p className="text-step-1 text-ual-medium">
          You need to complete these tasks in order to start your term
        </p>
      </header>

      <section aria-labelledby="essential-heading" className="flex flex-col gap-s">
        <h2
          id="essential-heading"
          className="text-step-2 font-bold tracking-ual-tight text-ual-dark dark:text-ual-light"
        >
          Essential tasks
        </h2>
        <p className="text-step-d1 text-ual-medium">
          {completeCount} of {tasks.length} complete
        </p>

        <ul role="list" className="flex flex-col">
          {tasks.map((task) => {
            const done = statuses[task.id] === 'complete';

            return (
              <li
                key={task.id}
                className="flex gap-s border-t border-ual-dark/10 py-m dark:border-ual-light/15"
              >
                <button
                  type="button"
                  onClick={() => toggle(task.id)}
                  aria-pressed={done}
                  aria-label={
                    done
                      ? `${task.title} — complete, click to undo`
                      : `Mark "${task.title}" as complete`
                  }
                  className="mt-3xs shrink-0 cursor-pointer rounded-full border-0 bg-transparent p-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ual-orange"
                >
                  <StatusCircle status={done ? 'complete' : 'not-started'} size={22} />
                </button>

                <div className="flex min-w-0 grow flex-col gap-2xs">
                  <h3 className="text-step-1 font-bold tracking-ual-tight text-ual-dark dark:text-ual-light">
                    {task.title}
                  </h3>
                  <p className="text-step-d1/ual-default text-ual-medium">
                    {task.shortDescription}
                  </p>

                  {task.note && (
                    <p className="inline-flex w-fit items-center gap-3xs bg-ual-shade px-xs py-2xs text-step-d1 text-ual-medium dark:bg-ual-dark-95">
                      <span aria-hidden="true">&#9432;</span> {task.note}
                    </p>
                  )}

                  <TaskAction cta={task.cta} apps={task.apps} />
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </article>
  );
}
