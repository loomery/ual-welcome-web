const FEEDBACK_URL = 'https://www.arts.ac.uk/';

export function BetaNotice() {
  return (
    <div className="bg-(--color-yellow) text-ual-dark" role="note" aria-label="Beta service">
      <div className="flex items-center gap-3 px-(--grid-gutter) py-3">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="size-6 shrink-0">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
          <path d="M12 11.5v4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <circle cx="12" cy="8" r="1" fill="currentColor" />
        </svg>

        <span className="inline-flex shrink-0 items-center bg-ual-dark px-2 py-1 text-step-d1 font-ual-bold text-ual-light">
          Beta
        </span>

        <p className="m-0 text-step-d1 text-ual-dark">
          This is a new service. Help us improve it and{' '}
          <a
            href={FEEDBACK_URL}
            target="_blank"
            rel="noreferrer"
            className="font-ual-bold text-ual-dark underline underline-offset-2 hover:text-ual-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ual-dark"
          >
            give your feedback (opens in a new tab)
          </a>
        </p>
      </div>
    </div>
  );
}
