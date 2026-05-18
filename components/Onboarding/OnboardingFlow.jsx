'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../Button/Button';
import { INTEREST_ICONS } from '../Icon/InterestIcons';
import {
  COLLEGE_OPTIONS,
  STUDY_LEVEL_OPTIONS,
  YEAR_OPTIONS,
  INTEREST_OPTIONS,
} from '../../data/onboardingOptions';
import { useOnboardingProfile } from '../../hooks/useOnboardingProfile';

const STEPS = ['intro', 'name', 'college', 'studyLevel', 'year', 'interests', 'finish'];

/**
 * Multi-step onboarding flow.
 *
 * Visual language matches the rest of the UAL app:
 *  - Sharp, rectangular surfaces (no rounded pills or shadow lifts).
 *  - DS button (.button + data-ghost-button) for actions.
 *  - DS tag (.tag) and standfirst patterns for in-step copy.
 *  - Selectable tiles use a thin 2px black border + filled inversion
 *    on selection — same vocabulary as the DS button hover state.
 *
 * Local-first state: a draft in component state is patched to
 * localStorage on every "next" so a refresh mid-flow doesn't lose
 * progress; commit() stamps completedAt and unlocks the dashboard gate.
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
    interests: profile?.interests ?? [],
  }));

  const stepId = STEPS[stepIndex];
  const isLast = stepIndex === STEPS.length - 1;

  useEffect(() => {
    headingRef.current?.focus();
  }, [stepIndex]);

  const canAdvance = useMemo(() => {
    switch (stepId) {
      case 'intro':
        return true;
      case 'name':
        return draft.name.trim().length >= 1;
      case 'college':
        return Boolean(draft.collegeId);
      case 'studyLevel':
        return Boolean(draft.studyLevel);
      case 'year':
        return Boolean(draft.year);
      case 'interests':
        return true;
      case 'finish':
        return true;
      default:
        return false;
    }
  }, [stepId, draft]);

  function goNext() {
    if (!canAdvance) return;
    patch(stepSlice(stepId, draft));
    if (isLast) {
      commit();
      router.push('/');
      return;
    }
    setDirection('forward');
    setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
  }

  function goBack() {
    if (stepIndex === 0) return;
    setDirection('back');
    setStepIndex((i) => Math.max(i - 1, 0));
  }

  function handleSkip() {
    patch(stepSlice(stepId, draft));
    commit();
    router.push('/');
  }

  function handleStartOver() {
    reset();
    setDraft({
      name: '',
      collegeId: '',
      studyLevel: '',
      year: '',
      interests: [],
    });
    setStepIndex(0);
  }

  const progressTotal = STEPS.length - 2;
  const progressCurrent = Math.max(0, Math.min(stepIndex, progressTotal));

  return (
    <>
      <div
        style={{
          display: 'block',
          width: '100%',
          maxWidth: '42rem',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
        className="onboarding-flow"
      >
        {/* Top bar: back + progress + skip — only on question steps */}
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

        {/* Step content */}
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

        {/* Action bar — DS .button */}
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

      <style>{`
        .onboarding-flow {
          padding: var(--space-s) 0;
        }
        /* No vertical padding on desktop — the parent main is flex-centered
           with its own padding when /onboarding hides the AppShell chrome. */
        @media (min-width: 49.5rem) {
          .onboarding-flow {
            padding: 0;
          }
        }
        /* Scale the heading down inside the flow so the centered content
           block doesn't fill the viewport on desktop — that was crowding
           the Continue CTA flush with the bottom edge. step-3 keeps the
           editorial weight without dominating the column. */
        .onboarding-flow h1 {
          font-size: var(--step-3);
        }

        .onboarding-flow__topbar {
          align-items: center;
          display: flex;
          gap: var(--space-s);
          margin-block-end: var(--space-m);
        }
        .onboarding-flow__back {
          align-items: center;
          background: transparent;
          border: 0;
          color: var(--color-dark);
          cursor: pointer;
          display: inline-flex;
          font: inherit;
          font-size: var(--step--1);
          gap: var(--space-3xs);
          padding: var(--space-2xs);
          margin-inline-start: calc(var(--space-2xs) * -1);
        }
        .onboarding-flow__back:hover,
        .onboarding-flow__back:focus-visible {
          color: var(--color-orange);
        }
        .onboarding-flow__back:focus-visible {
          outline: 2px solid var(--color-orange);
          outline-offset: 2px;
        }

        .onboarding-flow__progress {
          background: var(--color-dark--tint-90);
          block-size: 4px;
          flex-grow: 1;
          overflow: hidden;
        }
        .onboarding-flow__progress-bar {
          background: var(--color-dark);
          block-size: 100%;
          transition: width 400ms cubic-bezier(0.4, 0, 0.2, 1);
        }

        .onboarding-flow__skip {
          background: transparent;
          border: 0;
          color: var(--color-medium);
          cursor: pointer;
          font: inherit;
          font-size: var(--step--1);
          font-weight: var(--font-weight-bold);
          padding: var(--space-2xs);
          text-decoration: underline;
          text-underline-offset: 4px;
        }
        .onboarding-flow__skip:hover,
        .onboarding-flow__skip:focus-visible {
          color: var(--color-orange);
        }
        .onboarding-flow__skip:focus-visible {
          outline: 2px solid var(--color-orange);
          outline-offset: 2px;
        }

        .onboarding-flow__content {
          margin-block-end: var(--space-l);
        }

        .onboarding-flow__actions {
          display: flex;
          flex-direction: column;
          gap: var(--space-2xs);
        }
        .onboarding-flow__actions .button {
          width: 100%;
          justify-content: center;
        }

        .onboarding-eyebrow {
          color: var(--color-orange);
          font-size: var(--step--1);
          font-weight: var(--font-weight-bold);
          letter-spacing: 0.06em;
          margin: 0 0 var(--space-2xs);
          text-transform: uppercase;
        }

        .onboarding-tile {
          background: var(--color-light);
          border: 2px solid var(--color-dark--tint-90);
          color: var(--color-dark);
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: var(--space-s);
          font: inherit;
          /* Tighter vertical padding so the option grid doesn't dominate
             the viewport — keeps comfortable touch height (~56px) but
             gives breathing room above and below the Continue CTA. */
          padding: var(--space-xs) var(--space-s);
          inline-size: 100%;
          block-size: 100%;
          text-align: start;
          transition: border-color 0.15s, background 0.15s;
        }
        .onboarding-tile:hover {
          border-color: var(--color-dark);
        }
        .onboarding-tile:focus-visible {
          outline: 2px solid var(--color-orange);
          outline-offset: 2px;
        }
        .onboarding-tile[data-selected] {
          background: var(--color-dark);
          border-color: var(--color-dark);
          color: var(--color-light);
        }
        .onboarding-tile__main {
          flex-grow: 1;
          min-inline-size: 0;
        }
        .onboarding-tile__title {
          font-size: var(--step-0);
          font-weight: var(--font-weight-bold);
          line-height: var(--line-height-condensed);
        }
        .onboarding-tile__hint {
          color: var(--color-dark--tint-50);
          font-size: var(--step--1);
          margin-block-start: var(--space-3xs);
        }
        .onboarding-tile[data-selected] .onboarding-tile__hint {
          color: var(--color-dark--tint-90);
        }
        .onboarding-tile__indicator {
          align-items: center;
          background: transparent;
          block-size: 1.125rem;
          border: 2px solid var(--color-dark--tint-50);
          border-radius: 999px;
          display: inline-flex;
          flex-shrink: 0;
          inline-size: 1.125rem;
          justify-content: center;
        }
        .onboarding-tile[data-selected] .onboarding-tile__indicator {
          background: var(--color-light);
          border-color: var(--color-light);
          color: var(--color-dark);
        }

        .onboarding-input {
          background: var(--color-light);
          border: 2px solid var(--color-dark--tint-90);
          color: var(--color-dark);
          font: inherit;
          font-size: var(--step-1);
          font-weight: var(--font-weight-bold);
          padding: var(--space-s);
          inline-size: 100%;
        }
        .onboarding-input::placeholder {
          color: var(--color-dark--tint-50);
          font-weight: var(--font-weight-normal);
        }
        .onboarding-input:focus {
          border-color: var(--color-dark);
          outline: 2px solid var(--color-orange);
          outline-offset: 2px;
        }

        .onboarding-grid {
          display: grid;
          gap: var(--space-xs);
          grid-template-columns: 1fr;
        }
        .onboarding-grid > li {
          display: flex;
        }
        @media (min-width: 49.5rem) {
          .onboarding-grid--two {
            grid-template-columns: 1fr 1fr;
          }
          .onboarding-grid--three {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .onboarding-interest {
          background: var(--color-light);
          border: 2px solid var(--color-dark--tint-90);
          color: var(--color-dark);
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: var(--space-3xs);
          font: inherit;
          /* Same proportional tightening as .onboarding-tile so the 3x2
             interests grid leaves room for the Continue CTA at the foot. */
          padding: var(--space-xs) var(--space-s);
          inline-size: 100%;
          block-size: 100%;
          text-align: start;
          transition: border-color 0.15s, background 0.15s;
        }
        .onboarding-interest:hover {
          border-color: var(--color-dark);
        }
        .onboarding-interest:focus-visible {
          outline: 2px solid var(--color-orange);
          outline-offset: 2px;
        }
        .onboarding-interest[data-selected] {
          background: var(--color-dark);
          border-color: var(--color-dark);
          color: var(--color-light);
        }
        .onboarding-interest__icon {
          align-items: center;
          color: var(--color-dark);
          display: inline-flex;
          margin-block-end: var(--space-3xs);
        }
        .onboarding-interest[data-selected] .onboarding-interest__icon {
          color: var(--color-light);
        }
        .onboarding-interest__icon svg {
          display: block;
        }
        .onboarding-interest__label {
          font-size: var(--step-0);
          font-weight: var(--font-weight-bold);
        }
        .onboarding-interest__body {
          color: var(--color-dark--tint-50);
          font-size: var(--step--1);
          line-height: var(--line-height-condensed);
        }
        .onboarding-interest[data-selected] .onboarding-interest__body {
          color: var(--color-dark--tint-90);
        }

        @keyframes onboardSlideIn {
          from { opacity: 0; transform: translate3d(12px, 0, 0); }
          to   { opacity: 1; transform: translate3d(0, 0, 0); }
        }
        @keyframes onboardSlideInBack {
          from { opacity: 0; transform: translate3d(-12px, 0, 0); }
          to   { opacity: 1; transform: translate3d(0, 0, 0); }
        }
      `}</style>
    </>
  );
}

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
    case 'interests':
      return { interests: draft.interests };
    default:
      return {};
  }
}

