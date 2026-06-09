import Link from 'next/link';
import { ArrowRightIcon, ExternalLinkIcon } from '../Icon/NavIcons';

/**
 * Inline action(s) for an essential task or MFA step — an underlined link
 * (`cta`) and/or app-download links (`apps`). Internal `cta` hrefs (those
 * starting with '/') render as a next/link with a forward arrow; external
 * ones open in a new tab with the external-link affordance.
 *
 * @param {Object} props
 * @param {import('../../data/checklist').Cta} [props.cta]
 * @param {import('../../data/checklist').AppLinks} [props.apps]
 */
export function TaskAction({ cta, apps }) {
  if (!cta && !apps) return null;

  return (
    <div className="flex flex-col gap-2xs">
      {apps && (
        <div className="flex flex-wrap items-center gap-x-l gap-y-2xs">
          <span className="text-step-d1 font-bold text-ual-dark dark:text-ual-light">
            Download the app
          </span>
          {apps.apple && <ExternalLink href={apps.apple} label="iOS" />}
          {apps.android && <ExternalLink href={apps.android} label="Android" />}
        </div>
      )}
      {cta && <CtaLink cta={cta} />}
    </div>
  );
}

/**
 * @param {{ cta: import('../../data/checklist').Cta }} props
 */
function CtaLink({ cta }) {
  const isInternal = cta.href.startsWith('/');

  if (isInternal) {
    return (
      <Link
        href={cta.href}
        className="inline-flex w-fit items-center gap-3xs text-step-d1 font-bold text-ual-dark underline underline-offset-2 hover:text-ual-orange focus-visible:outline-2 focus-visible:outline-ual-dark dark:text-ual-light dark:focus-visible:outline-ual-light"
      >
        {cta.label}
        <ArrowRightIcon width={14} height={14} aria-hidden="true" />
      </Link>
    );
  }

  return <ExternalLink href={cta.href} label={cta.label} />;
}

/**
 * @param {{ href: string, label: string }} props
 */
function ExternalLink({ href, label }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex w-fit items-center gap-3xs text-step-d1 font-bold text-ual-dark underline underline-offset-2 hover:text-ual-orange focus-visible:outline-2 focus-visible:outline-ual-dark dark:text-ual-light dark:focus-visible:outline-ual-light"
    >
      {label}
      <ExternalLinkIcon width={12} height={12} aria-hidden="true" />
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
