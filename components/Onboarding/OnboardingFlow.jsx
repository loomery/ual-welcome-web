'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../Button/Button';
import { ChevronLeftIcon, ArrowRightIcon } from '../Icon/NavIcons';
import { useOnboardingProfile } from '../../hooks/useOnboardingProfile';
import { asset } from '../../utils/asset';
import { IntroStep } from './steps/IntroStep';
import { NameStep } from './steps/NameStep';
import { CollegeStep } from './steps/CollegeStep';
import { YearStep } from './steps/YearStep';
import { StudentTypeStep } from './steps/StudentTypeStep';
import { VisaStatusStep } from './steps/VisaStatusStep';
import { InterestsStep } from './steps/InterestsStep';
import { FinishStep } from './steps/FinishStep';

const ALL_STEPS = [
  'intro',
  'name',
  'college',
  'year',
  'studentType',
  'visaStatus',
  'interests',
  'finish',
];

/**
 * Multi-step onboarding flow.
 *
 * This component owns the navigation state (step index, direction, draft)
 * and delegates all rendering to the per-step components in ./steps/.
 *
 * Local-first state: the draft is patched to localStorage on every "next"
 * so a mid-flow refresh doesn't lose progress. `commit()` stamps
 * `completedAt` and unlocks the dashboard gate.
 */
