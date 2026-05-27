import { StepHeader } from '../StepHeader';
import { INTEREST_OPTIONS } from '../../../data/onboardingOptions';
import { INTEREST_ICONS } from '../../Icon/InterestIcons';

/**
 * Step 6 — choose focus areas (optional, multi-select).
 * Selected interests drive the "My focus" view on the dashboard.
 *
 * @param {Object} props
 * @param {{ current: HTMLHeadingElement | null }} props.headingRef
 * @param {string[]} props.value  Array of selected interest IDs.
 * @param {(interests: string[]) => void} props.onChange
 * @param {import('../../../data/onboardingOptions').InterestOption[]} [props.options]
 *   Subset of interests to display. Defaults to all INTEREST_OPTIONS. The
 *   orchestrator (OnboardingFlow) passes a filtered list based on student type.
 */
export function InterestsStep({ headingRef, value, onChange, options = INTEREST_OPTIONS }) {
  function toggle(id) {
    if (value.includes(id)) onChange(value.filter((i) => i !== id));
    else onChange([...value, id]);
  }

  return (
    <div className="flow" data-flow="m">
      <StepHeader
        headingRef={headingRef}
        title="Choose your focus"
        body="Pick as many as you like, or none. We'll surface things that match."
      />

      <ul
        className="onboarding-grid onboarding-grid--three"
        role="group"
        aria-label="Choose what interests you (optional, multiple)"
      >
        {options.map((opt) => {
          const selected = value.includes(opt.id);
          const Icon = INTEREST_ICONS[opt.id];

          return (
            <li key={opt.id}>
              <button
                type="button"
                role="checkbox"
                aria-checked={selected}
                onClick={() => toggle(opt.id)}
                data-selected={selected || undefined}
                className="onboarding-interest"
              >
                {Icon && (
                  <span className="onboarding-interest__icon" aria-hidden="true">
                    <Icon width={24} height={24} />
                  </span>
                )}
                <span className="onboarding-interest__label">{opt.label}</span>
                <span className="onboarding-interest__body">{opt.body}</span>
              </button>
            </li>
          );
        })}
      </ul>

      <p className="text-step-d1 text-ual-medium">
        {value.length === 0 ? 'You can change these any time.' : `${value.length} selected`}
      </p>
    </div>
  );
}
