'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../Button/Button';
import { useOnboardingProfile } from '../../hooks/useOnboardingProfile';
import { INTEREST_OPTIONS } from '../../data/onboardingOptions';
import { IntroStep } from './steps/IntroStep';
import { NameStep } from './steps/NameStep';
import { CollegeStep } from './steps/CollegeStep';
import { StudyLevelStep } from './steps/StudyLevelStep';
import { YearStep } from './steps/YearStep';
import { StudentTypeStep } from './steps/StudentTypeStep';
import { VisaStatusStep } from './steps/VisaStatusStep';
import { InterestsStep } from './steps/InterestsStep';
import { FinishStep } from './steps/FinishStep';

const ALL_STEPS = [
  'intro',
  'name',
  'college',
  'studyLevel',
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
    studyLevel: profile?.studyLevel ?? '',
    year: profile?.year ?? '',
    studentType: profile?.studentType ?? '',
    visaStatus: profile?.visaStatus ?? '',
    interests: profile?.interests ?? [],
  }));

  const activeSteps = useMemo(() => {
    let steps = ALL_STEPS;
    // Year is only relevant for undergraduates — postgrad, pre-degree and
    // short-course students skip straight to StudentType.
    if (draft.studyLevel !== 'undergraduate') {
      steps = steps.filter((s) => s !== 'year');
    }
    // VisaStatus is only shown to international students.
    if (draft.studentType !== 'international') {
      steps = steps.filter((s) => s !== 'visaStatus');
    }
    return steps;
  }, [draft.studyLevel, draft.studentType]);

  // Interests available to this student — international students see the
  // additional "Visa & immigration" option; domestic students do not.
  const interestOptions = useMemo(
    () =>
      draft.studentType === 'international'
        ? INTEREST_OPTIONS
        : INTEREST_OPTIONS.filter((o) => !o.internationalOnly),
    [draft.studentType],
  );

  const stepId = activeSteps[stepIndex];
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
      case 'studyLevel':
        return Boolean(draft.studyLevel);
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
  // the URL at /onboarding. The listener is removed on unmount (when the
  // flow navigates away intentionally via replace).
  useEffect(() => {
    window.history.pushState(null, '', '/onboarding');

    function trapBack() {
      window.history.pushState(null, '', '/onboarding');
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
      studyLevel: '',
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
    <div className="onboarding-flow">
      {/* ── TOP BAR — back button + progress bar + skip ────────────────── */}
      {stepId !== 'intro' && stepId !== 'finish' && (
        <div className="onboarding-flow__topbar">
          <button
            type="button"
            onClick={goBack}
            aria-label="Go back to previous step"
            className="onboarding-flow__back"
          >
            <svg width="14" height="14" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path
                d="M11 3L5 9L11 15"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>Back</span>
          </button>

          <div
            className="onboarding-flow__progress"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={progressTotal}
            aria-valuenow={progressCurrent}
            aria-label={`Step ${progressCurrent} of ${progressTotal}`}
          >
            <div
              className="onboarding-flow__progress-bar"
              style={{ width: `${(progressCurrent / progressTotal) * 100}%` }}
            />
          </div>

          <button type="button" onClick={handleSkip} className="onboarding-flow__skip">
            Skip
          </button>
        </div>
      )}

      {/* ── STEP CONTENT ───────────────────────────────────────────────── */}
      <div className="onboarding-flow__content">
        <div
          key={stepId}
          className="flow"
          data-flow="m"
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
          {stepId === 'studyLevel' && (
            <StudyLevelStep
              headingRef={headingRef}
              value={draft.studyLevel}
              onChange={(v) => setDraft((d) => ({ ...d, studyLevel: v }))}
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
              options={interestOptions}
            />
          )}
          {stepId === 'finish' && <FinishStep headingRef={headingRef} draft={draft} />}
        </div>
      </div>

      {/* ── ACTION BAR ─────────────────────────────────────────────────── */}
      <div className="onboarding-flow__actions">
        <Button onClick={goNext} disabled={!canAdvance}>
          {stepId === 'intro'
            ? 'Get started'
            : isLast
              ? 'Open my hub'
              : stepId === 'interests'
                ? "Let's go"
                : 'Continue'}
        </Button>
        {stepId === 'intro' && (
          <Button ghost onClick={handleSkip}>
            Skip and show me everything
          </Button>
        )}
      </div>
    </div>
  );
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
    case 'studyLevel':
      return { studyLevel: draft.studyLevel };
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
