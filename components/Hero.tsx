"use client";

import React, { useEffect, useRef } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const DOT_SPACING = 28;

function DotGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(255,255,255,0.11)";
      const cols = Math.ceil(canvas.width / DOT_SPACING);
      const rows = Math.ceil(canvas.height / DOT_SPACING);
      for (let c = 0; c <= cols; c++)
        for (let r = 0; r <= rows; r++) {
          ctx.beginPath();
          ctx.arc(c * DOT_SPACING, r * DOT_SPACING, 1, 0, Math.PI * 2);
          ctx.fill();
        }
    };

    draw();
    const ro = new ResizeObserver(draw);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ pointerEvents: "none" }}
      aria-hidden="true"
    />
  );
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] },
});

export default function Hero() {
  return (
    <section className="relative h-screen">
      <div className="bg-[#0f0f0f] m-2 rounded-2xl h-[calc(94vh-1rem)] flex flex-col relative overflow-hidden">
        <DotGrid />

        {/* CENTERED CONTENT */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center gap-7">
          {/* Badge */}
          <motion.div {...fadeUp(0.05)}>
            <div
              className="inline-flex items-center overflow-hidden"
              style={{
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: "999px",
                background: "rgba(255,255,255,0.04)",
              }}
            >
              <span
                style={{
                  padding: "6px 16px",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#fff",
                  borderRight: "1px solid rgba(255,255,255,0.15)",
                  letterSpacing: "-0.01em",
                }}
              >
                Introducing Bag\Ui v1
              </span>
              <Link
                href="/changelog"
                style={{
                  padding: "6px 16px",
                  fontSize: "13px",
                  color: "rgba(255,255,255,0.55)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                  textDecoration: "none",
                }}
                className="hover:text-white transition-colors duration-150"
              >
                See what shipped
                <ArrowUpRight size={16} />
              </Link>
            </div>
          </motion.div>

          {/* Heading */}
          <motion.h1
            {...fadeUp(0.13)}
            style={{
              fontSize: "clamp(36px, 7.8vw, 80px)",
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: "-0.04em",
              color: "rgba(255,255,255,0.45)",
              margin: 0,
            }}
          >
              Premium <span style={{ color: "#fff" }}>shadcn/ui blocks</span>
            <br />
              built for <span style={{ color: "#fff" }}>devs who ship.</span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            {...fadeUp(0.22)}
            style={{
              fontSize: "clamp(14px, 1.5vw, 17px)",
              color: "rgba(255,255,255,0.4)",
              lineHeight: 1.7,
              maxWidth: "540px",
              margin: 0,
            }}
          >
              Polished React sections you can plug in instantly, customize in minutes, and ship with
              confidence — carefully crafted by hand, without bloated starters or generic AI-generated layouts.
          </motion.p>

          {/* CTAs */}
          <motion.div
            {...fadeUp(0.3)}
            className="flex items-center gap-3 flex-wrap justify-center"
          >
            <Link
              href="/access"
              className="inline-flex items-center gap-2 h-12 px-7 rounded-full bg-white text-[#0f0f0f] text-sm font-semibold hover:bg-gray-100 active:scale-95 transition-all"
              style={{ letterSpacing: "-0.01em" }}
            >
              Get full access <ArrowRight size={16} />
            </Link>
            <Link
              href="/blocks"
              className="inline-flex items-center h-12 px-7 rounded-full text-sm font-semibold text-white/80 hover:text-white hover:border-white/60 active:scale-95 transition-all"
              style={{
                border: "1px solid rgba(255,255,255,0.2)",
                letterSpacing: "-0.01em",
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
