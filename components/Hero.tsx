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
            ctx.fillStyle = "rgba(0,0,0,0.06)";
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
    transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] as const },
});

export default function Hero() {
    return (
        <section className="relative h-screen">
            <div className="max-w-7xl mx-auto px-6 pt-10 pb-20 border-x border-gray-200 " style={{
                background: `
          radial-gradient(circle, rgba(0,0,0,0.08) 1px, transparent 1px)
        `,
                backgroundSize: "20px 20px",
                backgroundColor: "#ffffff",
            }}>
                {/* DotGrid removed - using background pattern instead */}

                {/* CENTERED CONTENT */}
                <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center gap-7">
                    {/* Badge */}
                    <motion.div {...fadeUp(0.05)}>
                        <div
                            className="inline-flex items-center overflow-hidden"
                            style={{
                                border: "1px solid rgba(0,0,0,0.1)",
                                borderRadius: "999px",
                                background: "rgba(0,0,0,0.02)",
                            }}
                        >
              <span
                  style={{
                      padding: "6px 16px",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#000",
                      borderRight: "1px solid rgba(0,0,0,0.1)",
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
                                    color: "rgba(0,0,0,0.55)",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "5px",
                                    textDecoration: "none",
                                }}
                                className="hover:text-black transition-colors duration-150"
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
                            color: "rgba(0,0,0,0.5)",
                            margin: 0,
                        }}
                    >
                        Premium <span style={{ color: "#000" }}>shadcn/ui blocks</span>
                        <br />
                        built for <span style={{ color: "#000" }}>devs who ship.</span>
                    </motion.h1>

                    {/* Subtext */}
                    <motion.p
                        {...fadeUp(0.22)}
                        style={{
                            fontSize: "clamp(14px, 1.5vw, 17px)",
                            color: "rgba(0,0,0,0.55)",
                            lineHeight: 1.7,
                            maxWidth: "540px",
                            margin: 0,
                        }}
                    >
                        Polished React sections you can plug in instantly, customize in
                        minutes, and ship with confidence — carefully crafted by hand,
                        without bloated starters or generic AI-generated layouts.
                    </motion.p>

                    {/* CTAs */}
                    <motion.div
                        {...fadeUp(0.3)}
                        className="flex items-center gap-3 flex-wrap justify-center"
                    >
                        <Link
                            href="/access"
                            className="inline-flex items-center gap-2 h-12 px-7 rounded-full bg-black text-white text-sm font-semibold hover:bg-gray-800 active:scale-95 transition-all"
                            style={{ letterSpacing: "-0.01em" }}
                        >
                            Get full access <ArrowRight size={16} />
                        </Link>
                        <Link
                            href="/blocks"
                            className="inline-flex items-center h-12 px-7 rounded-full text-sm font-semibold text-black/80 hover:text-black hover:border-black/40 active:scale-95 transition-all"
                            style={{
                                border: "1px solid rgba(0,0,0,0.15)",
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