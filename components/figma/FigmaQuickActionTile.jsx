'use client';

/**
 * FigmaQuickActionTile — feed-grid action tile (node 12:25).
 *
 * Real button with hover/active/focus affordances. The accent stripe
 * at the bottom uses one of three Tailwind-only colour classes mapped
 * from the `accent` prop — keeps the colour sourced in Tailwind, not
 * inline `style`.
 *
 * @param {Object} props
 * @param {'inverse' | 'yellow' | 'green'} [props.accent]
 * @param {string} props.title
 * @param {string} [props.sublabel]
 * @param {() => void} [props.onClick]
 */
export function FigmaQuickActionTile({ accent = 'inverse', title, sublabel, onClick }) {
  // Static class lookup so Tailwind's JIT can see all three at build.
  const accentClass = {
    inverse: 'bg-black',
    yellow: 'bg-[#ffd022]',
    green: 'bg-[#00c73e]',
  }[accent];

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-19 w-26.5 flex-col items-start gap-1 bg-[#f2f2f2] pt-4 pr-3 pb-3 pl-4 text-left hover:bg-[#e5e5e5] focus:outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#ff5000] active:bg-[#d4d4d4]"
    >
      <span className="text-[16px] leading-[1.4] font-medium whitespace-nowrap text-black">
        {title}
      </span>
      {sublabel && (
        <span className="text-[14px] leading-[1.4] whitespace-nowrap text-[#525252]">
          {sublabel}
        </span>
      )}
      <span aria-hidden="true" className={`mt-auto block h-0.75 w-10 ${accentClass}`} />
    </button>
  );
}
