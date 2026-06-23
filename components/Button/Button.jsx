const BASE =
  'inline-flex min-h-11 cursor-pointer items-center gap-2xs border-2 border-ual-dark p-s text-step-0/ual-condensed font-ual-bold no-underline transition-colors duration-200 [&>svg]:size-[1.5em] [&>svg]:shrink-0 hover:border-ual-orange hover:bg-ual-orange hover:text-ual-dark focus-visible:border-ual-orange focus-visible:bg-ual-orange focus-visible:text-ual-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ual-orange active:scale-[0.99] active:border-[var(--color-orange-pressed)] active:bg-[var(--color-orange-pressed)] active:text-ual-dark disabled:cursor-not-allowed disabled:opacity-50 aria-disabled:cursor-not-allowed aria-disabled:opacity-50';

/**
 * Tailwind class string for the UAL DS button. Exported so non-<button>
 * elements (e.g. an <a> styled as a button) share the exact same styling.
 *
 * @param {boolean} [ghost]
 */
export function buttonClasses(ghost) {
  return [BASE, ghost ? 'bg-transparent text-ual-dark' : 'bg-ual-dark text-ual-light'].join(' ');
}

/**
 * UAL DS Button.
 *
 * @param {Object} props
 * @param {import('react').ReactNode} props.children
 * @param {boolean} [props.ghost]  Ghost variant (transparent bg, dark text).
 * @param {string} [props.className]
 * @param {'button' | 'submit' | 'reset'} [props.type]
 */
export function Button({ children, ghost, className, type = 'button', ...rest }) {
  return (
    <button
      type={type}
      className={[buttonClasses(ghost), className].filter(Boolean).join(' ')}
      {...rest}
    >
      {children}
    </button>
  );
}
