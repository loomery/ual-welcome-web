import { notFound } from 'next/navigation';
import { EVENTS } from '../../../data/events';
import { EventDetailScreen } from '../../../screens/Events/EventDetailScreen';

/**
 * Pre-render every event detail page at build time. Pure-static and
 * predictable — no client-side data fetching needed.
 */
export function generateStaticParams() {
  return EVENTS.map((e) => ({ id: e.id }));
}

/**
 * @param {Object} props
 * @param {{ id: string }} props.params
 */
export function generateMetadata({ params }) {
  const event = EVENTS.find((e) => e.id === params.id);
  if (!event) return { title: 'Event not found | UAL Welcome Week' };
  return {
    title: `${event.title} | UAL Welcome Week`,
    description: event.description,
  };
}

/**
 * @param {Object} props
 * @param {{ id: string }} props.params
 */
export default function EventDetailPage({ params }) {
  const event = EVENTS.find((e) => e.id === params.id);
  if (!event) notFound();
  return <EventDetailScreen id={params.id} />;
}
