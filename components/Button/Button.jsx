/**
 * UAL DS Button — renders with `.button` class so all styling is
 * inherited from the design system tokens/components stylesheet.
 *
 * @param {Object} props
 * @param {import('react').ReactNode} props.children
 * @param {boolean} [props.ghost]  Ghost variant from UAL DS (`data-ghost-button`).
 * @param {string} [props.className]
 * @param {'button' | 'submit' | 'reset'} [props.type]
 */
export function Button({ children, ghost, className, type = 'button', ...rest }) {
  return (
    <button
      type={type}
      className={['button', className].filter(Boolean).join(' ')}
      data-ghost-button={ghost ? '' : undefined}
      {...rest}
    >
      {children}
    </button>
  );
}
