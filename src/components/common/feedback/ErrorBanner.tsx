import React from "react";
import {
  ErrorBanner as StyledErrorBanner,
  ErrorText,
  CloseButton,
} from "../../styles";
import { CloseIcon } from "../icons";

interface ErrorBannerProps {
  message: string;
  onDismiss: () => void;
}

export const ErrorBanner = React.memo(function ErrorBanner({
  message,
  onDismiss,
}: ErrorBannerProps) {
  return (
    <StyledErrorBanner role="alert">
      <ErrorText>{message}</ErrorText>
      <CloseButton onClick={onDismiss} aria-label="Dismiss error">
        <CloseIcon />
      </CloseButton>
    </StyledErrorBanner>
  );
});
