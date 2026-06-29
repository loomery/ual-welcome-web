'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MFA_PATHS, MFA_HELP, MFA_READ_MORE } from '../../data/checklist';
import { usePersistedState } from '../../hooks/usePersistedState';
import { useOnboardingProfile } from '../../hooks/useOnboardingProfile';
import { StatusCircle } from '../../components/StatusCircle/StatusCircle';
import { TaskAction } from '../../components/Checklist/TaskAction';
import { ArrowRightIcon, CheckCircleIcon } from '../../components/Icon/NavIcons';

const STATUS_KEY = 'ual:task:status:v1';
const STEPS_KEY = 'ual:task:steps:v1';

/**
 * Multi-factor authentication (MFA) setup. The student picks one of two
 * registration paths; each path has its own ordered step list with inline
 * actions. Step completion and the overall task status persist to
 * localStorage so progress survives a refresh and feeds the dashboard.
 */
export function MfaScreen() {
  const router = useRouter();
  const { isComplete: hasCompletedOnboarding, hydrated } = useOnboardingProfile();
  const [statuses, setStatuses] = usePersistedState(STATUS_KEY, {});
  const [allSteps, setAllSteps] = usePersistedState(STEPS_KEY, {});
  const [pathId, setPathId] = useState(MFA_PATHS[0].id);

  useEffect(() => {
    if (hydrated && !hasCompletedOnboarding) {
      router.replace('/onboarding');
    }
  }, [hydrated, hasCompletedOnboarding, router]);

  const path = useMemo(() => MFA_PATHS.find((p) => p.id === pathId) ?? MFA_PATHS[0], [pathId]);
  const stepsKey = `mfa:${path.id}`;
  const stepState = useMemo(() => allSteps[stepsKey] ?? {}, [allSteps, stepsKey]);

  const doneCount = useMemo(
    () => path.steps.filter((s) => stepState[s.id]).length,
    [path.steps, stepState],
  );

  if (!hydrated || !hasCompletedOnboarding) return null;

  const taskComplete = statuses.mfa === 'complete';

  function toggleStep(stepId) {
    setAllSteps((prev) => ({
      ...prev,
      [stepsKey]: { ...(prev[stepsKey] ?? {}), [stepId]: !(prev[stepsKey]?.[stepId] ?? false) },
    }));
  }

  function toggleComplete() {
    setStatuses((prev) => ({ ...prev, mfa: prev.mfa === 'complete' ? 'in-progress' : 'complete' }));
  }

  return (
    <article className="flex flex-col gap-8">
      <Link
        href="/checklist"
        className="inline-flex w-fit items-center gap-1 text-step-d1 text-ual-medium underline underline-offset-2 hover:text-ual-orange focus-visible:outline-2 focus-visible:outline-ual-dark"
      >
        &larr; Back to setup list
      </Link>

      <header className="flex flex-col gap-3">
        <h1 className="text-step-4/ual-condensed font-bold tracking-ual-tight text-ual-dark">
          Multi-factor authentication (MFA)
        </h1>
        <p className="text-step-1 text-ual-medium">
          You need to complete these tasks in order to start your term
        </p>
      </header>

      <div
        role="radiogroup"
        aria-label="Choose how to set up MFA"
        className="grid gap-4 md:grid-cols-2"
      >
        {MFA_PATHS.map((p) => {
          const selected = p.id === path.id;
          return (
            <button
              key={p.id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => setPathId(p.id)}
              className={[
                'flex cursor-pointer flex-col gap-2 p-6 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ual-orange',
                selected ? 'bg-ual-dark text-ual-light' : 'bg-ual-shade text-ual-dark',
              ].join(' ')}
            >
              <span className="flex items-start justify-between gap-3">
                <span
                  className={[
                    'inline-block w-fit px-2 py-1 text-step-d1 font-bold',
                    selected ? 'bg-ual-light text-ual-dark' : 'bg-ual-dark text-ual-light',
                  ].join(' ')}
                >
                  {p.badge}
                </span>
                {selected && (
                  <span className="text-ual-util-green" aria-hidden="true">
                    <CheckCircleIcon />
                  </span>
                )}
              </span>
              <span className="text-step-1 font-bold tracking-ual-tight">{p.title}</span>
              <span className="text-step-d1/ual-default opacity-80">{p.body}</span>
            </button>
          );
        })}
      </div>

      <section aria-labelledby="mfa-steps-heading" className="flex flex-col gap-4">
        <h2
          id="mfa-steps-heading"
          className="text-step-2 font-bold tracking-ual-tight text-ual-dark"
        >
          Steps to complete
        </h2>
        <p className="text-step-d1 text-ual-medium">
          {doneCount} of {path.steps.length} complete
        </p>

        <ol role="list" className="flex flex-col">
          {path.steps.map((step) => {
            const done = Boolean(stepState[step.id]);
            return (
              <li key={step.id} className="flex gap-4 border-t border-ual-dark/10 py-6">
                <button
                  type="button"
                  onClick={() => toggleStep(step.id)}
                  aria-pressed={done}
                  aria-label={done ? 'Done, click to undo' : 'Mark step as done'}
                  className="mt-1 shrink-0 cursor-pointer rounded-full border-0 bg-transparent p-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ual-orange"
                >
                  <StatusCircle status={done ? 'complete' : 'not-started'} size={22} />
                </button>

                <div className="flex min-w-0 grow flex-col gap-2">
                  <p className="text-step-0/ual-default text-ual-dark">{step.text}</p>
                  <TaskAction cta={step.cta} apps={step.apps} />
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      <section aria-labelledby="mfa-progress-heading" className="flex flex-col gap-2">
        <p id="mfa-progress-heading" className="text-step-d1 font-bold text-ual-dark">
          Your progress
        </p>
        <button
          type="button"
          className="inline-flex min-h-11 cursor-pointer items-center gap-2 border-2 border-ual-dark bg-ual-dark p-4 font-main text-step-0/ual-condensed font-ual-bold text-ual-light no-underline transition-[background-color,border-color,color] duration-200 hover:border-ual-orange hover:bg-ual-orange hover:text-ual-dark focus-visible:border-ual-orange focus-visible:bg-ual-orange focus-visible:text-ual-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ual-orange active:scale-[0.99] active:border-(--color-orange-pressed) active:bg-(--color-orange-pressed) active:text-ual-dark"
          onClick={toggleComplete}
        >
          {taskComplete ? 'Marked as complete' : 'Mark as complete'}
        </button>
      </section>

      <section aria-labelledby="mfa-help-heading" className="flex flex-col gap-4">
        <h2
          id="mfa-help-heading"
          className="text-step-2 font-bold tracking-ual-tight text-ual-dark"
        >
          Get help
        </h2>
        <p className="text-step-d1 text-ual-medium">{MFA_HELP.title}</p>
        <ul role="list" className="grid gap-6 md:grid-cols-3">
          {MFA_HELP.channels.map((channel) => (
            <li key={channel.id}>
              <a
                href={channel.href}
                target={channel.href.startsWith('http') ? '_blank' : undefined}
                rel={channel.href.startsWith('http') ? 'noreferrer' : undefined}
                className="group flex flex-col gap-2 focus-visible:outline-2 focus-visible:outline-ual-dark"
              >
                <span className="text-step-1 font-bold text-ual-dark group-hover:text-ual-orange">
                  {channel.label}
                </span>
                <span className="text-ual-dark group-hover:text-ual-orange">
                  <ArrowRightIcon width={20} height={20} aria-hidden="true" />
                </span>
                <span className="text-step-d1 text-ual-medium">{channel.value}</span>
                {channel.note && (
                  <span className="text-step-d1 text-ual-medium">{channel.note}</span>
                )}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <a
        href={MFA_READ_MORE.href}
        target="_blank"
        rel="noreferrer"
        className="group flex items-center justify-between gap-6 bg-ual-dark p-8 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ual-light"
      >
        <span className="text-step-2 font-bold tracking-ual-tight text-ual-light group-hover:text-ual-orange">
          {MFA_READ_MORE.label}
        </span>
        <ArrowRightIcon
          width={28}
          height={28}
          aria-hidden="true"
          className="shrink-0 text-ual-light group-hover:text-ual-orange"
        />
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    </article>
  );
}
