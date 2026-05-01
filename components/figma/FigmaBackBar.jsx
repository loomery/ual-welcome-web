'use client';

/**
 * FigmaBackBar — top-of-screen back navigation (node 11:10).
 *
 * The whole bar is the click target (matches Figma — leading chevron +
 * label are visually grouped but a single button). Keyboard focus
 * shows a focus ring inside the bar (offset -2 to stay within the
 * 44px touch target).
 *
 * @param {Object} props
 * @param {string} [props.label]
 * @param {() => void} [props.onClick]
 */
export function FigmaBackBar({ label = 'Back', onClick }) {
  return (
    <div className="w-93.75 max-w-full bg-white">
      <button
        type="button"
        onClick={onClick}
        className="flex min-h-11 w-full items-center gap-2.5 px-6 text-left text-black hover:bg-[#f2f2f2] focus:outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#ff5000] active:bg-[#e5e5e5]"
      >
        <span aria-hidden="true" className="shrink-0 text-[22px] leading-none">
          ‹
        </span>
        <span className="flex-1 text-[16px] leading-[1.4]">{label}</span>
      </button>
    </div>
  );
}
