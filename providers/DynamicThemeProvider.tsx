"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";

// L'appel à `dynamic(..., { ssr: false })` doit vivre dans un Client Component.
// C'est le rôle de ce wrapper : layout.tsx (Server Component, à cause de
// `metadata`) l'importe normalement, sans jamais toucher à next/dynamic.
const ThemeProvider = dynamic(() => import("@/providers/ThemeProvider"), {
  ssr: false,
});

export default function DynamicThemeProvider({
  children,
}: {
  children: ReactNode;
}) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
