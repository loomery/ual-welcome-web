import { StepHeader } from '../StepHeader';
import { OnboardingTile } from '../OnboardingTile';
import { InfoIcon } from '../../Icon/NavIcons';
import { INTEREST_OPTIONS } from '../../../data/onboardingOptions';

/**
 * Step — choose topics to show on the personalised home page (optional,
 * multi-select). Selected topics drive the "Selected interests" view on the
 * dashboard. A "Select all" card toggles every topic at once.
 *
 * @param {Object} props
 * @param {{ current: HTMLHeadingElement | null }} props.headingRef
 * @param {string[]} props.value  Array of selected interest IDs.
 * @param {(interests: string[]) => void} props.onChange
 * @param {import('../../../data/onboardingOptions').InterestOption[]} [props.options]
 */
export function InterestsStep({ headingRef, value, onChange, options = INTEREST_OPTIONS }) {
  const allSelected = value.length === options.length;

  function toggle(id) {
    if (value.includes(id)) onChange(value.filter((i) => i !== id));
    else onChange([...value, id]);
  }

  return (
    <div className="space-y-6">
      <StepHeader
        headingRef={headingRef}
        title="Build your UAL guide your way"
        body="Select topics you're interested in to show on your home page. Choose as many or as little as you like. You can change these any time."
      />

      <div className="flex items-center gap-3 border border-ual-dark-90 px-4 py-3 text-step-d1 text-ual-medium">
        <InfoIcon className="size-5 shrink-0 text-ual-dark" aria-hidden="true" />
        <span>These will show as &lsquo;your selected interests&rsquo; on your home page</span>
      </div>

      <ul
        className="grid list-none grid-cols-1 gap-4 p-0 md:grid-cols-3 [&>li]:flex"
        role="group"
        aria-label="Choose the topics to show on your home page (optional, multiple)"
      >
        {options.map((opt) => (
          <li key={opt.id}>
            <OnboardingTile
              role="checkbox"
              selected={value.includes(opt.id)}
              onClick={() => toggle(opt.id)}
              title={opt.label}
              hint={opt.body}
            />
          </li>
        ))}
        <li>
          <OnboardingTile
            role="checkbox"
            selected={allSelected}
            onClick={() => onChange(allSelected ? [] : options.map((o) => o.id))}
            title="Select/Unselect all"
            hint="See all topics on your home screen"
          />
        </li>
      </ul>
    </div>
  );
}
