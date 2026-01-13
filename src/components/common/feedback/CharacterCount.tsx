import { memo } from "react";
import {
  CharacterCount as StyledCharacterCount,
  CharacterWarning,
} from "../../styles";

interface CharacterCountProps {
  id: string;
  characterCount: number;
  maxLength: number;
  isNearLimit: boolean;
  isOverLimit: boolean;
  warningMessage: string | null;
}

/**
 * Displays character count with warning/error states.
 * Only renders when characterCount > 0.
 */
export const CharacterCount = memo(function CharacterCount({
  id,
  characterCount,
  maxLength,
  isNearLimit,
  isOverLimit,
  warningMessage,
}: CharacterCountProps) {
  if (characterCount === 0) {
    return null;
  }

  return (
    <StyledCharacterCount
      id={id}
      $isWarning={isNearLimit}
      $isError={isOverLimit}
      role={isOverLimit ? "alert" : undefined}
    >
      {warningMessage && <CharacterWarning>{warningMessage}</CharacterWarning>}
      <span>
        {characterCount}/{maxLength}
      </span>
    </StyledCharacterCount>
  );
});
