"use client";

import React, {
  useState,
  useCallback,
  useMemo,
  FormEvent,
  ChangeEvent,
  KeyboardEvent,
} from "react";
import {
  EditFormWrapper,
  EditForm,
  EditInputWrapper,
  EditInput,
  IconButton,
} from "../../styles";
import { CheckIcon, CloseIcon } from "../../common/icons";
import { CharacterCount } from "../../common/feedback";
import { useCharacterLimit } from "@/hooks/useCharacterLimit";
import { useDebounce } from "@/hooks/useDebounce";
import { isBlank } from "@/lib/string-utils";
import { TASK_CONFIG } from "./constants";

interface TaskEditFormProps {
  initialTitle: string;
  isLoading: boolean;
  onSave: (title: string) => Promise<void>;
  onCancel: () => void;
}

export const TaskEditForm = React.memo(function TaskEditForm({
  initialTitle,
  isLoading,
  onSave,
  onCancel,
}: TaskEditFormProps) {
  const [editTitle, setEditTitle] = useState(initialTitle);

  // Debounce title for character validation (avoids excessive recalculations during fast typing)
  const debouncedTitle = useDebounce(editTitle, 150);

  const { characterCount, isOverLimit, isNearLimit, warningMessage } =
    useCharacterLimit(debouncedTitle, {
      maxLength: TASK_CONFIG.MAX_LENGTH,
      warningThreshold: TASK_CONFIG.WARNING_THRESHOLD,
    });

  const isSaveDisabled = useMemo(
    () => isLoading || isOverLimit,
    [isLoading, isOverLimit]
  );

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const trimmedTitle = editTitle.trim();

      const limitExceeded = trimmedTitle.length > TASK_CONFIG.MAX_LENGTH;

      if (
        isBlank(trimmedTitle) ||
        trimmedTitle === initialTitle ||
        limitExceeded
      ) {
        onCancel();
        return;
      }

      await onSave(trimmedTitle);
    },
    [editTitle, initialTitle, onSave, onCancel]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Escape") {
        onCancel();
      }
    },
    [onCancel]
  );

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setEditTitle(e.target.value);
  }, []);

  return (
    <EditFormWrapper>
      <EditForm onSubmit={handleSubmit}>
        <EditInputWrapper>
          <EditInput
            type="text"
            value={editTitle}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            $hasError={isOverLimit}
            autoFocus
            aria-label="Edit task title"
            aria-describedby={warningMessage ? "edit-char-count" : undefined}
            aria-invalid={isOverLimit}
          />
        </EditInputWrapper>
        <IconButton type="submit" disabled={isSaveDisabled} title="Save">
          <CheckIcon />
        </IconButton>
        <IconButton
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          title="Cancel"
        >
          <CloseIcon size={18} />
        </IconButton>
      </EditForm>
      <CharacterCount
        id="edit-char-count"
        characterCount={characterCount}
        maxLength={TASK_CONFIG.MAX_LENGTH}
        isNearLimit={isNearLimit}
        isOverLimit={isOverLimit}
        warningMessage={warningMessage}
      />
    </EditFormWrapper>
  );
});
