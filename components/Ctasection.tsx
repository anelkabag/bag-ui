"use client";

import { motion, useInView, cubicBezier } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";

export default function CTASection() {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: "-100px" });
    const customEase = cubicBezier(0.4, 0, 0.2, 1);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.12, delayChildren: 0.15 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 16 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: customEase } },
    };

    const scaleVariants = {
        hidden: { opacity: 0, scale: 0.85 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: customEase } },
    };

    return (
        <div className="w-full border-t border-gray-200">
            <div className="max-w-7xl mx-auto border-l border-r border-gray-200 bg-black">
                <motion.section
                    ref={ref}
                    className="w-full rounded-2xl px-8 py-14 overflow-hidden relative min-h-96 flex flex-col items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ duration: 0.6, ease: customEase }}
                >
                    {/* Content container */}
                    <motion.div
                        className="relative z-10 flex flex-col items-center justify-center text-center max-w-xl mx-auto"
                        variants={containerVariants}
                        initial="hidden"
                        animate={inView ? "visible" : "hidden"}
                    >
                        {/* Icon - smaller */}
                        <motion.div
                            variants={scaleVariants}
                            className="mb-5 w-14 h-14 rounded flex items-center justify-center"
                        >
                            <img
                                src="https://bagui.vercel.app/faviconwhite.png"
                                alt="BagUI Logo"
                                width={50}
                                height={50}
                            />
                        </motion.div>

                        {/* Headline - smaller */}
                        <motion.h2
                            variants={itemVariants}
                            className="text-2xl sm:text-3xl font-bold text-white mb-3 leading-tight tracking-tight"
                        >
                            Ready to build amazing UIs?
                        </motion.h2>

                        {/* Subtitle - smaller */}
                        <motion.p
                            variants={itemVariants}
                            className="text-sm sm:text-base text-gray-300 mb-7 leading-relaxed max-w-sm"
                        >
                            Join thousands of developers creating beautiful components with BagUI.
                        </motion.p>

                        {/* CTA Button - single */}
                        <motion.div
                            variants={itemVariants}
                        >
                            <Link
                                href="/docs"
                                className="group inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-black font-semibold text-sm px-6 py-2.5 rounded-lg transition-all duration-200 active:scale-95"
                            >
                                Start for free
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                                >
                                    <path d="M5 12h14M13 6l6 6-6 6" />
                                </svg>
                            </Link>
                        </motion.div>
                    </motion.div>
                </motion.section>
            </div>
        </div>
    );
}