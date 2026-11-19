import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type PageHeroProps = {
  firstLine: ReactNode;
  secondLine: ReactNode;
  emphasis: ReactNode;
  children?: ReactNode;
  className?: string;
};

export default function PageHero({
  firstLine,
  secondLine,
  emphasis,
  children,
  className,
}: PageHeroProps) {
  return (
    <section
      className={cn(
        "grid items-end gap-8 px-6 pb-10 pt-10 md:px-10 lg:grid-cols-[auto_auto_1fr] lg:gap-10 lg:pt-16",
        className,
      )}
    >
      <h1 className="max-w-xl text-[clamp(30px,4vw,44px)] font-medium leading-[1.1] tracking-[-0.035em] text-muted-foreground">
        {firstLine}
        <br />
        {secondLine} <span className="font-semibold text-foreground">{emphasis}</span>
      </h1>

      {children}
    </section>
  );
}
