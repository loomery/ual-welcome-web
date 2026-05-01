'use client';

import { FigmaDateBadge } from './FigmaDateBadge';

/**
 * FigmaEventCard — events-of-the-week summary card with a header link
 * and per-row date badge + meta (node 13:2).
 *
 * Real interactive elements: the "See all →" header link and each
 * event row are anchors with hover affordances (underline + colour
 * shift). Data-driven via the `events` prop.
 *
 * @typedef {Object} FigmaEventEntry
 * @property {string} day
 * @property {string} month
 * @property {'yellow' | 'green' | 'subtle'} [tone]
 * @property {string} title
 * @property {string} time
 * @property {string} [meta]
 * @property {string} [href]
 *
 * @param {Object} props
 * @param {string} [props.title]
 * @param {string} [props.seeAllHref]
 * @param {() => void} [props.onSeeAll]
 * @param {FigmaEventEntry[]} props.events
 */
export function FigmaEventCard({ title = 'Events this week', seeAllHref = '#', onSeeAll, events }) {
  return (
    <article className="flex w-81.75 max-w-full flex-col gap-4 rounded-lg bg-[#f2f2f2] p-4">
      <header className="flex items-center justify-between">
        <h3 className="text-[20px] leading-[1.2] font-bold text-black">{title}</h3>
        <a
          href={seeAllHref}
          onClick={(e) => {
            if (onSeeAll) {
              e.preventDefault();
              onSeeAll();
            }
          }}
          className="rounded-xs px-0.5 text-[13px] leading-[1.4] text-[#525252] hover:text-black hover:underline focus:outline-none focus-visible:outline-2 focus-visible:outline-[#ff5000]"
        >
          See all →
        </a>
      </header>

      {events.map((event, i) => (
        <a
          key={i}
          href={event.href || '#'}
          className="-mx-1 flex items-start gap-3 rounded-sm px-1 py-0.5 hover:bg-white focus:outline-none focus-visible:outline-2 focus-visible:outline-[#ff5000]"
        >
          <FigmaDateBadge day={event.day} month={event.month} tone={event.tone || 'yellow'} />
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <p className="text-[16px] leading-[1.4] font-medium text-black">{event.title}</p>
            <p className="text-[13px] leading-[1.4] text-[#525252]">{event.time}</p>
            {event.meta && <p className="text-[13px] leading-[1.4] text-[#858585]">{event.meta}</p>}
          </div>
        </a>
      ))}
    </article>
  );
}
