import { notFound } from 'next/navigation';
import { EXPLORE_TOPICS } from '../../../data/explore';
import { ExploreTopicScreen } from '../../../screens/Explore/ExploreTopicScreen';

export function generateStaticParams() {
  return EXPLORE_TOPICS.map((t) => ({ topicId: t.id }));
}

export async function generateMetadata({ params }) {
  const { topicId } = await params;
  const topic = EXPLORE_TOPICS.find((t) => t.id === topicId);
  if (!topic) return { title: 'Page not found' };
  return { title: topic.title };
}

export default async function ExploreTopicPage({ params }) {
  const { topicId } = await params;
  if (!EXPLORE_TOPICS.some((t) => t.id === topicId)) notFound();

  return <ExploreTopicScreen topicId={topicId} />;
}
