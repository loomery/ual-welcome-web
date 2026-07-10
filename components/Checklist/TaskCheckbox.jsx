/**
 * TaskCheckbox — the square completion indicator used in the Essentials
 * "To do list". Empty square outline when not complete; a filled green square
 * with a white tick when complete (per Figma). Self-contained (no CSS classes),
 * scaled via width/height off a fixed 24×24 viewBox.
 *
 * @param {{ complete?: boolean, size?: number }} props
 */
export function TaskCheckbox({ complete = false, size = 24 }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      aria-hidden="true"
      className="block shrink-0"
    >
      <rect
        x="1.5"
        y="1.5"
        width="21"
        height="21"
        rx="1.5"
        fill={complete ? 'var(--color-ual-util-green)' : 'none'}
        stroke={complete ? 'var(--color-ual-util-green)' : 'var(--color-dark)'}
        strokeWidth="1.6"
      />
      {complete && (
        <path
          d="M7 12.5 10.5 16 17 8.5"
          stroke="white"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}
