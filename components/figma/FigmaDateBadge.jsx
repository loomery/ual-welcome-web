/**
 * FigmaDateBadge — day + month abbreviation chip used in event listings
 * (node 12:26).
 *
 * Presentational. `tone` picks the fill colour from a Tailwind-only
 * static lookup so the JIT scanner sees every class used.
 *
 * @param {Object} props
 * @param {string} props.day
 * @param {string} props.month
 * @param {'yellow' | 'green' | 'subtle'} [props.tone]
 */
export function FigmaDateBadge({ day, month, tone = 'yellow' }) {
  const fillClass = {
    yellow: 'bg-[#ffd022]',
    green: 'bg-[#00c73e]',
    subtle: 'bg-[#f2f2f2]',
  }[tone];

  return (
    <span
      className={`inline-flex size-12 flex-col items-center justify-center rounded-sm text-black ${fillClass}`}
    >
      <span className="text-[17px] leading-[1.1] font-bold">{day}</span>
      <span className="text-[11px] leading-none font-bold tracking-[0.5px]">{month}</span>
    </span>
  );
}
