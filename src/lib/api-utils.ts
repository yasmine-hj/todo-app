import { NextResponse } from "next/server";
import { ApiResponse, CreateTaskPayload, UpdateTaskPayload } from "@/types";
import { isBlank } from "./string-utils";

export const MAX_TITLE_LENGTH = 500;

export function successResponse<T>(
  data: T,
  status = 200
): NextResponse<ApiResponse<T>> {
  return NextResponse.json({ success: true, data }, { status });
}

export function errorResponse(
  error: string,
  status = 500
): NextResponse<ApiResponse<never>> {
  return NextResponse.json({ success: false, error }, { status });
}

function validateTitle(
  title: unknown
): { valid: true; title: string } | { valid: false; error: string } {
  if (typeof title !== "string") {
    return { valid: false, error: "Title must be a string" };
  }

  if (isBlank(title)) {
    return { valid: false, error: "Title cannot be empty" };
  }

  if (title.length > MAX_TITLE_LENGTH) {
    return {
      valid: false,
      error: `Title must be ${MAX_TITLE_LENGTH} characters or less`,
    };
  }

  return { valid: true, title: title.trim() };
}

export function validateCreateTaskPayload(
  body: unknown
):
  | { valid: true; payload: CreateTaskPayload }
  | { valid: false; error: string } {
  if (!body || typeof body !== "object") {
    return { valid: false, error: "Request body must be an object" };
  }

  const { title } = body as Record<string, unknown>;

  if (title === undefined) {
    return { valid: false, error: "Title is required" };
  }

  const titleValidation = validateTitle(title);
  if (!titleValidation.valid) {
    return titleValidation;
  }

  return { valid: true, payload: { title: titleValidation.title } };
}

export function validateUpdateTaskPayload(
  body: unknown
):
  | { valid: true; payload: UpdateTaskPayload }
  | { valid: false; error: string } {
  if (!body || typeof body !== "object") {
    return { valid: false, error: "Request body must be an object" };
  }

  const { title, completed } = body as Record<string, unknown>;
  const hasTitle = title !== undefined;
  const hasCompleted = completed !== undefined;

  if (!hasTitle && !hasCompleted) {
    return {
      valid: false,
      error: "At least one field (title or completed) must be provided",
    };
  }

  const payload: UpdateTaskPayload = {};

  if (hasTitle) {
    const titleValidation = validateTitle(title);
    if (!titleValidation.valid) {
      return titleValidation;
    }
    payload.title = titleValidation.title;
  }

  if (hasCompleted) {
    if (typeof completed !== "boolean") {
      return { valid: false, error: "Completed must be a boolean" };
    }
    payload.completed = completed;
  }

  return { valid: true, payload };
}

/** Safely parses JSON from a request */
export async function parseJsonBody(
  request: Request
): Promise<{ ok: true; body: unknown } | { ok: false }> {
  try {
    const body = await request.json();
    return { ok: true, body };
  } catch {
    return { ok: false };
  }
}
