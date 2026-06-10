import Link from 'next/link';
import { Card } from '../../components/Card/Card';
import { ArrowRightIcon } from '../../components/Icon/NavIcons';
import { asset } from '../../utils/asset';

// Shared fallback artwork for media cards (matches the placeholder imagery in
// the Figma board until real photography is supplied).
const FALLBACK_IMAGE = asset('/images/card-fallback.png');

/**
 * Renders a personalised-home info page from its data description
 * (data/infoPages.js). Server component — the content is fully static.
 *
 * Block types: 'prose', 'list', 'links' and 'table'. Any block may also carry
 * a prominent `cta` button rendered after its body.
 *
 * @param {Object} props
 * @param {import('../../data/infoPages').InfoPage} props.page
 */
export function InfoScreen({ page }) {
  return (
    <article className="flex flex-col gap-l">
      <Link
        href="/"
        className="inline-flex w-fit items-center gap-3xs text-step-d1 text-ual-medium underline underline-offset-2 hover:text-ual-orange focus-visible:outline-2 focus-visible:outline-ual-dark dark:focus-visible:outline-ual-light"
      >
        &larr; Back to home
      </Link>

      <header className="flex flex-col gap-xs">
        <h1 className="text-step-4/ual-condensed font-bold tracking-ual-tight text-ual-dark dark:text-ual-light">
          {page.title}
        </h1>
        {page.lead && <p className="text-step-1 text-ual-medium">{page.lead}</p>}
      </header>

      {page.blocks.map((block, i) => (
        <InfoBlock key={`${block.type}-${i}`} block={block} />
      ))}
    </article>
  );
}

/**
 * @param {{ block: import('../../data/infoPages').InfoBlock }} props
 */
function InfoBlock({ block }) {
  return (
    <section className="flex flex-col gap-s" aria-label={block.heading}>
      {block.heading && (
        <h2 className="text-step-2 font-bold tracking-ual-tight text-ual-dark dark:text-ual-light">
          {block.heading}
        </h2>
      )}

      {block.type === 'prose' &&
        block.body?.map((paragraph, i) => (
          <p key={i} className="text-step-0/ual-default text-ual-dark dark:text-ual-light">
            {paragraph}
          </p>
        ))}

      {block.type === 'list' && (
        <ol
          className={[
            'flex flex-col gap-2xs pl-m text-step-0/ual-default text-ual-dark dark:text-ual-light',
            block.ordered ? 'list-decimal' : 'list-disc',
          ].join(' ')}
          role="list"
        >
          {block.items?.map((item, i) => (
            <li key={i} className="pl-2xs">
              {item}
            </li>
          ))}
        </ol>
      )}

      {block.type === 'links' &&
        (block.media ? (
          <div className="grid">
            {block.links?.map((link) => {
              const isInternal = link.href.startsWith('/');
              return (
                <Card
                  key={link.title}
                  title={link.title}
                  body={link.body}
                  image={FALLBACK_IMAGE}
                  to={isInternal ? link.href : undefined}
                  external={isInternal ? undefined : link.href}
                />
              );
            })}
          </div>
        ) : (
          <ul role="list" className="grid gap-m md:grid-cols-3">
            {block.links?.map((link) => (
              <li key={link.title}>
                <InfoLinkTile link={link} />
              </li>
            ))}
          </ul>
        ))}

      {block.type === 'table' && <InfoTable rows={block.rows ?? []} />}

      {block.cta && <CtaButton cta={block.cta} />}
    </section>
  );
}

/**
 * @param {{ link: import('../../data/infoPages').InfoLink }} props
 */
function InfoLinkTile({ link }) {
  const isInternal = link.href.startsWith('/');
  const inner = (
    <>
      <span className="text-step-1 font-bold text-ual-dark group-hover:text-ual-orange dark:text-ual-light">
        {link.title}
        {!isInternal && <span className="sr-only"> (opens in a new tab)</span>}
      </span>
      <span className="text-ual-dark group-hover:text-ual-orange dark:text-ual-light">
        <ArrowRightIcon width={20} height={20} aria-hidden="true" />
      </span>
      {link.body && <span className="text-step-d1 text-ual-medium">{link.body}</span>}
    </>
  );

  const className =
    'group flex flex-col gap-2xs focus-visible:outline-2 focus-visible:outline-ual-dark dark:focus-visible:outline-ual-light';

  if (isInternal) {
    return (
      <Link href={link.href} className={className}>
        {inner}
      </Link>
    );
  }
  return (
    <a href={link.href} target="_blank" rel="noreferrer" className={className}>
      {inner}
    </a>
  );
}

/**
 * Two-column rows grouped by an optional `group` label — used for the
 * "Transport" block (closest stations / closest buses).
 *
 * @param {{ rows: import('../../data/infoPages').InfoRow[] }} props
 */
function InfoTable({ rows }) {
  const groups = rows.reduce((acc, row) => {
    const key = row.group ?? '';
    (acc[key] ??= []).push(row);
    return acc;
  }, /** @type {Record<string, import('../../data/infoPages').InfoRow[]>} */ ({}));

  return (
    <div className="grid gap-m md:grid-cols-2">
      {Object.entries(groups).map(([group, groupRows]) => (
        <div key={group} className="flex flex-col">
          {group && (
            <p className="text-step-d1 font-bold text-ual-dark dark:text-ual-light">{group}</p>
          )}
          {groupRows.map((row, i) => (
            <div
              key={i}
              className="flex items-center justify-between gap-s border-t border-ual-dark/10 py-2xs text-step-d1 text-ual-medium dark:border-ual-light/15"
            >
              <span>{row.label}</span>
              <span>{row.value}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

/**
 * Prominent dark call-to-action button (matches the Figma "Find your nearest
 * doctor" / banner style). Internal hrefs render next/link.
 *
 * @param {{ cta: { label: string, href: string } }} props
 */
function CtaButton({ cta }) {
  const isInternal = cta.href.startsWith('/');
  // The text colour lives on the inner span/icon (not the anchor) so it beats
  // the unlayered `a { color: var(--color-dark) }` base rule in globals.css —
  // otherwise the white label renders black-on-black and disappears.
  const inner = (
    <>
      <span className="text-ual-light group-hover:text-ual-orange">
        {cta.label}
        {!isInternal && <span className="sr-only"> (opens in a new tab)</span>}
      </span>
      <ArrowRightIcon
        width={24}
        height={24}
        aria-hidden="true"
        className="shrink-0 text-ual-light group-hover:text-ual-orange"
      />
    </>
  );

  const className =
    'group flex w-full max-w-prose-ual items-center justify-between gap-m bg-ual-dark px-l py-m text-step-1 font-bold tracking-ual-tight focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ual-dark dark:bg-ual-dark-95 dark:focus-visible:outline-ual-light';

  if (isInternal) {
    return (
      <Link href={cta.href} className={className}>
        {inner}
      </Link>
    );
  }
  return (
    <a href={cta.href} target="_blank" rel="noreferrer" className={className}>
      {inner}
    </a>
  );
}
