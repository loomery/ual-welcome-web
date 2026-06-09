import Link from 'next/link';
import { Card } from '../../components/Card/Card';
import { Countdown } from '../../components/Countdown/Countdown';
import { EventCard } from '../../components/EventCard/EventCard';
import { HubEntryBanner } from '../../components/Dashboard/HubEntryBanner';
import { EVENTS } from '../../data/events';
import { USEFUL_INFO } from '../../data/usefulInfo';

export function HomeScreen() {
  // Server-side computation — sorts deterministically by ISO timestamp.
  const upcoming = [...EVENTS].sort((a, b) => a.startsAt.localeCompare(b.startsAt)).slice(0, 3);

  return (
    <article className="flow" data-flow="l">
      {/* Personalised hub entry — demo CTA. Tailwind-only client island. */}
      <HubEntryBanner />

      {/* Hero */}
      <section className="home-hero flow" data-flow="m" aria-labelledby="home-hero-heading">
        <Countdown />
        <h1 id="home-hero-heading" className="home-hero__title">
          Welcome to UAL.
        </h1>
        <p className="standfirst home-hero__lede">
          Your first week at the University of the Arts London — induction checklist, explorable
          campus map, and everything happening during Welcome Week.
        </p>
        <svg
          className="home-hero__pattern"
          viewBox="0 0 600 200"
          aria-hidden="true"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <pattern id="hero-dots" width="16" height="16" patternUnits="userSpaceOnUse">
              <circle cx="1.5" cy="1.5" r="1.5" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="600" height="200" fill="url(#hero-dots)" />
        </svg>
      </section>

      {/* Happening next */}
      <section className="flow" data-flow="s" aria-labelledby="happening-heading">
        <div className="cluster" data-justify="space-between">
          <h2 id="happening-heading">Happening next</h2>
          <Link className="home-section__cta" href="/events">
            See all events →
          </Link>
        </div>
        <div className="reel home-reel" role="list">
          {upcoming.map((event) => (
            <div role="listitem" key={event.id}>
              <EventCard event={event} compact />
            </div>
          ))}
        </div>
      </section>

      {/* Start here */}
      <section aria-labelledby="home-sections" className="flow" data-flow="s">
        <h2 id="home-sections">Start here</h2>
        <div className="grid">
          <Card
            title="Induction checklist"
            to="/checklist"
            body={<p>Tick off the essentials before and during your first week.</p>}
          />
          <Card
            title="Find your campus"
            to="/map"
            body={<p>Floor plans, address and transport for your college.</p>}
          />
          <Card
            title="Events"
            to="/events"
            body={<p>Talks, tours and socials happening during Welcome Week.</p>}
          />
        </div>
      </section>

      {/* Useful info — always-on UAL resources from the priority brief.
          Two cards: term dates + Student Services. These aren't tasks
          to complete, they're references the student will come back to. */}
      <section aria-labelledby="useful-info" className="flow" data-flow="s">
        <h2 id="useful-info">Useful info</h2>
        <div className="grid">
          {USEFUL_INFO.map((item) => (
            <Card key={item.id} title={item.title} external={item.href} body={<p>{item.body}</p>} />
          ))}
        </div>
      </section>
    </article>
  );
}
