import Link from 'next/link';
import { Button } from '../../components/Button/Button';

/**
 * @param {{ category: import('../../data/help').HelpCategory }} props
 */
export function HelpDetailScreen({ category }) {
  return (
    <article className="space-y-8">
      <Link
        href="/help"
        className="inline-flex items-center gap-2 text-step-d1 text-ual-dark no-underline hover:text-ual-orange focus-visible:text-ual-orange focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ual-orange"
      >
        ← Back to help
      </Link>

      <div className="space-y-4">
        <h1>{category.title}</h1>
        <p>{category.description}</p>
      </div>

      <section aria-labelledby="contact-heading" className="mt-6">
        <h2 id="contact-heading" className="mb-4">
          How to contact
        </h2>

        <ul
          role="list"
          className="border-2 border-ual-dark-90 [&>li+li]:border-t [&>li+li]:border-ual-dark-90"
        >
          {category.contacts.map((contact, i) => (
            <li key={i} className="flex flex-col gap-0.5 bg-ual-light px-4 py-3">
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

      <Button href={category.ctaHref} target="_blank" rel="noreferrer">
        {category.ctaLabel} →<span className="sr-only"> (opens in a new tab)</span>
      </Button>
    </article>
  );
}
