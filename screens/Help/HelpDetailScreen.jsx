/**
 * A Get help child page (/help/{id}) — title + intro, then a directory of
 * contact methods rendered as full-width rows (a small type caption above the
 * link), separated by hairline rules. Matches the UAL DS directory pattern.
 *
 * @param {{ category: import('../../data/help').HelpCategory }} props
 */
export function HelpDetailScreen({ category }) {
  return (
    <article className="flex flex-col gap-8">
      <header className="flex flex-col gap-6">
        <h1 className="text-step-4/ual-condensed font-bold tracking-ual-tight text-ual-dark">
          {category.title}
        </h1>
        <p className="max-w-200 text-step-2 text-ual-dark">{category.description}</p>
      </header>

      <section aria-labelledby="contacts-heading" className="flex max-w-200 flex-col gap-4">
        <h2
          id="contacts-heading"
          className="text-step-3 font-bold tracking-ual-tight text-ual-dark"
        >
          {category.title}
        </h2>
        <ul role="list" className="border-t border-ual-dark/15">
          {category.contacts.map((contact, i) => {
            const external = contact.type !== 'email' && contact.type !== 'phone';
            const inner = (
              <>
                <span className="text-step-d1 text-ual-medium">{contact.label}</span>
                <span className="text-step-1 tracking-ual-tight">{contact.value}</span>
                {contact.note && (
                  <span className="text-step-d1 text-ual-medium">{contact.note}</span>
                )}
              </>
            );
            return (
              <li key={i} className="border-b border-ual-dark/15">
                {contact.href ? (
                  <a
                    href={contact.href}
                    target={external ? '_blank' : undefined}
                    rel={external ? 'noreferrer' : undefined}
                    className="flex flex-col gap-2 py-6 text-ual-dark no-underline transition-colors hover:text-ual-orange focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ual-orange"
                  >
                    {inner}
                    {external && <span className="sr-only"> (opens in a new tab)</span>}
                  </a>
                ) : (
                  <div className="flex flex-col gap-2 py-6 text-ual-dark">{inner}</div>
                )}
              </li>
            );
          })}
        </ul>
      </section>
    </article>
  );
}
