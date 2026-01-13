import React from "react";
import { ThemeToggleButton } from "../../styles";
import { SunIcon, MoonIcon } from "../../common/icons";

interface ThemeToggleProps {
  themeMode: "light" | "dark";
  onToggle: () => void;
}

export const ThemeToggle = React.memo(function ThemeToggle({
  themeMode,
  onToggle,
}: ThemeToggleProps) {
  const nextMode = themeMode === "light" ? "dark" : "light";

  return (
    <ThemeToggleButton
      onClick={onToggle}
      aria-label={`Switch to ${nextMode} mode`}
      title={`Switch to ${nextMode} mode`}
    >
      {themeMode === "light" ? <MoonIcon /> : <SunIcon />}
    </ThemeToggleButton>
  );
});
