import { notFound } from 'next/navigation';
import { UkGuideScreen } from '../../../../screens/Explore/UkGuideScreen';

// Only Moving to the UK has a UK guide child; other topics have none.
export function generateStaticParams() {
  return [{ topicId: 'moving-to-the-uk' }];
}

export const metadata = {
  title: 'UK guide',
};

export default async function UkGuidePage({ params }) {
  const { topicId } = await params;
  if (topicId !== 'moving-to-the-uk') notFound();

  return <UkGuideScreen />;
}
