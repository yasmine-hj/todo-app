/**
 * String utility functions.
 */

/**
 * Truncates a string to a maximum length with ellipsis.
 *
 * @param text - The string to truncate
 * @param maxLength - Maximum total length including suffix
 * @param suffix - The suffix to append (default: "...")
 * @returns Truncated string with suffix, not exceeding maxLength
 */
export function truncate(
  text: string,
  maxLength: number,
  suffix: string = "..."
): string {
  if (maxLength <= 0) {
    return "";
  }

  const chars = Array.from(text);
  const suffixChars = Array.from(suffix);

  if (chars.length <= maxLength) {
    return text;
  }

  // If maxLength is smaller than suffix, truncate the suffix itself
  if (maxLength <= suffixChars.length) {
    return suffixChars.slice(0, maxLength).join("");
  }

  const truncateAt = maxLength - suffixChars.length;

  return chars.slice(0, truncateAt).join("") + suffix;
}

/**
 * Checks if a string is empty or contains only whitespace.
 *
 * @param text - The string to check
 * @returns True if empty or whitespace-only
 */
export function isBlank(text: string | null | undefined): boolean {
  return !text || text.trim().length === 0;
}
