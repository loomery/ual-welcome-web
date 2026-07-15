'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MFA_PATHS, MFA_HELP, MFA_READ_MORE, visibleTasks } from '../../data/checklist';
import { usePersistedState } from '../../hooks/usePersistedState';
import { useOnboardingProfile } from '../../hooks/useOnboardingProfile';
import { TaskAction } from '../../components/Checklist/TaskAction';
import {
  ArrowRightIcon,
  InfoIcon,
  ChevronRightIcon,
  CheckCircleOutlineIcon,
} from '../../components/Icon/NavIcons';

const STATUS_KEY = 'ual:task:status:v1';

/** Compact tab labels for the set-up options (matches Figma). */
const PATH_TAB_LABEL = {
  'two-device': 'Smartphone and another device (recommended)',
  'one-device': 'Smartphone only',
};

/**
 * Multi-factor authentication (MFA) setup. The student chooses a set-up option
 * (a compact toggle, not cards) and follows a numbered list of steps with
 * inline actions. Overall task completion persists to localStorage so it feeds
 * the dashboard; individual steps are not separately tracked.
 */
export function MfaScreen() {
  const router = useRouter();
  const { profile, isComplete: hasCompletedOnboarding, hydrated } = useOnboardingProfile();
  const [statuses, setStatuses] = usePersistedState(STATUS_KEY, {});
  const [pathId, setPathId] = useState(MFA_PATHS[0].id);

  useEffect(() => {
    if (hydrated && !hasCompletedOnboarding) {
      router.replace('/onboarding');
    }
  }, [hydrated, hasCompletedOnboarding, router]);

  const path = useMemo(() => MFA_PATHS.find((p) => p.id === pathId) ?? MFA_PATHS[0], [pathId]);

  if (!hydrated || !hasCompletedOnboarding) return null;

  const taskComplete = statuses.mfa === 'complete';

  // "Go to next task" targets the next task that has its own page.
  const tasks = visibleTasks(profile?.studentType, profile?.studentStatus);
  const mfaIndex = tasks.findIndex((t) => t.id === 'mfa');
  const nextTask =
    mfaIndex >= 0
      ? tasks.slice(mfaIndex + 1).find((t) => t.detail || t.cta?.href?.startsWith('/'))
      : undefined;
  const nextTaskHref = nextTask
    ? nextTask.detail
      ? `/checklist/${nextTask.id}`
      : nextTask.cta.href
    : '/checklist';

  function toggleComplete() {
    setStatuses((prev) => ({ ...prev, mfa: prev.mfa === 'complete' ? 'in-progress' : 'complete' }));
  }

  return (
    <article className="flex flex-col gap-8">
      <header className="flex flex-col gap-3">
        <h1 className="text-step-4/ual-condensed font-bold tracking-ual-tight text-ual-dark">
          Multi-factor authentication (MFA)
        </h1>
        <p className="max-w-200 text-step-1 text-ual-medium">
          MFA adds a step when logging in to verify your identity. It’s a way of double checking
          that you are the user of your personal account.
        </p>
      </header>

      <section aria-labelledby="mfa-register-heading" className="flex flex-col gap-3">
        <h2
          id="mfa-register-heading"
          className="text-step-2 font-bold tracking-ual-tight text-ual-dark"
        >
          Register for MFA
        </h2>
        <p className="max-w-200 text-step-0 text-ual-dark">
          You’ll need access to your smartphone to register for MFA. You may also need a tablet or a
          laptop to start the registration process.
        </p>
      </section>

      <section aria-labelledby="mfa-steps-heading" className="flex flex-col gap-4">
        <h2
          id="mfa-steps-heading"
          className="text-step-2 font-bold tracking-ual-tight text-ual-dark"
        >
          Set up steps
        </h2>

        <div
          role="radiogroup"
          aria-label="Choose how to set up MFA"
          className="flex flex-wrap gap-x-6 border-b border-ual-dark-90"
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
                  '-mb-px cursor-pointer border-b-2 px-1 py-3 text-step-0 tracking-ual-tight transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ual-orange',
                  selected
                    ? 'border-ual-dark font-ual-bold text-ual-dark'
                    : 'border-transparent font-ual-normal text-ual-medium hover:text-ual-orange',
                ].join(' ')}
              >
                {PATH_TAB_LABEL[p.id] ?? p.title}
              </button>
            );
          })}
        </div>

        <p className="flex max-w-200 items-start gap-2 text-step-d1 text-ual-medium">
          <InfoIcon className="mt-0.5 size-5 shrink-0 text-ual-dark" aria-hidden="true" />
          Setting up on two devices prevents you from getting locked out if you lose your original
          device.
        </p>

        <ol className="flex flex-col border-t border-ual-dark-90">
          {path.steps.map((step, i) => (
            <li key={step.id} className="flex items-start gap-4 border-b border-ual-dark-90 py-6">
              <div className="flex min-w-0 grow flex-col gap-3">
                <p className="max-w-200 text-step-0/ual-default text-ual-dark">
                  <span className="font-ual-bold">{i + 1}.</span> {step.text}
                </p>
                <TaskAction cta={step.cta} apps={step.apps} />
              </div>
              <ChevronRightIcon aria-hidden="true" className="mt-1 size-5 shrink-0 text-ual-dark" />
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="mfa-progress-heading" className="flex flex-col gap-4">
        <p id="mfa-progress-heading" className="text-step-d1 text-ual-medium">
          Your progress
        </p>
        <div className="flex flex-wrap items-stretch gap-x-10 gap-y-4">
          <button
            type="button"
            onClick={toggleComplete}
            className="inline-flex min-h-11 cursor-pointer items-center gap-3 border-2 border-ual-dark bg-ual-dark px-6 py-4 text-step-0/ual-condensed font-ual-normal text-ual-light no-underline transition-colors duration-200 hover:border-ual-orange hover:bg-ual-orange hover:text-ual-dark focus-visible:border-ual-orange focus-visible:bg-ual-orange focus-visible:text-ual-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ual-orange active:scale-[0.99] [&>svg]:size-6"
          >
            {taskComplete ? 'Marked as complete' : 'Mark as complete'}
            <CheckCircleOutlineIcon aria-hidden="true" />
          </button>
          <Link
            href={nextTaskHref}
            className="inline-flex items-center gap-3 self-end border-b border-ual-dark-90 pb-3 text-step-0 text-ual-dark no-underline hover:text-ual-orange focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ual-orange [&>svg]:size-5"
          >
            Go to next task
            <ArrowRightIcon aria-hidden="true" />
          </Link>
        </div>
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
