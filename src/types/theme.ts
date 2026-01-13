export type ThemeMode = "light" | "dark";

export interface ThemeColors {
  primary: string;
  primaryHover: string;
  danger: string;
  dangerHover: string;
  success: string;
  background: string;
  surface: string;
  border: string;
  text: string;
  textMuted: string;
  textLight: string;
  shadowColor: string;
}

export interface Theme {
  mode: ThemeMode;
  colors: ThemeColors;
}
