'use client';

import Link from 'next/link';
import { DateStampBar } from '../Dashboard/DateStampBar';
import { ArrowRightIcon, CaptionIcon } from '../Icon/NavIcons';
import { TIME_FMT } from '../../utils/dates';
import { asset } from '../../utils/asset';

/** Shared artwork used when an event has no image of its own. */
const FALLBACK_IMAGE = '/images/card-fallback.png';

/**
 * Event card — UAL-branded, image-led.
 *
 * Anatomy (top-to-bottom):
 *  - Media: a 16:9 artwork with a caption chip in its bottom-left corner; it
 *    subtly zooms on hover/focus so the card reads as an interactive surface.
 *  - Date-stamp bar: the signature black timeline strip (label + date, or a
 *    start→end range for multi-day events).
 *  - Meta: Location + Timing rows, the title (turns UAL orange on hover), and
 *    a directional arrow pinned to the card's bottom edge so cards in a grid
 *    or reel align regardless of copy length.
 *
 * The whole surface is a link, following the UAL DS card pattern.
 *
 * @param {Object} props
 * @param {import('../../data/events').UalEvent} props.event
 * @param {boolean} [props.compact]  Width-constrained variant for horizontal reels.
 */
export function EventCard({ event, compact }) {
  const start = new Date(event.startsAt);
  const end = new Date(event.endsAt);
  const timeRange = `${TIME_FMT.format(start)}–${TIME_FMT.format(end)}`;

  const className = [
    'group flex h-full flex-col border border-[#d1d1d1] bg-ual-light',
    compact && 'w-72 max-w-[85vw]',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <article className={className}>
      <Link
        href={`/events/${event.id}`}
        className="group/link flex h-full flex-col text-inherit no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ual-orange"
      >
        <span
          className="relative block aspect-video overflow-hidden bg-ual-shade"
          aria-hidden="true"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={asset(event.image ?? FALLBACK_IMAGE)}
            alt=""
            loading="lazy"
            className="block size-full object-cover transition-transform duration-300 group-hover/link:scale-[1.03] group-focus-visible/link:scale-[1.03] motion-reduce:transition-none"
          />
          <span className="absolute bottom-0 left-0 inline-flex size-11 items-center justify-center bg-ual-dark text-ual-light [&>svg]:size-6">
            <CaptionIcon />
          </span>
        </span>

        <DateStampBar label="Event" startsAt={event.startsAt} endsAt={event.endsAt} />

        <div className="flex grow flex-col gap-2 p-4">
          <p className="m-0 line-clamp-1 text-step-d1 text-ual-medium">
            Location: {event.location}
          </p>
          <p className="m-0 text-step-d1 text-ual-medium">
            <span className="font-ual-bold text-ual-dark">Timing:</span> {timeRange}
          </p>
          <h3 className="m-0 text-step-1/ual-condensed font-ual-bold tracking-ual-tight text-balance text-ual-dark transition-colors group-hover/link:text-ual-orange group-focus-visible/link:text-ual-orange">
            {event.title}
          </h3>
          <span
            className="mt-auto inline-flex size-11 items-center text-current [&>svg]:size-6"
            aria-hidden="true"
          >
            <ArrowRightIcon />
          </span>
        </div>
      </Link>
    </article>
  );
}
