"use client";

import React, { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { FaGithub } from "react-icons/fa6";
import { motion } from "framer-motion";
import Link from "next/link";
import NumberFlow from "@number-flow/react";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] as const },
});

export default function Hero() {
  const [stars, setStars] = useState(0);

  useEffect(() => {
    fetch("https://api.github.com/repos/anelkabag/bag-ui")
      .then((res) => res.json())
      .then((data) => {
        if (data.stargazers_count !== undefined) {
          setStars(data.stargazers_count);
        }
      })
      .catch((err) => console.error("Error fetching stars:", err));
  }, []);

  return (
    <section className="relative">
      <div
        className="mx-auto max-w-7xl border-x border-border px-6 pt-10"
        style={{
          background: `
            radial-gradient(
                circle,
                color-mix(in srgb, var(--foreground) 12%, transparent) 1px,
                transparent 1px
            )
            `,
          backgroundSize: "20px 20px",
          backgroundColor: "var(--background)",
        }}
      >
        <div className="relative flex-1 flex flex-col items-center justify-center px-12 text-center gap-7 p-10">
          <motion.div {...fadeUp(0.05)}>
            <div
              className="inline-flex items-center overflow-hidden"
              style={{
                border: "1px solid var(--border)",
                borderRadius: "999px",
                background: "color-mix(in srgb, var(--card) 88%, transparent)",
              }}
            >
              <span
                style={{
                  padding: "6px 16px",
                  fontSize: "10px",
                  fontWeight: 600,
                  color: "var(--foreground)",
                  borderRight: "1px solid var(--border)",
                  letterSpacing: "-0.01em",
                }}
              >
                Introducing Bag\Ui v1
              </span>
              <Link
                href="https://github.com/anelkabag/bag-ui#-contributing"
                style={{
                  padding: "6px 16px",
                  fontSize: "10px",
                  color: "var(--muted-foreground)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                  textDecoration: "none",
                }}
                className="hover:text-gray-300 transition-colors duration-150"
              >
                Open Source, Built Together
                <ArrowUpRight size={16} />
              </Link>
            </div>
          </motion.div>

          <motion.h1
            {...fadeUp(0.13)}
            style={{
              fontSize: "clamp(36px, 7.8vw, 50px)",
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: "-0.04em",
              color: "color-mix(in srgb, var(--foreground) 55%, transparent)",
              margin: 0,
            }}
          >
            Build{" "}
            <span style={{ color: "var(--foreground)" }}>production-ready</span>
            <br />
            SaaS landing{" "}
            <span style={{ color: "var(--foreground)" }}>pages faster.</span>
          </motion.h1>

          <motion.p
            {...fadeUp(0.22)}
            style={{
              fontSize: "clamp(14px, 1.5vw, 10px)",
              color: "color-mix(in srgb, var(--foreground) 58%, transparent)",
              lineHeight: 1.7,
              maxWidth: "540px",
              margin: 0,
            }}
          >
            Handcrafted React & shadcn/ui sections that you can plug in,
            customize, and ship with confidence.
          </motion.p>

          <motion.div
            {...fadeUp(0.3)}
            className="flex items-center gap-3 flex-wrap justify-center mb-10"
          >
            <a
              href="https://github.com/anelkabag/bag-ui"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center gap-2.5 rounded-full bg-foreground px-5 text-sm font-medium text-background transition-all duration-300 hover:opacity-90 hover:scale-[1.02] active:scale-95"
            >
              <FaGithub className="h-4 w-4 shrink-0" />

              <span>GitHub</span>

              <span className="inline-flex min-w-[42px] items-center justify-center rounded-full bg-background/15 px-2.5 py-1 text-[11px] font-semibold leading-none">
                <NumberFlow
                  value={stars}
                  format={{ notation: "compact" }}
                  transformTiming={{ duration: 600, easing: "ease-out" }}
                  spinTiming={{ duration: 600, easing: "ease-out" }}
                  opacityTiming={{ duration: 300, easing: "ease-out" }}
                  willChange
                />
              </span>
            </a>

            <Link
              href="/blocks"
              className="inline-flex h-12 items-center rounded-full px-7 text-sm font-semibold transition-all duration-300 hover:bg-muted hover:text-foreground active:scale-95"
              style={{
                border: "1px solid var(--border)",
                color: "var(--foreground)",
              }}
            >
              Explore blocks
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
