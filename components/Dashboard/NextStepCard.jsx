import Link from 'next/link';
import { Button } from '../Button/Button';

/**
 * NextStepCard — the dark "Your next step" CTA card.
 *
 * Shown in the personalised home's Get setup section: eyebrow + bigger
 * task title + short description +
 * primary "Go to …" CTA and an underlined "View all tasks" secondary.
 *
 * Styled inline with Tailwind utilities mapped to the UAL DS tokens — a
 * light-on-dark card so it always reads as the strongest CTA on the page.
 *
 * @param {Object} props
 * @param {string} props.title              Task title — bigger headline.
 * @param {string} props.body               Short, single-sentence description.
 * @param {Object} props.primary            Main CTA (in-app link).
 * @param {string} props.primary.label
 * @param {string} props.primary.href
 * @param {Object} [props.secondary]        Optional secondary text link.
 * @param {string} props.secondary.label
 * @param {string} props.secondary.href
 */
export function NextStepCard({ title, body, primary, secondary }) {
  const primaryExternal = !primary.href.startsWith('/');
  return (
    <article className="space-y-4 border-2 border-ual-dark bg-ual-dark p-6 text-ual-light">
      <p className="text-step-d1 font-ual-bold text-ual-light">Your next step</p>
      <h3 className="text-step-1/ual-condensed tracking-ual-tight text-ual-light">{title}</h3>
      <p className="text-ual-dark-90">{body}</p>
      <div className="mt-3 flex flex-wrap items-center gap-4">
        <Button
          variant="accent"
          href={primary.href}
          {...(primaryExternal && { target: '_blank', rel: 'noreferrer' })}
        >
          {primary.label} →
          {primaryExternal && <span className="sr-only"> (opens in a new tab)</span>}
        </Button>
        {secondary && (
          <Link
            href={secondary.href}
            className="inline-flex items-center border border-ual-dark-50 px-4 py-2 text-step-d1 font-ual-bold text-ual-light no-underline hover:border-(--color-yellow) hover:text-(--color-yellow) focus-visible:border-(--color-yellow) focus-visible:text-(--color-yellow)"
          >
            {secondary.label} →
          </Link>
        )}
      </div>
    </article>
  );
}
