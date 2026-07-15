'use client';

import { usePersistedState } from '../../hooks/usePersistedState';
import { ArrowRightIcon, ExternalLinkIcon, InfoIcon } from '../Icon/NavIcons';
import { RichText } from './RichText';
import { TaskCheckbox } from './TaskCheckbox';

const SUBTASK_KEY = 'ual:subtask:status:v1';

/**
 * SubTaskChecklist — the smaller list inside a task detail page. By default a
 * tick-off checklist ("Accounts to set up") with per-item completion; when
 * `subTasks.ordered` is set it renders as a plain numbered how-to list (no
 * checkboxes, no progress count), e.g. the "Set up steps" on the doctor task.
 *
 * @param {Object} props
 * @param {string} props.taskId
 * @param {import('../../data/checklist').SubTaskList} props.subTasks
 */
export function SubTaskChecklist({ taskId, subTasks }) {
  const ordered = Boolean(subTasks.ordered);
  const [statuses, setStatuses] = usePersistedState(
    SUBTASK_KEY,
    /** @type {Record<string, boolean>} */ ({}),
  );

  const key = (id) => `${taskId}/${id}`;
  const completeCount = subTasks.items.filter((i) => statuses[key(i.id)]).length;

  function toggle(id) {
    setStatuses((prev) => ({ ...prev, [key(id)]: !prev[key(id)] }));
  }

  const ListTag = ordered ? 'ol' : 'ul';

  return (
    <div className="flex w-full max-w-197.25 flex-col gap-4">
      <h3 className="text-step-2 font-ual-normal tracking-ual-tight text-ual-dark">
        {subTasks.title}
      </h3>
      {!ordered && (
        <p className="text-step-0 text-ual-dark">
          {completeCount} of {subTasks.items.length} complete
        </p>
      )}

      {/* No role="list": the global [role='list'] li reset would strip the
          markers off the nested step/bullet lists inside each row. */}
      <ListTag className="m-0 flex list-none flex-col divide-y divide-ual-dark/10 border-y border-ual-dark/20 p-0">
        {subTasks.items.map((item, i) => {
          const done = !ordered && Boolean(statuses[key(item.id)]);
          return (
            <li key={item.id} className="flex items-start gap-4 p-4">
              {ordered ? (
                <span
                  aria-hidden="true"
                  className="mt-1 shrink-0 text-step-1 font-ual-bold text-ual-dark"
                >
                  {i + 1}.
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => toggle(item.id)}
                  aria-pressed={done}
                  aria-label={
                    done
                      ? `${item.label} — complete, click to undo`
                      : `Mark "${item.label}" as complete`
                  }
                  className="mt-1 shrink-0 cursor-pointer border-0 bg-transparent p-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ual-orange"
                >
                  <TaskCheckbox complete={done} size={24} />
                </button>
              )}

              <div className="flex min-w-0 flex-1 flex-col gap-3">
                {item.href ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex w-fit items-center gap-2 text-step-1 font-ual-normal tracking-ual-tight text-ual-dark no-underline hover:text-ual-orange focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ual-orange"
                  >
                    {item.label}
                    <ExternalLinkIcon aria-hidden="true" className="size-5 shrink-0" />
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                ) : (
                  <p className="text-step-1 font-ual-normal tracking-ual-tight text-ual-dark">
                    {item.label}
                  </p>
                )}

                {item.description && (
                  <p className="max-w-200 text-step-0 text-ual-dark">
                    <RichText text={item.description} />
                  </p>
                )}

                {item.lead && <p className="max-w-200 text-step-0 text-ual-dark">{item.lead}</p>}

                {item.steps && (
                  <ol className="flex list-decimal flex-col gap-2 pl-6 text-step-0 text-ual-dark">
                    {item.steps.map((step) => (
                      <li key={step.text}>
                        <RichText text={step.text} />
                        {step.bullets && (
                          <ul className="mt-1 flex list-disc flex-col gap-1 pl-5">
                            {step.bullets.map((b) => (
                              <li key={b}>{b}</li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ol>
                )}

                {item.bullets && (
                  <ul className="flex list-disc flex-col gap-1 pl-6 text-step-0 text-ual-dark">
                    {item.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                )}

                {item.note && (
                  <span className="inline-flex w-fit items-center gap-1 rounded bg-ual-shade p-2 text-step-d1 text-ual-dark">
                    <InfoIcon aria-hidden="true" className="size-5 shrink-0" />
                    {item.note}
                  </span>
                )}

                {item.link && (
                  <a
                    href={item.link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex w-fit items-center gap-2 text-step-0 text-ual-dark underline underline-offset-2 hover:text-ual-orange focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ual-orange [&>svg]:size-5"
                  >
                    {item.link.label}
                    <ArrowRightIcon aria-hidden="true" />
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                )}
              </div>
            </li>
          );
        })}
      </ListTag>
    </div>
  );
}
