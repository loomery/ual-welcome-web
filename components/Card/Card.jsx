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
 * When an `image` is supplied the card becomes a *media card* (`.card--media`):
 * a 16:10 image sits at the top with a rounded surface, the directional icon
 * moves to the *end* of the card next to the body, and the whole tile reads as
 * a clickable picture-led promo (matches the home "All at UAL" grid in Figma).
 *
 * @param {Object} props
 * @param {string} props.title
 * @param {import('react').ReactNode} [props.body]
 * @param {string} [props.to]        Internal route — renders next/link.
 * @param {string} [props.external]  External URL — renders <a target="_blank">.
 * @param {string} [props.eyebrow]   Small meta label rendered above the title.
 * @param {string} [props.image]     Image src — turns the card into a media card.
 * @param {string} [props.imageAlt]  Alt text for the image (default '' = decorative).
 */
export function Card({ title, body, to, external, eyebrow, image, imageAlt = '' }) {
  const isInternal = Boolean(to);
  const isExternal = Boolean(external);
  const Icon = isExternal ? ExternalLinkIcon : ArrowRightIcon;
  const hasIcon = isInternal || isExternal;
  const hasMedia = Boolean(image);

  const inner = (
    <>
      {hasMedia && (
        <span className="card__media" aria-hidden="true">
          {/* Plain <img>: static export, dummy placeholder art — no need for
              next/image optimisation here. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt={imageAlt} loading="lazy" />
        </span>
      )}
      {eyebrow && <p className="card__eyebrow">{eyebrow}</p>}
      <h3 className="card__title">{title}</h3>
      {hasIcon && !hasMedia && (
        <span className="card__icon" aria-hidden="true">
          <Icon />
        </span>
      )}
      {body && <div className="card__body">{body}</div>}
      {hasIcon && hasMedia && (
        <span className="card__icon card__icon--end" aria-hidden="true">
          <Icon />
        </span>
      )}
      {isExternal && <span className="visually-hidden"> (opens in new tab)</span>}
    </>
  );

  const className = hasMedia ? 'card card--media' : 'card';

  if (isInternal) {
    return (
      <Link href={to} className={className}>
        {inner}
      </Link>
    );
  }

  if (isExternal) {
    return (
      <a href={external} className={className} target="_blank" rel="noreferrer">
        {inner}
      </a>
    );
  }

  return <article className={className}>{inner}</article>;
}
