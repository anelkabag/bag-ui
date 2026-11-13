import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { AuthProvider } from "@/providers/AuthProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import SmoothScrollProvider from "@/components/shell/SmoothScrollProvider";
const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});
export const metadata: Metadata = {
  metadataBase: new URL("https://www.bagui.pro"),
  title: "BagUI (Bag UI) – Open-Source shadcn/ui Components & Blocks",
  description:
    "Discover BagUI (also searched as Bag UI), an open-source shadcn/ui registry with production-ready React components, blocks, templates, and animations for Next.js and Tailwind CSS.",
  keywords: [
    "bagui",
    "bag ui",
    "BagUI",
    "bagui official",
    "bagui ui library",
    "bagui shadcn",
    "bagui open source",
    "bag/ui",
    "bag\\ui",
    "ui bag",
    "bagui pro",
    "ba gui",
    "baguui",
    "bag gui",
    "baguii",
    "shadcn",
    "shadcn/ui",
    "shadcn ui open source",
    "open source shadcn",
    "shadcn registry",
    "shadcn components",
    "shadcn blocks",
    "shadcn templates",
    "react shadcn ui",
    "react components",
    "react component library",
    "react component bag",
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
    title: "BagUI (Bag UI) – Open-Source shadcn/ui Components & Blocks",
    description:
      "Discover BagUI (also searched as Bag UI), an open-source shadcn/ui registry with production-ready React components, blocks, templates, and animations for Next.js and Tailwind CSS.",
    url: "https://www.bagui.pro",
    siteName: "BagUI",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "BagUI (Bag UI) – Open-Source shadcn/ui Components & Blocks",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BagUI (Bag UI) – Open-Source shadcn/ui Components & Blocks",
    description:
      "Discover BagUI (also searched as Bag UI), an open-source shadcn/ui registry with production-ready React components, blocks, templates, and animations for Next.js and Tailwind CSS.",
    images: ["/og-image.png"],
    creator: "@anelkabag",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/",
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
        <ThemeProvider>
          <AuthProvider>
            <SmoothScrollProvider>{children}</SmoothScrollProvider>
          </AuthProvider>
        </ThemeProvider>
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}
