import { LONG_DATE_FMT } from '../../utils/dates';

/**
 * KeyInfoCard — a single card in the "Key information" section.
 *
 * Mirrors the Figma "Autumn term" / Useful-info card: optional eyebrow
 * (e.g. "Autumn term"), title, either a formatted date range or a body
 * paragraph, and an underlined CTA link.
 *
 * Item data comes from `data/usefulInfo.js`. Items with structured
 * `dates` render the formatted range as the body; items with `body`
 * fall back to that string.
 *
 * @param {Object} props
 * @param {import('../../data/usefulInfo').UsefulInfoItem} props.item
 */
export function KeyInfoCard({ item }) {
  const dateRange = item.dates
    ? `${LONG_DATE_FMT.format(new Date(item.dates.startsAt))} – ${LONG_DATE_FMT.format(new Date(item.dates.endsAt))}`
    : null;

  return (
    <a
      href={item.href}
      target="_blank"
      rel="noreferrer"
      className="flow card key-info-card"
      data-flow="s"
    >
      {item.eyebrow && <p className="key-info-card__eyebrow">{item.eyebrow}</p>}
      <h3>{item.title}</h3>
      {dateRange ? <p>{dateRange}</p> : item.body ? <p>{item.body}</p> : null}
      <p className="key-info-card__cta">{item.ctaLabel}</p>
    </a>
  );
}
