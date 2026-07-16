"use client";

import { useLayoutEffect, useRef, useState, type ComponentType } from "react";
import { motion } from "framer-motion";
import { FaUser, FaLink, FaEnvelope, FaInstagram } from "react-icons/fa6";

type IconType = ComponentType<{ size?: number }>;

interface FieldConfig {
    Icon: IconType;
    label: string;
    segments: number[];
}

interface FrameRect {
    x: number;
    width: number;
    bottom: number;
}

const HIDDEN_FRAME: FrameRect = { x: 0, width: 0, bottom: 0 };
const spring = { type: "spring" as const, stiffness: 220, damping: 32 };

export interface SpotlightEmailCardProps {
    email?: string;
    subtitle?: string;
    className?: string;
}

export default function SpotlightEmailCard({
                                               email = "hello@example.com",
                                               className = "",
                                           }: SpotlightEmailCardProps) {
    const atIndex = email.indexOf("@");
    const segments =
        atIndex > 0
            ? [email.slice(0, atIndex), "@", email.slice(atIndex + 1)]
            : [email];

    const fields: FieldConfig[] =
        segments.length === 3
            ? [
                { Icon: FaUser, label: "Name", segments: [0] },
                { Icon: FaLink, label: "Website", segments: [2] },
                { Icon: FaEnvelope, label: "Email", segments: [0, 1, 2] },
                { Icon: FaInstagram, label: "Instagram", segments: [1, 2] },
            ]
            : [{ Icon: FaEnvelope, label: "Email", segments: [0] }];

    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [frame, setFrame] = useState<FrameRect>(HIDDEN_FRAME);

    const textRef = useRef<HTMLDivElement>(null);
    const segmentRefs = useRef<(HTMLSpanElement | null)[]>([]);

    const activeField = activeIndex !== null ? fields[activeIndex] : null;
    const activeSet = new Set(activeField?.segments ?? []);
    const hasActive = activeField !== null;

    useLayoutEffect(() => {
        if (activeIndex === null) {
            // Keep the last known frame in place; only opacity/offset animate out.
            return;
        }
        const indices = fields[activeIndex].segments;
        const container = textRef.current;
        if (!container) return;
        const containerRect = container.getBoundingClientRect();
        const rects = indices
            .map((i) => segmentRefs.current[i]?.getBoundingClientRect())
            .filter((r): r is DOMRect => r !== undefined);
        if (rects.length === 0) return;
        const minX = Math.min(...rects.map((r) => r.left));
        const maxX = Math.max(...rects.map((r) => r.right));
        const maxBottom = Math.max(...rects.map((r) => r.bottom));
        setFrame({
            x: minX - containerRect.left - 4,
            width: maxX - minX + 8,
            bottom: maxBottom - containerRect.top + 4,
        });
    }, [activeIndex]);

    return (
        <motion.div
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className={`relative w-[440px] max-w-[92vw] overflow-visible   ${className}`}
        >
            <div className="flex flex-col items-center gap-1 text-center">
                {/* Text row */}
                <div ref={textRef} className="relative w-full overflow-visible">
                    <div className="flex items-baseline justify-center text-[35px] font-semibold tracking-tight select-none">
                        {segments.map((seg, i) => (
                            <span
                                key={i}
                                ref={(el: HTMLSpanElement | null) => {
                                    segmentRefs.current[i] = el;
                                }}
                                className="transition-all duration-700 ease-out"
                                style={{
                                    color: activeSet.has(i) ? "#000000" : "#1f2937",
                                    opacity: hasActive && !activeSet.has(i) ? 0.15 : 1,
                                    fontWeight: activeSet.has(i) ? 700 : 600,
                                }}
                            >
                {seg}
              </span>
                        ))}
                    </div>

                    {/* Bottom-aligned dashed underline box — exits downward on hover-out */}
                    <motion.div
                        animate={{
                            opacity: hasActive ? 1 : 0,
                            x: frame.x,
                            y: frame.bottom - 10 + (hasActive ? 0 : 10),
                            width: frame.width,
                        }}
                        transition={spring}
                        className="pointer-events-none absolute left-0 top-0 h-[10px] rounded-b-[4px] border-b-2 border-l-2 border-r-2 border-dashed border-[#22c55e]"
                    />

                    {/* Floating label below the underline — disappears upward on hover-out */}
                    <motion.div
                        animate={{
                            opacity: hasActive ? 1 : 0,
                            x: frame.x + frame.width / 2,
                            y: frame.bottom + 8 - (hasActive ? 0 : 10),
                        }}
                        transition={spring}
                        className="pointer-events-none absolute left-0 top-0 -translate-x-1/2"
                    >
            <span className="whitespace-nowrap text-[11px] font-medium text-neutral-400">
              {activeField?.label ?? ""}
            </span>
                    </motion.div>
                </div>

                {/* spacer for label */}
                <div className="h-2" />
            </div>

            <div className="mt-4 flex items-center justify-center gap-4 pt-5">
                {fields.map(({ Icon, label }, i) => (
                    <button
                        key={i}
                        type="button"
                        onMouseEnter={() => setActiveIndex(i)}
                        onMouseLeave={() => setActiveIndex(null)}
                        onFocus={() => setActiveIndex(i)}
                        onBlur={() => setActiveIndex(null)}
                        className="cursor-pointer rounded-md p-1 transition-colors duration-500 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                        style={{
                            color: activeIndex === i ? "#000000" : "#9ca3af",
                        }}
                        aria-label={label}
                    >
                        <Icon size={25} />
                    </button>
                ))}
            </div>
        </motion.div>
    );
}
