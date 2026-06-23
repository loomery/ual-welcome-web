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
      className={[
        'flex h-full w-full cursor-pointer items-center gap-s border-2 px-s py-xs text-start transition-[border-color,background-color] duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ual-orange',
        selected
          ? 'border-ual-dark bg-ual-dark text-ual-light'
          : 'border-ual-dark-90 bg-ual-light text-ual-dark hover:border-ual-dark',
      ].join(' ')}
      {...rest}
    >
      <span className="min-w-0 grow">
        <span className="block text-step-0/ual-condensed font-ual-bold">{title}</span>
        {hint && (
          <span
            className={[
              'mt-3xs block text-step-d1',
              selected ? 'text-ual-dark-90' : 'text-ual-dark-50',
            ].join(' ')}
          >
            {hint}
          </span>
        )}
      </span>

      {/* Selection indicator — circle that fills with a checkmark when selected */}
      <span
        className={[
          'inline-flex size-4.5 shrink-0 items-center justify-center rounded-full border-2',
          selected
            ? 'border-ual-light bg-ual-light text-ual-dark'
            : 'border-ual-dark-50 bg-transparent',
        ].join(' ')}
        aria-hidden="true"
      >
        {selected && (
          <svg viewBox="0 0 12 12" fill="none" className="block size-2.5">
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
