import Link from 'next/link';
import { Card } from '../../components/Card/Card';
import { LinkButton } from '../../components/Button/LinkButton';
import { ArrowRightIcon, ChevronDownIcon, ExternalLinkIcon } from '../../components/Icon/NavIcons';
import { asset } from '../../utils/asset';
import { Breadcrumbs } from '../../components/Breadcrumbs/Breadcrumbs';

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
    <article className="flex flex-col gap-8">
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: page.title, href: `/info/${page.slug}` },
        ]}
      />

      <header className="flex flex-col gap-3">
        <h1 className="text-step-4/ual-condensed font-bold tracking-ual-tight text-ual-dark">
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
  const isAccordion = block.type === 'list' && block.accordion;

  return (
    <section className="flex flex-col gap-4" aria-label={block.heading}>
      {block.heading && !isAccordion && (
        // Subheadings are normal weight — set explicitly so the base
        // bold default for headings doesn't apply.
        <h2 className="text-step-2 font-normal tracking-ual-tight text-ual-dark">
          {block.heading}
        </h2>
      )}

      {block.type === 'prose' &&
        block.body?.map((paragraph, i) => (
          <p key={i} className="text-step-0/ual-default text-ual-dark">
            {paragraph}
          </p>
        ))}

      {block.type === 'list' &&
        (isAccordion ? (
          <details open className="group border-b border-ual-dark/10 pb-4">
            <summary className="flex cursor-pointer list-none items-baseline justify-between gap-4 [&::-webkit-details-marker]:hidden">
              <h2 className="text-step-2 font-normal tracking-ual-tight text-ual-dark">
                {block.heading}
              </h2>
              <ChevronDownIcon
                width={24}
                height={24}
                aria-hidden="true"
                className="shrink-0 self-center text-ual-dark transition-transform group-open:rotate-180"
              />
            </summary>
            <div className="pt-4">
              <ListBody block={block} />
            </div>
          </details>
        ) : (
          <ListBody block={block} />
        ))}

      {block.type === 'links' &&
        (block.media ? (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(250px,100%),1fr))] gap-(--grid-gutter)">
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
          <ul role="list" className="grid gap-6 md:grid-cols-3">
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
 * Ordered/unordered list body, optionally alongside a photo shown next to
 * the content on wider screens.
 *
 * No `role="list"` here: a list with visible markers keeps its assistive-tech
 * semantics without the role (and `role="list"` would strip the markers).
 *
 * @param {{ block: import('../../data/infoPages').InfoBlock }} props
 */
function ListBody({ block }) {
  const list = (
    <ol
      className={[
        'flex flex-col gap-2 pl-6 text-step-0/ual-default text-ual-dark',
        block.ordered ? 'list-decimal' : 'list-disc',
      ].join(' ')}
    >
      {block.items?.map((item, i) => (
        <li key={i} className="pl-2">
          {item}
        </li>
      ))}
    </ol>
  );

  if (!block.image) {
    return list;
  }

  return (
    <div className="grid items-start gap-4 md:grid-cols-2">
      {list}
      {/* Plain <img>: static export, local photo — same rationale as Card. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={asset(block.image)}
        alt={block.imageAlt ?? ''}
        loading="lazy"
        width={1000}
        height={750}
        className="w-full bg-ual-shade object-cover"
      />
    </div>
  );
}

/**
 * @param {{ link: import('../../data/infoPages').InfoLink }} props
 */
function InfoLinkTile({ link }) {
  const isInternal = link.href.startsWith('/');
  const inner = (
    <>
      <span className="text-step-1 font-bold text-ual-dark group-hover:text-ual-orange">
        {link.title}
        {!isInternal && <span className="sr-only"> (opens in a new tab)</span>}
      </span>
      <span className="text-ual-dark group-hover:text-ual-orange">
        <ArrowRightIcon width={20} height={20} aria-hidden="true" />
      </span>
      {link.body && <span className="text-step-d1 text-ual-medium">{link.body}</span>}
    </>
  );

  const className =
    'group flex flex-col gap-2 focus-visible:outline-2 focus-visible:outline-ual-dark';

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
    <div className="grid gap-6 md:grid-cols-2">
      {Object.entries(groups).map(([group, groupRows]) => (
        <div key={group} className="flex flex-col">
          {group && <p className="text-step-d1 font-bold text-ual-dark">{group}</p>}
          {groupRows.map((row, i) => (
            <div
              key={i}
              className="flex items-center justify-between gap-4 border-t border-ual-dark/10 py-2 text-step-d1 text-ual-medium"
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
 * Prominent dark call-to-action button (banner style). Internal hrefs
 * render next/link.
 *
 * @param {{ cta: { label: string, href: string } }} props
 */
function CtaButton({ cta }) {
  const isInternal = cta.href.startsWith('/');

  if (cta.variant === 'hyperlink') {
    return (
      <LinkButton
        href={cta.href}
        className="w-fit text-step-0"
        {...(isInternal ? {} : { target: '_blank', rel: 'noreferrer' })}
      >
        {cta.label}
        {!isInternal && (
          <>
            <span className="sr-only"> (opens in a new tab)</span>
            <ExternalLinkIcon
              width={16}
              height={16}
              aria-hidden="true"
              className="ml-1 inline shrink-0"
            />
          </>
        )}
      </LinkButton>
    );
  }

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
    'group flex w-full max-w-prose-ual items-center justify-between gap-6 bg-ual-dark px-8 py-6 text-step-1 font-bold tracking-ual-tight focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ual-dark';

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
