import Link from 'next/link';
import { HELP_CATEGORIES } from '../../data/help';

export function HelpCategoriesScreen() {
  return (
    <article className="flow" data-flow="l">
      <div className="flow" data-flow="s">
        <h1>Get help and support</h1>
        <p>Not sure who to contact? Find the right team or service below.</p>
      </div>

      <ul role="list" className="border-2 border-ual-dark-90">
        {HELP_CATEGORIES.map((cat, i) => (
          <li key={cat.id} className={i > 0 ? 'border-t border-ual-dark-90' : ''}>
            <Link
              href={`/help/${cat.id}`}
              className="flex min-h-14 items-center gap-s bg-ual-light px-s py-xs text-ual-dark no-underline transition-colors hover:bg-ual-shade focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ual-orange"
            >
              <span className="flex min-w-0 grow flex-col" style={{ gap: '2px' }}>
                <span className="text-step-0 font-ual-bold">{cat.title}</span>
                <span className="text-step-d1/ual-condensed text-ual-medium">
                  {cat.shortDescription}
                </span>
              </span>

              <svg
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
                className="shrink-0 text-ual-medium"
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
    </article>
  );
}
