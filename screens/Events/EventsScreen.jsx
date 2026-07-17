'use client';

import { EVENTS } from '../../data/events';
import { COLLEGE_OPTIONS } from '../../data/onboardingOptions';
import { useOnboardingProfile } from '../../hooks/useOnboardingProfile';
import { EventCard } from '../../components/EventCard/EventCard';
import { ArrowRightIcon } from '../../components/Icon/NavIcons';

/** Events live on the UAL "What's on" site; the banner links there. */
const WHATS_ON_URL = 'https://www.arts.ac.uk/whats-on';

/**
 * "Events" (/explore/student-life/events) — a grid of Welcome Week event cards
 * for the student's chosen college (plus all-college events), with a dark
 * read-more banner to the full UAL listing. Reached from Explore → Student life.
 */
export function EventsScreen() {
  const { profile } = useOnboardingProfile();
  const college = COLLEGE_OPTIONS.find((c) => c.id === profile?.collegeId)?.name;

  // Show the chosen college's events plus events open to all colleges; before
  // we know the college (no profile yet) fall back to showing everything.
  const events = college
    ? EVENTS.filter((event) => event.college === college || event.college === 'All colleges')
    : EVENTS;

  return (
    <article className="flex flex-col gap-10">
      <header className="flex flex-col gap-6">
        <h1 className="text-step-4/ual-condensed font-bold tracking-ual-tight text-ual-dark">
          Events
        </h1>
        <p className="max-w-200 text-step-2 text-ual-dark">
          Check out What&rsquo;s On, from Welcome Fair to summer degree shows, there&rsquo;s
          something for everyone.
        </p>
      </header>

      <ul role="list" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <li key={event.id}>
            <EventCard event={event} />
          </li>
        ))}
      </ul>

      <a
        href={WHATS_ON_URL}
        target="_blank"
        rel="noreferrer"
        className="group flex w-full max-w-200 items-center justify-between gap-4 bg-ual-dark p-8 text-step-2 font-bold tracking-ual-tight text-ual-light no-underline transition-colors hover:text-ual-orange focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ual-orange [&>svg]:size-8"
      >
        Check out more of what&rsquo;s on at UAL
        <ArrowRightIcon aria-hidden="true" />
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    </article>
  );
}
