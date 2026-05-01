import Link from 'next/link';
import { ArrowRightIcon, ExternalLinkIcon } from '../Icon/NavIcons';

/**
 * UAL DS Card pattern. If `to` or `external` is provided it becomes a link-card
 * (entire surface is the target) matching the DS "card:is(a)" style.
 *
 * The trailing icon doubles as a directional cue:
 *  - internal route (`to`): ArrowRightIcon
 *  - external (`external`): ExternalLinkIcon + visually-hidden "(opens in
 *    new tab)" so AT users get the same affordance sighted users get.
 *
 * @param {Object} props
 * @param {string} props.title
 * @param {import('react').ReactNode} [props.body]
 * @param {string} [props.to]
 * @param {string} [props.external]
 * @param {string} [props.eyebrow]
 */
export function Card({ title, body, to, external, eyebrow }) {
  const inner = (
    <>
      {eyebrow && <p className="step--1 event__meta">{eyebrow}</p>}
      <h3>{title}</h3>
      {body && (
        <div className="flow" data-flow="s">
          {body}
        </div>
      )}
      {to && <ArrowRightIcon aria-hidden="true" />}
      {external && (
        <>
          <ExternalLinkIcon aria-hidden="true" />
          <span className="visually-hidden"> (opens in new tab)</span>
        </>
      )}
    </>
  );

  if (to) {
    return (
      <Link href={to} className="flow card" data-flow="s">
        {inner}
      </Link>
    );
  }

  if (external) {
    return (
      <a href={external} className="flow card" data-flow="s" target="_blank" rel="noreferrer">
        {inner}
      </a>
    );
  }

  return (
    <article className="flow card" data-flow="s">
      {inner}
    </article>
  );
}
