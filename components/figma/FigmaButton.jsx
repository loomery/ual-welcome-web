'use client';

import clsx from 'clsx';

/**
 * FigmaButton — interactive button matching Shenese's Figma library
 * (file 5UATNYgfuhdBbrMp9X4dEI, node 6:22).
 *
 * Variants: primary (filled inverse), secondary (outline). All visual
 * states drive off the real DOM pseudo-classes (hover, active,
 * focus-visible, disabled) so the component is genuinely interactive —
 * no `state` prop pretending to be hovered.
 *
 * Implementation notes:
 *  - Focus ring uses `outline` instead of border-thickness changes to
 *    avoid layout shift on tab. Outline doesn't take space in the box.
 *  - Primary's "Focused" Figma spec is bg #ff5000 + 2px #ff5000 border.
 *    Since border = bg colour visually that's just a colour swap, so
 *    `focus-visible:bg-[#ff5000]` is sufficient + outline mirrors it.
 *  - Secondary uses `ring` (box-shadow based) so the 1px → 2px focus
 *    transition doesn't push surrounding content.
 *  - `disabled:cursor-not-allowed` because pointer should communicate
 *    the affordance even though the click is suppressed.
 *
 * @param {Object} props
 * @param {'primary' | 'secondary'} [props.variant]
 * @param {boolean} [props.disabled]
 * @param {'button' | 'submit' | 'reset'} [props.type]
 * @param {() => void} [props.onClick]
 * @param {import('react').ReactNode} props.children
 */
export function FigmaButton({
  variant = 'primary',
  disabled = false,
  type = 'button',
  onClick,
  children,
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        'inline-flex min-w-24 items-center justify-center px-6 py-4 text-[16px] leading-[1.4] font-medium focus:outline-none disabled:cursor-not-allowed',
        variant === 'primary'
          ? 'bg-black text-white hover:bg-[#262626] focus-visible:bg-[#ff5000] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#ff5000] active:bg-[#525252] disabled:bg-[#e5e5e5] disabled:text-[#c2c2c2] disabled:hover:bg-[#e5e5e5]'
          : 'bg-white text-black ring-1 ring-black ring-inset hover:bg-[#f2f2f2] focus-visible:ring-2 focus-visible:ring-[#ff5000] active:bg-[#e5e5e5] disabled:text-[#c2c2c2] disabled:ring-[#e5e5e5] disabled:hover:bg-white',
      )}
    >
      {children}
    </button>
  );
}
