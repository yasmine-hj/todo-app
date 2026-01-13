import { NextRequest, NextResponse } from "next/server";
import { TaskStorage } from "@/lib/storage";
import {
  successResponse,
  errorResponse,
  validateUpdateTaskPayload,
  parseJsonBody,
} from "@/lib/api-utils";
import { ApiResponse, Task } from "@/types";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/tasks/:id
 * Retrieves a single task by ID.
 */
export async function GET(
  _request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<ApiResponse<Task>>> {
  try {
    const { id } = await params;
    const task = await TaskStorage.getById(id);

    if (!task) {
      return errorResponse("Task not found", 404);
    }

    return successResponse(task);
  } catch (error) {
    console.error("Error fetching task:", error);
    return errorResponse("Failed to fetch task");
  }
}

/**
 * PATCH /api/tasks/:id
 * Updates an existing task.
 */
export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<ApiResponse<Task>>> {
  try {
    const { id } = await params;

    const parsed = await parseJsonBody(request);
    if (!parsed.ok) {
      return errorResponse("Invalid JSON in request body", 400);
    }

    const validation = validateUpdateTaskPayload(parsed.body);
    if (!validation.valid) {
      return errorResponse(validation.error, 400);
    }

    const task = await TaskStorage.update(id, validation.payload);

    if (!task) {
      return errorResponse("Task not found", 404);
    }

    return successResponse(task);
  } catch (error) {
    console.error("Error updating task:", error);
    return errorResponse("Failed to update task");
  }
}

/**
 * DELETE /api/tasks/:id
 * Deletes a task by ID.
 */
export async function DELETE(
  _request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<ApiResponse<null>>> {
  try {
    const { id } = await params;
    const deleted = await TaskStorage.delete(id);

    if (!deleted) {
      return errorResponse("Task not found", 404);
    }

    return successResponse(null);
  } catch (error) {
    console.error("Error deleting task:", error);
    return errorResponse("Failed to delete task");
  }
}
