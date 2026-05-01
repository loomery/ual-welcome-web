'use client';

/**
 * FigmaOptionRow — survey single-select list row (node 7:14).
 *
 * Real interactive states via pseudo-classes. Selection is a controlled
 * boolean prop (`selected`); the parent decides which option is active
 * (e.g. radio-group behaviour). Disabled is a real prop on the button.
 *
 * Tailwind 4's `aria-pressed:` variant drives the selected look so we
 * don't need a duplicate className branch — the same DOM uses
 * `aria-pressed="true"` to flip to the inverse skin.
 *
 * @param {Object} props
 * @param {boolean} [props.selected]
 * @param {boolean} [props.disabled]
 * @param {() => void} [props.onClick]
 * @param {import('react').ReactNode} props.children
 */
export function FigmaOptionRow({ selected = false, disabled = false, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
      className="flex min-h-14 w-79.75 max-w-full items-center bg-white px-5 py-4 text-left text-[17px] leading-normal text-black ring-1 ring-[#e5e5e5] ring-inset hover:bg-[#f2f2f2] hover:ring-[#858585] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5000] active:bg-[#e5e5e5] active:ring-[#858585] disabled:cursor-not-allowed disabled:text-[#c2c2c2] disabled:hover:bg-white disabled:hover:ring-[#e5e5e5] aria-pressed:bg-black aria-pressed:text-white aria-pressed:ring-0 aria-pressed:hover:bg-black aria-pressed:active:bg-black"
    >
      {children}
    </button>
  );
}
