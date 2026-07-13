/**
 * Selectable card used for the onboarding choice steps (college, student
 * type, interests). White card by default; inverts to dark-on-light when
 * selected, matching the Figma onboarding cards.
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
      aria-checked={selected}
      className={[
        'flex h-full min-h-24 w-full cursor-pointer flex-col items-start gap-2 border p-5 text-start transition-[border-color,background-color,color] duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ual-orange',
        selected
          ? 'border-ual-dark bg-ual-dark text-ual-light'
          : 'border-ual-dark-90 bg-ual-light text-ual-dark hover:border-ual-dark',
      ].join(' ')}
      {...rest}
    >
      <span className="block text-step-0/ual-condensed font-ual-bold">{title}</span>
      {hint && (
        <span
          className={[
            'block text-step-d1/ual-condensed',
            selected ? 'text-ual-dark-90' : 'text-ual-medium',
          ].join(' ')}
        >
          {hint}
        </span>
      )}
    </button>
  );
}
