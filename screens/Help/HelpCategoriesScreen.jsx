import Link from 'next/link';
import { HELP_CATEGORIES, SECTIONS } from '../../data/help';

export function HelpCategoriesScreen() {
  return (
    <article className="space-y-8">
      <div className="space-y-4">
        <h1>Get help and support</h1>
        <p className="text-step-1 text-ual-medium">
          Not sure who to contact? Find the right team or service below.
        </p>
      </div>

      {SECTIONS.map((section) => {
        const categories = HELP_CATEGORIES.filter((cat) => cat.section === section.id);
        if (categories.length === 0) return null;

        return (
          <section key={section.id} aria-labelledby={`section-${section.id}`} className="space-y-4">
            <h2 id={`section-${section.id}`} className="text-step-1 font-ual-bold">
              {section.label}
            </h2>

            <ul
              role="list"
              className="border-2 border-ual-dark-90 [&>li+li]:border-t [&>li+li]:border-ual-dark-90"
            >
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/help/${cat.id}`}
                    className="flex min-h-14 items-center gap-4 bg-ual-light px-4 py-3 text-ual-dark no-underline transition-colors duration-150 hover:bg-ual-shade focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ual-orange"
                  >
                    <span className="flex min-w-0 grow flex-col gap-1">
                      <span className="text-step-0 font-ual-bold">{cat.title}</span>
                      <span className="text-step-d1/ual-condensed text-ual-medium">
                        {cat.shortDescription}
                      </span>
                    </span>

                    {/* Chevron */}
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
          </section>
        );
      })}
    </article>
  );
}
