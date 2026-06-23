import { COLLEGE_OPTIONS } from '../../../data/onboardingOptions';

/**
 * Final confirmation step — shown after all questions are answered.
 * Summarises the student's college selection before they open their hub.
 *
 * @param {Object} props
 * @param {{ current: HTMLHeadingElement | null }} props.headingRef
 * @param {{ collegeId: string, name: string }} props.draft  Current draft answers.
 */
export function FinishStep({ headingRef, draft }) {
  const college = COLLEGE_OPTIONS.find((c) => c.id === draft.collegeId);

  return (
    <div className="space-y-m">
      <p className="mb-2xs text-step-d1 font-ual-bold tracking-[0.06em] text-ual-orange uppercase">
        All set
      </p>

      <h1 ref={headingRef} tabIndex={-1} className="outline-none">
        You&apos;re all set{draft.name ? `, ${draft.name}` : ''}.
      </h1>

      <p className="text-step-1 text-ual-medium">
        Your hub is personalised{college ? <> for {college.short}</> : null}. Everything you need
        for Welcome Week is one tap away.
      </p>
    </div>
  );
}
