"use client";

import Link from "next/link";
import BlockPreview from "@/components/BlockPreview";
import PageHero from "@/components/shell/PageHero";
import PageTopBar from "@/components/shell/PageTopBar";

type BentoItem = {
  slug: string;
  title: string;
  description: string;
  span?: string;
  fill?: boolean;
};

// Colonne de gauche : 2 blocs empilés (la hauteur de la ligne vient d'eux)
const STACK: BentoItem[] = [
  {
    slug: "hero",
    title: "Hero sections",
    description: "A headline, a proof point and one clear action.",
  },
  {
    slug: "navbar",
    title: "Navigation bars",
    description: "Menus that stay clear on every screen.",
  },
];

const BENTO: BentoItem[] = [
  {
    slug: "dashboard",
    title: "Dashboards",
    description: "Metrics, tables and activity, ready to plug into your data.",
    span: "lg:col-span-2",
    fill: true,
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

function BentoCard({
  slug,
  title,
  description,
  span = "",
  fill = false,
}: BentoItem) {
  return (
    <Link
      href={`/blocks/${slug}`}
      className={`group flex min-h-0 flex-col rounded-3xl border border-border bg-card p-6 ${span}`}
    >
      <h3 className="text-[15px] font-semibold text-foreground">{title}</h3>
      <p className="mt-2 max-w-sm text-[15px] leading-6 text-muted-foreground">
        {description}
      </p>
      {/* fill = l'aperçu occupe tout l'espace restant (desktop) */}
      <div className={`pt-6 ${fill ? "mt-auto lg:flex lg:min-h-0 lg:flex-1" : "mt-auto"}`}>
        <div
          className={`relative overflow-hidden rounded-xl border border-border bg-background ${
            fill ? "aspect-[16/9] lg:aspect-auto lg:min-h-0 lg:flex-1" : "aspect-[16/9]"
          }`}
        >
          <div className="absolute inset-0">
            <BlockPreview blockType={slug} />
          </div>
        </div>
      </div>
    </Link>
  );
}

function PreviewFrame() {
  return (
    <section className="px-4 pb-16 md:px-6">
      <div className="overflow-hidden rounded-3xl border border-border bg-muted/30">
        <div className="grid gap-4 p-4 md:p-6 lg:grid-cols-3">
          {/* Colonne 1 : deux blocs empilés, chacun garde son aperçu 16/9 complet */}
          <div className="flex flex-col gap-4 lg:col-span-1">
            {STACK.map((item) => (
              <BentoCard key={item.slug} {...item} />
            ))}
          </div>

          {/* Le reste de la grille */}
          {BENTO.map((item) => (
            <BentoCard key={item.slug} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Landing() {
  return (
    <>
      <PageTopBar />
      <PageHero
        firstLine="The building blocks"
        secondLine="for beautiful"
        emphasis="SaaS interfaces."
      >
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
      </PageHero>
      <PreviewFrame />
    </>
  );
}