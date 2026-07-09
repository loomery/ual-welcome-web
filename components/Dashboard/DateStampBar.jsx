import { DAY_FMT, LONG_DATE_FMT, MONTH_FMT, isSameDay } from '../../utils/dates';

/**
 *
 * @param {Object} props
 * @param {string} props.label      Short category label (e.g. "Welcome").
 * @param {string} props.startsAt   ISO-8601 start date.
 * @param {string} props.endsAt     ISO-8601 end date.
 */
export function DateStampBar({ label, startsAt, endsAt }) {
  const start = new Date(startsAt);
  const end = new Date(endsAt);
  const isRange = !isSameDay(start, end);
  return (
    <div className="flex items-stretch bg-ual-dark text-ual-light">
      <span className="flex items-center px-3 text-step-d1 font-ual-bold tracking-ual-tight uppercase">
        {label}
      </span>
      {isRange && <Stamp date={start} />}
      <span aria-hidden="true" className="my-auto h-px grow bg-ual-light/40" />
      <Stamp date={isRange ? end : start} />
    </div>
  );
}

/**
 * A single date-stamp square: day over abbreviated month.
 *
 * @param {Object} props
 * @param {Date} props.date
 */
function Stamp({ date }) {
  return (
    <time
      dateTime={date.toISOString().slice(0, 10)}
      className="flex min-w-14 flex-col items-center justify-center px-3 py-4 leading-ual-single"
    >
      <span className="sr-only">{LONG_DATE_FMT.format(date)}</span>
      <span aria-hidden="true" className="text-step-0 font-ual-bold">
        {DAY_FMT.format(date)}
      </span>
      <span aria-hidden="true" className="text-step-d1">
        {MONTH_FMT.format(date)}
      </span>
    </time>
  );
}
