import { render, screen } from "../test-utils";
import { Task } from "@/types";
import { TaskList } from "@/components";

const createTask = (id: string, title: string, completed: boolean): Task => ({
  id,
  title,
  completed,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

describe("TaskList", () => {
  const defaultProps = {
    onToggle: jest.fn().mockResolvedValue(undefined),
    onUpdate: jest.fn().mockResolvedValue(undefined),
    onDelete: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("sorting", () => {
    it("should display completed tasks at the bottom", () => {
      const tasks: Task[] = [
        createTask("1", "Completed first", true),
        createTask("2", "Pending task", false),
        createTask("3", "Another completed", true),
        createTask("4", "Another pending", false),
      ];

      render(<TaskList tasks={tasks} {...defaultProps} />);

      const taskItems = screen.getAllByRole("checkbox");

      expect(taskItems[0]).not.toBeChecked();
      expect(taskItems[1]).not.toBeChecked();
      expect(taskItems[2]).toBeChecked();
      expect(taskItems[3]).toBeChecked();
    });

    it("should preserve order within pending tasks", () => {
      const tasks: Task[] = [
        createTask("1", "First pending", false),
        createTask("2", "Completed", true),
        createTask("3", "Second pending", false),
      ];

      render(<TaskList tasks={tasks} {...defaultProps} />);

      const taskTitles = screen
        .getAllByRole("listitem")
        .map((item) => item.textContent);

      expect(taskTitles[0]).toContain("First pending");
      expect(taskTitles[1]).toContain("Second pending");
      expect(taskTitles[2]).toContain("Completed");
    });

    it("should preserve order within completed tasks", () => {
      const tasks: Task[] = [
        createTask("1", "First completed", true),
        createTask("2", "Pending", false),
        createTask("3", "Second completed", true),
      ];

      render(<TaskList tasks={tasks} {...defaultProps} />);

      const taskTitles = screen
        .getAllByRole("listitem")
        .map((item) => item.textContent);

      expect(taskTitles[0]).toContain("Pending");
      expect(taskTitles[1]).toContain("First completed");
      expect(taskTitles[2]).toContain("Second completed");
    });

    it("should handle all tasks being pending", () => {
      const tasks: Task[] = [
        createTask("1", "First", false),
        createTask("2", "Second", false),
      ];

      render(<TaskList tasks={tasks} {...defaultProps} />);

      const checkboxes = screen.getAllByRole("checkbox");
      expect(checkboxes).toHaveLength(2);
      checkboxes.forEach((cb) => expect(cb).not.toBeChecked());
    });

    it("should handle all tasks being completed", () => {
      const tasks: Task[] = [
        createTask("1", "First", true),
        createTask("2", "Second", true),
      ];

      render(<TaskList tasks={tasks} {...defaultProps} />);

      const checkboxes = screen.getAllByRole("checkbox");
      expect(checkboxes).toHaveLength(2);
      checkboxes.forEach((cb) => expect(cb).toBeChecked());
    });
  });

  describe("stats", () => {
    it("should display correct pending and completed counts", () => {
      const tasks: Task[] = [
        createTask("1", "Pending 1", false),
        createTask("2", "Completed 1", true),
        createTask("3", "Pending 2", false),
      ];

      render(<TaskList tasks={tasks} {...defaultProps} />);

      expect(screen.getByText("2 pending, 1 completed")).toBeInTheDocument();
      expect(screen.getByText("3 total")).toBeInTheDocument();
    });

    it("should hide stats when showStats is false", () => {
      const tasks: Task[] = [createTask("1", "Task", false)];

      render(<TaskList tasks={tasks} {...defaultProps} showStats={false} />);

      expect(screen.queryByText(/pending/)).not.toBeInTheDocument();
      expect(screen.queryByText(/total/)).not.toBeInTheDocument();
    });
  });
});
