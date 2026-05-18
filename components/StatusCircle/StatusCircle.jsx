/**
 * StatusCircle — shared SVG indicator for task/step completion state.
 *
 * Uses a fixed 16×16 internal viewBox scaled via width/height attributes
 * so coordinates are always predictable. No CSS classes, no Tailwind
 * sizing — purely self-contained.
 *
 * @param {{ status: 'complete' | 'in-progress' | 'not-started', size?: number }} props
 */
export function StatusCircle({ status = 'not-started', size = 16 }) {
  // Use orange for complete — it's brand-fixed and never inverts in dark mode.
  // var(--color-dark) would flip to light in dark mode, making the circle
  // appear white with an invisible white checkmark.
  const circleFill = status === 'complete' ? 'var(--color-orange)' : 'none';

  const circleStroke =
    status === 'complete'
      ? 'var(--color-orange)'
      : status === 'in-progress'
        ? 'var(--color-orange)'
        : 'var(--color-dark--tint-50)';

  return (
    <svg
      viewBox="0 0 16 16"
      width={size}
      height={size}
      fill="none"
      aria-hidden="true"
      style={{ flexShrink: 0, display: 'block' }}
    >
      {/* Circle */}
      <circle cx="8" cy="8" r="6.5" fill={circleFill} stroke={circleStroke} strokeWidth="1.5" />

      {/* Checkmark — same path proportions used elsewhere in the codebase */}
      {status === 'complete' && (
        <path
          d="M4.5 8L6.5 10.5L11.5 5.5"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}

      {/* In-progress dot */}
      {status === 'in-progress' && <circle cx="8" cy="8" r="2.5" fill="var(--color-orange)" />}
    </svg>
  );
}
