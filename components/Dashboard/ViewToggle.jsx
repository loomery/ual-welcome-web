/**
 * ViewToggle — two-button pill (Figma "My focus / Everything").
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
    <div className="dash-toggle" role="group" aria-label={ariaLabel}>
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={String(opt.value)}
            type="button"
            className="dash-toggle__btn"
            data-active={active || undefined}
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
