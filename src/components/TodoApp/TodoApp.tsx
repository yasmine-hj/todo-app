"use client";

import { useCallback, useMemo, useState } from "react";
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
} from "../styles";

/**
 * Main To-Do application component.
 * Orchestrates task management and renders the UI.
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
    async (title: string) => {
      await createTask({ title });
    },
    [createTask]
  );

  const handleUpdateTask = useCallback(
    async (id: string, title: string) => {
      await updateTask(id, { title });
    },
    [updateTask]
  );

  const handleToggleTask = useCallback(
    async (id: string, completed: boolean) => {
      await toggleTask(id, completed);
    },
    [toggleTask]
  );

  const content = useMemo(() => {
    if (isLoading) {
      return <LoadingState />;
    }

    if (tasks.length === 0) {
      return <EmptyState />;
    }

    return (
      <TaskList
        tasks={tasks}
        onToggle={handleToggleTask}
        onUpdate={handleUpdateTask}
        onDelete={deleteTask}
      />
    );
  }, [isLoading, tasks, handleToggleTask, handleUpdateTask, deleteTask]);

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
