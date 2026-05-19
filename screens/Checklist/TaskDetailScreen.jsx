'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePersistedState } from '../../hooks/usePersistedState';
import { useOnboardingProfile } from '../../hooks/useOnboardingProfile';
import { Progress } from '../../components/Progress/Progress';
import { StatusCircle } from '../../components/StatusCircle/StatusCircle';

const STATUS_KEY = 'ual:task:status:v1';
const STEPS_KEY = 'ual:task:steps:v1';

/**
 * @param {{ task: import('../../data/checklist').Task }} props
 */
export function TaskDetailScreen({ task }) {
  const router = useRouter();
  const { isComplete: hasCompletedOnboarding, hydrated } = useOnboardingProfile();
  const [statuses, setStatuses] = usePersistedState(STATUS_KEY, {});
  const [allSteps, setAllSteps] = usePersistedState(STEPS_KEY, {});

  useEffect(() => {
    if (hydrated && !hasCompletedOnboarding) {
      router.replace('/onboarding');
    }
  }, [hydrated, hasCompletedOnboarding, router]);

  const status = statuses[task.id] ?? 'not-started';
  const taskSteps = useMemo(() => allSteps[task.id] ?? {}, [allSteps, task.id]);

  const stepsTotal = task.steps?.length ?? 0;
  const stepsDone = useMemo(
    () => task.steps?.filter((s) => taskSteps[s.id]).length ?? 0,
    [task.steps, taskSteps],
  );

  if (!hydrated || !hasCompletedOnboarding) return null;

  function toggleStep(stepId) {
    setAllSteps((prev) => ({
      ...prev,
      [task.id]: { ...(prev[task.id] ?? {}), [stepId]: !(prev[task.id]?.[stepId] ?? false) },
    }));
  }
  const markInProgress = () => setStatuses((p) => ({ ...p, [task.id]: 'in-progress' }));
  const markComplete = () => setStatuses((p) => ({ ...p, [task.id]: 'complete' }));
  const markIncomplete = () => setStatuses((p) => ({ ...p, [task.id]: 'not-started' }));

  const isComplete = status === 'complete';
  const isInProgress = status === 'in-progress';

  return (
    <article className="flow" data-flow="l">
      {/* Back */}
      <Link
        href="/checklist"
        className="inline-flex items-center gap-2xs text-step-d1 text-ual-dark no-underline hover:text-ual-orange focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ual-orange"
      >
        ← Back to setup list
      </Link>

      {/* Tags */}
      <div className="cluster" data-justify="flex-start">
        <span className="inline-block bg-ual-dark px-xs py-3xs text-step-d1 font-ual-bold tracking-wider text-ual-light uppercase">
          Essential
        </span>
        {isComplete && (
          <span className="inline-block border-2 border-ual-dark px-xs py-3xs text-step-d1 font-ual-bold tracking-wider text-ual-dark uppercase">
            Complete
          </span>
        )}
      </div>

      <h1 className="text-step-4/ual-condensed">{task.title}</h1>

      {task.steps && <p>{task.shortDescription}</p>}

      {/* Sub-steps */}
      {task.steps && task.steps.length > 0 && (
        <section aria-labelledby="steps-heading" className="flow" data-flow="s">
          <h2 id="steps-heading">Steps to complete</h2>
          <Progress
            value={stepsDone}
            max={stepsTotal}
            label={`${stepsDone} of ${stepsTotal} complete`}
          />
          <p className="text-step-d1 text-ual-medium">
            {stepsDone} of {stepsTotal} complete
          </p>
          <ul className="flow" data-flow="2xs" role="list">
            {task.steps.map((step) => (
              <StepRow
                key={step.id}
                step={step}
                done={Boolean(taskSteps[step.id])}
                onToggle={() => toggleStep(step.id)}
                isTaskComplete={isComplete}
              />
            ))}
          </ul>
        </section>
      )}

      {/* Content sections */}
      {task.sections?.map((section, i) => (
        <ContentSection key={i} section={section} />
      ))}

      {/* CTA */}
      <a
        href={task.cta.href}
        className="button flex w-full justify-center"
        target="_blank"
        rel="noreferrer"
      >
        {task.cta.label} →<span className="visually-hidden"> (opens in a new tab)</span>
      </a>

      {/* Progress controls */}
      <section aria-labelledby="progress-heading" className="flow" data-flow="2xs">
        <p id="progress-heading" className="text-step-d1 text-ual-medium">
          Your progress
        </p>
        {isComplete ? (
          <button
            type="button"
            className="button flex w-full items-center justify-center gap-xs bg-ual-dark text-ual-light"
            onClick={markIncomplete}
          >
            <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" width="18" height="18">
              <path
                d="M4 10l4.5 4.5L16 7"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Marked as complete
          </button>
        ) : isInProgress ? (
          <button
            type="button"
            className="button flex w-full justify-center"
            onClick={markComplete}
          >
            Mark as complete
          </button>
        ) : (
          <button
            type="button"
            className="button flex w-full justify-center"
            data-ghost-button
            onClick={markInProgress}
          >
            Mark as in progress
          </button>
        )}
      </section>

      {/* Minimal CSS — only irreducible patterns (pseudo-elements, attribute selectors) */}
      <style>{`
        .step-row__title[data-done] { text-decoration: line-through; color: var(--color-medium); }
        .step-row__title a:hover { color: var(--color-orange); }
        .task-accordion summary { cursor: pointer; font-weight: var(--font-weight-bold); font-size: var(--step--1); list-style: none; display: flex; align-items: center; justify-content: space-between; gap: var(--space-xs); padding: var(--space-xs) 0; border-block-end: 1px solid var(--color-dark--tint-90); }
        .task-accordion summary::-webkit-details-marker { display: none; }
        .task-accordion summary::after { content: '›'; font-size: var(--step-1); transition: transform 0.15s; }
        .task-accordion[open] summary::after { transform: rotate(90deg); }
        .task-accordion__body { padding-block-start: var(--space-xs); }
        .task-accordion__body li { font-size: var(--step--1); padding: var(--space-3xs) 0; }
        .content-section h2 { font-size: var(--step-0); font-weight: var(--font-weight-bold); margin-block-end: var(--space-2xs); }
      `}</style>
    </article>
  );
}

