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
  // Combine the class strings into one. `filter(Boolean)` drops any that are
  // empty/undefined (e.g. when no `className` is passed) so we don't end up
  // with a stray "undefined" or a double space; `join(' ')` space-separates them.
  const cls = [CLS, className].filter(Boolean).join(' ');

  // Plain <button> by default. With an `href` it becomes a link instead:
  // a Next.js <Link> for internal paths ("/…"), or a normal <a> for external URLs.
  let Tag = 'button';
  let tagProps = { type };
  if (href) {
    Tag = href.startsWith('/') ? Link : 'a';
    tagProps = { href };
  }

  return (
    <Tag ref={ref} className={cls} {...tagProps} {...rest}>
      {children}
    </Tag>
  );
}
