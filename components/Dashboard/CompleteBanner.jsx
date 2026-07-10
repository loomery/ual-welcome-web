import { Button } from '../Button/Button';
import { CheckCircleIcon } from '../Icon/NavIcons';

/**
 * CompleteBanner — shown below the full progress bar once every arrival task
 * is done: a grey bar with a green tick, a "Do not show again" dismissal and
 * a bordered link through to the completed checklist.
 *
 * @param {Object} props
 * @param {() => void} props.onDismiss   Hides the whole section for good.
 * @param {string} [props.href='/checklist']  Where "View completed tasks" points.
 */
export function CompleteBanner({ onDismiss, href = '/checklist' }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 bg-ual-shade p-6">
      <p className="inline-flex items-center gap-2 text-step-1/ual-condensed font-ual-bold tracking-ual-tight text-ual-dark">
        <CheckCircleIcon
          width={28}
          height={28}
          aria-hidden="true"
          className="shrink-0 text-ual-util-green"
        />
        All arrival tasks complete
      </p>
      <div className="flex flex-wrap items-center gap-4">
        <Button variant="solid" onClick={onDismiss}>
          Do not show again
        </Button>
        <Button variant="outline" href={href}>
          View completed tasks →
        </Button>
      </div>
    </div>
  );
}
