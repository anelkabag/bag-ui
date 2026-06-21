"use client";

import { motion, Variants } from "framer-motion";
import { Play, BadgeCheck } from "lucide-react";
import Image from "next/image";

/* ─── Types ─── */
interface Testimonial {
    id: number;
    type: "text" | "video";
    quote?: string;
    author: {
        name: string;
        role: string;
        avatar: string;
    };
    videoThumb?: string;
}

/* ─── Data ─── */
const testimonials: Testimonial[] = [
    {
        id: 1,
        type: "text",
        quote:
            '"I can DEFINITELY recommend GoFunnels for EVERY agency in the world. These guys outperform everything"',
        author: {
            name: "Rehan Ahmed",
            role: "CEO @Moodify.io",
            avatar: "https://i.pravatar.cc/40?img=11",
        },
    },
    {
        id: 2,
        type: "text",
        quote:
            "We invite you to a shared Slack channel, giving you direct, real-time access to your assigned team, just like they're in-house.",
        author: {
            name: "Rehan Ahmed",
            role: "CEO @Moodify.io",
            avatar: "https://i.pravatar.cc/40?img=12",
        },
    },
    {
        id: 3,
        type: "video",
        videoThumb: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
        author: {
            name: "Rehan Ahmed",
            role: "CEO @Moodify.io",
            avatar: "https://i.pravatar.cc/40?img=13",
        },
    },
    {
        id: 4,
        type: "text",
        quote:
            "We invite you to a shared Slack channel, giving you direct, real-time access to your assigned team, just like they're in-house.",
        author: {
            name: "Rehan Ahmed",
            role: "CEO @Moodify.io",
            avatar: "https://i.pravatar.cc/40?img=14",
        },
    },
];

/* ─── Animation variants ─── */
const containerVariants: Variants = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.12 },
    },
};

const cardVariants: Variants = {
    hidden: { opacity: 0, y: 28 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
    },
};

const headerVariants: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

/* ─── Author row ─── */
function AuthorRow({ author }: { author: Testimonial["author"] }) {
    return (
        <div className="flex items-center gap-2.5 mt-auto pt-4">
            <div className="relative w-9 h-9 rounded-full overflow-hidden ring-2 ring-white shadow-sm flex-shrink-0">
                <Image src={author.avatar} alt={author.name} fill className="object-cover" />
            </div>
            <div className="min-w-0">
                <p className="text-sm font-semibold text-[#0f172a] leading-tight truncate">
                    {author.name}
                </p>
                <div className="flex items-center gap-1">
                    <span className="text-xs text-[#64748b] truncate">{author.role}</span>
                    <BadgeCheck className="w-3.5 h-3.5 text-[#3b82f6] flex-shrink-0" />
                </div>
            </div>
        </div>
    );
}

/* ─── Text card ─── */
function TextCard({ testimonial }: { testimonial: Testimonial }) {
    return (
        <motion.div
            variants={cardVariants}
            whileHover={{ y: -3, boxShadow: "0 8px 30px rgba(0,0,0,0.08)" }}
            transition={{ duration: 0.2 }}
            className="group bg-white border border-[#e2e8f0] rounded-2xl p-6 flex flex-col h-full shadow-sm"
        >
            {/* Quote icon */}
            <div className="text-[#cbd5e1] mb-4">
                <svg width="28" height="20" viewBox="0 0 28 20" fill="currentColor">
                    <path d="M0 20V12.4C0 8.93333 0.833333 6.06667 2.5 3.8C4.2 1.53333 6.7 0.133333 10 0L11.2 2C9.06667 2.4 7.4 3.33333 6.2 4.8C5.06667 6.2 4.5 7.86667 4.5 9.8H8V20H0ZM16.8 20V12.4C16.8 8.93333 17.6333 6.06667 19.3 3.8C21 1.53333 23.5 0.133333 26.8 0L28 2C25.8667 2.4 24.2 3.33333 23 4.8C21.8667 6.2 21.3 7.86667 21.3 9.8H24.8V20H16.8Z" />
                </svg>
            </div>

            <p className="text-[#1e293b] text-[15px] leading-relaxed font-medium flex-1">
                {testimonial.quote}
            </p>

            <AuthorRow author={testimonial.author} />
        </motion.div>
    );
}

/* ─── Video card ─── */
function VideoCard({ testimonial }: { testimonial: Testimonial }) {
    return (
        <motion.div
            variants={cardVariants}
            whileHover={{ y: -3, boxShadow: "0 8px 30px rgba(0,0,0,0.12)" }}
            transition={{ duration: 0.2 }}
            className="group relative bg-[#0f172a] border border-[#1e293b] rounded-2xl overflow-hidden flex flex-col shadow-sm cursor-pointer"
        >
            {/* Thumbnail */}
            <div className="relative flex-1 min-h-[220px]">
                <Image
                    src={testimonial.videoThumb!}
                    alt="Video testimonial"
                    fill
                    className="object-cover opacity-80 group-hover:opacity-90 transition-opacity duration-300"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                {/* Play button */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-14 h-14 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-xl"
                    >
                        <Play className="w-5 h-5 text-[#0f172a] ml-0.5" fill="#0f172a" />
                    </motion.div>
                </div>
            </div>

            {/* Author on dark bg */}
            <div className="p-4 bg-white border-t border-[#e2e8f0]">
                <AuthorRow author={testimonial.author} />
            </div>
        </motion.div>
    );
}

/* ─── Main Section ─── */
export default function TestimonialsSection() {
    return (
        <section className="w-full bg-[#f8fafc] py-20 px-4 font-[Inter,system-ui,sans-serif]">
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <motion.div
                    className="text-center mb-14"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-80px" }}
                    variants={containerVariants}
                >
                    {/* Eyebrow */}
                    <motion.div variants={headerVariants} className="inline-flex items-center gap-2 mb-5">
                        <span className="h-px w-5 bg-[#94a3b8]" />
                        <span className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#64748b] border border-[#e2e8f0] bg-white px-3 py-1.5 rounded-full">
              Testimonials
            </span>
                        <span className="h-px w-5 bg-[#94a3b8]" />
                    </motion.div>

                    {/* Title */}
                    <motion.h2
                        variants={headerVariants}
                        className="text-[2.6rem] sm:text-5xl font-extrabold text-[#0f172a] leading-[1.08] tracking-tight max-w-2xl mx-auto uppercase"
                    >
                        Proof That We Deliver,{" "}
                        <span className="text-[#0f172a]">Straight Up</span>
                    </motion.h2>
                </motion.div>

                {/* Cards grid */}
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-60px" }}
                    variants={containerVariants}
                >
                    {testimonials.map((t) =>
                        t.type === "video" ? (
                            <VideoCard key={t.id} testimonial={t} />
                        ) : (
                            <TextCard key={t.id} testimonial={t} />
                        )
                    )}
                </motion.div>
            </div>
        </section>
    );
}