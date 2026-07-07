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
    <div className="space-y-6">
      <StepHeader headingRef={headingRef} title="Which college/institute are you joining?" />

      <ul
        className="grid list-none grid-cols-1 gap-4 p-0 md:grid-cols-3 [&>li]:flex"
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
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
