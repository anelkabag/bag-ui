"use client";

import React, { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { FaGithub } from "react-icons/fa6";
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
    const [stars, setStars] = useState<number | null>(null);

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
                className="max-w-7xl mx-auto px-6 pt-10 border-x border-gray-200 "
                style={{
                    background: `
                  radial-gradient(circle, rgba(0,0,0,0.08) 1px, transparent 1px)
                `,
                    backgroundSize: "20px 20px",
                    backgroundColor: "#ffffff",
                }}
            >
                <div className="relative flex-1 flex flex-col items-center justify-center px-12 text-center gap-7 p-10">
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
                                    fontSize: "10px",
                                    fontWeight: 600,
                                    color: "#000",
                                    borderRight: "1px solid rgba(0,0,0,0.1)",
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
                                    color: "rgb(41 43 42 / 0.81)",
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
                            color: "rgba(0,0,0,0.5)",
                            margin: 0,
                        }}
                    >
                        Build <span style={{ color: "#000" }}>production-ready</span>
                        <br />
                        SaaS landing <span style={{ color: "#000" }}>pages faster.</span>
                    </motion.h1>

                    <motion.p
                        {...fadeUp(0.22)}
                        style={{
                            fontSize: "clamp(14px, 1.5vw, 10px)",
                            color: "rgba(0,0,0,0.55)",
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
                            className="inline-flex items-center gap-2 h-12 px-7 rounded-full bg-black text-white text-sm font-semibold hover:bg-gray-800 active:scale-95 transition-all"
                            style={{ letterSpacing: "-0.01em" }}
                        >
                            <FaGithub size={16} />
                            <span>GitHub</span>
                            <span className="inline-flex items-center justify-center text-[11px] font-semibold bg-white/15 rounded-full px-2 py-0.5">
                                {stars !== null ? stars.toLocaleString() : "0"}
                            </span>
                        </a>
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