/* ---------- Step components ---------- */

function StepHeader({ headingRef, eyebrow, title, body }) {
  return (
    <div className="flow py-4" data-flow="2xs">
      {eyebrow && <p className="onboarding-eyebrow">{eyebrow}</p>}
      <h1 ref={headingRef} tabIndex={-1} style={{ outline: 'none' }}>
        {title}
      </h1>
      {body && <p className="standfirst">{body}</p>}
    </div>
  );
}

function IntroStep({ headingRef, hasExistingProfile, onResume, onStartOver }) {
  return (
    <div className="flow" data-flow="m">
      <p style={{ fontSize: 'var(--step--1)', color: 'var(--color-medium)' }}>Takes 2 minutes</p>
      <h1 ref={headingRef} tabIndex={-1} style={{ outline: 'none' }}>
        Let&apos;s get you ready for term
      </h1>
      <p className="standfirst">Everything you need to access before term in one place</p>

      <ul
        style={{
          listStyle: 'none',
          margin: 0,
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-s)',
          paddingBlockStart: 'var(--space-xs)',
        }}
        aria-label="What you'll get"
      >
        {[
          'View what you need to do to prep for your first week',
          'See upcoming social and creative events happening at the campuses',
          'Find key info, support and services for your college',
        ].map((item) => (
          <li
            key={item}
            style={{ display: 'flex', gap: 'var(--space-s)', alignItems: 'flex-start' }}
          >
            <svg
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden="true"
              style={{
                flexShrink: 0,
                marginBlockStart: '2px',
                width: '1.25rem',
                height: '1.25rem',
              }}
            >
              <circle cx="10" cy="10" r="9" fill="var(--color-orange)" />
              <path
                d="M6 10l3 3 5-5"
                stroke="#fff"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span style={{ fontSize: 'var(--step-0)' }}>{item}</span>
          </li>
        ))}
      </ul>

      {hasExistingProfile && (
        <div
          className="flow"
          data-flow="2xs"
          style={{
            background: 'var(--color-shade)',
            borderInlineStart: '4px solid var(--color-orange)',
            padding: 'var(--space-s)',
          }}
        >
          <p style={{ fontSize: 'var(--step--1)', color: 'var(--color-medium)' }}>
            You&apos;ve already set up your hub.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2xs)' }}>
            <Button onClick={onResume}>Open my hub</Button>
            <Button ghost onClick={onStartOver}>
              Start over
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function NameStep({ headingRef, value, onChange, onSubmit }) {
  return (
    <div className="flow" data-flow="m">
      <StepHeader
        headingRef={headingRef}
        title="What should we call you?"
        body="We'll use it to greet you"
      />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (value.trim().length >= 1) onSubmit();
        }}
      >
        <label className="visually-hidden" htmlFor="onboarding-name">
          Your first name
        </label>
        <input
          id="onboarding-name"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete="given-name"
          autoFocus
          maxLength={40}
          placeholder="Your first name"
          className="onboarding-input"
        />
      </form>
    </div>
  );
}

