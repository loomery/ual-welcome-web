/**
 * ViewToggle — two-button pill.
 *
 * Stateless; the parent owns the current value and the onChange handler.
 * Buttons are real `<button>`s with `aria-pressed`, so screen readers
 * announce the active option correctly and the toggle works without JS
 * frameworks doing anything clever.
 *
 * @template T
 * @param {Object} props
 * @param {T} props.value
 * @param {(next: T) => void} props.onChange
 * @param {Array<{ value: T, label: string }>} props.options
 * @param {string} [props.ariaLabel='Dashboard view']
 */
export function ViewToggle({ value, onChange, options, ariaLabel = 'Dashboard view' }) {
  return (
    <div className="flex gap-8 border-b border-ual-dark-90" role="group" aria-label={ariaLabel}>
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={String(opt.value)}
            type="button"
            className={`-mb-px cursor-pointer border-0 border-b-[3px] bg-none py-2 pb-4 font-main text-step-0 font-ual-bold transition-colors duration-[0.12s] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ual-orange ${
              active
                ? 'border-ual-dark text-ual-dark'
                : 'border-transparent text-ual-dark-50 hover:text-ual-dark'
            }`}
            onClick={() => onChange(opt.value)}
            aria-pressed={active}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
