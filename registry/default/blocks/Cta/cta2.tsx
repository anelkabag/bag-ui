"use client";

import { motion, useInView, cubicBezier } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";

export default function CTASection() {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: "-100px" });
    const customEase = cubicBezier(0.4, 0, 0.2, 1);

    const clients = [
        { type: "logo", initials: "W", label: "works" },
        { type: "logo", initials: "CS", label: "Capsule" },
        { type: "logo", initials: "H", label: "Hilma" },
        { type: "avatar", name: "alex" },
        { type: "logo", initials: "QB", label: "Quickbooks" },
        { type: "logo", initials: "BX", label: "Brex" },
        { type: "avatar", name: "jordan" },
        { type: "logo", initials: "CS", label: "Capsule" },
        { type: "logo", initials: "H", label: "Hilma" },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.08, delayChildren: 0.2 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 12 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: customEase } },
    };

    return (
        <div className="w-full bg-gradient-to-b from-white to-gray-50">
            <div className="max-w-7xl mx-auto px-6 py-16">
                <motion.section
                    ref={ref}
                    className="w-full rounded-2xl bg-white border border-gray-200 p-8 md:p-12 overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.6, ease: customEase }}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
                        {/* Left side - Client logos grid */}
                        <motion.div
                            className="grid grid-cols-3 gap-4"
                            variants={containerVariants}
                            initial="hidden"
                            animate={inView ? "visible" : "hidden"}
                        >
                            {clients.map((client, idx) => (
                                <motion.div
                                    key={idx}
                                    variants={itemVariants}
                                    className="bg-gray-100 rounded-lg p-4 flex items-center justify-center aspect-square hover:bg-gray-150 transition-colors"
                                >
                                    {client.type === "logo" ? (
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="w-10 h-10 bg-gray-300 rounded flex items-center justify-center text-xs font-bold text-gray-700">
                                                {client.initials}
                                            </div>
                                            <span className="text-xs text-gray-600 text-center">{client.label}</span>
                                        </div>
                                    ) : (
                                        <img
                                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${client.name}`}
                                            alt={client.name}
                                            className="w-full h-full rounded-lg"
                                        />
                                    )}
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Right side - CTA content */}
                        <motion.div
                            className="flex flex-col justify-center"
                            variants={containerVariants}
                            initial="hidden"
                            animate={inView ? "visible" : "hidden"}
                        >
                            <motion.h2
                                variants={itemVariants}
                                className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight"
                            >
                                Connect with our team to get started on your growth
                            </motion.h2>

                            <motion.div
                                variants={itemVariants}
                            >
                                <Link
                                    href="/contact"
                                    className="inline-flex items-center gap-2 bg-black hover:bg-gray-900 text-white font-semibold text-sm px-6 py-3 rounded-lg transition-all duration-200 active:scale-95"
                                >
                                    Work with us
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
                    </div>
                </motion.section>
            </div>
        </div>
    );
}