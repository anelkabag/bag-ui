"use client";

import { motion, Variants } from "framer-motion";
import Image from "next/image";

/* ─── Types ─── */
interface Testimonial {
    id: number;
    quote: string;
    author: string;
    location: string;
    avatar: string;
    variant: "white" | "muted" | "dark";
}

/* ─── Data ─── */
const testimonials: Testimonial[] = [
    {
        id: 1,
        quote:
            '"The process of buying our home was as stress-free as we could have imagined."',
        author: "Janie Stewart",
        location: "Idaho, USA.",
        avatar: "https://i.pravatar.cc/80?img=47",
        variant: "white",
    },
    {
        id: 2,
        quote:
            '"We have had two great experiences working with Realty Group, as they sold two of our homes. They were professional, attentive, and patient."',
        author: "Madison Wilson",
        location: "Idaho, USA.",
        avatar: "https://i.pravatar.cc/80?img=32",
        variant: "muted",
    },
    {
        id: 3,
        quote:
            "Great experience working with Realty Group, especially as a first time buyer!",
        author: "Rosa Smith",
        location: "Idaho, USA.",
        avatar: "https://i.pravatar.cc/80?img=25",
        variant: "dark",
    },
];

/* ─── Variants map ─── */
const variantStyles = {
    white: {
        card: "bg-white border border-[#e2e8f0]",
        quote: "text-[#1e293b]",
        author: "text-[#0f172a]",
        location: "text-[#94a3b8]",
        ring: "ring-[#e2e8f0]",
    },
    muted: {
        card: "bg-[#f1f5f9] border border-[#e2e8f0]",
        quote: "text-[#1e293b]",
        author: "text-[#0f172a]",
        location: "text-[#94a3b8]",
        ring: "ring-[#e2e8f0]",
    },
    dark: {
        card: "bg-black border border-[#1e293b]",
        quote: "text-[#f1f5f9]",
        author: "text-white",
        location: "text-[#64748b]",
        ring: "ring-[#334155]",
    },
};

/* ─── Animation ─── */
const containerVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.14 } },
};

const cardVariants: Variants = {
    hidden: { opacity: 0, y: 32 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
    },
};

const headerVariants: Variants = {
    hidden: { opacity: 0, y: 18 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

/* ─── Card ─── */
function TestimonialCard({ t }: { t: Testimonial }) {
    const s = variantStyles[t.variant];

    return (
        <motion.div
            variants={cardVariants}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className={`${s.card} rounded-2xl p-8 flex flex-col justify-between h-full shadow-sm`}
        >
            {/* Quote */}
            <p className={`${s.quote} text-[17px] leading-relaxed font-normal flex-1`}>
                {t.quote}
            </p>

            {/* Divider */}
            <div className={`my-6 h-px ${t.variant === "dark" ? "bg-[#1e293b]" : "bg-[#e2e8f0]"}`} />

            {/* Author */}
            <div className="flex items-center gap-3">
                <div
                    className={`relative w-11 h-11 rounded-full overflow-hidden ring-2 ${s.ring} flex-shrink-0`}
                >
                    <Image src={t.avatar} alt={t.author} fill className="object-cover" />
                </div>
                <div>
                    <p className={`text-sm font-semibold ${s.author} leading-tight`}>{t.author}</p>
                    <p className={`text-sm ${s.location} mt-0.5`}>{t.location}</p>
                </div>
            </div>
        </motion.div>
    );
}

/* ─── Section ─── */
export default function TestimonialsSection1() {
    return (
        <section className="w-full py-24 px-4">
            <div className="max-w-5xl mx-auto">

                {/* ── Header ── */}
                <motion.div
                    className="text-center mb-16"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-80px" }}
                    variants={containerVariants}
                >
                    {/* Eyebrow */}
                    <motion.div
                        variants={headerVariants}
                        className="flex items-center justify-center gap-2 mb-5"
                    >
                        <span className="w-2 h-2 rounded-full bg-[#ef4444] inline-block" />
                        <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#64748b]">
              Review
            </span>
                    </motion.div>

                    {/* Title */}
                    <motion.h2
                        variants={headerVariants}
                        className="text-[2.6rem] sm:text-5xl font-semibold text-[#0f172a] leading-[1.1] tracking-tight mb-5"
                    >
                        Real State success{" "}
                        <em className="font-serif italic font-normal">stories</em>
                    </motion.h2>

                    {/* Subtitle */}
                    <motion.p
                        variants={headerVariants}
                        className="text-[#64748b] text-base leading-relaxed max-w-md mx-auto"
                    >
                        Our goal is to provide clients with an exceptional real estate experience,
                        offering top-tier service every step of the way.
                    </motion.p>
                </motion.div>

                {/* ── Cards grid ── */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-3 gap-5"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-60px" }}
                    variants={containerVariants}
                >
                    {testimonials.map((t) => (
                        <TestimonialCard key={t.id} t={t} />
                    ))}
                </motion.div>
            </div>
        </section>
    );
}