/**
 * Selectable rectangular tile used for single-choice steps (college,
 * study level, year). Inverts to black-on-white when selected,
 * matching the DS button hover vocabulary.
 *
 * @param {Object} props
 * @param {boolean} props.selected
 * @param {() => void} props.onClick
 * @param {'radio' | 'checkbox'} [props.role]
 * @param {string} props.title
 * @param {string} [props.hint]  Optional secondary line shown below the title.
 */
export function OnboardingTile({ selected, onClick, role, title, hint, ...rest }) {
  return (
    <button
      type="button"
      role={role}
      onClick={onClick}
      aria-checked={role === 'radio' ? selected : undefined}
      data-selected={selected || undefined}
      className="onboarding-tile"
      {...rest}
    >
      <span className="onboarding-tile__main">
        <span className="onboarding-tile__title">{title}</span>
        {hint && <span className="onboarding-tile__hint">{hint}</span>}
      </span>

      {/* Selection indicator — circle that fills with a checkmark when selected */}
      <span className="onboarding-tile__indicator" aria-hidden="true">
        {selected && (
          <svg
            viewBox="0 0 12 12"
            fill="none"
            style={{ display: 'block', width: '0.625rem', height: '0.625rem' }}
          >
            <path
              d="M2.5 6L5 8.5L9.5 4"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
    </button>
  );
}
