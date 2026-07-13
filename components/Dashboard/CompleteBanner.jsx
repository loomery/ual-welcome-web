import { Button } from '../Button/Button';
import { CheckCircleIcon } from '../Icon/NavIcons';

/**
 * CompleteBanner — the grey "All arrival tasks complete" bar shown once every
 * arrival task is done: a green tick, a primary "View completed tasks" action
 * and a "Don’t show this again" dismissal.
 *
 * @param {Object} props
 * @param {() => void} props.onView     Reveal the completed tasks (home: go to
 *   the checklist; Essentials: expand the list in place).
 * @param {() => void} props.onDismiss  Dismiss the completed list.
 * @param {string} [props.title='All arrival tasks complete']
 */
export function CompleteBanner({ onView, onDismiss, title = 'All arrival tasks complete' }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 bg-ual-shade p-6">
      <p className="inline-flex items-center gap-2 text-step-1/ual-condensed font-ual-normal tracking-ual-tight text-ual-dark">
        <CheckCircleIcon
          width={28}
          height={28}
          aria-hidden="true"
          className="shrink-0 text-ual-util-green"
        />
        {title}
      </p>
      <div className="flex flex-wrap items-center gap-4">
        <Button variant="solid" weight="normal" onClick={onView}>
          View completed tasks
        </Button>
        <Button variant="outline" weight="normal" onClick={onDismiss}>
          Don’t show this again
        </Button>
      </div>
    </div>
  );
}
