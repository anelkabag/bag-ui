"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import BlockPreview from "@/components/BlockPreview";
import BlocksCatalog from "@/components/Blockscatalog";
import CTASection from "@/components/Ctasection";
import { Footer } from "@/components/footer";

const BENTO: {
  slug: string;
  title: string;
  description: string;
  span: string;
}[] = [
  {
    slug: "hero",
    title: "Hero sections",
    description: "Open your page with a headline, a proof point and one clear action.",
    span: "lg:col-span-1",
  },
  {
    slug: "dashboard",
    title: "Dashboards",
    description: "Metrics, tables and activity, ready to plug into your data.",
    span: "lg:col-span-2",
  },
  {
    slug: "pricing",
    title: "Pricing tables",
    description: "Compare plans side by side without writing the layout.",
    span: "lg:col-span-1",
  },
  {
    slug: "feature",
    title: "Feature grids",
    description: "Explain what your product does, one card at a time.",
    span: "lg:col-span-1",
  },
  {
    slug: "testimonial",
    title: "Testimonials",
    description: "Put customer quotes where visitors decide.",
    span: "lg:col-span-1",
  },
];

function TopBar() {
  const { user } = useAuth();
  const link =
    "text-[15px] text-muted-foreground transition-colors hover:text-foreground";
  return (
    <div className="flex h-14 items-center justify-end gap-6 px-6">
      <a
        href="https://github.com/anelkabag/bag-ui"
        target="_blank"
        rel="noopener noreferrer"
        className={link}
      >
        Star on GitHub
      </a>
      {user ? (
        <Link href="/account" className={link}>
          Account
        </Link>
      ) : (
        <>
          <Link href="/login" className={link}>
            Log in
          </Link>
          <Link href="/register" className="text-[15px] font-medium text-foreground">
            Sign up
          </Link>
        </>
      )}
    </div>
  );
}

function Hero() {
  return (
    <section className="grid items-end gap-8 px-6 pb-10 pt-10 md:px-10 lg:grid-cols-[auto_auto_1fr] lg:gap-10 lg:pt-16">
      <h1 className="max-w-xl text-[clamp(30px,4vw,44px)] font-medium leading-[1.1] tracking-[-0.035em] text-muted-foreground">
        Shadcn registry for
        <br />
        building{" "}
        <span className="font-semibold text-foreground">SaaS interfaces.</span>
      </h1>

      <div className="flex items-center gap-4">
        <Link
          href="/docs"
          className="inline-flex h-10 items-center rounded-full bg-foreground px-5 text-sm font-semibold text-background transition-opacity hover:opacity-85"
        >
          Get started
        </Link>
        <Link
          href="/blocks"
          className="text-[15px] text-muted-foreground transition-colors hover:text-foreground"
        >
          Explore blocks
        </Link>
      </div>

      <Link
        href="/changelog"
        className="text-[15px] text-muted-foreground transition-colors hover:text-foreground lg:text-right mb-2.5"
      >
        <span className="font-semibold text-foreground">November 2026:</span>{" "}
        BagUI MCP and the VS Code extension are live
      </Link>
    </section>
  );
}

function PreviewFrame() {
  return (
    <section className="px-4 pb-16 md:px-6">
      <div className="overflow-hidden rounded-3xl border border-border bg-muted/30">
        <div className="grid gap-4 p-4 md:p-6 lg:grid-cols-3">
          {BENTO.map(({ slug, title, description, span }) => (
            <Link
              key={slug}
              href={`/blocks/${slug}`}
              className={`group flex flex-col rounded-3xl border border-border bg-card p-6 ${span}`}
            >
              <h3 className="text-[15px] font-semibold text-foreground">{title}</h3>
              <p className="mt-2 max-w-xs text-[15px] leading-6 text-muted-foreground">
                {description}
              </p>
              <div className="mt-auto pt-6">
                <div className="relative aspect-[16/9] overflow-hidden rounded-xl border border-border bg-background">
                  <div className="absolute inset-0">
                    <BlockPreview blockType={slug} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Landing() {
  return (
    <>
      <TopBar />
      <Hero />
      <PreviewFrame />
    </>
  );
}