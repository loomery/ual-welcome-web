import { StepHeader } from '../StepHeader';
import { INTEREST_OPTIONS } from '../../../data/onboardingOptions';

/**
 * Step — choose topics to show on the personalised home page (optional,
 * multi-select). Selected topics drive the "My focus" view on the dashboard.
 * Copy and tiles match the Figma "Build your UAL guide your way" frame.
 *
 * @param {Object} props
 * @param {{ current: HTMLHeadingElement | null }} props.headingRef
 * @param {string[]} props.value  Array of selected interest IDs.
 * @param {(interests: string[]) => void} props.onChange
 * @param {import('../../../data/onboardingOptions').InterestOption[]} [props.options]
 *   Subset of topics to display. Defaults to all INTEREST_OPTIONS.
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
        title="Build your UAL guide your way"
        body="Select topics to show on your home page. Choose as many or as little as you like. You can change these any time."
      />

      <ul
        className="onboarding-grid onboarding-grid--three"
        role="group"
        aria-label="Choose the topics to show on your home page (optional, multiple)"
      >
        {options.map((opt) => {
          const selected = value.includes(opt.id);

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
