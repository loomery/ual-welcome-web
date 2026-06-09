import { StepHeader } from '../StepHeader';
import { OnboardingTile } from '../OnboardingTile';
import { YEAR_OPTIONS } from '../../../data/onboardingOptions';

/**
 * Year step — choose which year of study the student is entering.
 *
 * @param {Object} props
 * @param {{ current: HTMLHeadingElement | null }} props.headingRef
 * @param {string} props.value  Currently selected year ID.
 * @param {(year: string) => void} props.onChange
 */
export function YearStep({ headingRef, value, onChange }) {
  return (
    <div className="flow" data-flow="m">
      <StepHeader headingRef={headingRef} title="What year are you in?" />

      <ul
        className="onboarding-grid onboarding-grid--two"
        role="radiogroup"
        aria-label="Choose your year"
      >
        {YEAR_OPTIONS.map((opt) => (
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
