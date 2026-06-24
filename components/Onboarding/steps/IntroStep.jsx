import { Button } from '../../Button/Button';

const BENEFITS = [
  'View what you need to do to prep for your first week',
  'See upcoming social and creative events happening at your college',
  'Find key info, support and services for your college',
];

/**
 * First step of the onboarding flow — introduction and feature overview.
 * If the student has already completed onboarding, shows a "resume or
 * start over" panel instead of the plain intro.
 *
 * @param {Object} props
 * @param {{ current: HTMLHeadingElement | null }} props.headingRef
 * @param {boolean} props.hasExistingProfile
 * @param {() => void} props.onResume
 * @param {() => void} props.onStartOver
 */
export function IntroStep({ headingRef, hasExistingProfile, onResume, onStartOver }) {
  return (
    <div className="space-y-6">
      <p className="text-step-d1 text-ual-medium">Takes 2 minutes</p>

      <h1 ref={headingRef} tabIndex={-1} className="outline-none">
        Let&apos;s get you ready for term
      </h1>

      <p className="text-step-1 text-ual-medium">
        Everything you need to access before term in one place
      </p>

      <ul className="list-none space-y-4 p-0" aria-label="What you'll get">
        {BENEFITS.map((item) => (
          <li key={item} className="flex items-start gap-4">
            {/* Orange check circle */}
            <svg
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden="true"
              className="mt-0.5 size-5 shrink-0"
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
            <span className="text-step-0">{item}</span>
          </li>
        ))}
      </ul>

      {/* Shown only when returning to onboarding after already completing it */}
      {hasExistingProfile && (
        <div className="space-y-2 border-s-4 border-ual-orange bg-ual-shade p-4">
          <p className="text-step-d1 text-ual-medium">You&apos;ve already set up your hub.</p>
          <div className="flex flex-wrap gap-2">
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
