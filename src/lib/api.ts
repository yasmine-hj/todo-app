import {
  Task,
  CreateTaskPayload,
  UpdateTaskPayload,
  ApiResponse,
} from "@/types";

const API_BASE = "/api/tasks";

/**
 * Generic fetch wrapper with err handling.
 */
async function fetchApi<T>(
  url: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  const data: ApiResponse<T> = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error || "An unexpected error occurred");
  }

  return data;
}

/**
 * Task API client for FE use.
 */
export const TaskApi = {
  /**
   * Fetches all tasks.
   */
  async getAll(): Promise<Task[]> {
    const response = await fetchApi<Task[]>(API_BASE);
    return response.data || [];
  },

  /**
   * Fetches a single task by ID.
   */
  async getById(id: string): Promise<Task> {
    const response = await fetchApi<Task>(`${API_BASE}/${id}`);
    if (!response.data) {
      throw new Error("Task not found");
    }
    return response.data;
  },

  /**
   * Creates a new task.
   */
  async create(payload: CreateTaskPayload): Promise<Task> {
    const response = await fetchApi<Task>(API_BASE, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    if (!response.data) {
      throw new Error("Failed to create task");
    }
    return response.data;
  },

  /**
   * Updates an existing task.
   */
  async update(id: string, payload: UpdateTaskPayload): Promise<Task> {
    const response = await fetchApi<Task>(`${API_BASE}/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
    if (!response.data) {
      throw new Error("Failed to update task");
    }
    return response.data;
  },

  /**
   * Deletes a task.
   */
  async delete(id: string): Promise<void> {
    await fetchApi<null>(`${API_BASE}/${id}`, {
      method: "DELETE",
    });
  },

  /**
   * Deletes all tasks.
   */
  async deleteAll(): Promise<void> {
    await fetchApi<null>(API_BASE, {
      method: "DELETE",
    });
  },
};
