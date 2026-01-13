import { promises as fs } from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { Task, CreateTaskPayload, UpdateTaskPayload } from "@/types";

const DATA_FILE = path.join(process.cwd(), "data", "tasks.json");

/**
 * Ensures the data directory and file exist.
 * Creates them with an empty array if they don't exist.
 */
async function ensureDataFile(): Promise<void> {
  const dir = path.dirname(DATA_FILE);

  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }

  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, JSON.stringify([], null, 2), "utf-8");
  }
}

/**
 * Reads all tasks from the JSON file.
 */
async function readTasks(): Promise<Task[]> {
  await ensureDataFile();
  const data = await fs.readFile(DATA_FILE, "utf-8");
  try {
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return []; // Return empty array if JSON is corrupted
  }
}

/**
 * Writes tasks to the JSON file.
 */
async function writeTasks(tasks: Task[]): Promise<void> {
  await fs.writeFile(DATA_FILE, JSON.stringify(tasks, null, 2), "utf-8");
}

/**
 * Storage layer for task CRUD operations.
 * Uses a JSON file for persistent storage.
 * TODO: Migrate to a database in the future.
 */
export const TaskStorage = {
  /**
   * Retrieves all tasks, sorted by creation date (newest first).
   */
  async getAll(): Promise<Task[]> {
    const tasks = await readTasks();
    return tasks.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  /**
   * Retrieves a single task by ID.
   * Returns null if the task doesn't exist.
   */
  async getById(id: string): Promise<Task | null> {
    const tasks = await readTasks();
    return tasks.find((task) => task.id === id) || null;
  },

  /**
   * Creates a new task with the given payload.
   * Generates a unique ID and timestamps automatically.
   */
  async create(payload: CreateTaskPayload): Promise<Task> {
    const tasks = await readTasks();
    const now = new Date().toISOString();
    const title = payload.title.trim();

    if (!title) {
      throw new Error("Task title cannot be empty");
    }

    const newTask: Task = {
      id: uuidv4(),
      title,
      completed: false,
      createdAt: now,
      updatedAt: now,
    };

    tasks.push(newTask);
    await writeTasks(tasks);

    return newTask;
  },

  /**
   * Updates an existing task with the given payload.
   * Returns the updated task, or null if the task doesn't exist.
   */
  async update(id: string, payload: UpdateTaskPayload): Promise<Task | null> {
    const tasks = await readTasks();
    const index = tasks.findIndex((task) => task.id === id);

    // Array.findIndex() returns -1 when no element matches the search criteria.
    if (index === -1) {
      return null;
    }

    const updatedTask: Task = {
      ...tasks[index],
      ...(payload.title !== undefined && { title: payload.title.trim() }),
      ...(payload.completed !== undefined && { completed: payload.completed }),
      updatedAt: new Date().toISOString(),
    };

    tasks[index] = updatedTask;
    await writeTasks(tasks);

    return updatedTask;
  },

  /**
   * Deletes a task by ID.
   * Returns true if the task was deleted, false if it didn't exist.
   */
  async delete(id: string): Promise<boolean> {
    const tasks = await readTasks();
    const index = tasks.findIndex((task) => task.id === id);

    if (index === -1) {
      return false; // Task didn't exist
    }

    tasks.splice(index, 1);
    await writeTasks(tasks);

    return true; // Task was deleted
  },

  /**
   * Deletes all tasks.
   */
  async deleteAll(): Promise<void> {
    await ensureDataFile();
    await writeTasks([]); // Update the storage with an empty array
  },
};
