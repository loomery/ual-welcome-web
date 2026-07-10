import { ExternalLinkIcon } from '../Icon/NavIcons';

const FEEDBACK_URL = 'https://www.arts.ac.uk/';

export function BetaNotice() {
  return (
    <div className="bg-(--color-yellow) text-ual-dark" role="note" aria-label="Beta service">
      <div className="flex items-center gap-3 px-(--grid-gutter) py-3">
        <span className="inline-flex shrink-0 items-center bg-ual-dark px-2 py-1 text-step-d1 font-ual-bold text-ual-light">
          Beta
        </span>

        <p className="m-0 text-step-d1 text-ual-dark">
          This is a new service. Help us improve it and{' '}
          <a
            href={FEEDBACK_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 font-ual-bold text-ual-dark hover:text-ual-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ual-dark"
          >
            give your feedback.
            <ExternalLinkIcon aria-hidden="true" width={16} height={16} />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </p>
      </div>
    </div>
  );
}
