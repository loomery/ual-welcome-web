import Link from 'next/link';

/**
 * TaskListCard — the "Essential tasks" checklist card on the home page.
 *
 * The first (active) task sits in a dark cell with an "Active task" badge, its
 * short description and a primary "View task" action; the remaining tasks are
 * white rows with a secondary action. Rows are separated by hairlines so the
 * card reads as a single ordered checklist.
 *
 * @param {Object} props
 * @param {Array<{ id: string, number: number, title: string, description?: string, href: string }>} props.items
 *   Incomplete tasks to surface, in order — the first is treated as active.
 */
export function TaskListCard({ items }) {
  return (
    <ol role="list" className="divide-y divide-[#d1d1d1]">
      {items.map((item, i) =>
        i === 0 ? (
          <li key={item.id} className="bg-ual-dark text-ual-light">
            <div className="flex flex-col gap-3 p-6">
              <span className="inline-flex w-fit items-center gap-2 border border-ual-light px-2 py-1 text-step-d1 font-ual-normal tracking-ual-tight">
                <span
                  className="inline-flex size-4 items-center justify-center rounded-full bg-ual-util-green/60"
                  aria-hidden="true"
                >
                  <span className="size-2.5 rounded-full bg-ual-util-green" />
                </span>
                Active task
              </span>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-48 flex-1 space-y-2">
                  <h3 className="text-step-1/ual-condensed font-ual-normal tracking-ual-tight text-ual-light">
                    {item.number}. {item.title}
                  </h3>
                  {item.description && <p className="text-ual-dark-90">{item.description}</p>}
                </div>
                <ViewTaskLink href={item.href} tone="primary" />
              </div>
            </div>
          </li>
        ) : (
          <li key={item.id} className="bg-ual-light text-ual-dark">
            <div className="flex flex-wrap items-center justify-between gap-3 p-6">
              <h3 className="text-step-0 font-ual-normal tracking-ual-tight text-ual-dark">
                {item.number}. {item.title}
              </h3>
              <ViewTaskLink href={item.href} tone="secondary" />
            </div>
          </li>
        ),
      )}
    </ol>
  );
}

/**
 * The square "View task" action. Primary is UAL orange; secondary is the
 * light-grey badge from the design. Both are ≥44px tall for touch.
 *
 * @param {Object} props
 * @param {string} props.href
 * @param {'primary'|'secondary'} props.tone
 */
function ViewTaskLink({ href, tone }) {
  const external = !href.startsWith('/');
  const cls = [
    'inline-flex min-h-11 shrink-0 items-center justify-center px-4 py-2 text-step-d1 font-ual-normal no-underline transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ual-orange',
    tone === 'primary'
      ? 'bg-ual-orange text-ual-dark hover:bg-[var(--color-orange-pressed)]'
      : 'bg-[#d1d1d1] text-ual-dark hover:bg-[#c2c2c2]',
  ].join(' ');
  const label = (
    <>
      View task
      {external && <span className="sr-only"> (opens in a new tab)</span>}
    </>
  );

  return external ? (
    <a href={href} target="_blank" rel="noreferrer" className={cls}>
      {label}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {label}
    </Link>
  );
}
