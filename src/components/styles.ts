"use client";

import styled, { css, keyframes } from "styled-components";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

export const PageWrapper = styled.div`
  min-height: 100vh;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.background};
  transition: background-color 0.3s ease;
`;

export const Container = styled.div`
  max-width: 640px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
`;

export const HeaderContent = styled.div`
  text-align: left;
`;

export const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 0.5rem;
  transition: color 0.3s ease;
`;

export const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 1rem;
  margin: 0;
  transition: color 0.3s ease;
`;

export const ThemeToggleButton = styled.button`
  background: none;
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  padding: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.textMuted};
  transition: all 0.3s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
    background-color: ${({ theme }) =>
      theme.mode === "dark"
        ? "rgba(96, 165, 250, 0.1)"
        : "rgba(59, 130, 246, 0.1)"};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px
      ${({ theme }) =>
        theme.mode === "dark"
          ? "rgba(96, 165, 250, 0.2)"
          : "rgba(59, 130, 246, 0.2)"};
  }
`;

export const FormWrapper = styled.div`
  margin-bottom: 1.5rem;
`;

export const Form = styled.form`
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;

  @media (max-width: 480px) {
    flex-direction: column;

    & > * {
      width: 100%;
    }
  }
`;

export const FormActions = styled.div`
  display: flex;
  gap: 0.75rem;

  @media (max-width: 480px) {
    width: 100%;

    & > * {
      flex: 1;
    }
  }
`;

export const InputWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const CharacterCount = styled.div<{
  $isWarning?: boolean;
  $isError?: boolean;
}>`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.375rem;
  font-size: 0.75rem;
  color: ${({ theme, $isWarning, $isError }) =>
    $isError
      ? theme.colors.danger
      : $isWarning
      ? theme.mode === "dark"
        ? "#fbbf24"
        : "#d97706"
      : theme.colors.textLight};
  transition: color 0.2s ease;
`;

export const CharacterWarning = styled.span`
  font-size: 0.75rem;
`;

export const Input = styled.input<{ $hasError?: boolean }>`
  flex: 1;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: 2px solid
    ${({ theme, $hasError }) =>
      $hasError ? theme.colors.danger : theme.colors.border};
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme, $hasError }) =>
      $hasError ? theme.colors.danger : theme.colors.primary};
    box-shadow: 0 0 0 3px
      ${({ theme, $hasError }) =>
        $hasError
          ? theme.mode === "dark"
            ? "rgba(248, 113, 113, 0.2)"
            : "rgba(239, 68, 68, 0.1)"
          : theme.mode === "dark"
          ? "rgba(96, 165, 250, 0.2)"
          : "rgba(59, 130, 246, 0.1)"};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textLight};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.background};
    cursor: not-allowed;
  }
`;

const buttonBase = css`
  padding: 0.75rem 1.25rem;
  font-size: 1rem;
  font-weight: 500;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const PrimaryButton = styled.button`
  ${buttonBase}
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  min-width: 100px;

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.primaryHover};
  }
`;

interface IconButtonProps {
  $variant?: "default" | "danger";
}

export const IconButton = styled.button<IconButtonProps>`
  ${buttonBase}
  padding: 0.5rem;
  background-color: transparent;
  color: ${({ $variant, theme }) =>
    $variant === "danger" ? theme.colors.danger : theme.colors.textMuted};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;

  &:hover:not(:disabled) {
    background-color: ${({ $variant, theme }) =>
      $variant === "danger"
        ? theme.mode === "dark"
          ? "rgba(248, 113, 113, 0.15)"
          : "rgba(239, 68, 68, 0.1)"
        : theme.mode === "dark"
        ? "rgba(255, 255, 255, 0.1)"
        : "rgba(0, 0, 0, 0.05)"};
    color: ${({ $variant, theme }) =>
      $variant === "danger" ? theme.colors.dangerHover : theme.colors.text};
  }
