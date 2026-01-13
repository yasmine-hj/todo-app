import { Theme, ThemeColors } from '@/types';

const lightColors: ThemeColors = {
  primary: '#3b82f6',
  primaryHover: '#2563eb',
  danger: '#ef4444',
  dangerHover: '#dc2626',
  success: '#22c55e',
  background: '#f8fafc',
  surface: '#ffffff',
  border: '#e2e8f0',
  text: '#1e293b',
  textMuted: '#64748b',
  textLight: '#94a3b8',
  shadowColor: 'rgba(0, 0, 0, 0.05)',
};

const darkColors: ThemeColors = {
  primary: '#60a5fa',
  primaryHover: '#3b82f6',
  danger: '#f87171',
  dangerHover: '#ef4444',
  success: '#4ade80',
  background: '#0f172a',
  surface: '#1e293b',
  border: '#334155',
  text: '#f1f5f9',
  textMuted: '#94a3b8',
  textLight: '#64748b',
  shadowColor: 'rgba(0, 0, 0, 0.3)',
};

export const lightTheme: Theme = {
  mode: 'light',
  colors: lightColors,
};

export const darkTheme: Theme = {
  mode: 'dark',
  colors: darkColors,
};

export const themes = {
  light: lightTheme,
  dark: darkTheme,
} as const;