function StepRow({ step, done, onToggle, isTaskComplete }) {
  const [open, setOpen] = useState(false);
  const hasDetails = step.details?.length > 0;

  return (
    <li className="flex items-start gap-s border-2 border-ual-dark-90 bg-ual-light p-s">
      <button
        type="button"
        className="shrink-0 cursor-pointer border-0 bg-transparent p-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ual-orange disabled:cursor-default"
        style={{ marginBlockStart: '2px' }}
        onClick={onToggle}
        aria-pressed={done}
        aria-label={done ? `${step.title} — done, click to undo` : `Mark "${step.title}" as done`}
        disabled={isTaskComplete}
      >
        <StatusCircle status={done ? 'complete' : 'not-started'} size={18} />
      </button>

      <div className="flow min-w-0 grow" data-flow="2xs">
        <p className="step-row__title text-step-0 font-ual-bold" data-done={done || undefined}>
          {step.href ? (
            <a
              href={step.href}
              target="_blank"
              rel="noreferrer"
              className="text-inherit no-underline"
            >
              {step.title}
            </a>
          ) : (
            step.title
          )}
        </p>
        {hasDetails && (
          <details className="task-accordion" open={open} onToggle={(e) => setOpen(e.target.open)}>
            <summary>{"What you'll need to do"}</summary>
            <div className="task-accordion__body">
              <ol style={{ paddingInlineStart: 'var(--space-m)', margin: 0 }}>
                {step.details.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ol>
            </div>
          </details>
        )}
      </div>
    </li>
  );
}

function ContentSection({ section }) {
  if (section.type === 'accordion') {
    return (
      <details className="task-accordion">
        <summary>{section.title}</summary>
        <div className="task-accordion__body">
          <ul role="list">
            {section.items?.map((item, i) => (
              <li key={i} className="py-3xs text-step-d1">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </details>
    );
  }
  return (
    <section className="flow" data-flow="2xs">
      <h2 className="text-step-0 font-ual-bold">{section.title}</h2>
      {section.body && <p className="text-step-0 text-ual-dark">{section.body}</p>}
    </section>
  );
}