`;

export const TaskList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

interface TaskItemProps {
  $completed?: boolean;
}

export const TaskItem = styled.li<TaskItemProps>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  margin-bottom: 0.5rem;
  animation: ${fadeIn} 0.2s ease-out;
  transition: box-shadow 0.2s, opacity 0.2s, background-color 0.3s,
    border-color 0.3s;

  ${({ $completed }) =>
    $completed &&
    css`
      opacity: 0.7;
    `}

  &:hover {
    box-shadow: 0 2px 8px ${({ theme }) => theme.colors.shadowColor};
  }
`;

export const Checkbox = styled.input.attrs({ type: "checkbox" })`
  width: 1.25rem;
  height: 1.25rem;
  cursor: pointer;
  accent-color: ${({ theme }) => theme.colors.primary};
  flex-shrink: 0;

  @media (max-width: 480px) {
    order: -2;
  }
`;

interface TaskTitleProps {
  $completed?: boolean;
}

export const TaskTitle = styled.span<TaskTitleProps>`
  flex: 1;
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text};
  word-break: break-word;
  transition: color 0.3s ease;

  @media (max-width: 480px) {
    order: -1;
    flex-basis: calc(100% - 3rem);
  }

  ${({ $completed, theme }) =>
    $completed &&
    css`
      text-decoration: line-through;
      color: ${theme.colors.textMuted};
    `}
`;

interface PriorityBadgeProps {
  $priority: "low" | "medium" | "high";
}

const priorityStyles = {
  low: {
    light: { bg: "#ecfdf5", text: "#047857", border: "#a7f3d0" },
    dark: {
      bg: "rgba(16, 185, 129, 0.15)",
      text: "#6ee7b7",
      border: "rgba(16, 185, 129, 0.3)",
    },
  },
  medium: {
    light: { bg: "#fffbeb", text: "#d97706", border: "#fde68a" },
    dark: {
      bg: "rgba(245, 158, 11, 0.15)",
      text: "#fcd34d",
      border: "rgba(245, 158, 11, 0.3)",
    },
  },
  high: {
    light: { bg: "#fef2f2", text: "#dc2626", border: "#fecaca" },
    dark: {
      bg: "rgba(239, 68, 68, 0.15)",
      text: "#fca5a5",
      border: "rgba(239, 68, 68, 0.3)",
    },
  },
};

export const PriorityBadge = styled.span<PriorityBadgeProps>`
  font-size: 0.65rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  flex-shrink: 0;
  border: 1px solid;
  transition: all 0.2s ease;

  ${({ $priority, theme }) => {
    const priority = $priority || "medium";
    const mode = theme?.mode || "light";
    const style = priorityStyles[priority][mode];
    return css`
      background-color: ${style.bg};
      color: ${style.text};
      border-color: ${style.border};
    `;
  }}
`;

export const PrioritySelect = styled.select`
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 110px;

  @media (max-width: 480px) {
    flex: 1;
  }

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px
      ${({ theme }) =>
        theme.mode === "dark"
          ? "rgba(96, 165, 250, 0.2)"
          : "rgba(59, 130, 246, 0.2)"};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const TaskActions = styled.div`
  display: flex;
  gap: 0.25rem;
  flex-shrink: 0;
`;

export const EditFormWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const EditForm = styled.form`
  display: flex;
  gap: 0.5rem;
  align-items: flex-start;
  flex-wrap: wrap;

  @media (max-width: 480px) {
    & > div:first-child {
      flex-basis: 100%;
    }
  }
`;

export const EditInputWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const EditInput = styled.input<{ $hasError?: boolean }>`
  flex: 1;
  padding: 0.5rem 0.75rem;
  font-size: 1rem;
  border: 2px solid
    ${({ theme, $hasError }) =>
      $hasError ? theme.colors.danger : theme.colors.primary};
  border-radius: 6px;
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px
      ${({ theme, $hasError }) =>
        $hasError
          ? theme.mode === "dark"
            ? "rgba(248, 113, 113, 0.2)"
            : "rgba(239, 68, 68, 0.1)"
          : theme.mode === "dark"
          ? "rgba(96, 165, 250, 0.2)"
          : "rgba(59, 130, 246, 0.1)"};
  }
