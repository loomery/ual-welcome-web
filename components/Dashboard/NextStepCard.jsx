import Link from 'next/link';
import { Button } from '../Button/Button';

/**
 * NextStepCard — the dark "Your next step" CTA card.
 *
 * Shown in the personalised home's Get setup section: eyebrow + bigger
 * task title + short description +
 * primary "Go to …" CTA and an underlined "View all tasks" secondary.
 *
 * Styled inline with Tailwind utilities mapped to the UAL DS tokens; the
 * `dark:` variants invert it to dark-on-light so it always reads as the
 * strongest CTA on the page.
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
    <article className="space-y-4 border-2 border-ual-dark bg-ual-dark p-6 text-ual-light dark:border-ual-light dark:bg-ual-light dark:text-ual-dark">
      <p className="text-step-d1 font-ual-bold text-ual-light dark:text-ual-dark">Your next step</p>
      <h3 className="text-step-1/ual-condensed tracking-ual-tight text-ual-light dark:text-ual-dark">
        {title}
      </h3>
      <p className="text-ual-dark-90 dark:text-ual-medium">{body}</p>
      <div className="mt-3 flex flex-wrap items-center gap-4">
        <Button
          variant="accent"
          href={primary.href}
          className='after:content-["_→"]'
          {...(primaryExternal && { target: '_blank', rel: 'noreferrer' })}
        >
          {primary.label}
          {primaryExternal && <span className="sr-only"> (opens in a new tab)</span>}
        </Button>
        {secondary && (
          <Link
            href={secondary.href}
            className="inline-flex items-center border border-ual-dark-50 px-4 py-2 text-step-d1 font-ual-bold text-ual-light no-underline after:ml-2 after:content-['_→'] hover:border-(--color-yellow) hover:text-(--color-yellow) focus-visible:border-(--color-yellow) focus-visible:text-(--color-yellow) dark:text-ual-dark"
          >
            {secondary.label}
          </Link>
        )}
      </div>
    </article>
  );
}
