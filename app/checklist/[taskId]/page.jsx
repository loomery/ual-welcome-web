import { notFound } from 'next/navigation';
import { TASKS, OTHER_TASKS } from '../../../data/checklist';
import { TaskDetailScreen } from '../../../screens/Checklist/TaskDetailScreen';

/** All tasks that own a detail page (MFA keeps its bespoke /checklist/mfa). */
const DETAIL_TASKS = [...TASKS, ...OTHER_TASKS.map((t) => ({ ...t, title: t.label }))].filter(
  (t) => t.detail,
);

export function generateStaticParams() {
  return DETAIL_TASKS.map((t) => ({ taskId: t.id }));
}

export async function generateMetadata({ params }) {
  const { taskId } = await params;
  const task = DETAIL_TASKS.find((t) => t.id === taskId);
  if (!task) return { title: 'Page not found' };
  return { title: task.detail.title ?? task.title };
}

export default async function TaskDetailPage({ params }) {
  const { taskId } = await params;
  if (!DETAIL_TASKS.some((t) => t.id === taskId)) notFound();

  return <TaskDetailScreen taskId={taskId} />;
}
