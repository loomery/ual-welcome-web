'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../Button/Button';
import { ChevronLeftIcon, ArrowRightIcon, WarningIcon } from '../Icon/NavIcons';
import { useOnboardingProfile } from '../../hooks/useOnboardingProfile';
import { visibleInterestOptions } from '../../data/onboardingOptions';
import { asset } from '../../utils/asset';
import { IntroStep } from './steps/IntroStep';
import { NameStep } from './steps/NameStep';
import { CollegeStep } from './steps/CollegeStep';
import { StudentTypeStep } from './steps/StudentTypeStep';
import { InterestsStep } from './steps/InterestsStep';
import { FinishStep } from './steps/FinishStep';

const STEPS = ['intro', 'name', 'college', 'studentType', 'interests', 'finish'];

/** Steps that require a choice, so they don't show a "Skip" button. */
const UNSKIPPABLE_STEPS = ['college', 'studentType'];

/**
 * Multi-step onboarding flow.
 *
 * Owns the navigation state (step index, direction, draft) and delegates
 * rendering to the per-step components in ./steps/. The draft is patched to
 * localStorage on every "next" so a mid-flow refresh keeps progress; the
 * finish step commits (stamps `completedAt`) and opens the hub or profile.
 */
export function OnboardingFlow() {
  const router = useRouter();
  const { profile, patch, commit, reset } = useOnboardingProfile();

  const [stepIndex, setStepIndex] = useState(0);
  const [direction, setDirection] = useState(/** @type {'forward' | 'back'} */ ('forward'));
  const [skipDialogOpen, setSkipDialogOpen] = useState(false);
  const headingRef = useRef(/** @type {HTMLHeadingElement | null} */ (null));
  const dialogRef = useRef(/** @type {HTMLDialogElement | null} */ (null));

  const [draft, setDraft] = useState(() => ({
    name: profile?.name ?? '',
    studentStatus: profile?.studentStatus ?? '',
    collegeId: profile?.collegeId ?? '',
    studentType: profile?.studentType ?? '',
    interests: profile?.interests ?? [],
  }));

  const steps = STEPS;

  const stepId = steps[stepIndex];
  const nextStepId = steps[stepIndex + 1];

  // Move keyboard focus to the step heading whenever the step changes.
  useEffect(() => {
    headingRef.current?.focus();
  }, [stepIndex]);

  const canAdvance = (() => {
    switch (stepId) {
      case 'name':
        return draft.name.trim().length >= 1;
      case 'college':
        return Boolean(draft.collegeId);
      case 'studentType':
        return Boolean(draft.studentType);
      default:
        return true;
    }
  })();

  // Trap the browser back gesture so a swipe can't escape mid-onboarding.
  // asset() prefixes the deploy sub-path — pushState bypasses Next's basePath.
  useEffect(() => {
    window.history.pushState(null, '', asset('/onboarding'));
    function trapBack() {
      window.history.pushState(null, '', asset('/onboarding'));
    }
    window.addEventListener('popstate', trapBack);
    return () => window.removeEventListener('popstate', trapBack);
  }, []);

  // Native <dialog> gives Escape-to-close, focus move and an inert modal
  // backdrop for free; just mirror open state onto it.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (skipDialogOpen && !dialog.open) dialog.showModal();
    else if (!skipDialogOpen && dialog.open) dialog.close();
  }, [skipDialogOpen]);

  function confirmSkipInterests() {
    setSkipDialogOpen(false);
    skipStep();
  }

  function goNext() {
    if (!canAdvance) return;
    patch(stepSlice(stepId, draft));
    setDirection('forward');
    setStepIndex((i) => Math.min(i + 1, steps.length - 1));
  }

  function goBack() {
    if (stepIndex === 0) return;
    setDirection('back');
    setStepIndex((i) => Math.max(i - 1, 0));
  }

  function skipStep() {
    patch(stepSlice(stepId, draft));
    setDirection('forward');
    setStepIndex((i) => Math.min(i + 1, steps.length - 1));
  }

  /** Landing → record new/returning and enter the flow. */
  function chooseStatus(studentStatus) {
    setDraft((d) => ({ ...d, studentStatus }));
    patch({ studentStatus });
    setDirection('forward');
    setStepIndex((i) => Math.min(i + 1, steps.length - 1));
  }

  function handleStartOver() {
    reset();
    setDraft({
      name: '',
      studentStatus: '',
      collegeId: '',
      studentType: '',
      interests: [],
    });
    setStepIndex(0);
  }

  function finishToHome() {
    commit();
    router.replace('/');
  }

  function finishToProfile() {
    commit();
    router.push('/profile');
  }

  // Progress spans the question steps only (exclude intro and finish).
  const progressTotal = steps.length - 2;
  const progressCurrent = Math.max(0, Math.min(stepIndex, progressTotal));

  const showChrome = stepId !== 'intro' && stepId !== 'finish';

  return (
    <div
      className={[
        'mx-auto w-full py-4 md:py-0',
        stepId === 'intro' ? 'max-w-grid' : 'max-w-[57.6rem]',
      ].join(' ')}
    >
      {/* ── TOP BAR — back + progress + skip ───────────────────────────── */}
      {showChrome && (
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

          {!UNSKIPPABLE_STEPS.includes(stepId) && (
            <button
              type="button"
              onClick={stepId === 'interests' ? () => setSkipDialogOpen(true) : skipStep}
              className="cursor-pointer border-0 bg-transparent p-2 text-step-d1 font-ual-bold text-ual-medium underline underline-offset-4 hover:text-ual-orange focus-visible:text-ual-orange focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ual-orange"
            >
              Skip
            </button>
          )}
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
              onNewStudent={() => chooseStatus('new')}
              onReturningStudent={() => chooseStatus('returning')}
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
          {stepId === 'studentType' && (
            <StudentTypeStep
              headingRef={headingRef}
              value={draft.studentType}
              onChange={(v) => setDraft((d) => ({ ...d, studentType: v }))}
            />
          )}
          {stepId === 'interests' && (
            <InterestsStep
              headingRef={headingRef}
              value={draft.interests}
              onChange={(v) => setDraft((d) => ({ ...d, interests: v }))}
              options={visibleInterestOptions(draft.studentType)}
            />
          )}
          {stepId === 'finish' && (
            <FinishStep
              headingRef={headingRef}
              onHome={finishToHome}
              onEditProfile={finishToProfile}
            />
          )}
        </div>
      </div>

      {showChrome && (
        <Button
          weight="normal"
          className="w-full justify-between whitespace-nowrap md:w-auto md:min-w-[18rem]"
          onClick={goNext}
          disabled={!canAdvance}
        >
          {ctaLabel(nextStepId)}
          <ArrowRightIcon aria-hidden="true" />
        </Button>
      )}

      <dialog
        ref={dialogRef}
        role="alertdialog"
        aria-labelledby="skip-dialog-title"
        aria-describedby="skip-dialog-desc"
        onCancel={() => setSkipDialogOpen(false)}
        onClick={(e) => {
          if (e.target === dialogRef.current) setSkipDialogOpen(false);
        }}
        className="m-auto w-[calc(100%-2rem)] max-w-[24rem] bg-ual-light backdrop:bg-ual-dark/50"
      >
        <div className="p-6">
          <div className="mb-3 flex items-center gap-2">
            <WarningIcon className="size-6 text-ual-util-orange" aria-hidden="true" />
            <h2 id="skip-dialog-title" className="text-step-1 font-ual-bold text-ual-dark">
              Skip interests
            </h2>
          </div>
          <p id="skip-dialog-desc" className="mb-6 text-step-d1 text-ual-medium">
            Are you sure you want to skip selecting topics you&apos;re interested in? Your home page
            will not display any interests.
          </p>
          <div className="flex gap-4">
            <Button variant="outline" weight="normal" onClick={() => setSkipDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              weight="normal"
              className="justify-between whitespace-nowrap"
              onClick={confirmSkipInterests}
            >
              Skip interests
              <ArrowRightIcon aria-hidden="true" />
            </Button>
          </div>
        </div>
      </dialog>
    </div>
  );
}

/** @param {string} [nextStepId] */
function ctaLabel(nextStepId) {
  switch (nextStepId) {
    case 'college':
      return 'Next, select your college';
    case 'studentType':
      return 'Next, select student type';
    case 'interests':
      return 'Next, select uni interests';
    case 'finish':
      return 'Next, view summary';
    default:
      return 'Continue';
  }
}

/**
 * Returns the draft slice for the given step so only that step's data is
 * patched to the persisted profile on "next".
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
    case 'studentType':
      return { studentType: draft.studentType };
    case 'interests':
      return { interests: draft.interests };
    default:
      return {};
  }
}
