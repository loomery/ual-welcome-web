import Link from 'next/link';
import { ArrowRightIcon, CaptionIcon, ExternalLinkIcon } from '../Icon/NavIcons';

/**
 * Card.
 *
 * Visual structure:
 *   1. Optional eyebrow (meta label, small)
 *   2. Title (h3)
 *   3. Directional icon on its own row — ArrowRightIcon for internal `to`,
 *      ExternalLinkIcon for external `external`. The icon sits *between*
 *      the title and the body, not at the end of the card.
 *   4. Optional body copy
 *
 * On hover/focus the entire card (title + icon + body) shifts to UAL
 * orange; on press, to the lighter pressed orange.
 *
 * When an `image` is supplied the card becomes a media card: a 16:9 image
 * sits at the top with a caption chip in its bottom-left corner, and the
 * rest of the stack (title → icon → body) keeps the same order and rhythm
 * as the text-only card.
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

  // Whole-card hover/focus/pressed — title, icon and body all shift colour
  // together (orange is a content signal, not a surface change). Only the link
  // variants flip: `group` sits on the anchor and the title/body opt into the
  // colour change via group-hover/group-focus-visible/group-active. The icon
  // inherits via text-current, following the anchor's own hover/focus colour.
  const interactive = isInternal || isExternal;
  const titleFlip = interactive
    ? ' group-hover:text-ual-orange group-focus-visible:text-ual-orange group-active:text-[var(--color-orange-pressed)]'
    : '';
  const bodyFlip = interactive
    ? ' group-hover:text-ual-orange group-focus-visible:text-ual-orange group-active:text-[var(--color-orange-pressed)]'
    : '';

  const inner = (
    <>
      {hasMedia && (
        <span
          className="relative block aspect-video overflow-hidden bg-ual-shade"
          aria-hidden="true"
        >
          {/* Plain <img>: static export, dummy placeholder art — no need for
              next/image optimisation here. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt={imageAlt}
            loading="lazy"
            className="block size-full object-cover transition-transform duration-300 group-hover:scale-[1.03] group-focus-visible:scale-[1.03]"
          />
          {/* Caption chip — decorative here (no caption data yet); the wrapping
              span is already aria-hidden. Sits over imagery, so it stays
              black/white in both themes — deliberately not themed. */}
          <span className="absolute bottom-0 left-0 inline-flex size-11 items-center justify-center bg-black text-white [&>svg]:size-5">
            <CaptionIcon />
          </span>
        </span>
      )}
      {eyebrow && <p className="text-step-d1 font-ual-bold text-ual-medium">{eyebrow}</p>}
      <h3
        className={`text-step-1/ual-condensed font-ual-normal text-(--color-copy-headings)${titleFlip}`}
      >
        {title}
      </h3>
      {hasIcon && (
        <span
          className="inline-flex size-11 items-center text-current [&>svg]:size-6"
          aria-hidden="true"
        >
          <Icon />
        </span>
      )}
      {body && (
        <div className={`text-(--color-copy-headings) [&>p+p]:mt-2xs${bodyFlip}`}>{body}</div>
      )}
      {isExternal && <span className="sr-only"> (opens in new tab)</span>}
    </>
  );

  const baseClass =
    'flex flex-col gap-s text-[var(--color-copy-headings)] no-underline transition-colors duration-150';
  // Anchor's own colour drives the icon (text-current); orange on hover/focus,
  // pressed-orange on active, plus the 2px orange focus ring at offset 4.
  const linkClass = `group ${baseClass} hover:text-ual-orange focus-visible:text-ual-orange active:text-[var(--color-orange-pressed)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ual-orange`;

  if (isInternal) {
    return (
      <Link href={to} className={linkClass}>
        {inner}
      </Link>
    );
  }

  if (isExternal) {
    return (
      <a href={external} className={linkClass} target="_blank" rel="noreferrer">
        {inner}
      </a>
    );
  }

  return <article className={baseClass}>{inner}</article>;
}
