import Link from 'next/link';

/**
 * @param {{ category: import('../../data/help').HelpCategory }} props
 */
export function HelpDetailScreen({ category }) {
  return (
    <article className="prose flow" data-flow="l">
      <Link href="/help" className="back-link">
        ← Back to help
      </Link>

      <div className="flow" data-flow="s">
        <h1>{category.title}</h1>
        <p>{category.description}</p>
      </div>

      <section aria-labelledby="contact-heading" style={{ marginBlockStart: 'var(--space-m)' }}>
        <h2 id="contact-heading" style={{ marginBlockEnd: 'var(--space-s)' }}>
          How to contact
        </h2>

        <ul role="list" className="stacked-list">
          {category.contacts.map((contact, i) => (
            <li key={i} className="flex flex-col bg-ual-light px-s py-xs" style={{ gap: '2px' }}>
              <span className="text-step-d1 text-ual-medium">{contact.label}</span>

              {contact.href ? (
                <a
                  href={contact.href}
                  className="text-step-0 font-ual-bold text-ual-dark no-underline hover:text-ual-orange hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ual-orange"
                  target={
                    contact.type !== 'email' && contact.type !== 'phone' ? '_blank' : undefined
                  }
                  rel={
                    contact.type !== 'email' && contact.type !== 'phone' ? 'noreferrer' : undefined
                  }
                >
                  {contact.value}
                </a>
              ) : (
                <span className="text-step-0 font-ual-bold text-ual-dark">{contact.value}</span>
              )}

              {contact.note && <span className="text-step-d1 text-ual-medium">{contact.note}</span>}
            </li>
          ))}
        </ul>
      </section>

      <a
        href={category.ctaHref}
        className="button flex w-full justify-center"
        target="_blank"
        rel="noreferrer"
      >
        {category.ctaLabel} →<span className="visually-hidden"> (opens in a new tab)</span>
      </a>
    </article>
  );
}
