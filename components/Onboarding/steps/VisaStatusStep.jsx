import { StepHeader } from '../StepHeader';
import { OnboardingTile } from '../OnboardingTile';
import { VISA_STATUS_OPTIONS } from '../../../data/onboardingOptions';

/**
 * Step 7 (international students only) — check student visa status.
 * All four options allow the flow to continue; visa-specific content
 * is surfaced later in the personalised dashboard.
 *
 * @param {Object} props
 * @param {{ current: HTMLHeadingElement | null }} props.headingRef
 * @param {string} props.value  Currently selected visa status ID.
 * @param {(visaStatus: string) => void} props.onChange
 */
export function VisaStatusStep({ headingRef, value, onChange }) {
  return (
    <div className="flow" data-flow="m">
      <StepHeader headingRef={headingRef} title="Have you set up your student visa?" />

      <ul
        className="onboarding-grid onboarding-grid--two"
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

      <p className="text-step-d1 text-ual-medium dark:text-ual-medium">
        Student Advice Service responds within 4 working days (5 in peak periods).
      </p>
    </div>
  );
}
