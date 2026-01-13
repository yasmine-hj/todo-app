import React from "react";
import {
  EmptyState as StyledEmptyState,
  EmptyIcon,
  EmptyText,
  EmptySubtext,
} from "../../styles";

interface EmptyStateProps {
  icon?: string;
  title?: string;
  subtitle?: string;
}

export const EmptyState = React.memo(function EmptyState({
  icon = "📝",
  title = "No tasks yet",
  subtitle = "Add a task above to get started!",
}: EmptyStateProps) {
  return (
    <StyledEmptyState>
      <EmptyIcon>{icon}</EmptyIcon>
      <EmptyText>{title}</EmptyText>
      <EmptySubtext>{subtitle}</EmptySubtext>
    </StyledEmptyState>
  );
});
