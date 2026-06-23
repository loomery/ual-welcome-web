/**
 * Accessible progress bar using the native <progress> semantic meaning via ARIA,
 * plus a visible DS-styled fill.
 *
 * @param {Object} props
 * @param {number} props.value
 * @param {number} props.max
 * @param {string} props.label
 */
export function Progress({ value, max, label }) {
  const percent = max === 0 ? 0 : Math.round((value / max) * 100);
  return (
    <div
      className="h-2xs w-full overflow-hidden bg-ual-dark-90"
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-valuetext={`${value} of ${max} complete (${percent}%)`}
    >
      <div
        className="h-full bg-ual-dark transition-[inline-size] duration-300 ease-[ease]"
        style={{ inlineSize: `${percent}%` }}
      />
    </div>
  );
}
