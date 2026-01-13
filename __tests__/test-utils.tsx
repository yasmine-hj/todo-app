import React, { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { ThemeProvider as StyledThemeProvider } from "styled-components";
import { lightTheme } from "@/lib/themes";

/**
 * Custom render function that wraps components with themed provider.
 */
function AllTheProviders({ children }: { children: React.ReactNode }) {
  return (
    <StyledThemeProvider theme={lightTheme}>{children}</StyledThemeProvider>
  );
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from "@testing-library/react";

export { customRender as render };
