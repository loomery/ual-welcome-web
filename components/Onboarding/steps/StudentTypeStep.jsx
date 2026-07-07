import { StepHeader } from '../StepHeader';
import { OnboardingTile } from '../OnboardingTile';
import { STUDENT_TYPE_OPTIONS } from '../../../data/onboardingOptions';

/**
 * Step 6 — choose domestic or international student status.
 *
 * @param {Object} props
 * @param {{ current: HTMLHeadingElement | null }} props.headingRef
 * @param {string} props.value  Currently selected student type ID.
 * @param {(studentType: string) => void} props.onChange
 */
export function StudentTypeStep({ headingRef, value, onChange }) {
  return (
    <div className="space-y-6">
      <StepHeader
        headingRef={headingRef}
        title="What type of student are you?"
        body="This helps us show you the right arrival information."
      />

      <ul
        className="grid list-none grid-cols-1 gap-4 p-0 md:grid-cols-2 [&>li]:flex"
        role="radiogroup"
        aria-label="Choose your student type"
      >
        {STUDENT_TYPE_OPTIONS.map((opt) => (
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
