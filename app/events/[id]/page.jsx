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
 * @param {Promise<{ id: string }>} props.params
 */
export async function generateMetadata({ params }) {
  const { id } = await params;
  const event = EVENTS.find((e) => e.id === id);
  if (!event) return { title: 'Event not found | UAL Welcome Week' };
  return {
    title: `${event.title} | UAL Welcome Week`,
    description: event.description,
  };
}

/**
 * @param {Object} props
 * @param {Promise<{ id: string }>} props.params
 */
export default async function EventDetailPage({ params }) {
  const { id } = await params;
  const event = EVENTS.find((e) => e.id === id);
  if (!event) notFound();
  return <EventDetailScreen id={id} />;
}
