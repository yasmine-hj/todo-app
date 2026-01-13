"use client";

import React, { useCallback, useState } from "react";
import { Task } from "@/types";
import {
  TaskItem as StyledTaskItem,
  Checkbox,
  TaskTitle,
  TaskActions,
  IconButton,
} from "../../styles";
import { ConfirmDialog } from "../../common/dialog";
import { EditIcon, TrashIcon } from "../../common/icons";
import { useAsyncAction } from "@/hooks/useAsyncAction";
import { TaskEditForm } from "./TaskEditForm";
import { TASK_CONFIG } from "./constants";
import { truncate } from "@/lib/string-utils";

interface TaskItemProps {
  task: Task;
  onToggle: (id: string, completed: boolean) => Promise<void>;
  onUpdate: (id: string, title: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

/**
 * Individual task item component with edit and delete functionality.
 */
export const TaskItem = React.memo(function TaskItem({
  task,
  onToggle,
  onUpdate,
  onDelete,
}: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { isLoading, execute } = useAsyncAction();

  const handleToggle = useCallback(() => {
    execute(() => onToggle(task.id, task.completed));
  }, [execute, onToggle, task.id, task.completed]);

  const startEditing = useCallback(() => {
    setIsEditing(true);
  }, []);

  const cancelEditing = useCallback(() => {
    setIsEditing(false);
  }, []);

  const handleSave = useCallback(
    async (title: string) => {
      await execute(() => onUpdate(task.id, title));
      setIsEditing(false);
    },
    [execute, onUpdate, task.id]
  );

  const openDeleteConfirm = useCallback(() => {
    setShowDeleteConfirm(true);
  }, []);

  const closeDeleteConfirm = useCallback(() => {
    setShowDeleteConfirm(false);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    await execute(() => onDelete(task.id));
    setShowDeleteConfirm(false);
  }, [execute, onDelete, task.id]);

  // Render edit mode
  if (isEditing) {
    return (
      <StyledTaskItem $completed={task.completed}>
        <TaskEditForm
          initialTitle={task.title}
          isLoading={isLoading}
          onSave={handleSave}
          onCancel={cancelEditing}
        />
      </StyledTaskItem>
    );
  }

  // Render view mode
  return (
    <>
      <StyledTaskItem $completed={task.completed}>
        <Checkbox
          checked={task.completed}
          onChange={handleToggle}
          disabled={isLoading}
          aria-label={
            task.completed ? "Mark as incomplete" : "Mark as complete"
          }
        />
        <TaskTitle $completed={task.completed}>{task.title}</TaskTitle>
        <TaskActions>
          <IconButton
            onClick={startEditing}
            disabled={isLoading}
            title="Edit task"
          >
            <EditIcon />
          </IconButton>
          <IconButton
            onClick={openDeleteConfirm}
            disabled={isLoading}
            $variant="danger"
            title="Delete task"
          >
            <TrashIcon />
          </IconButton>
        </TaskActions>
      </StyledTaskItem>
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete task?"
        message={`Are you sure you want to delete "${truncate(
          task.title,
          TASK_CONFIG.DISPLAY_TRUNCATE_LENGTH
        )}"? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={closeDeleteConfirm}
        isLoading={isLoading}
      />
    </>
  );
});
