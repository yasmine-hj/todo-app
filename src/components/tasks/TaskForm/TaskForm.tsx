"use client";

import React, { useState, useCallback, FormEvent, ChangeEvent } from "react";
import {
  FormWrapper,
  Form,
  InputWrapper,
  Input,
  PrimaryButton,
} from "../../styles";
import { CharacterCount } from "../../common/feedback";
import { useCharacterLimit } from "@/hooks/useCharacterLimit";
import { useAsyncAction } from "@/hooks/useAsyncAction";
import { useDebounce } from "@/hooks/useDebounce";
import { TASK_CONFIG } from "../TaskItem/constants";
import { isBlank } from "@/lib/string-utils";

interface TaskFormProps {
  onSubmit: (title: string) => Promise<void>;
  disabled?: boolean;
}

export const TaskForm = React.memo(function TaskForm({
  onSubmit,
  disabled = false,
}: TaskFormProps) {
  const [title, setTitle] = useState("");
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
        await onSubmit(trimmedTitle);
        setTitle("");
      });
    },
    [title, execute, onSubmit]
  );

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  }, []);

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
        <PrimaryButton type="submit" disabled={isSubmitDisabled}>
          {isSubmitting ? "Adding..." : "Add Task"}
        </PrimaryButton>
      </Form>
    </FormWrapper>
  );
});
