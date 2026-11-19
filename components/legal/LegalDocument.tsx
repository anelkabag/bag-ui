import type { ReactNode } from "react";
import Link from "next/link";
import AppShell from "@/components/shell/AppShell";
import PageHero from "@/components/shell/PageHero";

export type LegalSection = {
  id: string;
  label: string;
};

const pages = [
  { href: "/terms", label: "Terms", key: "terms" },
  { href: "/privacy", label: "Privacy", key: "privacy" },
] as const;

export function SectionHeading({
  id,
  children,
}: {
  id: string;
  children: ReactNode;
}) {
  return (
    <h2
      id={id}
      className="group mt-14 mb-4 flex scroll-mt-20 items-center gap-2 text-xl font-semibold text-foreground"
    >
      <a
        href={`#${id}`}
        className="text-base text-foreground opacity-0 transition-opacity group-hover:opacity-30"
      >
        #
      </a>
      {children}
    </h2>
  );
}

export function Prose({ children }: { children: ReactNode }) {
  return (
    <p className="text-[0.925rem] leading-7 text-muted-foreground">{children}</p>
  );
}

export const textLink =
  "text-foreground underline underline-offset-2 transition-opacity hover:opacity-70";

export function LegalDocument({
  current,
  firstLine,
  secondLine,
  emphasis,
  description,
  sections,
  children,
}: {
  current: (typeof pages)[number]["key"];
  firstLine: string;
  secondLine: string;
  emphasis: string;
  description: string;
  sections: readonly LegalSection[];
  children: ReactNode;
}) {
  return (
    <AppShell>
      <div className="mx-auto min-h-full max-w-[1440px] bg-background pb-16 text-foreground">
        <PageHero
          firstLine={firstLine}
          secondLine={secondLine}
          emphasis={emphasis}
          className="pb-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.8fr)]"
        >
          <p className="max-w-xl text-sm leading-6 text-muted-foreground md:text-base">
            {description}
          </p>
        </PageHero>

        <div className="mx-5 mt-8 grid grid-cols-1 gap-8 md:mx-10 xl:grid-cols-[180px_minmax(0,760px)_180px] xl:justify-center xl:gap-10">
          <nav
            aria-label="Legal pages"
            className="flex w-fit max-w-full items-center gap-1 overflow-x-auto rounded-full border border-border bg-muted/40 p-1 xl:sticky xl:top-8 xl:w-full xl:flex-col xl:items-stretch xl:gap-5 xl:self-start xl:overflow-visible xl:rounded-none xl:border-0 xl:bg-transparent xl:p-0"
          >
            <div className="flex shrink-0 items-center gap-1 xl:block">
              <p className="mb-2 hidden px-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground xl:block">
                Legal
              </p>
              <ul className="flex items-center gap-1 xl:block xl:space-y-0.5">
                {pages.map((page) => {
                  const active = page.key === current;
                  return (
                    <li key={page.key}>
                      <Link
                        href={page.href}
                        aria-current={active ? "page" : undefined}
                        className={`block shrink-0 rounded-full px-3.5 py-2 text-left text-sm font-medium transition-colors xl:rounded-lg xl:px-3 ${
                          active
                            ? "bg-foreground text-background xl:bg-accent xl:text-foreground"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {page.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </nav>

          <div className="mx-auto w-full min-w-0 max-w-[760px]">{children}</div>

          <nav
            className="sticky top-20 hidden self-start xl:block"
            aria-label="On this page"
          >
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              On this page
            </p>
            <ul className="space-y-1.5">
              {sections.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="block py-0.5 text-[13px] text-muted-foreground transition-colors hover:text-foreground/80"
                  >
                    {section.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </AppShell>
  );
}
