'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { usePersistedState } from '../../hooks/usePersistedState';
import { Progress } from '../../components/Progress/Progress';

const STATUS_KEY = 'ual:task:status:v1';
const STEPS_KEY = 'ual:task:steps:v1';

/**
 * Task detail page — rich content, sub-steps, progress tracking.
 *
 * @param {{ task: import('../../data/checklist').Task }} props
 */
export function TaskDetailScreen({ task }) {
  const [statuses, setStatuses] = usePersistedState(STATUS_KEY, {});
  const [allSteps, setAllSteps] = usePersistedState(STEPS_KEY, {});

  const status = statuses[task.id] ?? 'not-started';
  const taskSteps = useMemo(() => allSteps[task.id] ?? {}, [allSteps, task.id]);

  // Sub-step completion
  const stepsTotal = task.steps?.length ?? 0;
  const stepsDone = useMemo(
    () => task.steps?.filter((s) => taskSteps[s.id]).length ?? 0,
    [task.steps, taskSteps],
  );

  function toggleStep(stepId) {
    setAllSteps((prev) => ({
      ...prev,
      [task.id]: {
        ...(prev[task.id] ?? {}),
        [stepId]: !(prev[task.id]?.[stepId] ?? false),
      },
    }));
  }

  function markInProgress() {
    setStatuses((prev) => ({ ...prev, [task.id]: 'in-progress' }));
  }

  function markComplete() {
    setStatuses((prev) => ({ ...prev, [task.id]: 'complete' }));
  }

  function markIncomplete() {
    setStatuses((prev) => ({ ...prev, [task.id]: 'not-started' }));
  }

  const isComplete = status === 'complete';
  const isInProgress = status === 'in-progress';

  return (
    <article className="flow task-detail" data-flow="l">
      {/* Back link */}
      <Link href="/checklist" className="task-detail__back">
        ← Back to setup list
      </Link>

      {/* Tags */}
      <div className="cluster" data-justify="flex-start">
        <span className="tag tag--essential">Essential</span>
        {isComplete && <span className="tag tag--complete">Complete</span>}
      </div>

      {/* Title */}
      <h1 className="task-detail__title">{task.title}</h1>

      {/* Short description — for tasks with steps */}
      {task.steps && <p>{task.shortDescription}</p>}

      {/* Sub-steps section */}
      {task.steps && task.steps.length > 0 && (
        <section aria-labelledby="steps-heading" className="flow" data-flow="s">
          <h2 id="steps-heading">Steps to complete</h2>
          <Progress
            value={stepsDone}
            max={stepsTotal}
            label={`${stepsDone} of ${stepsTotal} complete`}
          />
          <p className="task-detail__steps-count">
            {stepsDone} of {stepsTotal} complete
          </p>

          <ul className="flow" data-flow="2xs" role="list">
            {task.steps.map((step) => {
              const done = Boolean(taskSteps[step.id]);
              return (
                <StepRow
                  key={step.id}
                  step={step}
                  done={done}
                  onToggle={() => toggleStep(step.id)}
                  isTaskComplete={isComplete}
                />
              );
            })}
          </ul>
        </section>
      )}

      {/* Content sections */}
      {task.sections &&
        task.sections.map((section, i) => <ContentSection key={i} section={section} />)}

      {/* Primary CTA */}
      <a href={task.cta.href} className="button task-detail__cta" target="_blank" rel="noreferrer">
        {task.cta.label} →<span className="visually-hidden"> (opens in a new tab)</span>
      </a>

      {/* Progress controls */}
      <section aria-labelledby="progress-heading" className="flow" data-flow="2xs">
        <p id="progress-heading" className="task-detail__progress-label">
          Your progress
        </p>
        {isComplete ? (
          <button
            type="button"
            className="button task-detail__progress-btn task-detail__progress-btn--complete"
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
          <button type="button" className="button task-detail__progress-btn" onClick={markComplete}>
            Mark as complete
          </button>
        ) : (
          <button type="button" className="button" data-ghost-button onClick={markInProgress}>
            Mark as in progress
          </button>
        )}
      </section>

      <style>{`
        .task-detail__back {
          display: inline-flex;
          align-items: center;
          color: var(--color-dark);
          font-size: var(--step--1);
          text-decoration: none;
          gap: var(--space-2xs);
        }
        .task-detail__back:hover,
        .task-detail__back:focus-visible {
          color: var(--color-orange);
        }
        .task-detail__back:focus-visible {
          outline: 2px solid var(--color-orange);
          outline-offset: 2px;
        }

        .tag {
          display: inline-block;
          font-size: var(--step--1);
          font-weight: var(--font-weight-bold);
          padding: var(--space-3xs) var(--space-xs);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .tag--essential {
          background: var(--color-dark);
          color: var(--color-light);
        }
        .tag--complete {
          background: transparent;
          color: var(--color-dark);
          border: 2px solid var(--color-dark);
        }

        .task-detail__title {
          font-size: var(--step-4);
          line-height: var(--line-height-condensed);
        }

        .task-detail__steps-count {
          font-size: var(--step--1);
          color: var(--color-medium);
        }

        .task-detail__cta {
          display: inline-flex;
          width: 100%;
          justify-content: center;
        }

        .task-detail__progress-label {
          font-size: var(--step--1);
          color: var(--color-medium);
        }

        .task-detail__progress-btn {
          width: 100%;
          justify-content: center;
        }

        .task-detail__progress-btn--complete {
          display: inline-flex;
          align-items: center;
          gap: var(--space-xs);
          background: var(--color-dark);
          color: var(--color-light);
        }

        /* Step rows */
        .step-row {
          display: flex;
          align-items: flex-start;
          gap: var(--space-s);
          padding: var(--space-s);
          border: 2px solid var(--color-dark--tint-90);
          background: var(--color-light);
        }
        .step-row__check {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          inline-size: 1.25rem;
          block-size: 1.25rem;
          border-radius: 999px;
          border: 2px solid var(--color-dark--tint-50);
          cursor: pointer;
          background: transparent;
          padding: 0;
          margin-block-start: 2px;
          transition: background 0.12s, border-color 0.12s;
        }
        .step-row__check[data-done] {
          background: var(--color-dark);
          border-color: var(--color-dark);
          color: var(--color-light);
        }
        .step-row__check:focus-visible {
          outline: 2px solid var(--color-orange);
          outline-offset: 2px;
        }
        .step-row__body {
          flex-grow: 1;
          min-inline-size: 0;
        }
        .step-row__title {
          font-weight: var(--font-weight-bold);
          font-size: var(--step-0);
        }
        .step-row__title a {
          color: inherit;
        }
        .step-row__title a:hover {
          color: var(--color-orange);
        }
        .step-row__title[data-done] {
          text-decoration: line-through;
          color: var(--color-medium);
        }

        /* Accordion */
        .task-accordion summary {
          cursor: pointer;
          font-weight: var(--font-weight-bold);
          font-size: var(--step--1);
          list-style: none;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--space-xs);
          padding: var(--space-xs) 0;
          border-block-end: 1px solid var(--color-dark--tint-90);
        }
        .task-accordion summary::-webkit-details-marker { display: none; }
        .task-accordion summary::after {
          content: '›';
          font-size: var(--step-1);
          transition: transform 0.15s;
        }
        .task-accordion[open] summary::after {
          transform: rotate(90deg);
        }
        .task-accordion__body {
          padding-block-start: var(--space-xs);
        }
        .task-accordion__body li {
          font-size: var(--step--1);
          padding: var(--space-3xs) 0;
          color: var(--color-dark);
        }

        /* Content section */
        .content-section h2 {
          font-size: var(--step-0);
          font-weight: var(--font-weight-bold);
          margin-block-end: var(--space-2xs);
        }
        .content-section p {
          font-size: var(--step-0);
          color: var(--color-dark);
        }
      `}</style>
    </article>
  );
}

