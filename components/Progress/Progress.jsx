/**
 * Accessible progress bar using the native <progress> semantic meaning via ARIA,
 * plus a visible DS-styled fill.
 *
 * @param {Object} props
 * @param {number} props.value
 * @param {number} props.max
 * @param {string} props.label
 * @param {'default'|'success'} [props.tone]  Fill colour — 'default' is the
 *   dark DS fill; 'success' is UAL green (used on the home arrival checklist).
 */
export function Progress({ value, max, label, tone = 'default' }) {
  const percent = max === 0 ? 0 : Math.round((value / max) * 100);
  const fill = tone === 'success' ? 'bg-ual-util-green' : 'bg-ual-dark';
  return (
    <div
      className="h-2 w-full overflow-hidden bg-ual-dark-90"
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-valuetext={`${value} of ${max} complete (${percent}%)`}
    >
      <div
        className={`h-full ${fill} transition-[inline-size] duration-300 ease-[ease]`}
        style={{ inlineSize: `${percent}%` }}
      />
    </div>
  );
}
