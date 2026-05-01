'use client';

/**
 * FigmaAppHeader — top-of-screen title bar (node 11:2).
 *
 * Presentational by default. If an `onClick` is supplied the title
 * becomes a button-like surface with hover/focus affordances (rare
 * but useful for "tap to refresh" patterns).
 *
 * @param {Object} props
 * @param {string} [props.title]
 * @param {() => void} [props.onClick]
 */
export function FigmaAppHeader({ title = 'UAL Student Hub', onClick }) {
  if (onClick) {
    return (
      <header className="flex min-h-11 w-93.75 max-w-full items-center bg-white px-6">
        <button
          type="button"
          onClick={onClick}
          className="flex-1 text-left text-[17px] leading-normal font-bold text-black hover:text-[#525252] focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff5000]"
        >
          {title}
        </button>
      </header>
    );
  }

  return (
    <header className="flex min-h-11 w-93.75 max-w-full items-center bg-white px-6">
      <h2 className="flex-1 text-[17px] leading-normal font-bold text-black">{title}</h2>
    </header>
  );
}
