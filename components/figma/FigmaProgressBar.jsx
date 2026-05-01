/**
 * FigmaProgressBar — accessible track + fill (node 19:23).
 *
 * Two width tokens drive the layout: the outer track has a fixed
 * 295px reference width (matches Figma) but `max-w-full` so it scales
 * to any container. The fill width is a runtime numeric percentage —
 * Tailwind utilities can't express a runtime variable, so a single
 * `style={{ width }}` is the minimum exception. Everything else
 * (colours, height, radius, overflow) is Tailwind.
 *
 * @param {Object} props
 * @param {number} props.value          0..100
 * @param {string} [props.label]        accessible name (defaults to "Progress")
 */
export function FigmaProgressBar({ value, label = 'Progress' }) {
  const pct = Math.min(100, Math.max(0, value));
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      className="relative h-1.5 w-73.75 max-w-full overflow-hidden rounded-full bg-[#f2f2f2]"
    >
      <div
        className="absolute top-0 left-0 h-1.5 rounded-full bg-black"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
