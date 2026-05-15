import Link from 'next/link';
import { HELP_CATEGORIES } from '../../data/help';

/**
 * Help & support categories list — "Get help and support".
 * Static — no client state needed.
 */
export function HelpCategoriesScreen() {
  return (
    <article className="prose has-lead flow help-categories" data-flow="l">
      <h1>Get help and support</h1>
      <p>Not sure who to contact? Find the right team or service below.</p>

      <ul className="help-cat-list" role="list">
        {HELP_CATEGORIES.map((cat) => (
          <li key={cat.id}>
            <Link href={`/help/${cat.id}`} className="help-cat-row">
              <span className="help-cat-row__body">
                <span className="help-cat-row__title">{cat.title}</span>
                <span className="help-cat-row__desc">{cat.shortDescription}</span>
              </span>
              <svg
                className="help-cat-row__chevron"
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
        ))}
      </ul>

      <style>{`
        .help-categories.prose.has-lead > h1 + p {
          margin-block-start: var(--space-s);
          margin-block-end: var(--space-xl);
        }

        .help-cat-list {
          list-style: none;
          margin: 0;
          padding: 0;
          border: 2px solid var(--color-dark--tint-90);
        }
        .help-cat-list li + li {
          border-block-start: 1px solid var(--color-dark--tint-90);
        }

        .help-cat-row {
          display: flex;
          align-items: center;
          gap: var(--space-s);
          padding: var(--space-xs) var(--space-s);
          background: var(--color-light);
          color: var(--color-dark);
          text-decoration: none;
          transition: background 0.1s;
          min-block-size: 3.5rem;
        }
        .help-cat-row:hover {
          background: var(--color-shade);
        }
        .help-cat-row:focus-visible {
          outline: 2px solid var(--color-orange);
          outline-offset: -2px;
        }

        .help-cat-row__body {
          flex-grow: 1;
          min-inline-size: 0;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .help-cat-row__title {
          font-weight: var(--font-weight-bold);
          font-size: var(--step-0);
        }
        .help-cat-row__desc {
          font-size: var(--step--1);
          color: var(--color-medium);
          line-height: var(--line-height-condensed);
        }
        .help-cat-row__chevron {
          flex-shrink: 0;
          color: var(--color-medium);
        }
      `}</style>
    </article>
  );
}
