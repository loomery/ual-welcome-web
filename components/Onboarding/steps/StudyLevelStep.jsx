import { StepHeader } from '../StepHeader';
import { OnboardingTile } from '../OnboardingTile';
import { STUDY_LEVEL_OPTIONS } from '../../../data/onboardingOptions';

/**
 * Step 4 — choose the level of higher education (Undergraduate / Postgraduate).
 *
 * @param {Object} props
 * @param {{ current: HTMLHeadingElement | null }} props.headingRef
 * @param {string} props.value  Currently selected study level ID.
 * @param {(studyLevel: string) => void} props.onChange
 */
export function StudyLevelStep({ headingRef, value, onChange }) {
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
      >
        {STUDY_LEVEL_OPTIONS.map((opt) => (
          <li key={opt.id}>
            <OnboardingTile
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
