import Link from 'next/link';
import { InterestTile } from '../Dashboard/InterestTile';
import { ArrowRightIcon } from '../Icon/NavIcons';

/**
 * Shared landing composition for the Explore and Studying hubs: a title +
 * intro, then themed groups of service-card grids, each with an optional
 * "view more" link. Purely presentational — any cohort gating happens in the
 * caller, which passes the already-resolved `groups`.
 *
 * @param {Object} props
 * @param {string} props.title
 * @param {string} props.intro
 * @param {Array<{ heading: string, cards: Array<object>, link?: { href: string, label: string } }>} props.groups
 */
export function TopicLandingScreen({ title, intro, groups }) {
  return (
    <article className="flex flex-col gap-12">
      <header className="flex flex-col gap-6">
        <h1 className="text-step-4/ual-condensed font-bold tracking-ual-tight text-ual-dark">
          {title}
        </h1>
        <p className="max-w-200 text-step-2 text-ual-dark">{intro}</p>
      </header>

      {groups.map((group) => (
        <section key={group.heading} className="flex flex-col gap-6">
          <h2 className="text-step-3 font-bold tracking-ual-tight text-ual-dark">
            {group.heading}
          </h2>
          <ul role="list" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {group.cards.map((card) => (
              <li key={card.id}>
                <InterestTile label={card.label} body={card.body} href={card.href} />
              </li>
            ))}
          </ul>
          {group.link && (
            <Link
              href={group.link.href}
              className="inline-flex w-fit items-center gap-2 text-step-0 text-ual-dark underline underline-offset-2 hover:text-ual-orange focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ual-orange [&>svg]:size-5"
            >
              {group.link.label}
              <ArrowRightIcon aria-hidden="true" />
            </Link>
          )}
        </section>
      ))}
    </article>
  );
}
