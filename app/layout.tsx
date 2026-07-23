import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { AuthProvider } from "@/providers/AuthProvider";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://bagui.vercel.app"),

  title: "BagUI – Open Source shadcn/ui Components & Blocks",

  description:
    "BagUI is an open-source shadcn/ui registry with production-ready components, blocks, templates, and animations for React, Next.js, and Tailwind CSS. Copy, customize, and build faster.",

  keywords: [
    "bagui",
    "bag/ui",
    "shadcn",
    "shadcn/ui",
    "shadcn registry",
    "shadcn components",
    "shadcn blocks",
    "shadcn templates",
    "react components",
    "nextjs components",
    "next.js",
    "react",
    "tailwind css",
    "tailwindcss",
    "tailwind components",
    "ui components",
    "component registry",
    "component library",
    "open source",
    "open source ui",
    "typescript",
    "animations",
    "landing page components",
    "dashboard components",
  ],

  authors: [
    {
      name: "Anelka Bagalane",
    },
  ],

  creator: "Anelka Bagalane <anelka.bag@gmail.com>",
  publisher: "BagUI",

  openGraph: {
    title: "BagUI – Open Source shadcn/ui Components & Blocks",
    description:
      "BagUI is an open-source shadcn/ui registry with production-ready components, blocks, templates, and animations for React, Next.js, and Tailwind CSS. Copy, customize, and build faster.",
    url: "https://bagui.vercel.app",
    siteName: "BagUI",
    type: "website",

    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "BagUI – Open Source shadcn/ui Components & Blocks",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "BagUI – Open Source shadcn/ui Components & Blocks",
    description:
      "BagUI is an open-source shadcn/ui registry with production-ready components, blocks, templates, and animations for React, Next.js, and Tailwind CSS. Copy, customize, and build faster.",
    images: ["/og-image.png"],
    creator: "@anelkabag",
  },

  robots: {
    index: true,
    follow: true,
  },

  icons: {
    icon: [
      {
        url: "/faviconwhite.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/faviconblack.png",
        media: "(prefers-color-scheme: dark)",
      },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <AuthProvider>{children}</AuthProvider>

        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}
