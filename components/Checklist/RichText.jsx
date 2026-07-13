import { ExternalLinkIcon } from '../Icon/NavIcons';

/**
 * RichText — renders a copy string that may contain inline links written as
 * [label](url). External links open in a new tab with the usual affordance.
 * Keeps detail-page copy in data/checklist.js as plain strings.
 *
 * @param {{ text: string }} props
 */
export function RichText({ text }) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
  return (
    <>
      {parts.map((part, i) => {
        const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (!match) return part;
        const [, label, href] = match;
        const external = href.startsWith('http');
        return (
          <a
            key={i}
            href={href}
            target={external ? '_blank' : undefined}
            rel={external ? 'noreferrer' : undefined}
            className="inline-flex items-baseline gap-1 font-ual-normal text-ual-dark underline underline-offset-2 hover:text-ual-orange focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ual-orange"
          >
            {label}
            {external && (
              <>
                <ExternalLinkIcon aria-hidden="true" className="size-4 self-center" />
                <span className="sr-only"> (opens in a new tab)</span>
              </>
            )}
          </a>
        );
      })}
    </>
  );
}
