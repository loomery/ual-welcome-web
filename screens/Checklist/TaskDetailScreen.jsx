'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TASKS, visibleTasks } from '../../data/checklist';
import { usePersistedState } from '../../hooks/usePersistedState';
import { useOnboardingProfile } from '../../hooks/useOnboardingProfile';
import { GetHelpSection } from '../../components/Checklist/GetHelpSection';
import { Button } from '../../components/Button/Button';
import { ArrowRightIcon, CheckCircleOutlineIcon } from '../../components/Icon/NavIcons';

const STATUS_KEY = 'ual:task:status:v1';

/** Where the checklist row / "Go to next task" should point for a task. */
function taskHref(task) {
  if (!task) return '/checklist';
  if (task.detail) return `/checklist/${task.id}`;
  return task.cta?.href?.startsWith('/') ? task.cta.href : '/checklist';
}

/**
 * A single essential-task detail page (/checklist/{id}): the task title and
 * intro, its content sections, a "Your progress" control (mark complete / go
 * to the next task) and a "Get help" block.
 *
 * @param {{ taskId: string }} props
 */
export function TaskDetailScreen({ taskId }) {
  const router = useRouter();
  const { profile, isComplete, hydrated } = useOnboardingProfile();
  const [statuses, setStatuses] = usePersistedState(
    STATUS_KEY,
    /** @type {Record<string, import('../../data/checklist').TaskStatus>} */ ({}),
  );

  const task = TASKS.find((t) => t.id === taskId);

  useEffect(() => {
    if (!hydrated) return;
    if (!isComplete) router.replace('/onboarding');
    else if (!task?.detail) router.replace('/checklist');
  }, [hydrated, isComplete, task, router]);

  if (!hydrated || !isComplete || !task?.detail) return null;

  const done = statuses[task.id] === 'complete';
  const list = visibleTasks(profile?.studentType, profile?.studentStatus);
  const index = list.findIndex((t) => t.id === task.id);
  const nextTask = index >= 0 ? list[index + 1] : undefined;

  function toggleComplete() {
    setStatuses((prev) => ({
      ...prev,
      [task.id]: prev[task.id] === 'complete' ? 'not-started' : 'complete',
    }));
  }

  const intro = task.detail.intro ?? task.shortDescription;

  return (
    <article className="flex flex-col gap-8">
      <header className="flex flex-col gap-6">
        <span className="inline-flex w-fit items-center bg-ual-dark px-2 py-1 text-step-d1 font-ual-normal text-ual-light">
          Essential
        </span>
        <h1 className="text-step-4/ual-condensed font-bold tracking-ual-tight text-ual-dark">
          {task.title}
        </h1>
        <p className="max-w-200 text-step-2 text-ual-dark">{intro}</p>
      </header>

      {task.detail.sections.map((section) => (
        <section key={section.heading} className="flex max-w-200 flex-col gap-3">
          <h2 className="text-step-3 font-bold tracking-ual-tight text-ual-dark">
            {section.heading}
          </h2>
          {section.body && <p className="text-step-0 text-ual-dark">{section.body}</p>}
          {section.lead && <p className="text-step-0 text-ual-dark">{section.lead}</p>}
          {section.bullets && (
            <ul className="flex list-disc flex-col gap-2 pl-6 text-step-0 text-ual-dark">
              {section.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          )}
        </section>
      ))}

      <section aria-labelledby="progress-heading" className="flex flex-col gap-3">
        <p id="progress-heading" className="text-step-0 text-ual-medium">
          Your progress
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <Button variant="solid" weight="normal" onClick={toggleComplete} aria-pressed={done}>
            {done ? 'Completed' : 'Mark as complete'}
            <CheckCircleOutlineIcon aria-hidden="true" />
          </Button>
          {nextTask && (
            <Button variant="outline" weight="normal" href={taskHref(nextTask)}>
              Go to next task
              <ArrowRightIcon aria-hidden="true" />
            </Button>
          )}
        </div>
      </section>

      {task.detail.help && (
        <GetHelpSection intro={task.detail.help.intro} channels={task.detail.help.channels} />
      )}
    </article>
  );
}
