import React, { useMemo } from "react";
import { Task } from "@/types/task";
import { StatsBar, StatText, TaskList as StyledTaskList } from "../../styles";
import { TaskItem } from "../TaskItem";

interface TaskListProps {
  tasks: Task[];
  onToggle: (id: string, completed: boolean) => Promise<void>;
  onUpdate: (id: string, title: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  showStats?: boolean;
}

/**
 * Task list component with statistics bar.
 */
export const TaskList = React.memo(function TaskList({
  tasks,
  onToggle,
  onUpdate,
  onDelete,
  showStats = true,
}: TaskListProps) {
  const { completedCount, pendingCount, sortedTasks } = useMemo(() => {
    const completed = tasks.filter((t) => t.completed).length;
    const sorted = [...tasks].sort((a, b) => {
      if (a.completed === b.completed) return 0;
      return a.completed ? 1 : -1;
    });
    return {
      completedCount: completed,
      pendingCount: tasks.length - completed,
      sortedTasks: sorted,
    };
  }, [tasks]);

  return (
    <>
      {showStats && (
        <StatsBar>
          <StatText>
            {pendingCount} pending, {completedCount} completed
          </StatText>
          <StatText>{tasks.length} total</StatText>
        </StatsBar>
      )}
      <StyledTaskList>
        {sortedTasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={onToggle}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        ))}
      </StyledTaskList>
    </>
  );
});
