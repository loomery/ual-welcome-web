import Link from 'next/link';
import { ChevronRightIcon, InfoIcon } from '../Icon/NavIcons';
import { TaskCheckbox } from './TaskCheckbox';

/**
 * A single row in the Essentials "To do list": a completion checkbox on the
 * left, then the task title (which, with the trailing chevron, links to the
 * task destination), its description and an optional availability note.
 *
 * The checkbox toggles completion in place; the title/chevron navigate to the
 * task's `cta` destination (an internal detail route like /checklist/mfa, or
 * an external UAL page).
 *
 * @param {Object} props
 * @param {import('../../data/checklist').Task} props.task
 * @param {boolean} props.complete
 * @param {(id: string) => void} props.onToggle
 */
export function ToDoTask({ task, complete, onToggle }) {
  const href = task.cta?.href;
  const isInternal = href?.startsWith('/');

  const titleRow = (
    <>
      <h4 className="text-step-1 font-ual-normal tracking-ual-tight text-ual-dark group-hover:text-ual-orange">
        {task.title}
      </h4>
      <ChevronRightIcon
        aria-hidden="true"
        className="mt-1 size-6 shrink-0 text-ual-dark group-hover:text-ual-orange"
      />
    </>
  );

  return (
    <li className="flex items-start gap-4 py-6">
      <button
        type="button"
        onClick={() => onToggle(task.id)}
        aria-pressed={complete}
        aria-label={
          complete ? `${task.title} — complete, select to undo` : `Mark "${task.title}" as complete`
        }
        className="mt-1 shrink-0 cursor-pointer border-0 bg-transparent p-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ual-orange"
      >
        <TaskCheckbox complete={complete} size={24} />
      </button>

      <div className="flex min-w-0 flex-1 flex-col gap-4">
        {href ? (
          isInternal ? (
            <Link href={href} className="group flex items-start justify-between gap-4 no-underline">
              {titleRow}
            </Link>
          ) : (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="group flex items-start justify-between gap-4 no-underline"
            >
              {titleRow}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          )
        ) : (
          <div className="flex items-start justify-between gap-4">{titleRow}</div>
        )}

        <div className="flex flex-col gap-3">
          <p className="max-w-200 text-step-0 text-ual-dark">{task.shortDescription}</p>

          {task.note && (
            <span className="inline-flex w-fit items-center gap-1 rounded bg-ual-shade p-2 text-step-d1 text-ual-dark">
              <InfoIcon aria-hidden="true" className="size-5 shrink-0" />
              {task.note}
            </span>
          )}
        </div>
      </div>
    </li>
  );
}
