import { render, screen, fireEvent, waitFor } from "../test-utils";
import { Task } from "@/types";
import { TaskItem } from "@/components";

const mockTask: Task = {
  id: "1",
  title: "Test task",
  completed: false,
  priority: "medium",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const mockCompletedTask: Task = {
  ...mockTask,
  id: "2",
  completed: true,
};

describe("TaskItem", () => {
  const defaultProps = {
    task: mockTask,
    onToggle: jest.fn().mockResolvedValue(undefined),
    onUpdate: jest.fn().mockResolvedValue(undefined),
    onDelete: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render task title and priority badge", () => {
    render(<TaskItem {...defaultProps} />);

    expect(screen.getByText("Test task")).toBeInTheDocument();
    expect(screen.getByText("medium")).toBeInTheDocument();
  });

  it("should render correct priority badge for high priority task", () => {
    const highPriorityTask = { ...mockTask, priority: "high" as const };
    render(<TaskItem {...defaultProps} task={highPriorityTask} />);

    expect(screen.getByText("high")).toBeInTheDocument();
  });

  it("should render correct priority badge for low priority task", () => {
    const lowPriorityTask = { ...mockTask, priority: "low" as const };
    render(<TaskItem {...defaultProps} task={lowPriorityTask} />);

    expect(screen.getByText("low")).toBeInTheDocument();
  });

  it("should render checkbox unchecked for incomplete task", () => {
    render(<TaskItem {...defaultProps} />);

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).not.toBeChecked();
  });

  it("should render checkbox checked for completed task", () => {
    render(<TaskItem {...defaultProps} task={mockCompletedTask} />);

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeChecked();
  });

  it("should call onToggle when checkbox is clicked", async () => {
    render(<TaskItem {...defaultProps} />);

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    await waitFor(() => {
      expect(defaultProps.onToggle).toHaveBeenCalledWith("1", false);
    });
  });

  it("should show confirmation dialog when delete button is clicked", async () => {
    render(<TaskItem {...defaultProps} />);

    const deleteButton = screen.getByTitle("Delete task");
    fireEvent.click(deleteButton);

    expect(screen.getByText("Delete task?")).toBeInTheDocument();
    expect(
      screen.getByText(/Are you sure you want to delete/)
    ).toBeInTheDocument();
  });

  it("should call onDelete when delete is confirmed", async () => {
    render(<TaskItem {...defaultProps} />);

    const deleteButton = screen.getByTitle("Delete task");
    fireEvent.click(deleteButton);

    const confirmButton = screen.getByRole("button", { name: "Delete" });
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(defaultProps.onDelete).toHaveBeenCalledWith("1");
    });
  });

  it("should close dialog when cancel is clicked", async () => {
    render(<TaskItem {...defaultProps} />);

    const deleteButton = screen.getByTitle("Delete task");
    fireEvent.click(deleteButton);

    const cancelButton = screen.getByRole("button", { name: "Cancel" });
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(screen.queryByText("Delete task?")).not.toBeInTheDocument();
    });
    expect(defaultProps.onDelete).not.toHaveBeenCalled();
  });

  it("should enter edit mode when edit button is clicked", () => {
    render(<TaskItem {...defaultProps} />);

    const editButton = screen.getByTitle("Edit task");
    fireEvent.click(editButton);

    expect(screen.getByDisplayValue("Test task")).toBeInTheDocument();
  });

  it("should call onUpdate with new title and priority when edit is submitted", async () => {
    render(<TaskItem {...defaultProps} />);

    const editButton = screen.getByTitle("Edit task");
    fireEvent.click(editButton);

    const input = screen.getByDisplayValue("Test task");
    fireEvent.change(input, { target: { value: "Updated task" } });

    const saveButton = screen.getByTitle("Save");
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(defaultProps.onUpdate).toHaveBeenCalledWith(
        "1",
        "Updated task",
        "medium"
      );
    });
  });

  it("should call onUpdate with changed priority", async () => {
    render(<TaskItem {...defaultProps} />);

    const editButton = screen.getByTitle("Edit task");
    fireEvent.click(editButton);

    const prioritySelect = screen.getByLabelText("Task priority");
    fireEvent.change(prioritySelect, { target: { value: "high" } });

    const saveButton = screen.getByTitle("Save");
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(defaultProps.onUpdate).toHaveBeenCalledWith(
        "1",
        "Test task",
        "high"
      );
    });
  });

  it("should cancel edit when cancel button is clicked", () => {
    render(<TaskItem {...defaultProps} />);

    const editButton = screen.getByTitle("Edit task");
    fireEvent.click(editButton);

    const cancelButton = screen.getByTitle("Cancel");
    fireEvent.click(cancelButton);

    expect(screen.getByText("Test task")).toBeInTheDocument();
    expect(screen.queryByDisplayValue("Test task")).not.toBeInTheDocument();
  });

  it("should cancel edit when Escape key is pressed", () => {
    render(<TaskItem {...defaultProps} />);

    const editButton = screen.getByTitle("Edit task");
    fireEvent.click(editButton);

    const input = screen.getByDisplayValue("Test task");
    fireEvent.keyDown(input, { key: "Escape" });

    expect(screen.getByText("Test task")).toBeInTheDocument();
  });

  it("should not call onUpdate when title and priority are unchanged", async () => {
    render(<TaskItem {...defaultProps} />);

    const editButton = screen.getByTitle("Edit task");
    fireEvent.click(editButton);

    const saveButton = screen.getByTitle("Save");
    fireEvent.click(saveButton);

    expect(defaultProps.onUpdate).not.toHaveBeenCalled();
  });
});
