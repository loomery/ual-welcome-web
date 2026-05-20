import { StepHeader } from '../StepHeader';
import { OnboardingTile } from '../OnboardingTile';
import { COLLEGE_OPTIONS } from '../../../data/onboardingOptions';

/**
 * Step 3 — choose a UAL college or institute.
 *
 * @param {Object} props
 * @param {{ current: HTMLHeadingElement | null }} props.headingRef
 * @param {string} props.value  Currently selected college ID.
 * @param {(collegeId: string) => void} props.onChange
 */
export function CollegeStep({ headingRef, value, onChange }) {
  return (
    <div className="flow" data-flow="m">
      <StepHeader headingRef={headingRef} title="Which college/institute are you joining?" />

      <ul
        className="onboarding-grid onboarding-grid--two"
        role="radiogroup"
        aria-label="Choose your college"
      >
        {COLLEGE_OPTIONS.map((college) => (
          <li key={college.id}>
            <OnboardingTile
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
