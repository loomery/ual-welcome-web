'use client';

import { useState } from 'react';
import { CompleteBanner } from '../Dashboard/CompleteBanner';
import { ToDoTask } from './ToDoTask';

/**
 * The Essentials "To do list" card. Dismissal is controlled by the parent
 * (TaskListScreen), which drops the surrounding section once complete and
 * dismissed — so this component never renders in that state.
 *
 * @param {Object} props
 * @param {import('../../data/checklist').Task[]} props.tasks
 * @param {Record<string, import('../../data/checklist').TaskStatus>} props.statuses
 * @param {(id: string) => void} props.onToggle
 * @param {boolean} props.dismissed
 * @param {() => void} props.onDismiss
 */
export function ToDoList({ tasks, statuses, onToggle, dismissed, onDismiss }) {
  const [override, setOverride] = useState(/** @type {boolean | null} */ (null));

  const isComplete = (t) => statuses[t.id] === 'complete';
  const completeCount = tasks.filter(isComplete).length;
  const allComplete = tasks.length > 0 && completeCount === tasks.length;

  const showCompleted = override ?? !allComplete;
  const visible = showCompleted ? tasks : tasks.filter((t) => !isComplete(t));

  // Belt-and-braces: the parent already hides the section in this state.
  if (allComplete && dismissed) return null;

  const collapsedComplete = allComplete && !showCompleted;

  return (
    <div className="flex w-full max-w-197.25 flex-col gap-4">
      <h3 className="text-step-2 font-ual-normal tracking-ual-tight text-ual-dark">To do list</h3>
      <p className="text-step-0 text-ual-dark">
        {completeCount} of {tasks.length} complete
      </p>

      {collapsedComplete ? (
        <CompleteBanner onView={() => setOverride(true)} onDismiss={onDismiss} />
      ) : (
        <>
          <ul
            role="list"
            className="flex flex-col divide-y divide-ual-dark/10 border-y border-ual-dark/20"
          >
            {visible.map((task) => (
              <ToDoTask key={task.id} task={task} complete={isComplete(task)} onToggle={onToggle} />
            ))}
          </ul>

          {completeCount > 0 && (
            <button
              type="button"
              onClick={() => setOverride(!showCompleted)}
              className="inline-flex min-h-11 w-fit cursor-pointer items-center justify-center bg-ual-dark px-4 py-2 text-step-d1 font-ual-normal text-ual-light transition-colors hover:bg-ual-dark-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ual-orange"
            >
              {showCompleted ? 'Close completed list' : 'View completed tasks'}
            </button>
          )}
        </>
      )}
    </div>
  );
}
