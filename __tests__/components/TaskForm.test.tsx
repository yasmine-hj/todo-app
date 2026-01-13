import { render, screen, fireEvent, waitFor, act } from "../test-utils";
import { TaskForm } from "@/components";

describe("TaskForm", () => {
  it("should render input, priority select, and button", () => {
    render(<TaskForm onSubmit={jest.fn()} />);

    expect(
      screen.getByPlaceholderText("What needs to be done?")
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Task priority")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /add/i })).toBeInTheDocument();
  });

  it("should disable button when input is empty", () => {
    render(<TaskForm onSubmit={jest.fn()} />);

    const button = screen.getByRole("button", { name: /add/i });
    expect(button).toBeDisabled();
  });

  it("should enable button when input has text", () => {
    render(<TaskForm onSubmit={jest.fn()} />);

    const input = screen.getByPlaceholderText("What needs to be done?");
    fireEvent.change(input, { target: { value: "New task" } });

    const button = screen.getByRole("button", { name: /add/i });
    expect(button).not.toBeDisabled();
  });

  it("should call onSubmit with trimmed title and default priority", async () => {
    const onSubmit = jest.fn().mockResolvedValue(undefined);
    render(<TaskForm onSubmit={onSubmit} />);

    const input = screen.getByPlaceholderText("What needs to be done?");
    fireEvent.change(input, { target: { value: "  New task  " } });

    const button = screen.getByRole("button", { name: /add/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith("New task", "medium");
    });
  });

  it("should call onSubmit with selected priority", async () => {
    const onSubmit = jest.fn().mockResolvedValue(undefined);
    render(<TaskForm onSubmit={onSubmit} />);

    const input = screen.getByPlaceholderText("What needs to be done?");
    fireEvent.change(input, { target: { value: "New task" } });

    const prioritySelect = screen.getByLabelText("Task priority");
    fireEvent.change(prioritySelect, { target: { value: "high" } });

    const button = screen.getByRole("button", { name: /add/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith("New task", "high");
    });
  });

  it("should clear input and reset priority after successful submission", async () => {
    const onSubmit = jest.fn().mockResolvedValue(undefined);
    render(<TaskForm onSubmit={onSubmit} />);

    const input = screen.getByPlaceholderText(
      "What needs to be done?"
    ) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "New task" } });

    const prioritySelect = screen.getByLabelText(
      "Task priority"
    ) as HTMLSelectElement;
    fireEvent.change(prioritySelect, { target: { value: "high" } });

    const button = screen.getByRole("button", { name: /add/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(input.value).toBe("");
      expect(prioritySelect.value).toBe("medium");
    });
  });

  it("should not submit empty or whitespace-only input", async () => {
    const onSubmit = jest.fn();
    render(<TaskForm onSubmit={onSubmit} />);

    const input = screen.getByPlaceholderText("What needs to be done?");
    fireEvent.change(input, { target: { value: "   " } });

    const button = screen.getByRole("button", { name: /add/i });
    fireEvent.click(button);

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("should disable form when disabled prop is true", () => {
    render(<TaskForm onSubmit={jest.fn()} disabled />);

    const input = screen.getByPlaceholderText("What needs to be done?");
    const prioritySelect = screen.getByLabelText("Task priority");
    const button = screen.getByRole("button", { name: /add/i });

    expect(input).toBeDisabled();
    expect(prioritySelect).toBeDisabled();
    expect(button).toBeDisabled();
  });

  describe("character limit", () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it("should show character count when typing", () => {
      render(<TaskForm onSubmit={jest.fn()} />);

      const input = screen.getByPlaceholderText("What needs to be done?");
      fireEvent.change(input, { target: { value: "Test task" } });

      // Advance past the 150ms debounce delay
      act(() => {
        jest.advanceTimersByTime(200);
      });

      expect(screen.getByText("9/500")).toBeInTheDocument();
    });

    it("should show warning when approaching limit (450+ characters)", () => {
      render(<TaskForm onSubmit={jest.fn()} />);

      const input = screen.getByPlaceholderText("What needs to be done?");
      const longText = "a".repeat(460);
      fireEvent.change(input, { target: { value: longText } });

      act(() => {
        jest.advanceTimersByTime(200);
      });

      expect(screen.getByText("40 characters remaining")).toBeInTheDocument();
      expect(screen.getByText("460/500")).toBeInTheDocument();
    });

    it("should show error when exceeding limit", () => {
      render(<TaskForm onSubmit={jest.fn()} />);

      const input = screen.getByPlaceholderText("What needs to be done?");
      const tooLongText = "a".repeat(510);
      fireEvent.change(input, { target: { value: tooLongText } });

      act(() => {
        jest.advanceTimersByTime(200);
      });

      expect(screen.getByText("10 characters over limit")).toBeInTheDocument();
      expect(screen.getByText("510/500")).toBeInTheDocument();
    });

    it("should disable submit button when over limit", () => {
      render(<TaskForm onSubmit={jest.fn()} />);

      const input = screen.getByPlaceholderText("What needs to be done?");
      const tooLongText = "a".repeat(510);
      fireEvent.change(input, { target: { value: tooLongText } });

      // Advance past the 150ms debounce delay
      act(() => {
        jest.advanceTimersByTime(200);
      });

      const button = screen.getByRole("button", { name: /add/i });
      expect(button).toBeDisabled();
    });

    it("should not submit when over limit", async () => {
      const onSubmit = jest.fn();
      render(<TaskForm onSubmit={onSubmit} />);

      const input = screen.getByPlaceholderText("What needs to be done?");
      const tooLongText = "a".repeat(510);
      fireEvent.change(input, { target: { value: tooLongText } });

      const button = screen.getByRole("button", { name: /add/i });
      fireEvent.click(button);

      expect(onSubmit).not.toHaveBeenCalled();
    });

    it("should not show character count when input is empty", () => {
      render(<TaskForm onSubmit={jest.fn()} />);

      expect(screen.queryByText(/\/500/)).not.toBeInTheDocument();
    });
  });
});
