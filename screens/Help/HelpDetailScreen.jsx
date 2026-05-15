import Link from 'next/link';

/**
 * Help category detail page — contact methods + CTA.
 *
 * @param {{ category: import('../../data/help').HelpCategory }} props
 */
export function HelpDetailScreen({ category }) {
  return (
    <article className="flow" data-flow="l">
      <Link href="/help" className="help-detail__back">
        ← Back to help
      </Link>

      <div className="flow" data-flow="s">
        <h1>{category.title}</h1>
        <p>{category.description}</p>
      </div>

      <section className="flow" data-flow="s" aria-labelledby="contact-heading">
        <h2 id="contact-heading">How to contact</h2>

        <ul
          className="flow"
          data-flow="2xs"
          role="list"
          style={{ listStyle: 'none', margin: 0, padding: 0 }}
        >
          {category.contacts.map((contact, i) => (
            <li key={i} className="help-contact-card">
              <span className="help-contact-card__label">{contact.label}</span>
              {contact.href ? (
                <a
                  href={contact.href}
                  className="help-contact-card__value"
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
                <span className="help-contact-card__value">{contact.value}</span>
              )}
              {contact.note && <span className="help-contact-card__note">{contact.note}</span>}
            </li>
          ))}
        </ul>
      </section>

      <a
        href={category.ctaHref}
        className="button help-detail__cta"
        target="_blank"
        rel="noreferrer"
      >
        {category.ctaLabel} →<span className="visually-hidden"> (opens in a new tab)</span>
      </a>

      <style>{`
        .help-detail__back {
          display: inline-flex;
          align-items: center;
          color: var(--color-dark);
          font-size: var(--step--1);
          text-decoration: none;
        }
        .help-detail__back:hover,
        .help-detail__back:focus-visible {
          color: var(--color-orange);
        }
        .help-detail__back:focus-visible {
          outline: 2px solid var(--color-orange);
          outline-offset: 2px;
        }

        .help-contact-card {
          display: flex;
          flex-direction: column;
          gap: var(--space-3xs);
          padding: var(--space-s);
          border: 2px solid var(--color-dark--tint-90);
          background: var(--color-light);
        }
        .help-contact-card__label {
          font-size: var(--step--1);
          color: var(--color-medium);
        }
        .help-contact-card__value {
          font-size: var(--step-0);
          font-weight: var(--font-weight-bold);
          color: var(--color-dark);
          text-decoration: none;
        }
        a.help-contact-card__value:hover,
        a.help-contact-card__value:focus-visible {
          color: var(--color-orange);
          text-decoration: underline;
        }
        .help-contact-card__note {
          font-size: var(--step--1);
          color: var(--color-medium);
        }

        .help-detail__cta {
          display: inline-flex;
          width: 100%;
          justify-content: center;
        }
      `}</style>
    </article>
  );
}
