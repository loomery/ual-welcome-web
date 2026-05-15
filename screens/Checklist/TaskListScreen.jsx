'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { TASKS } from '../../data/checklist';
import { usePersistedState } from '../../hooks/usePersistedState';

const STATUS_KEY = 'ual:task:status:v1';

/**
 * Task list page — "Get setup list"
 * Shows the 3 essential tasks with their completion status.
 * Each card links to /checklist/[id] for the detail view.
 */
export function TaskListScreen() {
  const [statuses, setStatuses] = usePersistedState(
    STATUS_KEY,
    /** @type {Record<string, import('../../data/checklist').TaskStatus>} */ ({}),
  );

  const completeCount = useMemo(
    () => TASKS.filter((t) => statuses[t.id] === 'complete').length,
    [statuses],
  );

  return (
    <article className="flow" data-flow="l">
      <div className="flow" data-flow="s">
        <h1>Get setup list</h1>
        <p className="task-list__count">
          {completeCount} of {TASKS.length} complete
        </p>
      </div>

      <section aria-labelledby="essential-heading" className="flow" data-flow="s">
        <div className="flow" data-flow="2xs">
          <h2 id="essential-heading" className="task-list__section-label">
            Essential tasks
          </h2>
          <p>You need to complete these tasks in order to start your term.</p>
        </div>

        <ul className="task-list flow" data-flow="2xs" role="list">
          {TASKS.map((task) => {
            const status = statuses[task.id] ?? 'not-started';
            return (
              <li key={task.id}>
                <Link href={`/checklist/${task.id}`} className="task-card">
                  <span
                    className="task-card__status"
                    data-status={status}
                    aria-label={
                      status === 'complete'
                        ? 'Complete'
                        : status === 'in-progress'
                          ? 'In progress'
                          : 'Not started'
                    }
                  >
                    {status === 'complete' && (
                      <svg
                        viewBox="0 0 12 12"
                        fill="none"
                        aria-hidden="true"
                        style={{ display: 'block', width: '0.625rem', height: '0.625rem' }}
                      >
                        <path
                          d="M2.5 6L5 8.5L9.5 4"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                    {status === 'in-progress' && (
                      <span className="task-card__status-dot" aria-hidden="true" />
                    )}
                  </span>

                  <span className="task-card__body">
                    <span className="task-card__title">{task.title}</span>
                    <span className="task-card__desc">{task.shortDescription}</span>
                  </span>

                  <svg
                    className="task-card__chevron"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                    width="16"
                    height="16"
                  >
                    <path
                      d="M9 6l6 6-6 6"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <style>{`
        .task-list__count {
          color: var(--color-medium);
          font-size: var(--step--1);
        }
        .task-list__section-label {
          font-size: var(--step-0);
          font-weight: var(--font-weight-bold);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .task-card {
          display: flex;
          align-items: center;
          gap: var(--space-s);
          padding: var(--space-s);
          border: 2px solid var(--color-dark--tint-90);
          color: var(--color-dark);
          text-decoration: none;
          background: var(--color-light);
          transition: border-color 0.12s;
        }
        .task-card:hover {
          border-color: var(--color-dark);
        }
        .task-card:focus-visible {
          outline: 2px solid var(--color-orange);
          outline-offset: 2px;
        }
        .task-card__status {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          inline-size: 1.25rem;
          block-size: 1.25rem;
          border-radius: 999px;
          border: 2px solid var(--color-dark--tint-50);
        }
        .task-card__status[data-status='complete'] {
          background: var(--color-dark);
          border-color: var(--color-dark);
          color: var(--color-light);
        }
        .task-card__status[data-status='in-progress'] {
          border-color: var(--color-orange);
        }
        .task-card__status-dot {
          display: block;
          inline-size: 0.5rem;
          block-size: 0.5rem;
          border-radius: 999px;
          background: var(--color-orange);
        }
        .task-card__body {
          flex-grow: 1;
          min-inline-size: 0;
          display: flex;
          flex-direction: column;
          gap: var(--space-3xs);
        }
        .task-card__title {
          font-weight: var(--font-weight-bold);
          font-size: var(--step-0);
        }
        .task-card__desc {
          font-size: var(--step--1);
          color: var(--color-medium);
          line-height: var(--line-height-condensed);
        }
        .task-card__chevron {
          flex-shrink: 0;
          color: var(--color-medium);
        }
      `}</style>
    </article>
  );
}
