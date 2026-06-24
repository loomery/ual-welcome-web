import Link from 'next/link';

/**
 * Inline text-link styled as an action — looks like an underlined link, for
 * in-text actions (reset, edit, "clear all") and inline CTAs. Renders a
 * <button> by default, or a link (next/link / <a>) when `href` is set.
 * Inherits the surrounding font size/weight, like a real link.
 *
 * @param {Object} props
 * @param {string} [props.href]      If set, renders a link instead of a button.
 * @param {string} [props.className] Extra utilities.
 */
const CLS =
  'cursor-pointer border-0 bg-transparent p-0 text-ual-dark underline underline-offset-4 hover:text-ual-orange focus-visible:text-ual-orange focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ual-orange';

export function LinkButton({ children, href, className, type = 'button', ref, ...rest }) {
  const cls = [CLS, className].filter(Boolean).join(' ');

  if (href && href.startsWith('/')) {
    return (
      <Link ref={ref} href={href} className={cls} {...rest}>
        {children}
      </Link>
    );
  }
  if (href) {
    return (
      <a ref={ref} href={href} className={cls} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <button ref={ref} type={type} className={cls} {...rest}>
      {children}
    </button>
  );
}
