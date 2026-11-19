"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Home } from "lucide-react";
import posthog from "posthog-js";
import AppShell from "@/components/shell/AppShell";
import PageHero from "@/components/shell/PageHero";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    posthog.captureException(error);
  }, [error]);

  return (
    <AppShell>
      <div className="mx-auto flex min-h-full max-w-[1440px] flex-col bg-background pb-16 text-foreground">
        <PageHero
          firstLine="Something broke."
          secondLine="This page"
          emphasis="didn't load."
          className="pb-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.8fr)]"
        >
          <p className="max-w-xl text-sm leading-6 text-muted-foreground md:text-base">
            The error was reported. You can try the page again, or head back to
            the rest of BagUI.
          </p>
        </PageHero>

        <section className="mx-5 mt-2 overflow-hidden rounded-2xl border border-border bg-card md:mx-10">
          <div className="border-b border-border px-6 py-5 md:px-8">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Error
            </p>
          </div>
          <div className="px-6 py-10 md:px-8 md:py-14">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              This view hit an unexpected error.
            </h2>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => reset()}
                className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition hover:opacity-90"
              >
                Try again
                <ArrowRight size={15} />
              </button>
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
