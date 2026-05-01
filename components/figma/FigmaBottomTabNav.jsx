'use client';

import clsx from 'clsx';

/**
 * FigmaBottomTabNav — primary mobile nav (node 10:54).
 *
 * Controlled component: parent supplies `tabs` (array of strings) and
 * the currently active tab. Each tab is a real button with hover/focus
 * affordances; the active tab is styled via `aria-current="page"`
 * which Tailwind 4 exposes as the `aria-current:` variant.
 *
 * @param {Object} props
 * @param {string[]} [props.tabs]
 * @param {string} props.activeTab
 * @param {(tab: string) => void} [props.onTabChange]
 */
export function FigmaBottomTabNav({
  tabs = ['Hub', 'Checklist', 'Events', 'Map'],
  activeTab,
  onTabChange,
}) {
  return (
    <nav
      aria-label="Primary"
      className="flex h-14.5 w-93.75 max-w-full items-center border-t border-[#e5e5e5] bg-white px-4 pt-1.5 pb-1.25"
    >
      {tabs.map((tab) => {
        const isActive = tab === activeTab;
        return (
          <button
            key={tab}
            type="button"
            aria-current={isActive ? 'page' : undefined}
            onClick={() => onTabChange?.(tab)}
            className="flex h-11.75 flex-1 flex-col items-center justify-center gap-1 overflow-hidden px-1 py-2 text-[#525252] hover:text-black focus:outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#ff5000] aria-[current=page]:bg-black aria-[current=page]:text-white aria-[current=page]:hover:text-white"
          >
            <span
              aria-hidden="true"
              className={clsx('size-2 rounded-full', isActive ? 'bg-white' : 'bg-current')}
            />
            <span className="text-[13px] leading-[1.4] whitespace-nowrap">{tab}</span>
          </button>
        );
      })}
    </nav>
  );
}
