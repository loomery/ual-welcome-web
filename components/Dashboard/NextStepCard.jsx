import Link from 'next/link';

/**
 * NextStepCard — the dark "Your next step" CTA card.
 *
 * Mirrors the Figma "Your next step" frame inside the personalised home's
 * Get setup section: eyebrow + bigger task title + short description +
 * primary "Go to …" CTA and an underlined "View all tasks" secondary.
 *
 * The visual styling lives in app/globals.css (`.next-step-card`,
 * `.next-step-card__*`) so dark-mode swaps and surface tokens follow the
 * rest of the UAL DS rather than being hand-rolled per-screen.
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
  return (
    <article className="next-step-card flow" data-flow="s">
      <p className="next-step-card__eyebrow">Your next step</p>
      <h3 className="next-step-card__title">{title}</h3>
      <p className="next-step-card__body">{body}</p>
      <div className="cluster next-step-card__ctas" data-justify="flex-start">
        <Link href={primary.href} className="button next-step-card__primary">
          {primary.label}
        </Link>
        {secondary && (
          <Link href={secondary.href} className="next-step-card__secondary">
            {secondary.label}
          </Link>
        )}
      </div>
    </article>
  );
}
