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
    <div className="flow" data-flow="m">
      <p className="text-step-d1 text-ual-medium">Takes 2 minutes</p>

      <h1 ref={headingRef} tabIndex={-1} style={{ outline: 'none' }}>
        Let&apos;s get you ready for term
      </h1>

      <p className="standfirst">Everything you need to access before term in one place</p>

      <ul
        className="flow pt-xs"
        data-flow="s"
        style={{ listStyle: 'none', padding: 0 }}
        aria-label="What you'll get"
      >
        {BENEFITS.map((item) => (
          <li key={item} className="flex items-start gap-s">
            {/* Orange check circle */}
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
            <span className="text-step-0">{item}</span>
          </li>
        ))}
      </ul>

      {/* Shown only when returning to onboarding after already completing it */}
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
          <p className="text-step-d1 text-ual-medium">You&apos;ve already set up your hub.</p>
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
