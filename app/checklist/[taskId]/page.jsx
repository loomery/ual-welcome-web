import { notFound } from 'next/navigation';
import { TASKS } from '../../../data/checklist';
import { TaskDetailScreen } from '../../../screens/Checklist/TaskDetailScreen';

/** Only tasks with their own detail content get a page (MFA keeps /checklist/mfa). */
export function generateStaticParams() {
  return TASKS.filter((t) => t.detail).map((t) => ({ taskId: t.id }));
}

export async function generateMetadata({ params }) {
  const { taskId } = await params;
  const task = TASKS.find((t) => t.id === taskId);
  if (!task?.detail) return { title: 'Page not found' };
  return { title: task.title };
}

export default async function TaskDetailPage({ params }) {
  const { taskId } = await params;
  const task = TASKS.find((t) => t.id === taskId);
  if (!task?.detail) notFound();

  return <TaskDetailScreen taskId={taskId} />;
}