/** Single sub-step row with toggle checkbox */
function StepRow({ step, done, onToggle, isTaskComplete }) {
  const [open, setOpen] = useState(false);
  const hasDetails = step.details && step.details.length > 0;

  return (
    <li className="step-row">
      <button
        type="button"
        className="step-row__check"
        onClick={onToggle}
        aria-pressed={done}
        aria-label={done ? `${step.title} — done, click to undo` : `Mark "${step.title}" as done`}
        data-done={done || undefined}
        disabled={isTaskComplete}
      >
        {done && (
          <svg
            viewBox="0 0 12 12"
            fill="none"
            aria-hidden="true"
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
      </button>

      <div className="step-row__body flow" data-flow="2xs">
        <p className="step-row__title" data-done={done || undefined}>
          {step.href ? (
            <a href={step.href} target="_blank" rel="noreferrer">
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

/** Rich content section — text or accordion */
function ContentSection({ section }) {
  if (section.type === 'accordion') {
    return (
      <details className="task-accordion content-section">
        <summary>{section.title}</summary>
        <div className="task-accordion__body">
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {section.items?.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      </details>
    );
  }

  return (
    <section className="content-section flow" data-flow="2xs">
      <h2>{section.title}</h2>
      {section.body && <p>{section.body}</p>}
    </section>
  );
}