export function OnboardingFlow() {
  const router = useRouter();
  const { profile, patch, commit, reset } = useOnboardingProfile();

  const [stepIndex, setStepIndex] = useState(0);
  const [direction, setDirection] = useState(/** @type {'forward' | 'back'} */ ('forward'));
  const headingRef = useRef(/** @type {HTMLHeadingElement | null} */ (null));

  const [draft, setDraft] = useState(() => ({
    name: profile?.name ?? '',
    collegeId: profile?.collegeId ?? '',
    year: profile?.year ?? '',
    studentType: profile?.studentType ?? '',
    visaStatus: profile?.visaStatus ?? '',
    interests: profile?.interests ?? [],
  }));

  const activeSteps = useMemo(() => {
    let steps = ALL_STEPS;
    if (draft.studentType !== 'international') {
      steps = steps.filter((s) => s !== 'visaStatus');
    }
    return steps;
  }, [draft.studentType]);

  const stepId = activeSteps[stepIndex];
  const nextStepId = activeSteps[stepIndex + 1];
  const isLast = stepIndex === activeSteps.length - 1;

  // Move keyboard focus to the step heading whenever the step changes
  useEffect(() => {
    headingRef.current?.focus();
  }, [stepIndex]);

  const canAdvance = useMemo(() => {
    switch (stepId) {
      case 'name':
        return draft.name.trim().length >= 1;
      case 'college':
        return Boolean(draft.collegeId);
      case 'year':
        return Boolean(draft.year);
      case 'studentType':
        return Boolean(draft.studentType);
      case 'visaStatus':
        return Boolean(draft.visaStatus);
      default:
        return true;
    }
  }, [stepId, draft]);

  // Trap the browser back gesture so a trackpad swipe can't escape the flow
  // mid-onboarding. We push a duplicate history entry on mount; popstate
  // fires when the user navigates back and we immediately re-push to keep
  // the URL at /onboarding. asset() prefixes the deploy sub-path — pushState
  // bypasses Next's basePath handling, so a bare '/onboarding' would rewrite
  // the URL to the host root on a sub-path deploy (e.g. /student-centre).
  // The listener is removed on unmount (when the flow navigates away
  // intentionally via replace).
  useEffect(() => {
    window.history.pushState(null, '', asset('/onboarding'));

    function trapBack() {
      window.history.pushState(null, '', asset('/onboarding'));
    }

    window.addEventListener('popstate', trapBack);
    return () => window.removeEventListener('popstate', trapBack);
  }, []);

  function goNext() {
    if (!canAdvance) return;
    patch(stepSlice(stepId, draft));
    if (isLast) {
      commit();
      router.replace('/');
      return;
    }
    setDirection('forward');
    setStepIndex((i) => Math.min(i + 1, activeSteps.length - 1));
  }

  function goBack() {
    if (stepIndex === 0) return;
    setDirection('back');
    setStepIndex((i) => Math.max(i - 1, 0));
  }

  function skipStep() {
    patch(stepSlice(stepId, draft));
    setDirection('forward');
    setStepIndex((i) => Math.min(i + 1, activeSteps.length - 1));
  }

  function handleSkip() {
    patch(stepSlice(stepId, draft));
    commit();
    router.replace('/');
  }

  function handleStartOver() {
    reset();
    setDraft({
      name: '',
      collegeId: '',
      year: '',
      studentType: '',
      visaStatus: '',
      interests: [],
    });
    setStepIndex(0);
  }

  const progressTotal = activeSteps.length - 2;
  const progressCurrent = Math.max(0, Math.min(stepIndex, progressTotal));

  return (
    <div
      className={[
        'mx-auto w-full py-4 md:py-0',
        stepId === 'intro' ? 'max-w-grid' : 'max-w-[57.6rem]',
      ].join(' ')}
    >
      {/* ── TOP BAR — back button + progress bar + skip ────────────────── */}
      {stepId !== 'intro' && stepId !== 'finish' && (
        <div className="mb-6 flex items-center gap-4">
          <button
            type="button"
            onClick={goBack}
            aria-label="Go back to previous step"
            className="-ms-2 inline-flex cursor-pointer items-center gap-1 border-0 bg-transparent p-2 text-step-d1 text-ual-dark hover:text-ual-orange focus-visible:text-ual-orange focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ual-orange"
          >
            <ChevronLeftIcon width="14" height="14" aria-hidden="true" />
            <span>Back</span>
          </button>

          <div
            className="h-2 grow overflow-hidden bg-ual-dark-90"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={progressTotal}
            aria-valuenow={progressCurrent}
            aria-label={`Step ${progressCurrent} of ${progressTotal}`}
          >
            <div
              className="h-full bg-ual-dark transition-[width] duration-400 ease-ual"
              style={{ width: `${(progressCurrent / progressTotal) * 100}%` }}
            />
          </div>

          <button
            type="button"
            onClick={skipStep}
            className="cursor-pointer border-0 bg-transparent p-2 text-step-d1 font-ual-bold text-ual-medium underline underline-offset-4 hover:text-ual-orange focus-visible:text-ual-orange focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ual-orange"
          >
            Skip
          </button>
        </div>
      )}

      {/* ── STEP CONTENT ───────────────────────────────────────────────── */}
      <div className="mb-8">
        <div
          key={stepId}
          className="space-y-6"
          style={{
            animation: `${
              direction === 'forward' ? 'onboardSlideIn' : 'onboardSlideInBack'
            } 280ms cubic-bezier(0.4, 0, 0.2, 1) both`,
          }}
        >
          {stepId === 'intro' && (
            <IntroStep
              headingRef={headingRef}
              hasExistingProfile={Boolean(profile?.completedAt)}
              onResume={() => router.push('/')}
              onStartOver={handleStartOver}
              onNewStudent={goNext}
              onReturningStudent={handleSkip}
            />
          )}
          {stepId === 'name' && (
            <NameStep
              headingRef={headingRef}
              value={draft.name}
              onChange={(v) => setDraft((d) => ({ ...d, name: v }))}
              onSubmit={goNext}
            />
          )}
          {stepId === 'college' && (
            <CollegeStep
              headingRef={headingRef}
              value={draft.collegeId}
              onChange={(v) => setDraft((d) => ({ ...d, collegeId: v }))}
            />
          )}
          {stepId === 'year' && (
            <YearStep
              headingRef={headingRef}
              value={draft.year}
              onChange={(v) => setDraft((d) => ({ ...d, year: v }))}
            />
          )}
          {stepId === 'studentType' && (
            <StudentTypeStep
              headingRef={headingRef}
              value={draft.studentType}
              onChange={(v) => setDraft((d) => ({ ...d, studentType: v }))}
            />
          )}
          {stepId === 'visaStatus' && (
            <VisaStatusStep
              headingRef={headingRef}
              value={draft.visaStatus}
              onChange={(v) => setDraft((d) => ({ ...d, visaStatus: v }))}
            />
          )}
          {stepId === 'interests' && (
            <InterestsStep
              headingRef={headingRef}
              value={draft.interests}
              onChange={(v) => setDraft((d) => ({ ...d, interests: v }))}
            />
          )}
          {stepId === 'finish' && <FinishStep headingRef={headingRef} draft={draft} />}
        </div>
      </div>

      {stepId !== 'intro' && (
        <Button
          weight="normal"
          className="w-full justify-between whitespace-nowrap md:w-auto md:min-w-[18rem]"
          onClick={goNext}
          disabled={!canAdvance}
        >
          {isLast ? 'Open my hub' : ctaLabel(nextStepId)}
          <ArrowRightIcon aria-hidden="true" />
        </Button>
      )}
    </div>
  );
}

/** @param {string} [nextStepId] */
function ctaLabel(nextStepId) {
  switch (nextStepId) {
    case 'college':
      return 'Next, select college/institute';
    case 'year':
      return 'Next, select year of study';
    case 'studentType':
      return 'Next, select student type';
    case 'visaStatus':
      return 'Next, confirm visa status';
    case 'interests':
      return 'Next, select your interests';
    case 'finish':
      return 'Next, view summary';
    default:
      return 'Continue';
  }
}

/**
 * Returns the draft slice relevant to the given step so only that
 * step's data is patched to the persisted profile on "next".
 *
 * @param {string} stepId
 * @param {Object} draft
 */
function stepSlice(stepId, draft) {
  switch (stepId) {
    case 'name':
      return { name: draft.name.trim() };
    case 'college':
      return { collegeId: draft.collegeId };
    case 'year':
      return { year: draft.year };
    case 'studentType':
      return { studentType: draft.studentType };
    case 'visaStatus':
      return { visaStatus: draft.visaStatus };
    case 'interests':
      return { interests: draft.interests };
    default:
      return {};
  }
}
