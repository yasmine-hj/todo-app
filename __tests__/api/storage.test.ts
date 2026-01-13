import { promises as fs } from "fs";
import path from "path";

jest.mock("uuid", () => ({
  v4: () => "mocked-uuid-" + Math.random().toString(36).substring(7),
}));

import { TaskStorage } from "@/lib/storage";

const TEST_DATA_FILE = path.join(process.cwd(), "data", "tasks.json");

describe("TaskStorage", () => {
  beforeEach(async () => {
    await fs.writeFile(TEST_DATA_FILE, JSON.stringify([], null, 2), "utf-8");
  });

  afterAll(async () => {
    await fs.writeFile(TEST_DATA_FILE, JSON.stringify([], null, 2), "utf-8");
  });

  describe("create", () => {
    it("should create a new task with correct properties and default priority", async () => {
      const task = await TaskStorage.create({ title: "Test task" });

      expect(task).toMatchObject({
        title: "Test task",
        completed: false,
        priority: "medium",
      });
      expect(task.id).toBeDefined();
      expect(task.createdAt).toBeDefined();
      expect(task.updatedAt).toBeDefined();
    });

    it("should create a task with specified priority", async () => {
      const task = await TaskStorage.create({
        title: "High priority task",
        priority: "high",
      });

      expect(task.priority).toBe("high");
    });

    it("should create a task with low priority", async () => {
      const task = await TaskStorage.create({
        title: "Low priority task",
        priority: "low",
      });

      expect(task.priority).toBe("low");
    });

    it("should trim whitespace from title", async () => {
      const task = await TaskStorage.create({ title: "  Test task  " });

      expect(task.title).toBe("Test task");
    });
  });

  describe("getAll", () => {
    it("should return empty array when no tasks exist", async () => {
      const tasks = await TaskStorage.getAll();

      expect(tasks).toEqual([]);
    });

    it("should return all tasks sorted by creation date (newest first)", async () => {
      const task1 = await TaskStorage.create({ title: "First task" });
      const task2 = await TaskStorage.create({ title: "Second task" });

      const tasks = await TaskStorage.getAll();

      expect(tasks).toHaveLength(2);
      expect(tasks[0].id).toBe(task2.id);
      expect(tasks[1].id).toBe(task1.id);
    });
  });

  describe("getById", () => {
    it("should return task when it exists", async () => {
      const created = await TaskStorage.create({ title: "Test task" });

      const task = await TaskStorage.getById(created.id);

      expect(task).toMatchObject({
        id: created.id,
        title: "Test task",
      });
    });

    it("should return null when task does not exist", async () => {
      const task = await TaskStorage.getById("non-existent-id");

      expect(task).toBeNull();
    });
  });

  describe("update", () => {
    it("should update task title", async () => {
      const created = await TaskStorage.create({ title: "Original title" });

      const updated = await TaskStorage.update(created.id, {
        title: "Updated title",
      });

      expect(updated?.title).toBe("Updated title");
      expect(updated?.completed).toBe(false);
      expect(updated?.priority).toBe("medium");
    });

    it("should update task completed status", async () => {
      const created = await TaskStorage.create({ title: "Test task" });

      const updated = await TaskStorage.update(created.id, { completed: true });

      expect(updated?.completed).toBe(true);
      expect(updated?.title).toBe("Test task");
    });

    it("should update task priority", async () => {
      const created = await TaskStorage.create({
        title: "Test task",
        priority: "low",
      });

      const updated = await TaskStorage.update(created.id, {
        priority: "high",
      });

      expect(updated?.priority).toBe("high");
      expect(updated?.title).toBe("Test task");
    });

    it("should update multiple fields including priority", async () => {
      const created = await TaskStorage.create({
        title: "Original",
        priority: "low",
      });

      const updated = await TaskStorage.update(created.id, {
        title: "Updated",
        priority: "high",
        completed: true,
      });

      expect(updated?.title).toBe("Updated");
      expect(updated?.priority).toBe("high");
      expect(updated?.completed).toBe(true);
    });

    it("should update the updatedAt timestamp", async () => {
      const created = await TaskStorage.create({ title: "Test task" });
      const originalUpdatedAt = created.updatedAt;

      await new Promise((resolve) => setTimeout(resolve, 10));

      const updated = await TaskStorage.update(created.id, {
        title: "Updated title",
      });

      expect(new Date(updated!.updatedAt).getTime()).toBeGreaterThan(
        new Date(originalUpdatedAt).getTime()
      );
    });

    it("should return null when task does not exist", async () => {
      const updated = await TaskStorage.update("non-existent-id", {
        title: "Updated title",
      });

      expect(updated).toBeNull();
    });
  });

  describe("delete", () => {
    it("should delete existing task and return true", async () => {
      const created = await TaskStorage.create({ title: "Test task" });

      const deleted = await TaskStorage.delete(created.id);
      const task = await TaskStorage.getById(created.id);

      expect(deleted).toBe(true);
      expect(task).toBeNull();
    });

    it("should return false when task does not exist", async () => {
      const deleted = await TaskStorage.delete("non-existent-id");

      expect(deleted).toBe(false);
    });
  });

  describe("deleteAll", () => {
    it("should delete all tasks", async () => {
      await TaskStorage.create({ title: "Task 1" });
      await TaskStorage.create({ title: "Task 2" });
      await TaskStorage.create({ title: "Task 3" });

      await TaskStorage.deleteAll();
      const tasks = await TaskStorage.getAll();

      expect(tasks).toEqual([]);
    });

    it("should work when no tasks exist", async () => {
      await TaskStorage.deleteAll();
      const tasks = await TaskStorage.getAll();

      expect(tasks).toEqual([]);
    });
  });
});
