import Link from 'next/link';

/**
 * The one UAL button. Renders a real <button>, or a link (next/link for
 * internal `/...` hrefs, <a> for external) when `href` is set — so a link
 * that looks like a button uses the exact same component and styling.
 *
 * @param {Object} props
 * @param {'solid'|'ghost'|'accent'|'outline'} [props.variant] solid = dark fill
 *        (default), ghost = transparent outline, accent = yellow CTA,
 *        outline = white fill + border (onboarding secondary).
 * @param {'md'|'sm'} [props.size]   md (default) or sm (compact).
 * @param {'bold'|'normal'} [props.weight] bold (default) or normal.
 * @param {string} [props.href]      If set, renders a link instead of a button.
 * @param {string} [props.className] Extra utilities.
 */
const VARIANT = {
  solid:
    'border-2 border-ual-dark bg-ual-dark text-ual-light hover:border-ual-orange hover:bg-ual-orange hover:text-ual-dark focus-visible:border-ual-orange focus-visible:bg-ual-orange focus-visible:text-ual-dark active:border-[var(--color-orange-pressed)] active:bg-[var(--color-orange-pressed)] active:text-ual-dark',
  ghost:
    'border-2 border-ual-dark bg-transparent text-ual-dark hover:border-ual-orange hover:bg-ual-orange hover:text-ual-dark focus-visible:border-ual-orange focus-visible:bg-ual-orange focus-visible:text-ual-dark active:border-[var(--color-orange-pressed)] active:bg-[var(--color-orange-pressed)] active:text-ual-dark',
  accent:
    'border-2 border-[var(--color-yellow)] bg-[var(--color-yellow)] text-ual-dark hover:border-[var(--color-yellow-pressed)] hover:bg-[var(--color-yellow-pressed)] focus-visible:border-[var(--color-yellow-pressed)] focus-visible:bg-[var(--color-yellow-pressed)] active:border-[var(--color-orange-pressed)] active:bg-[var(--color-orange-pressed)]',
  outline:
    'border-b border-ual-dark-50 bg-ual-light text-ual-dark hover:border-ual-orange hover:text-ual-orange focus-visible:border-ual-orange focus-visible:text-ual-orange',
};

const SIZE = { md: 'p-4 text-step-0/ual-condensed', sm: 'px-4 py-2 text-step-d1' };

const WEIGHT = { bold: 'font-ual-bold', normal: 'font-ual-normal' };

const BASE =
  'inline-flex min-h-11 cursor-pointer items-center gap-2 no-underline transition-colors duration-200 [&>svg]:size-[1.5em] [&>svg]:shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ual-orange active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 aria-disabled:cursor-not-allowed aria-disabled:opacity-50';

export function Button({
  children,
  variant = 'solid',
  size = 'md',
  weight = 'bold',
  href,
  className,
  type = 'button',
  ref,
  ...rest
}) {
  const cls = [BASE, SIZE[size], WEIGHT[weight], VARIANT[variant], className]
    .filter(Boolean)
    .join(' ');

  // Internal link (e.g. "/events") → Next.js <Link>.
  if (href && href.startsWith('/')) {
    return (
      <Link ref={ref} href={href} className={cls} {...rest}>
        {children}
      </Link>
    );
  }
  // External link (e.g. "https://…") → a normal <a>.
  if (href) {
    return (
      <a ref={ref} href={href} className={cls} {...rest}>
        {children}
      </a>
    );
  }
  // No href → a real <button>.
  return (
    <button ref={ref} type={type} className={cls} {...rest}>
      {children}
    </button>
  );
}
