"use client";

import { useEffect, useRef } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import { gsap } from "gsap";
import { ArrowRight, ExternalLink } from "lucide-react";

/* ─────────────────────────────────────────────
   Corner cross marks (decorative)
───────────────────────────────────────────── */
function CrossMark({ className }: { className: string }) {
    return (
        <span
            className={`absolute text-neutral-300 text-xl font-thin select-none pointer-events-none ${className}`}
            aria-hidden
        >
      +
    </span>
    );
}

/* ─────────────────────────────────────────────
   Dot-grid background pattern
───────────────────────────────────────────── */
function DotGrid() {
    return (
        <div
            className="absolute inset-0 pointer-events-none"
            style={{
                backgroundImage: `radial-gradient(circle, #d4d4d4 1px, transparent 1px)`,
                backgroundSize: "28px 28px",
                opacity: 0.45,
            }}
        />
    );
}

/* ─────────────────────────────────────────────
   Announcement badge
───────────────────────────────────────────── */
function AnnouncementBadge() {
    return (
        <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
            className="flex items-center gap-1 mb-10"
        >
      <span className="border border-neutral-300 rounded-full px-4 py-1.5 text-sm font-medium text-neutral-800 bg-white shadow-sm">
        Introducing blockus v1
      </span>
            <a
                href="#"
                className="flex items-center gap-1 rounded-full px-4 py-1.5 text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
            >
                See what shipped
                <ExternalLink size={13} strokeWidth={1.8} />
            </a>
        </motion.div>
    );
}

/* ─────────────────────────────────────────────
   Animated heading — word by word
───────────────────────────────────────────── */
const headingWords = [
    { text: "Beautiful", muted: true },
    { text: "shadcn", muted: false },
    { text: "blocks", muted: false },
    { text: "for", muted: true },
    { text: "devs", muted: false },
    { text: "who", muted: false },
    { text: "ship.", muted: false },
];

function AnimatedHeading() {
    return (
        <h1 className="text-[clamp(2.8rem,7vw,5.2rem)] font-extrabold leading-[1.08] tracking-tight text-center">
            {headingWords.map((word, i) => (
                <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{
                        duration: 0.55,
                        ease: [0.22, 1, 0.36, 1],
                        delay: 0.45 + i * 0.07,
                    }}
                    className={`inline-block mr-[0.22em] ${
                        word.muted ? "text-neutral-400" : "text-neutral-900"
                    }`}
                >
                    {word.text}
                </motion.span>
            ))}
        </h1>
    );
}

/* ─────────────────────────────────────────────
   CTA Buttons — GSAP magnetic effect
───────────────────────────────────────────── */
function MagneticButton({
                            children,
                            primary,
                        }: {
    children: React.ReactNode;
    primary?: boolean;
}) {
    const btnRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const el = btnRef.current;
        if (!el) return;

        const handleMove = (e: MouseEvent) => {
            const rect = el.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const dx = (e.clientX - cx) * 0.28;
            const dy = (e.clientY - cy) * 0.28;
            gsap.to(el, { x: dx, y: dy, duration: 0.35, ease: "power2.out" });
        };
        const handleLeave = () => {
            gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1,0.5)" });
        };

        el.addEventListener("mousemove", handleMove);
        el.addEventListener("mouseleave", handleLeave);
        return () => {
            el.removeEventListener("mousemove", handleMove);
            el.removeEventListener("mouseleave", handleLeave);
        };
    }, []);

    return (
        <button
            ref={btnRef}
            className={`
        relative inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold
        transition-all duration-200 cursor-pointer
        ${
                primary
                    ? "bg-neutral-900 text-white hover:bg-neutral-700 shadow-md hover:shadow-lg"
                    : "border border-neutral-300 text-neutral-800 bg-white hover:bg-neutral-50 hover:border-neutral-400 shadow-sm"
            }
      `}
        >
            {children}
        </button>
    );
}

/* ─────────────────────────────────────────────
   Main Hero
───────────────────────────────────────────── */
export default function Hero() {
    const containerRef = useRef<HTMLDivElement>(null);

    /* GSAP — subtle parallax on mouse move */
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleMouse = (e: MouseEvent) => {
            const { innerWidth: W, innerHeight: H } = window;
            const xPct = (e.clientX / W - 0.5) * 2; // -1 → +1
            const yPct = (e.clientY / H - 0.5) * 2;

            gsap.to(".hero-dots", {
                x: xPct * 12,
                y: yPct * 8,
                duration: 1.2,
                ease: "power1.out",
            });
            gsap.to(".hero-content", {
                x: xPct * -4,
                y: yPct * -3,
                duration: 1.4,
                ease: "power1.out",
            });
        };

        window.addEventListener("mousemove", handleMouse);
        return () => window.removeEventListener("mousemove", handleMouse);
    }, []);

    /* GSAP — entrance line animation on the decorative border */
    useEffect(() => {
        gsap.fromTo(
            ".hero-border",
            { scaleX: 0, transformOrigin: "left" },
            { scaleX: 1, duration: 1.2, ease: "expo.out", delay: 0.1 }
        );
    }, []);

    return (
        <section
            ref={containerRef}
            className="relative h-[100svh] flex flex-col items-center justify-center overflow-hidden bg-[#f9f9f8]"
        >
            {/* Dot-grid bg layer */}
            <div className="hero-dots absolute inset-0">
                <DotGrid />
            </div>

            {/* Faint radial vignette */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background:
                        "radial-gradient(ellipse 70% 60% at 50% 50%, transparent 40%, #f9f9f8 100%)",
                }}
            />

            {/* Corner + marks */}
            <CrossMark className="top-8 left-8" />
            <CrossMark className="top-8 right-8" />
            <CrossMark className="bottom-8 left-8" />
            <CrossMark className="bottom-8 right-8" />

            {/* Animated thin top-border line */}
            <div className="hero-border absolute top-0 left-0 right-0 h-px bg-neutral-200" />

            {/* Content */}
            <div className="hero-content relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto px-6">
                <AnnouncementBadge />
                <AnimatedHeading />

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut", delay: 1.05 }}
                    className="text-neutral-500 text-[1.05rem] leading-relaxed max-w-md mb-10"
                >
                    Drop them in, swap the copy, push to prod. Polished React sections
                    built by hand — no starter scaffolds, no AI slop.
                </motion.p>

                {/* Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, ease: "easeOut", delay: 1.2 }}
                    className="flex items-center gap-3 flex-wrap justify-center"
                >
                    <MagneticButton primary>
                        Get full access <ArrowRight size={15} strokeWidth={2.2} />
                    </MagneticButton>
                    <MagneticButton>Explore blocks</MagneticButton>
                </motion.div>
            </div>

            {/* Bottom border line */}
            <div className="hero-border absolute bottom-0 left-0 right-0 h-px bg-neutral-200" />
        </section>
    );
}