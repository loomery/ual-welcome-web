'use client';

import Link from 'next/link';
import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { visibleTasks } from '../../data/checklist';
import { usePersistedState } from '../../hooks/usePersistedState';
import { useOnboardingProfile } from '../../hooks/useOnboardingProfile';
import { StatusCircle } from '../../components/StatusCircle/StatusCircle';

const STATUS_KEY = 'ual:task:status:v1';

export function TaskListScreen() {
  const router = useRouter();
  const { profile, isComplete, hydrated } = useOnboardingProfile();
  const [statuses] = usePersistedState(
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

  return (
    <article className="flow" data-flow="l">
      <div className="flow" data-flow="s">
        <h1>Get setup list</h1>
        <p className="standfirst">
          {completeCount} of {tasks.length} complete
        </p>
      </div>

      <section aria-labelledby="essential-heading" className="flow" data-flow="m">
        <div className="flow" data-flow="s">
          <h2 id="essential-heading" className="text-step-0 font-ual-bold tracking-wider uppercase">
            Essential tasks
          </h2>
          <p>You need to complete these tasks in order to start your term.</p>
        </div>

        <ul className="flow" data-flow="xs" role="list">
          {tasks.map((task) => {
            const status = statuses[task.id] ?? 'not-started';

            return (
              <li key={task.id}>
                <Link href={`/checklist/${task.id}`} className="task-row-link">
                  <StatusCircle status={status} />

                  <span className="flex min-w-0 grow flex-col gap-3xs">
                    <span className="text-step-0 font-ual-bold">{task.title}</span>
                    <span className="text-step-d1/ual-condensed text-ual-medium">
                      {task.shortDescription}
                    </span>
                  </span>

                  {/* Chevron */}
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                    className="shrink-0 text-ual-medium"
                    width="16"
                    height="16"
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
    </article>
  );
}
