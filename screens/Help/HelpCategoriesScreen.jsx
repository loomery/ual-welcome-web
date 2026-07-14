import Link from 'next/link';
import { HELP_CATEGORIES, SECTIONS } from '../../data/help';
import { ChevronRightIcon } from '../../components/Icon/NavIcons';

export function HelpCategoriesScreen() {
  return (
    <article className="space-y-8">
      <div className="space-y-4">
        <h1>Get help</h1>
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

            <ul role="list" className="border-t border-ual-dark-90">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/help/${cat.id}`}
                    className="flex min-h-20 items-center gap-4 border-b border-ual-dark-90 py-6 text-ual-dark no-underline transition-colors duration-150 hover:text-ual-orange focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ual-orange"
                  >
                    <span className="min-w-0 grow text-step-0 font-ual-normal">{cat.title}</span>

                    {/* Chevron */}
                    <ChevronRightIcon
                      aria-hidden="true"
                      width="20"
                      height="20"
                      className="shrink-0 text-ual-dark"
                    />
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
