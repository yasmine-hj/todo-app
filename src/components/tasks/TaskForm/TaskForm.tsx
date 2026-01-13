"use client";

import React, { useState, useCallback, FormEvent, ChangeEvent } from "react";
import { Priority } from "@/types";
import {
  FormWrapper,
  Form,
  FormActions,
  InputWrapper,
  Input,
  PrimaryButton,
  PrioritySelect,
} from "../../styles";
import { CharacterCount } from "../../common/feedback";
import { useCharacterLimit } from "@/hooks/useCharacterLimit";
import { useAsyncAction } from "@/hooks/useAsyncAction";
import { useDebounce } from "@/hooks/useDebounce";
import { TASK_CONFIG } from "../TaskItem/constants";
import { isBlank } from "@/lib/string-utils";

interface TaskFormProps {
  onSubmit: (title: string, priority: Priority) => Promise<void>;
  disabled?: boolean;
}

export const TaskForm = React.memo(function TaskForm({
  onSubmit,
  disabled = false,
}: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const { isLoading: isSubmitting, execute } = useAsyncAction();

  // Debounce title for character validation (avoids excessive recalculations during fast typing)
  const debouncedTitle = useDebounce(title, 150);

  const { characterCount, isOverLimit, isNearLimit, warningMessage } =
    useCharacterLimit(debouncedTitle, {
      maxLength: TASK_CONFIG.MAX_LENGTH,
      warningThreshold: TASK_CONFIG.WARNING_THRESHOLD,
    });

  const isSubmitDisabled =
    disabled ||
    isSubmitting ||
    isBlank(title) ||
    title.length > TASK_CONFIG.MAX_LENGTH;

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const trimmedTitle = title.trim();

      const limitExceeded = trimmedTitle.length > TASK_CONFIG.MAX_LENGTH;

      if (isBlank(trimmedTitle) || limitExceeded) {
        return;
      }

      await execute(async () => {
        await onSubmit(trimmedTitle, priority);
        setTitle("");
        setPriority("medium");
      });
    },
    [title, priority, execute, onSubmit]
  );

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  }, []);

  const handlePriorityChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      setPriority(e.target.value as Priority);
    },
    []
  );

  return (
    <FormWrapper>
      <Form onSubmit={handleSubmit}>
        <InputWrapper>
          <Input
            type="text"
            value={title}
            onChange={handleChange}
            placeholder="What needs to be done?"
            disabled={disabled || isSubmitting}
            $hasError={isOverLimit}
            aria-label="New task title"
            aria-describedby={warningMessage ? "char-count" : undefined}
            aria-invalid={isOverLimit}
          />
          <CharacterCount
            id="char-count"
            characterCount={characterCount}
            maxLength={TASK_CONFIG.MAX_LENGTH}
            isNearLimit={isNearLimit}
            isOverLimit={isOverLimit}
            warningMessage={warningMessage}
          />
        </InputWrapper>
        <FormActions>
          <PrioritySelect
            value={priority}
            onChange={handlePriorityChange}
            disabled={disabled || isSubmitting}
            aria-label="Task priority"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </PrioritySelect>
          <PrimaryButton type="submit" disabled={isSubmitDisabled}>
            {isSubmitting ? "Adding..." : "Add"}
          </PrimaryButton>
        </FormActions>
      </Form>
    </FormWrapper>
  );
});
