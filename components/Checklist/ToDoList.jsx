'use client';

import { useState } from 'react';
import { ToDoTask } from './ToDoTask';

/**
 * The Essentials "To do list" card: a heading, a progress line, the list of
 * tasks (each a ToDoTask row separated by hairlines and bounded top and
 * bottom), and a toggle that hides/shows the completed tasks.
 *
 * @param {Object} props
 * @param {import('../../data/checklist').Task[]} props.tasks
 * @param {Record<string, import('../../data/checklist').TaskStatus>} props.statuses
 * @param {(id: string) => void} props.onToggle
 */
export function ToDoList({ tasks, statuses, onToggle }) {
  const [showCompleted, setShowCompleted] = useState(true);

  const isComplete = (t) => statuses[t.id] === 'complete';
  const completeCount = tasks.filter(isComplete).length;
  const visible = showCompleted ? tasks : tasks.filter((t) => !isComplete(t));

  return (
    <div className="flex w-full max-w-197.25 flex-col gap-4">
      <h3 className="text-step-2 font-ual-normal tracking-ual-tight text-ual-dark">To do list</h3>
      <p className="text-step-0 text-ual-dark">
        {completeCount} of {tasks.length} complete
      </p>

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
          onClick={() => setShowCompleted((v) => !v)}
          className="inline-flex min-h-11 w-fit cursor-pointer items-center justify-center bg-ual-dark px-4 py-2 text-step-d1 font-ual-normal text-ual-light transition-colors hover:bg-ual-dark-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ual-orange"
        >
          {showCompleted ? 'Close completed list' : 'Show completed list'}
        </button>
      )}
    </div>
  );
}