`;

export const EditCharacterCount = styled.div<{
  $isWarning?: boolean;
  $isError?: boolean;
}>`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.25rem;
  font-size: 0.7rem;
  color: ${({ theme, $isWarning, $isError }) =>
    $isError
      ? theme.colors.danger
      : $isWarning
      ? theme.mode === "dark"
        ? "#fbbf24"
        : "#d97706"
      : theme.colors.textLight};
  transition: color 0.2s ease;
`;

// States
export const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

export const EmptyText = styled.p`
  font-size: 1.125rem;
  margin: 0 0 0.5rem;
  color: ${({ theme }) => theme.colors.text};
  transition: color 0.3s ease;
`;

export const EmptySubtext = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textLight};
  margin: 0;
  transition: color 0.3s ease;
`;

export const FilterBar = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;

  @media (max-width: 480px) {
    justify-content: space-between;

    & > button {
      flex: 1;
      min-width: 0;
    }
  }
`;

interface FilterButtonProps {
  $active?: boolean;
  $variant?: "all" | "low" | "medium" | "high";
}

const filterVariantColors = {
  all: { light: "#3b82f6", dark: "#60a5fa" },
  low: { light: "#047857", dark: "#6ee7b7" },
  medium: { light: "#d97706", dark: "#fcd34d" },
  high: { light: "#dc2626", dark: "#fca5a5" },
};

export const FilterButton = styled.button<FilterButtonProps>`
  padding: 0.4rem 0.75rem;
  font-size: 0.8rem;
  font-weight: 500;
  border-radius: 9999px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid;

  ${({ $active, $variant = "all", theme }) => {
    const color = filterVariantColors[$variant][theme.mode];

    if ($active) {
      return css`
        background-color: ${color};
        border-color: ${color};
        color: ${theme.mode === "dark" ? "#1f2937" : "#ffffff"};
      `;
    }

    return css`
      background-color: transparent;
      border-color: ${theme.colors.border};
      color: ${theme.colors.textMuted};

      &:hover {
        border-color: ${color};
        color: ${color};
      }
    `;
  }}
`;

export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
`;

export const Spinner = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border: 3px solid ${({ theme }) => theme.colors.border};
  border-top-color: ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

export const LoadingText = styled.p`
  margin-top: 1rem;
  color: ${({ theme }) => theme.colors.textMuted};
  transition: color 0.3s ease;
`;

export const ErrorBanner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background-color: ${({ theme }) =>
    theme.mode === "dark"
      ? "rgba(248, 113, 113, 0.15)"
      : "rgba(239, 68, 68, 0.1)"};
  border: 1px solid ${({ theme }) => theme.colors.danger};
  border-radius: 8px;
  margin-bottom: 1rem;
  animation: ${fadeIn} 0.2s ease-out;
`;

export const ErrorText = styled.span`
  color: ${({ theme }) => theme.colors.danger};
  font-size: 0.875rem;
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.danger};
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    opacity: 0.8;
  }
`;

export const DialogOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: ${fadeIn} 0.15s ease-out;
`;

export const DialogContent = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  padding: 1.5rem;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 4px 20px ${({ theme }) => theme.colors.shadowColor};
  animation: ${fadeIn} 0.15s ease-out;
`;

export const DialogTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 0.5rem;
`;

export const DialogMessage = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textMuted};
  margin: 0 0 1.5rem;
  line-height: 1.5;
`;

export const DialogActions = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
`;

export const SecondaryButton = styled.button`
  ${buttonBase}
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.border};

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.border};
  }
`;

export const DangerButton = styled.button`
  ${buttonBase}
  background-color: ${({ theme }) => theme.colors.danger};
  color: white;

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.dangerHover};
  }
`;

export const StatsBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  margin-bottom: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  transition: border-color 0.3s ease;
`;

export const StatText = styled.span`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textMuted};
  transition: color 0.3s ease;
`;
