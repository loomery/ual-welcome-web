import { redirect } from 'next/navigation';

/**
 * /dashboard is now merged into the root route /.
 * Redirect any direct visits here.
 */
export default function DashboardPage() {
  redirect('/');
}
