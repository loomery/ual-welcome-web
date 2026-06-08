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
      <Link href="/checklist" className="back-link">
        ← Back to setup list
      </Link>

      {/* Status badges — Complete is always rendered to avoid layout shift on state change */}
      <div className="cluster" data-justify="flex-start">
        <span className="badge-filled">Essential</span>
        <span className="badge-outline" style={{ visibility: isComplete ? 'visible' : 'hidden' }}>
          Complete
        </span>
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

      {/* Secondary, link-styled help action */}
      {task.helpLink && (
        <a
          href={task.helpLink.href}
          className="step-help-link text-step-d1 text-ual-medium"
          target="_blank"
          rel="noreferrer"
        >
          {task.helpLink.label} →<span className="visually-hidden"> (opens in a new tab)</span>
        </a>
      )}

      {/* Primary CTA — optional; step-only tasks complete via the button below */}
      {task.cta && (
        <a href={task.cta.href} className="button" target="_blank" rel="noreferrer">
          {task.cta.label} →<span className="visually-hidden"> (opens in a new tab)</span>
        </a>
      )}

      {/* Progress controls — single button element to avoid layout shift between states */}
      <section aria-labelledby="progress-heading" className="flow" data-flow="2xs">
        <p id="progress-heading" className="text-step-d1 text-ual-medium">
          Your progress
        </p>
        <button
          type="button"
          className="button"
          data-ghost-button={!isComplete && !isInProgress ? '' : undefined}
          onClick={isComplete ? markIncomplete : isInProgress ? markComplete : markInProgress}
        >
          {/* Checkmark icon always occupies space — hidden until task is complete */}
          <svg
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
            width="18"
            height="18"
            style={{ visibility: isComplete ? 'visible' : 'hidden' }}
          >
            <path
              d="M4 10l4.5 4.5L16 7"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {isComplete
            ? 'Marked as complete'
            : isInProgress
              ? 'Mark as complete'
              : 'Mark as in progress'}
        </button>
      </section>

      {/* Only irreducible CSS — pseudo-elements and attribute selectors
          that can't be expressed as Tailwind or component classes. */}
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

        /* Rich step cards (e.g. "Set up your digital accounts") */
        .step-card { border: 1px solid var(--color-dark--tint-90); padding: var(--space-s); }
        .step-card[data-done] { background: var(--color-shade); }
        .step-desc { font-size: var(--step--1); color: var(--color-medium); line-height: 1.4; }
        /* Each action sits on its own line; width:fit-content keeps the hit area
           tight to the text/pill instead of spanning the card. */
        .step-cta { display: flex; align-items: center; width: fit-content; font-size: var(--step--1); font-weight: var(--font-weight-bold); color: var(--color-dark); text-decoration: underline; text-underline-offset: 2px; }
        .step-cta:hover { color: var(--color-orange); }
        .step-note { display: flex; align-items: center; gap: var(--space-3xs); width: fit-content; background: var(--color-shade); padding: var(--space-2xs) var(--space-xs); font-size: var(--step--1); color: var(--color-medium); }
        .step-apps { display: flex; align-items: center; flex-wrap: wrap; gap: var(--space-2xs); }
        .step-apps__label { font-size: var(--step--1); font-weight: var(--font-weight-bold); margin-inline-end: auto; }
        .step-apps__btn { border: 1px solid var(--color-dark--tint-90); padding: var(--space-3xs) var(--space-s); font-size: var(--step--1); color: var(--color-dark); text-decoration: none; }
        .step-apps__btn:hover { background: var(--color-shade); }

        /* "About your timetable"-style info box */
        .step-note-box { background: var(--color-shade); border: 1px solid var(--color-dark--tint-90); padding: var(--space-s); }
        .step-note-box__title { font-weight: var(--font-weight-bold); font-size: var(--step--1); }
        .step-note-box__body { font-size: var(--step--1); color: var(--color-medium); margin-block-start: var(--space-3xs); line-height: 1.4; }

        /* Secondary help link */
        .step-help-link { text-decoration: none; }
        .step-help-link:hover { color: var(--color-orange); }
      `}</style>
    </article>
  );
}

/**
 * @param {{ step: import('../../data/checklist').Step, done: boolean, onToggle: () => void, isTaskComplete: boolean }} props
 */
function StepRow({ step, done, onToggle, isTaskComplete }) {
  const [open, setOpen] = useState(false);
  const hasDetails = step.details?.length > 0;
  // Rich steps (description / inline action / app links / note) render as a
  // bordered card; plain title-only steps keep the original compact row.
  const isCard = Boolean(step.description || step.cta || step.apps || step.note);

  return (
    <li
      className={isCard ? 'task-row step-card' : 'task-row'}
      data-done={isCard && done ? '' : undefined}
    >
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

      <div className="flow min-w-0 grow" data-flow={isCard ? 'xs' : '2xs'}>
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

        {step.description && <p className="step-desc">{step.description}</p>}

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

        {step.note && (
          <span className="step-note">
            <span aria-hidden="true">ⓘ</span> {step.note}
          </span>
        )}

        {step.apps && (
          <div className="step-apps">
            <span className="step-apps__label">Download the app</span>
            {step.apps.apple && (
              <a href={step.apps.apple} className="step-apps__btn" target="_blank" rel="noreferrer">
                Apple<span className="visually-hidden"> (opens in a new tab)</span>
              </a>
            )}
            {step.apps.android && (
              <a
                href={step.apps.android}
                className="step-apps__btn"
                target="_blank"
                rel="noreferrer"
              >
                Android<span className="visually-hidden"> (opens in a new tab)</span>
              </a>
            )}
          </div>
        )}

        {step.cta && (
          <a href={step.cta.href} className="step-cta" target="_blank" rel="noreferrer">
            {step.cta.label} →<span className="visually-hidden"> (opens in a new tab)</span>
          </a>
        )}
      </div>
    </li>
  );
}

/**
 * @param {{ section: import('../../data/checklist').Section }} props
 */
function ContentSection({ section }) {
  if (section.type === 'note') {
    return (
      <aside className="step-note-box">
        <p className="step-note-box__title">
          <span aria-hidden="true">ⓘ</span> {section.title}
        </p>
        {section.body && <p className="step-note-box__body">{section.body}</p>}
      </aside>
    );
  }

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
    <section className="content-section flow" data-flow="2xs">
      <h2>{section.title}</h2>
      {section.body && <p className="text-step-0">{section.body}</p>}
    </section>
  );
}
