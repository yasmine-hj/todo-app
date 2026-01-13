export type Priority = "low" | "medium" | "high";

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: Priority;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskPayload {
  title: string;
  priority?: Priority;
}

export interface UpdateTaskPayload {
  title?: string;
  completed?: boolean;
  priority?: Priority;
}

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
