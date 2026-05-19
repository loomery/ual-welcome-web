import Link from 'next/link';
import { ArrowRightIcon, ExternalLinkIcon } from '../Icon/NavIcons';

/**
 * UAL DDS Card pattern.
 *
 * Visual structure (matches the "Atoms / Body" frame in the UAL DDS Figma):
 *   1. Optional eyebrow (meta label, small)
 *   2. Title (h3)
 *   3. Directional icon on its own row — ArrowRightIcon for internal `to`,
 *      ExternalLinkIcon for external `external`. The icon sits *between*
 *      the title and the body, not at the end of the card.
 *   4. Optional body copy
 *
 * On hover/focus the entire card (title + icon + body) shifts to UAL
 * orange (#ff5000); on press, to the lighter pressed orange (#ff8500).
 * Driven by the `.card` CSS, not inline classes — keeps the JSX clean.
 *
 * @param {Object} props
 * @param {string} props.title
 * @param {import('react').ReactNode} [props.body]
 * @param {string} [props.to]        Internal route — renders next/link.
 * @param {string} [props.external]  External URL — renders <a target="_blank">.
 * @param {string} [props.eyebrow]   Small meta label rendered above the title.
 */
export function Card({ title, body, to, external, eyebrow }) {
  const isInternal = Boolean(to);
  const isExternal = Boolean(external);
  const Icon = isExternal ? ExternalLinkIcon : ArrowRightIcon;
  const hasIcon = isInternal || isExternal;

  const inner = (
    <>
      {eyebrow && <p className="card__eyebrow">{eyebrow}</p>}
      <h3 className="card__title">{title}</h3>
      {hasIcon && (
        <span className="card__icon" aria-hidden="true">
          <Icon />
        </span>
      )}
      {body && <div className="card__body">{body}</div>}
      {isExternal && <span className="visually-hidden"> (opens in new tab)</span>}
    </>
  );

  if (isInternal) {
    return (
      <Link href={to} className="card">
        {inner}
      </Link>
    );
  }

  if (isExternal) {
    return (
      <a href={external} className="card" target="_blank" rel="noreferrer">
        {inner}
      </a>
    );
  }

  return <article className="card">{inner}</article>;
}
