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
    <div className="space-y-m">
      <StepHeader headingRef={headingRef} title="What year are you in?" />

      <ul
        className="grid list-none grid-cols-1 gap-xs p-0 md:grid-cols-2 [&>li]:flex"
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
