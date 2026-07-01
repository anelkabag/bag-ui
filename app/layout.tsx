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

  title: "Bag/UI - Premium shadcn/ui blocks",
  description:
    "BagUI is a curated registry of modern shadcn/ui components, animated sections, and production-ready blocks designed to help developers build beautiful interfaces in minutes.",

  keywords: [
    "shadcn",
    "shadcn/ui",
    "ui components",
    "component registry",
    "nextjs",
    "reactjs",
    "react",
    "tailwindcss",
    "blocks",
    "animations",
    "ui library",
  ],

  authors: [
    {
      name: "Anelka Bagalane",
    },
  ],

  creator: "Anelka Bagalane <anelka.bag@gmail.com",
  publisher: "BagUI",

  openGraph: {
    title: "Bag/UI - Premium shadcn/ui blocks",
    description:
      "BagUI is a curated registry of modern shadcn/ui components, animated sections, and production-ready blocks designed to help developers build beautiful interfaces in minutes.",
    url: "https://bagui.vercel.app",
    siteName: "BagUI",
    type: "website",

    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "BagUI - Premium shadcn/ui blocks",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Bag/UI - Premium shadcn/ui blocks",
    description:
      "BagUI is a curated registry of modern shadcn/ui components, animated sections, and production-ready blocks designed to help developers build beautiful interfaces in minutes.",
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
