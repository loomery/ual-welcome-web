'use client';

import Link from 'next/link';
import { EXPLORE_LANDING } from '../../data/explore';
import { InterestTile } from '../../components/Dashboard/InterestTile';
import { ArrowRightIcon } from '../../components/Icon/NavIcons';

/**
 * "Explore" (/explore) — the hub for everything beyond your course: grids of
 * service cards grouped by theme (Moving to the UK, Finance, Health and
 * wellbeing, Student life, Safety), each with a "View more services" link
 * through to its topic page.
 */
export function ExploreScreen() {
  return (
    <article className="flex flex-col gap-12">
      <header className="flex flex-col gap-6">
        <h1 className="text-step-4/ual-condensed font-bold tracking-ual-tight text-ual-dark">
          Explore
        </h1>
        <p className="max-w-200 text-step-2 text-ual-dark">
          Everything beyond your course — settling into the UK, your finances, health and wellbeing,
          student life and staying safe.
        </p>
      </header>

      {EXPLORE_LANDING.map((group) => (
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
