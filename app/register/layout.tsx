import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create your account",
  description:
    "Sign up for free on BagUI and get access to premium UI components, blocks and templates built with Next.js, Tailwind CSS and shadcn/ui.",
  alternates: { canonical: "/register" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Create your account | BagUI",
    description:
      "Sign up for free on BagUI and get access to premium UI components, blocks and templates.",
    url: "/register",
    siteName: "BagUI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Create your account | BagUI",
    description:
      "Sign up for free on BagUI and get access to premium UI components, blocks and templates.",
  },
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}