import { notFound } from 'next/navigation';
import { HELP_CATEGORIES, HELP_BY_ID } from '../../../data/help';
import { HelpDetailScreen } from '../../../screens/Help/HelpDetailScreen';

export function generateStaticParams() {
  return HELP_CATEGORIES.map((h) => ({ id: h.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const category = HELP_BY_ID[id];
  if (!category) return { title: 'Not found' };
  return { title: `${category.title} | UAL Help` };
}

export default async function HelpDetailPage({ params }) {
  const { id } = await params;
  const category = HELP_BY_ID[id];
  if (!category) notFound();

  return <HelpDetailScreen category={category} />;
}
