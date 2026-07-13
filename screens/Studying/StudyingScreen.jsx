'use client';

import Link from 'next/link';
import { STUDYING_LANDING } from '../../data/studying';
import { InterestTile } from '../../components/Dashboard/InterestTile';
import { ArrowRightIcon } from '../../components/Icon/NavIcons';

/**
 * "Studying" (/studying) — grids of service cards grouped by theme (Your
 * college, Online study tools, IT services), each with an optional "View more
 * services" link through to its topic page.
 */
export function StudyingScreen() {
  return (
    <article className="flex flex-col gap-12">
      <header className="flex flex-col gap-6">
        <h1 className="text-step-4/ual-condensed font-bold tracking-ual-tight text-ual-dark">
          Studying
        </h1>
        <p className="max-w-200 text-step-2 text-ual-dark">
          Tools, services and guides to support you throughout your academic year.
        </p>
      </header>

      {STUDYING_LANDING.map((group) => (
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
