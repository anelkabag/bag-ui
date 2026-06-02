import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Bag/UI - Premium shadcn/ui blocks",
  description:
    "A curated shadcn/ui component registry. Copy-paste beautiful, accessible blocks for your projects.",
  keywords: [
    "shadcn",
    "ui",
    "components",
    "registry",
    "nextjs",
    "tailwind",
    "blocks",
  ],
  authors: [{ name: "Anelka Bagalane" }],

  openGraph: {
    title: "Bag/UI — shadcn registry",
    description:
      "A curated shadcn/ui component registry. Copy-paste beautiful, accessible blocks.",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "BagUI - By Anelka Bag",
    description:
      "A curated shadcn/ui component registry. Copy-paste beautiful, accessible blocks.",
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
      {
        url: "/faviconblack.png",
        type: "image/svg+xml",
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

          {children}

        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}
