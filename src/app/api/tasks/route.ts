import { NextRequest, NextResponse } from "next/server";
import { TaskStorage } from "@/lib/storage";
import {
  successResponse,
  errorResponse,
  validateCreateTaskPayload,
  parseJsonBody,
} from "@/lib/api-utils";
import { ApiResponse, Task } from "@/types";

/**
 * GET /api/tasks
 * Retrieves all tasks.
 */
export async function GET(): Promise<NextResponse<ApiResponse<Task[]>>> {
  try {
    const tasks = await TaskStorage.getAll();
    return successResponse(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return errorResponse("Failed to fetch tasks");
  }
}

/**
 * POST /api/tasks
 * Creates a new task.
 */
export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<Task>>> {
  try {
    const parsed = await parseJsonBody(request);
    if (!parsed.ok) {
      return errorResponse("Invalid JSON in request body", 400);
    }

    const validation = validateCreateTaskPayload(parsed.body);
    if (!validation.valid) {
      return errorResponse(validation.error, 400);
    }

    const task = await TaskStorage.create(validation.payload);
    return successResponse(task, 201);
  } catch (error) {
    console.error("Error creating task:", error);
    return errorResponse("Failed to create task");
  }
}

/**
 * DELETE /api/tasks
 * Deletes all tasks.
 */
export async function DELETE(): Promise<NextResponse<ApiResponse<null>>> {
  try {
    await TaskStorage.deleteAll();
    return successResponse(null);
  } catch (error) {
    console.error("Error deleting all tasks:", error);
    return errorResponse("Failed to delete all tasks");
  }
}
