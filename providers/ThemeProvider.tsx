"use client";

import { ThemeProvider as NextThemeProvider } from "next-themes";
import React from "react";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemeProvider
      attribute="class"
      storageKey="bagui-theme"
      enableSystem
      defaultTheme="system"
    >
      {children}
    </NextThemeProvider>
  );
}

export default ThemeProvider;
