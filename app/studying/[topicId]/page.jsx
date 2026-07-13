import { notFound } from 'next/navigation';
import { STUDYING_TOPICS } from '../../../data/studying';
import { StudyingTopicScreen } from '../../../screens/Studying/StudyingTopicScreen';

export function generateStaticParams() {
  return STUDYING_TOPICS.map((t) => ({ topicId: t.id }));
}

export async function generateMetadata({ params }) {
  const { topicId } = await params;
  const topic = STUDYING_TOPICS.find((t) => t.id === topicId);
  if (!topic) return { title: 'Page not found' };
  return { title: topic.title };
}

export default async function StudyingTopicPage({ params }) {
  const { topicId } = await params;
  if (!STUDYING_TOPICS.some((t) => t.id === topicId)) notFound();

  return <StudyingTopicScreen topicId={topicId} />;
}