function CollegeStep({ headingRef, value, onChange }) {
  return (
    <div className="flow" data-flow="m">
      <StepHeader headingRef={headingRef} title="Which college/institute are you joining?" />
      <ul
        className="onboarding-grid onboarding-grid--two"
        role="radiogroup"
        aria-label="Choose your college"
        style={{ listStyle: 'none', margin: 0, padding: 0 }}
      >
        {COLLEGE_OPTIONS.map((college) => (
          <li key={college.id}>
            <Tile
              role="radio"
              selected={value === college.id}
              onClick={() => onChange(college.id)}
              title={college.name}
              hint={college.area}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

function StudyLevelStep({ headingRef, value, onChange }) {
  return (
    <div className="flow" data-flow="m">
      <StepHeader
        headingRef={headingRef}
        title="What level of higher education are you entering?"
      />
      <ul
        className="onboarding-grid onboarding-grid--two"
        role="radiogroup"
        aria-label="Choose your study level"
        style={{ listStyle: 'none', margin: 0, padding: 0 }}
      >
        {STUDY_LEVEL_OPTIONS.map((opt) => (
          <li key={opt.id}>
            <Tile
              role="radio"
              selected={value === opt.id}
              onClick={() => onChange(opt.id)}
              title={opt.label}
              hint={opt.hint}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

function YearStep({ headingRef, value, onChange }) {
  return (
    <div className="flow" data-flow="m">
      <StepHeader headingRef={headingRef} title="What year are you in?" />
      <ul
        className="onboarding-grid onboarding-grid--two"
        role="radiogroup"
        aria-label="Choose your year"
        style={{ listStyle: 'none', margin: 0, padding: 0 }}
      >
        {YEAR_OPTIONS.map((opt) => (
          <li key={opt.id}>
            <Tile
              role="radio"
              selected={value === opt.id}
              onClick={() => onChange(opt.id)}
              title={opt.label}
              hint={opt.hint}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

function InterestsStep({ headingRef, value, onChange }) {
  function toggle(id) {
    if (value.includes(id)) onChange(value.filter((i) => i !== id));
    else onChange([...value, id]);
  }

  return (
    <div className="flow" data-flow="m">
      <StepHeader
        headingRef={headingRef}
        title="Choose your focus"
        body="Pick as many as you like, or none. We'll surface things that match."
      />
      <ul
        className="onboarding-grid onboarding-grid--three"
        role="group"
        aria-label="Choose what interests you (optional, multiple)"
        style={{ listStyle: 'none', margin: 0, padding: 0 }}
      >
        {INTEREST_OPTIONS.map((opt) => {
          const selected = value.includes(opt.id);
          const Icon = INTEREST_ICONS[opt.id];
          return (
            <li key={opt.id}>
              <button
                type="button"
                role="checkbox"
                aria-checked={selected}
                onClick={() => toggle(opt.id)}
                data-selected={selected || undefined}
                className="onboarding-interest"
              >
                {Icon && (
                  <span className="onboarding-interest__icon" aria-hidden="true">
                    <Icon width={24} height={24} />
                  </span>
                )}
                <span className="onboarding-interest__label">{opt.label}</span>
                <span className="onboarding-interest__body">{opt.body}</span>
              </button>
            </li>
          );
        })}
      </ul>
      <p style={{ color: 'var(--color-dark--tint-50)', fontSize: 'var(--step--1)' }}>
        {value.length === 0 ? 'You can change these any time.' : `${value.length} selected`}
      </p>
    </div>
  );
}

function FinishStep({ headingRef, draft }) {
  const college = COLLEGE_OPTIONS.find((c) => c.id === draft.collegeId);
  return (
    <div className="flow" data-flow="m">
      <p className="onboarding-eyebrow">All set</p>
      <h1 ref={headingRef} tabIndex={-1} style={{ outline: 'none' }}>
        You&apos;re all set{draft.name ? `, ${draft.name}` : ''}.
      </h1>
      <p className="standfirst">
        Your hub is personalised
        {college ? <> for {college.short}</> : null}. Everything you need for Welcome Week is one
        tap away.
      </p>
    </div>
  );
}

/**
 * Reusable selectable tile: rectangular, 2px black-tint-90 border, fills
 * black on selection (matches the DS button hover state).
 */
function Tile({ selected, onClick, role, title, hint, ...rest }) {
  return (
    <button
      type="button"
      role={role}
      onClick={onClick}
      aria-checked={role === 'radio' ? selected : undefined}
      data-selected={selected || undefined}
      className="onboarding-tile"
      {...rest}
    >
      <span className="onboarding-tile__main">
        <span className="onboarding-tile__title">{title}</span>
        {hint && (
          <span className="onboarding-tile__hint" style={{ display: 'block' }}>
            {hint}
          </span>
        )}
      </span>
      <span className="onboarding-tile__indicator" aria-hidden="true">
        {selected && (
          <svg
            viewBox="0 0 12 12"
            fill="none"
            style={{
              display: 'block',
              width: '0.625rem',
              height: '0.625rem',
            }}
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
      </span>
    </button>
  );
}
