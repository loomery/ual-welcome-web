/**
 * StatusCheckbox — square task/step completion indicator used in the checklist.
 *
 * Empty square outline when not started; a filled UAL-orange square with a
 * white tick when complete. Fixed 16×16 internal viewBox scaled via width/
 * height so coordinates stay predictable. Self-contained (no CSS classes).
 *
 * @param {{ status: 'complete' | 'in-progress' | 'not-started', size?: number }} props
 */
export function StatusCheckbox({ status = 'not-started', size = 22 }) {
  const isComplete = status === 'complete';
  // Orange is brand-fixed (never inverts); the empty box uses the dark ink so
  // the outline reads crisply against the light card.
  const fill = isComplete ? 'var(--color-orange)' : 'none';
  const stroke =
    isComplete || status === 'in-progress' ? 'var(--color-orange)' : 'var(--color-dark)';

  return (
    <svg
      viewBox="0 0 16 16"
      width={size}
      height={size}
      fill="none"
      aria-hidden="true"
      className="block shrink-0"
    >
      <rect x="1.5" y="1.5" width="13" height="13" fill={fill} stroke={stroke} strokeWidth="1.5" />

      {isComplete && (
        <path
          d="M4.5 8L6.5 10.5L11.5 5.5"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}

      {status === 'in-progress' && (
        <rect x="5" y="5" width="6" height="6" fill="var(--color-orange)" />
      )}
    </svg>
  );
}
