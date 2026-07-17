import { notFound } from 'next/navigation';
import { EventsScreen } from '../../../../screens/Events/EventsScreen';

// Only Student life has an Events listing; other topics have no /events child.
export function generateStaticParams() {
  return [{ topicId: 'student-life' }];
}

export const metadata = {
  title: 'Events',
};

export default async function ExploreEventsPage({ params }) {
  const { topicId } = await params;
  if (topicId !== 'student-life') notFound();

  return <EventsScreen />;
}
