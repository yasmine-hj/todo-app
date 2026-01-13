import { useMemo } from "react";

interface CharacterLimitOptions {
  maxLength: number;
  warningThreshold: number;
}

interface CharacterLimitResult {
  characterCount: number;
  remainingChars: number;
  isOverLimit: boolean;
  isNearLimit: boolean;
  warningMessage: string | null;
}

/**
 * Hook for managing character limit validation and warnings.
 *
 * @param value - The current input value to validate
 * @param options - Configuration for max length and warning threshold
 * @returns Character count info and validation state
 */
export function useCharacterLimit(
  value: string,
  { maxLength, warningThreshold }: CharacterLimitOptions
): CharacterLimitResult {
  return useMemo(() => {
    const characterCount = value.length;
    const remainingChars = maxLength - characterCount;
    const isOverLimit = characterCount > maxLength;
    const isNearLimit =
      characterCount >= warningThreshold && characterCount <= maxLength;

    let warningMessage: string | null = null;
    if (isOverLimit) {
      warningMessage = `${Math.abs(remainingChars)} characters over limit`;
    } else if (isNearLimit) {
      warningMessage = `${remainingChars} characters remaining`;
    }

    return {
      characterCount,
      remainingChars,
      isOverLimit,
      isNearLimit,
      warningMessage,
    };
  }, [value, maxLength, warningThreshold]);
}
