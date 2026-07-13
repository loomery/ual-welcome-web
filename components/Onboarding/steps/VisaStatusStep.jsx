import { StepHeader } from '../StepHeader';
import { OnboardingTile } from '../OnboardingTile';
import { VISA_STATUS_OPTIONS } from '../../../data/onboardingOptions';

/**
 * Visa status — shown only to international students. Helps route them to the
 * Student Advice Service.
 *
 * @param {Object} props
 * @param {{ current: HTMLHeadingElement | null }} props.headingRef
 * @param {string} props.value  Currently selected visa-status ID.
 * @param {(visaStatus: string) => void} props.onChange
 */
export function VisaStatusStep({ headingRef, value, onChange }) {
  return (
    <div className="space-y-6">
      <StepHeader
        headingRef={headingRef}
        title="Have you sorted your student visa?"
        body="This helps us point you to the right support."
      />

      <ul
        className="grid list-none grid-cols-1 gap-4 p-0 md:grid-cols-2 [&>li]:flex"
        role="radiogroup"
        aria-label="Choose your visa status"
      >
        {VISA_STATUS_OPTIONS.map((opt) => (
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

      <p className="text-step-d1 text-ual-medium">
        Student Advice Service responds within 4 working days (5 in peak periods).
      </p>
    </div>
  );
}
