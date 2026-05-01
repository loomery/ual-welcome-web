'use client';

import clsx from 'clsx';
import { FigmaProgressBar } from './FigmaProgressBar';

/**
 * FigmaGetSetupCard — onboarding-progress dashboard card with title,
 * counter, progress bar, preview rows, and a "see all" link
 * (node 13:21).
 *
 * The preview rows are a private sub-component (no need to export —
 * only this card uses them). Each row is read-only here, but in the
 * real product would be a navigable item; bring back FigmaChecklistItem
 * if you need full interactivity.
 *
 * @typedef {Object} FigmaSetupItem
 * @property {boolean} done
 * @property {string} label
 *
 * @param {Object} props
 * @param {string} [props.title]
 * @param {string} props.counter
 * @param {number} props.progress       0..100
 * @param {FigmaSetupItem[]} props.items
 * @param {string} [props.seeAllHref]
 * @param {() => void} [props.onSeeAll]
 */
export function FigmaGetSetupCard({
  title = 'Get setup',
  counter,
  progress,
  items,
  seeAllHref = '#',
  onSeeAll,
}) {
  return (
    <article className="flex min-h-62.25 w-81.75 max-w-full flex-col justify-between rounded-lg bg-[#f2f2f2] p-4">
      <div className="flex flex-col gap-3">
        <h3 className="text-[20px] leading-[1.2] font-bold whitespace-nowrap text-black">
          {title}
        </h3>
        <p className="text-[13px] leading-[1.4] whitespace-nowrap text-[#525252]">{counter}</p>
        <FigmaProgressBar value={progress} label={`${title} progress`} />
        {items.map((item, i) => (
          <SetupRow key={i} done={item.done}>
            {item.label}
          </SetupRow>
        ))}
      </div>

      <a
        href={seeAllHref}
        onClick={(e) => {
          if (onSeeAll) {
            e.preventDefault();
            onSeeAll();
          }
        }}
        className="mt-3 w-fit rounded-xs px-0.5 text-[13px] leading-[1.4] text-[#525252] hover:text-black hover:underline focus:outline-none focus-visible:outline-2 focus-visible:outline-[#ff5000]"
      >
        See all →
      </a>
    </article>
  );
}

/**
 * @param {Object} props
 * @param {boolean} props.done
 * @param {import('react').ReactNode} props.children
 */
function SetupRow({ done, children }) {
  return (
    <div className="flex w-full items-center gap-2">
      <span
        aria-hidden="true"
        className={clsx(
          'flex size-4 shrink-0 items-center justify-center rounded-full',
          done ? 'bg-black' : 'border-[1.5px] border-black bg-transparent',
        )}
      >
        {done && <span className="text-[10px] leading-none font-bold text-white">✓</span>}
      </span>
      <span
        className={clsx(
          'flex-1 text-[16px] leading-[1.4]',
          done ? 'text-[#525252] line-through' : 'text-black',
        )}
      >
        {children}
      </span>
    </div>
  );
}
