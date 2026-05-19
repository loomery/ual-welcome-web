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
    <a href={item.href} target="_blank" rel="noreferrer" className="card key-info-card">
      {item.eyebrow && <p className="card__eyebrow">{item.eyebrow}</p>}
      <h3 className="card__title">{item.title}</h3>
      {(dateRange || item.body) && (
        <div className="card__body">
          <p>{dateRange ?? item.body}</p>
        </div>
      )}
      <p className="key-info-card__cta">{item.ctaLabel}</p>
    </a>
  );
}
