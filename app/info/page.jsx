import { redirect } from 'next/navigation';

// /info has no index of its own (pages live at /info/[slug]). The breadcrumb
// derived from the URL still shows an "Info" crumb, so keep the route valid by
// sending it home instead of 404-ing.
export default function InfoIndexPage() {
  redirect('/');
}
