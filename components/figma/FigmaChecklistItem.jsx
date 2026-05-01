'use client';

import clsx from 'clsx';

/**
 * FigmaChecklistItem — toggleable checklist row with leading indicator,
 * optional struck-through label, and trailing chevron (node 9:33).
 *
 * `checked` is a controlled prop. Uncontrolled callers can wrap with
 * useState. `aria-checked` mirrors `checked` for assistive tech.
 *
 * Visual states (hover/focus/pressed) come from Tailwind variants on
 * the outer button. Sub-elements (indicator dot + label) read the
 * checked state via the parent-controlled className branches because
 * Tailwind's group-* variants on `aria-checked` are too clunky for the
 * three-element composition.
 *
 * @param {Object} props
 * @param {boolean} [props.checked]
 * @param {boolean} [props.disabled]
 * @param {() => void} [props.onClick]
 * @param {import('react').ReactNode} props.children
 */
export function FigmaChecklistItem({ checked = false, disabled = false, onClick, children }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      disabled={disabled}
      onClick={onClick}
      className="flex min-h-14 w-83.75 max-w-full items-center gap-3 bg-white p-4 text-left hover:bg-[#f2f2f2] focus:outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#ff5000] active:bg-[#e5e5e5] disabled:cursor-not-allowed disabled:hover:bg-white"
    >
      {/* Indicator: empty circle / filled black with check */}
      <span
        aria-hidden="true"
        className={clsx(
          'flex size-5.5 shrink-0 items-center justify-center rounded-full',
          checked
            ? 'border-0 bg-black'
            : disabled
              ? 'border-[1.5px] border-[#e5e5e5] bg-transparent'
              : 'border-[1.5px] border-black bg-transparent',
        )}
      >
        {checked && <span className="text-[13px] leading-none font-bold text-white">✓</span>}
      </span>

      <span
        className={clsx(
          'flex-1 text-[17px] leading-normal',
          disabled ? 'text-[#c2c2c2]' : checked ? 'text-[#525252] line-through' : 'text-black',
        )}
      >
        {children}
      </span>

      <span
        aria-hidden="true"
        className={clsx(
          'shrink-0 text-[20px] leading-none',
          disabled ? 'text-[#c2c2c2]' : 'text-[#525252]',
        )}
      >
        ›
      </span>
    </button>
  );
}
