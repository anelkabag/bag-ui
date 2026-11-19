import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign in",
  description:
    "Sign in to your BagUI account to access premium UI components, blocks and templates built with Next.js, Tailwind CSS and shadcn/ui.",
  alternates: { canonical: "/login" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Sign in | BagUI",
    description:
      "Sign in to your BagUI account to access premium UI components, blocks and templates.",
    url: "/login",
    siteName: "BagUI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sign in | BagUI",
    description:
      "Sign in to your BagUI account to access premium UI components, blocks and templates.",
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}