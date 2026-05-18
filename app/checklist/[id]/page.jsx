import { notFound } from 'next/navigation';
import { TASKS_BY_ID, TASKS } from '../../../data/checklist';
import { TaskDetailScreen } from '../../../screens/Checklist/TaskDetailScreen';

/**
 * Generate static params for all known task IDs.
 */
export function generateStaticParams() {
  return TASKS.map((t) => ({ id: t.id }));
}

/**
 * In Next.js 15+, params is a Promise and must be awaited.
 */
export async function generateMetadata({ params }) {
  const { id } = await params;
  const task = TASKS_BY_ID[id];
  if (!task) return { title: 'Not found' };
  return { title: `${task.title} | UAL Welcome Week` };
}

export default async function TaskDetailPage({ params }) {
  const { id } = await params;
  const task = TASKS_BY_ID[id];
  if (!task) notFound();

  return <TaskDetailScreen task={task} />;
}
