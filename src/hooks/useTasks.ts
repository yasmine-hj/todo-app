"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { Task, CreateTaskPayload, UpdateTaskPayload } from "@/types";
import { TaskApi } from "@/lib/api";

interface UseTasksReturn {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  createTask: (payload: CreateTaskPayload) => Promise<void>;
  updateTask: (id: string, payload: UpdateTaskPayload) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  deleteAllTasks: () => Promise<void>;
  toggleTask: (id: string, currentCompleted: boolean) => Promise<void>;
  clearError: () => void;
}

const getErrorMessage = (err: unknown, fallback: string): string =>
  err instanceof Error ? err.message : fallback;

/**
 * Provides CRUD operations with loading and error states.
 */
export function useTasks(): UseTasksReturn {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Keep a ref to tasks for synchronous access without stale closures
  const tasksRef = useRef<Task[]>(tasks);
  tasksRef.current = tasks;

  // Fetch all tasks on mount
  useEffect(() => {
    let cancelled = false;

    const fetchTasks = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await TaskApi.getAll();
        if (!cancelled) {
          setTasks(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(getErrorMessage(err, "Failed to fetch tasks"));
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchTasks();

    return () => {
      cancelled = true;
    };
  }, []);

  const createTask = useCallback(async (payload: CreateTaskPayload) => {
    setError(null);

    // Optimistic update with temporary ID
    const tempId = `temp-${Date.now()}`;
    const now = new Date().toISOString();
    const optimisticTask: Task = {
      id: tempId,
      title: payload.title,
      completed: false,
      priority: payload.priority ?? "medium",
      createdAt: now,
      updatedAt: now,
    };

    setTasks((prev) => [optimisticTask, ...prev]); // Appears at top of list

    try {
      const newTask = await TaskApi.create(payload); // Server creates real task

      // Replace temp task with real one
      setTasks((prev) =>
        prev.map((task) => (task.id === tempId ? newTask : task))
      );
    } catch (err) {
      // Rollback on error (remove the optimistic task due to err, since it was never actually created)
      setTasks((prev) => prev.filter((task) => task.id !== tempId));
      const message = getErrorMessage(err, "Failed to create task");
      setError(message);
      throw err;
    }
  }, []);

  const updateTask = useCallback(
    async (id: string, payload: UpdateTaskPayload) => {
      setError(null);

      // Store previous state for rollback
      const previousTask = tasksRef.current.find((t) => t.id === id);
      if (!previousTask) return;

      // Optimistic update
      setTasks((prev) =>
        prev.map((task) => (task.id === id ? { ...task, ...payload } : task))
      );

      try {
        const updatedTask = await TaskApi.update(id, payload);
        setTasks((prev) =>
          prev.map((task) => (task.id === id ? updatedTask : task))
        );
      } catch (err) {
        // Rollback on error
        setTasks((prev) =>
          prev.map((task) => (task.id === id ? previousTask : task))
        );
        const message = getErrorMessage(err, "Failed to update task");
        setError(message);
        throw err;
      }
    },
    []
  );

  const deleteTask = useCallback(async (id: string) => {
    setError(null);

    // Store for rollback
    const previousTasks = tasksRef.current;
    const taskIndex = previousTasks.findIndex((t) => t.id === id);
    const deletedTask = previousTasks[taskIndex];

    // Optimistic delete
    setTasks((prev) => prev.filter((task) => task.id !== id));

    try {
      await TaskApi.delete(id);
    } catch (err) {
      // Rollback: restore task at original position
      setTasks((prev) => {
        const restored = [...prev];
        restored.splice(taskIndex, 0, deletedTask);
        return restored;
      });
      const message = getErrorMessage(err, "Failed to delete task");
      setError(message);
      throw err;
    }
  }, []);

  const deleteAllTasks = useCallback(async () => {
    setError(null);

    // Store for rollback
    const previousTasks = tasksRef.current;

    // Optimistic delete
    setTasks([]);

    try {
      await TaskApi.deleteAll();
    } catch (err) {
      // Rollback on err
      setTasks(previousTasks);
      const message = getErrorMessage(err, "Failed to delete all tasks");
      setError(message);
      throw err;
    }
  }, []);

  const toggleTask = useCallback(
    async (id: string, currentCompleted: boolean) => {
      await updateTask(id, { completed: !currentCompleted });
    },
    [updateTask]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return useMemo(
    () => ({
      tasks,
      isLoading,
      error,
      createTask,
      updateTask,
      deleteTask,
      deleteAllTasks,
      toggleTask,
      clearError,
    }),
    [
      tasks,
      isLoading,
      error,
      createTask,
      updateTask,
      deleteTask,
      deleteAllTasks,
      toggleTask,
      clearError,
    ]
  );
}
