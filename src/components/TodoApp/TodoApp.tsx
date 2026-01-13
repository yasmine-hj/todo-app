"use client";

import { useCallback, useMemo, useState } from "react";
import { Priority } from "@/types";
import { useTasks } from "@/hooks/useTasks";
import { useTheme } from "@/hooks/useTheme";
import { TaskForm } from "../tasks/TaskForm";
import { TaskList } from "../tasks/TaskList";
import { ThemeToggle } from "../layout/ThemeToggle";
import { ConfirmDialog } from "../common/dialog";
import { ErrorBanner, LoadingState, EmptyState } from "../common/feedback";
import {
  PageWrapper,
  Container,
  Header,
  HeaderContent,
  Title,
  Subtitle,
  StatsBar,
  StatText,
  DangerButton,
  FilterBar,
  FilterButton,
} from "../styles";

type PriorityFilter = "all" | Priority;

/**
 * Main application component - orchestrates task management and renders the UI.
 */
export function TodoApp() {
  const {
    tasks,
    isLoading,
    error,
    createTask,
    updateTask,
    deleteTask,
    deleteAllTasks,
    toggleTask,
    clearError,
  } = useTasks();

  const { themeMode, toggleTheme } = useTheme();

  const [showDeleteAllDialog, setShowDeleteAllDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("all");

  const handleDeleteAllClick = useCallback(() => {
    setShowDeleteAllDialog(true);
  }, []);

  const handleDeleteAllConfirm = useCallback(async () => {
    setIsDeleting(true);
    try {
      await deleteAllTasks();
      setShowDeleteAllDialog(false);
    } catch {
      // Error is handled by useTasks
    } finally {
      setIsDeleting(false);
    }
  }, [deleteAllTasks]);

  const handleDeleteAllCancel = useCallback(() => {
    setShowDeleteAllDialog(false);
  }, []);

  const handleCreateTask = useCallback(
    async (title: string, priority: Priority) => {
      await createTask({ title, priority });
    },
    [createTask]
  );

  const handleUpdateTask = useCallback(
    async (id: string, title: string, priority: Priority) => {
      await updateTask(id, { title, priority });
    },
    [updateTask]
  );

  const handleToggleTask = useCallback(
    async (id: string, completed: boolean) => {
      await toggleTask(id, completed);
    },
    [toggleTask]
  );

  const filteredTasks = useMemo(() => {
    if (priorityFilter === "all") {
      return tasks;
    }
    return tasks.filter(
      (task) => (task.priority || "medium") === priorityFilter
    );
  }, [tasks, priorityFilter]);

  const content = useMemo(() => {
    if (isLoading) {
      return <LoadingState />;
    }

    if (tasks.length === 0) {
      return <EmptyState />;
    }

    if (filteredTasks.length === 0) {
      return (
        <EmptyState
          icon="🔍"
          title="No tasks found"
          subtitle={`No ${priorityFilter} priority tasks`}
        />
      );
    }

    return (
      <TaskList
        tasks={filteredTasks}
        onToggle={handleToggleTask}
        onUpdate={handleUpdateTask}
        onDelete={deleteTask}
      />
    );
  }, [
    isLoading,
    tasks,
    filteredTasks,
    handleToggleTask,
    handleUpdateTask,
    deleteTask,
  ]);

  return (
    <PageWrapper>
      <Container>
        <Header>
          <HeaderContent>
            <Title>To-Do List</Title>
            <Subtitle>Stay organized and get things done ✅</Subtitle>
          </HeaderContent>
          <ThemeToggle themeMode={themeMode} onToggle={toggleTheme} />
        </Header>

        {error && <ErrorBanner message={error} onDismiss={clearError} />}

        <TaskForm onSubmit={handleCreateTask} disabled={isLoading} />

        {tasks.length > 0 && (
          <FilterBar>
            <FilterButton
              $active={priorityFilter === "all"}
              $variant="all"
              onClick={() => setPriorityFilter("all")}
            >
              All
            </FilterButton>
            <FilterButton
              $active={priorityFilter === "high"}
              $variant="high"
              onClick={() => setPriorityFilter("high")}
            >
              High
            </FilterButton>
            <FilterButton
              $active={priorityFilter === "medium"}
              $variant="medium"
              onClick={() => setPriorityFilter("medium")}
            >
              Medium
            </FilterButton>
            <FilterButton
              $active={priorityFilter === "low"}
              $variant="low"
              onClick={() => setPriorityFilter("low")}
            >
              Low
            </FilterButton>
          </FilterBar>
        )}

        {tasks.length > 1 && (
          <StatsBar>
            <StatText>
              {tasks.length} task{tasks.length !== 1 ? "s" : ""}
            </StatText>
            <DangerButton onClick={handleDeleteAllClick} disabled={isLoading}>
              Delete All
            </DangerButton>
          </StatsBar>
        )}

        {content}

        <ConfirmDialog
          isOpen={showDeleteAllDialog}
          title="Delete all tasks?"
          message="This will permanently delete all your tasks. This action cannot be undone."
          confirmLabel="Delete All"
          onConfirm={handleDeleteAllConfirm}
          onCancel={handleDeleteAllCancel}
          isLoading={isDeleting}
        />
      </Container>
    </PageWrapper>
  );
}
