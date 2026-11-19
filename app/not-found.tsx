import Link from "next/link";
import { ArrowRight, Home } from "lucide-react";
import AppShell from "@/components/shell/AppShell";
import PageHero from "@/components/shell/PageHero";

export default function NotFound() {
  return (
    <AppShell>
      <div className="mx-auto flex min-h-full max-w-[1440px] flex-col bg-background pb-16 text-foreground">
        <PageHero
          firstLine="Wrong turn."
          secondLine="This page"
          emphasis="isn't here."
          className="pb-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.8fr)]"
        >
          <p className="max-w-xl text-sm leading-6 text-muted-foreground md:text-base">
            The address may have moved, been removed, or never existed. The
            rest of BagUI is still right where you left it.
          </p>
        </PageHero>

        <section className="mx-5 mt-2 overflow-hidden rounded-2xl border border-border bg-card md:mx-10">
          <div className="border-b border-border px-6 py-5 md:px-8">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              404
            </p>
          </div>
          <div className="px-6 py-10 md:px-8 md:py-14">
            <p className="text-[clamp(72px,12vw,120px)] font-semibold leading-none tracking-[-0.06em] text-foreground">
              4<span className="text-muted-foreground/40">0</span>4
            </p>
            <h2 className="mt-6 text-xl font-semibold tracking-tight text-foreground">
              This block doesn&apos;t exist.
            </h2>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/blocks"
                className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition hover:opacity-90"
              >
                Browse blocks
                <ArrowRight size={15} />
              </Link>
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition hover:bg-accent"
              >
                <Home size={15} />
                Go home
              </Link>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
