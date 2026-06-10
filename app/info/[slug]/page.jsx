import { notFound } from 'next/navigation';
import { INFO_PAGES, INFO_PAGES_BY_SLUG } from '../../../data/infoPages';
import { InfoScreen } from '../../../screens/Info/InfoScreen';

/**
 * Pre-render every info page at build time — pure-static content, no
 * client-side data fetching needed.
 */
export function generateStaticParams() {
  return INFO_PAGES.map((p) => ({ slug: p.slug }));
}

/**
 * @param {Object} props
 * @param {Promise<{ slug: string }>} props.params
 */
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const page = INFO_PAGES_BY_SLUG[slug];
  if (!page) return { title: 'Page not found | UAL Welcome Week' };
  return {
    title: `${page.title} | UAL Welcome Week`,
    description: page.lead,
  };
}

/**
 * @param {Object} props
 * @param {Promise<{ slug: string }>} props.params
 */
export default async function InfoPage({ params }) {
  const { slug } = await params;
  const page = INFO_PAGES_BY_SLUG[slug];
  if (!page) notFound();
  return <InfoScreen page={page} />;
}
