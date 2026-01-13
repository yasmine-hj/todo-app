import { Task } from "@/types/task";
import { LoadingState, EmptyState } from "../common/feedback";
import { TaskList } from "../tasks/TaskList";

interface TaskContentProps {
  isLoading: boolean;
  tasks: Task[];
  onToggle: (id: string) => void;
  onUpdate: (id: string, title: string) => Promise<void>;
  onDelete: (id: string) => void;
}

/**
 * Renders the appropriate content based on loading state and task list.
 * Shows loading spinner, empty state, or task list.
 */
export function TaskContent({
  isLoading,
  tasks,
  onToggle,
  onUpdate,
  onDelete,
}: TaskContentProps) {
  if (isLoading) {
    return <LoadingState />;
  }

  if (tasks.length === 0) {
    return <EmptyState />;
  }

  return (
    <TaskList
      tasks={tasks}
      onToggle={onToggle}
      onUpdate={onUpdate}
      onDelete={onDelete}
    />
  );
}
