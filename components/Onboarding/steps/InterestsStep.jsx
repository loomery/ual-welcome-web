import { StepHeader } from '../StepHeader';
import { INTEREST_OPTIONS } from '../../../data/onboardingOptions';

/**
 * Step — choose topics to show on the personalised home page (optional,
 * multi-select). Selected topics drive the "My focus" view on the dashboard.
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
    <div className="space-y-m">
      <StepHeader
        headingRef={headingRef}
        title="Build your UAL guide your way"
        body="Select topics to show on your home page. Choose as many or as little as you like. You can change these any time."
      />

      <ul
        className="grid list-none grid-cols-1 gap-xs p-0 nav:grid-cols-3 [&>li]:flex"
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
                className={[
                  'flex h-full w-full cursor-pointer flex-col items-start gap-3xs border-2 px-s py-xs text-start transition-[border-color,background-color] duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ual-orange',
                  selected
                    ? 'border-ual-dark bg-ual-dark text-ual-light'
                    : 'border-ual-dark-90 bg-ual-light text-ual-dark hover:border-ual-dark',
                ].join(' ')}
              >
                <span className="text-step-0 font-ual-bold">{opt.label}</span>
                <span
                  className={[
                    'text-step-d1 leading-ual-condensed',
                    selected ? 'text-ual-dark-90' : 'text-ual-dark-50',
                  ].join(' ')}
                >
                  {opt.body}
                </span>
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
