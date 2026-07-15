'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TASKS, OTHER_TASKS, visibleTasks } from '../../data/checklist';
import { COLLEGE_OPTIONS } from '../../data/onboardingOptions';
import { usePersistedState } from '../../hooks/usePersistedState';
import { useOnboardingProfile } from '../../hooks/useOnboardingProfile';
import { GetHelpSection } from '../../components/Checklist/GetHelpSection';
import { RichText } from '../../components/Checklist/RichText';
import { SubTaskChecklist } from '../../components/Checklist/SubTaskChecklist';
import { Button } from '../../components/Button/Button';
import {
  ArrowRightIcon,
  CheckCircleOutlineIcon,
  ExternalLinkIcon,
  PlayIcon,
} from '../../components/Icon/NavIcons';

const STATUS_KEY = 'ual:task:status:v1';

/** Every task (essential + other) that owns a detail page, by id. */
function detailTask(taskId) {
  return (
    TASKS.find((t) => t.id === taskId) ??
    // Other important tasks use `label` for their list text; normalise to title.
    OTHER_TASKS.map((t) => ({ ...t, title: t.label })).find((t) => t.id === taskId)
  );
}

/** Where the checklist row / "Go to next task" should point for a task. */
function taskHref(task) {
  if (!task) return '/checklist';
  if (task.detail) return `/checklist/${task.id}`;
  return task.cta?.href?.startsWith('/') ? task.cta.href : '/checklist';
}

/**
 * A single task detail page (/checklist/{id}): tag + title + intro, content
 * sections (paragraphs with inline links, bullets, arrow links), an optional
 * sub-checklist ("Accounts to set up" / "Set up steps"), a video-guide link,
 * a "Your progress" control, a dark read-more banner and a "Get help" block.
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

  const task = detailTask(taskId);

  useEffect(() => {
    if (!hydrated) return;
    if (!isComplete) router.replace('/onboarding');
    else if (!task?.detail) router.replace('/checklist');
  }, [hydrated, isComplete, task, router]);

  if (!hydrated || !isComplete || !task?.detail) return null;

  const { detail } = task;
  const done = statuses[task.id] === 'complete';
  const list = visibleTasks(profile?.studentType, profile?.studentStatus);
  const index = list.findIndex((t) => t.id === task.id);
  // Skip to the next task that has its own page (a detail page or an internal
  // cta) so "Go to next task" opens a task, never dead-ends on the list.
  const nextTask =
    index >= 0
      ? list.slice(index + 1).find((t) => t.detail || t.cta?.href?.startsWith('/'))
      : undefined;

  // The student's college fills the [College/Institute] placeholder in copy.
  const collegeName =
    COLLEGE_OPTIONS.find((c) => c.id === profile?.collegeId)?.name ?? 'your College or Institute';
  const fill = (text) =>
    typeof text === 'string' ? text.replaceAll('[College/Institute]', collegeName) : text;

  function toggleComplete() {
    setStatuses((prev) => ({
      ...prev,
      [task.id]: prev[task.id] === 'complete' ? 'not-started' : 'complete',
    }));
  }

  const intro = fill(detail.intro ?? task.shortDescription);

  return (
    <article className="flex flex-col gap-8">
      <header className="flex flex-col gap-6">
        <span className="inline-flex w-fit items-center bg-ual-dark px-2 py-1 text-step-d1 font-ual-normal text-ual-light">
          {detail.tag ?? 'Essential'}
        </span>
        <h1 className="text-step-4/ual-condensed font-bold tracking-ual-tight text-ual-dark">
          {detail.title ?? task.title}
        </h1>
        <p className="max-w-200 text-step-2 text-ual-dark">{intro}</p>
      </header>

      {detail.sections.map((section) => (
        <section key={section.heading} className="flex max-w-200 flex-col gap-3">
          <h2 className="text-step-3 font-bold tracking-ual-tight text-ual-dark">
            {section.heading}
          </h2>
          {(section.paragraphs ?? (section.body ? [section.body] : [])).map((paragraph) => (
            <p key={paragraph} className="text-step-0 text-ual-dark">
              <RichText text={fill(paragraph)} />
            </p>
          ))}
          {section.lead && <p className="text-step-0 text-ual-dark">{fill(section.lead)}</p>}
          {section.bullets && (
            <ul className="flex list-disc flex-col gap-2 pl-6 text-step-0 text-ual-dark">
              {section.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          )}
          {section.link && (
            <a
              href={section.link.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-fit items-center gap-2 text-step-0 text-ual-dark underline underline-offset-2 hover:text-ual-orange focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ual-orange [&>svg]:size-5"
            >
              {section.link.label}
              <ExternalLinkIcon aria-hidden="true" />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          )}
        </section>
      ))}

      {detail.subTasks && <SubTaskChecklist taskId={task.id} subTasks={detail.subTasks} />}

      {detail.video && (
        <a
          href={detail.video.href}
          target="_blank"
          rel="noreferrer"
          className="inline-flex w-fit items-center gap-2 text-step-0 text-ual-dark underline underline-offset-2 hover:text-ual-orange focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ual-orange [&>svg]:size-5"
        >
          {detail.video.label}
          <PlayIcon aria-hidden="true" />
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      )}

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

      {detail.readMore && (
        <a
          href={detail.readMore.href}
          target="_blank"
          rel="noreferrer"
          className="group flex w-full max-w-200 items-center justify-between gap-4 bg-ual-dark p-8 text-step-2 font-bold tracking-ual-tight text-ual-light no-underline transition-colors hover:text-ual-orange focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ual-orange [&>svg]:size-8"
        >
          {detail.readMore.label}
          <ArrowRightIcon aria-hidden="true" />
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      )}

      {detail.help && (
        <GetHelpSection intro={fill(detail.help.intro)} channels={detail.help.channels} />
      )}
    </article>
  );
}
