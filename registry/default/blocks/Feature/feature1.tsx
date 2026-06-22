"use client";

import { motion, Variants } from "framer-motion";

const containerVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

/* ══════════════════════════════════════════
   SVG ILLUSTRATIONS — Black & White only
══════════════════════════════════════════ */

function AiSvg() {
    return (
        <svg viewBox="0 0 240 170" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <polygon points="120,18 210,72 120,126 30,72" fill="white" stroke="black" strokeWidth="1.4"/>
            <polygon points="120,30 200,76 120,112 40,76" fill="#e8e8e8" stroke="#888" strokeWidth="1"/>
            <rect x="76" y="44" width="88" height="70" rx="14" fill="white" stroke="black" strokeWidth="1.6"/>
            <rect x="88" y="56" width="64" height="46" rx="9" fill="#f0f0f0" stroke="#aaa" strokeWidth="1.2"/>
            <circle cx="105" cy="73" r="6" fill="black" opacity=".15"/>
            <circle cx="127" cy="73" r="6" fill="black" opacity=".15"/>
            <circle cx="105" cy="73" r="2.5" fill="black"/>
            <circle cx="127" cy="73" r="2.5" fill="black"/>
            <path d="M100 87 Q116 95 132 87" stroke="black" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
            <line x1="120" y1="56" x2="120" y2="44" stroke="black" strokeWidth="1.3"/>
            <circle cx="120" cy="42" r="3" fill="black"/>
            <path d="M34 28 L37 22 L40 28 L37 34 Z" fill="black" opacity=".2"/>
            <path d="M196 30 L199 24 L202 30 L199 36 Z" fill="black" opacity=".2"/>
        </svg>
    );
}

function FrontEndSvg() {
    return (
        <svg viewBox="0 0 240 170" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <rect x="30" y="54" width="152" height="98" rx="12" fill="#e8e8e8" stroke="#aaa" strokeWidth="1.2" transform="rotate(-5 30 54)"/>
            <rect x="40" y="42" width="152" height="98" rx="12" fill="#f0f0f0" stroke="#888" strokeWidth="1.2" transform="rotate(-1.5 40 42)"/>
            <rect x="46" y="30" width="152" height="98" rx="12" fill="white" stroke="black" strokeWidth="1.6"/>
            <circle cx="64" cy="46" r="3.5" fill="black" opacity=".2"/>
            <circle cx="75" cy="46" r="3.5" fill="black" opacity=".4"/>
            <circle cx="86" cy="46" r="3.5" fill="black" opacity=".7"/>
            <rect x="96" y="41" width="86" height="10" rx="4" fill="#f0f0f0"/>
            <rect x="62" y="60" width="118" height="7" rx="3.5" fill="#e0e0e0"/>
            <rect x="62" y="74" width="86" height="6" rx="3" fill="#e0e0e0"/>
            <rect x="62" y="86" width="104" height="6" rx="3" fill="#e0e0e0"/>
            <rect x="62" y="98" width="68" height="6" rx="3" fill="#e0e0e0"/>
            <rect x="172" y="14" width="30" height="22" rx="6" fill="black" opacity=".08"/>
            <text x="179" y="29" fontSize="11" fill="black" fontWeight="800" fontFamily="monospace">{"<>"}</text>
        </svg>
    );
}

function BackEndSvg() {
    return (
        <svg viewBox="0 0 240 170" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <polygon points="120,128 186,92 186,108 120,144 54,108 54,92" fill="#333"/>
            <polygon points="54,92 120,128 186,92 120,56" fill="#555"/>
            <polygon points="54,92 54,108 120,144 120,128" fill="#777"/>
            <polygon points="120,100 186,64 186,80 120,116 54,80 54,64" fill="#555"/>
            <polygon points="54,64 120,100 186,64 120,28" fill="#777"/>
            <polygon points="54,64 54,80 120,116 120,100" fill="#999"/>
            <polygon points="120,72 186,36 186,52 120,88 54,52 54,36" fill="#777"/>
            <polygon points="54,36 120,72 186,36 120,0" fill="#999"/>
            <polygon points="54,36 54,52 120,88 120,72" fill="#bbb"/>
            <line x1="54" y1="92" x2="186" y2="92" stroke="white" strokeWidth="0.8" strokeDasharray="5 4" opacity=".4"/>
            <line x1="54" y1="64" x2="186" y2="64" stroke="white" strokeWidth="0.8" strokeDasharray="5 4" opacity=".4"/>
        </svg>
    );
}

function MobileSvg() {
    return (
        <svg viewBox="0 0 240 170" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <rect x="78" y="6" width="84" height="152" rx="18" fill="white" stroke="black" strokeWidth="1.6"/>
            <rect x="84" y="22" width="72" height="118" rx="7" fill="#f0f0f0"/>
            <rect x="104" y="10" width="32" height="8" rx="4" fill="#ccc"/>
            <circle cx="120" cy="60" r="8" fill="black" opacity=".12"/>
            <ellipse cx="120" cy="60" rx="20" ry="7" stroke="black" strokeWidth="1.3" fill="none"/>
            <ellipse cx="120" cy="60" rx="20" ry="7" stroke="black" strokeWidth="1.3" fill="none" transform="rotate(60 120 60)"/>
            <ellipse cx="120" cy="60" rx="20" ry="7" stroke="black" strokeWidth="1.3" fill="none" transform="rotate(-60 120 60)"/>
            <text x="102" y="96" fontSize="10" fontWeight="800" fill="black" fontFamily="Inter,sans-serif">NEXT.js</text>
            <rect x="90" y="104" width="60" height="5" rx="2.5" fill="#ccc"/>
            <rect x="90" y="114" width="44" height="5" rx="2.5" fill="#ccc"/>
            <rect x="90" y="124" width="52" height="5" rx="2.5" fill="#ccc"/>
            <rect x="106" y="148" width="28" height="3" rx="1.5" fill="#ccc"/>
        </svg>
    );
}

function CtoSvg() {
    return (
        <svg viewBox="0 0 240 170" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <circle cx="110" cy="88" r="72" fill="#f0f0f0" stroke="black" strokeWidth="1.3"/>
            <circle cx="110" cy="88" r="50" fill="#e0e0e0" stroke="#888" strokeWidth="1.1"/>
            <circle cx="110" cy="88" r="30" fill="white" stroke="black" strokeWidth="1.3"/>
            <circle cx="104" cy="80" r="7" fill="black" opacity=".5"/>
            <path d="M86 102 Q104 94 122 102" stroke="black" strokeWidth="2.2" strokeLinecap="round" fill="none" opacity=".6"/>
            <circle cx="56" cy="38" r="13" fill="white" stroke="black" strokeWidth="1.2"/>
            <circle cx="56" cy="38" r="5.5" fill="black" opacity=".12"/>
            <path d="M56 29v-4 M56 51v4 M47 38h-4 M69 38h4" stroke="black" strokeWidth="1.6" strokeLinecap="round"/>
            <path d="M49.5 31.5l-2.8-2.8 M65.3 47.3l2.8 2.8 M49.5 44.5l-2.8 2.8 M65.3 30.7l2.8-2.8" stroke="black" strokeWidth="1.2" strokeLinecap="round"/>
            <circle cx="166" cy="52" r="13" fill="white" stroke="black" strokeWidth="1.2"/>
            <path d="M170 43 L163 54 L167 54 L162 63 L170 51 L165 51 Z" fill="black" opacity=".5"/>
            <rect x="142" y="126" width="86" height="22" rx="7" fill="black" opacity=".88" transform="rotate(-14 142 126)"/>
            <text x="148" y="141" fontSize="7.5" fill="white" fontWeight="600" fontFamily="Inter,sans-serif" transform="rotate(-14 148 141)">Technical Training</text>
        </svg>
    );
}

/* ─── Features ─── */
const features = [
    { id: 1, title: "AI Development",       desc: "Custom AI solutions that transform your business operations and drive measurable results.",                    Illustration: AiSvg },
    { id: 2, title: "Front-End Development",desc: "Beautiful, responsive interfaces that provide exceptional user experiences across all devices.",               Illustration: FrontEndSvg },
    { id: 3, title: "Back-End Development", desc: "Scalable, secure backend systems that power your applications with reliability and performance.",              Illustration: BackEndSvg },
    { id: 4, title: "Mobile Development",   desc: "Native and cross-platform mobile apps that engage users and drive business growth.",                           Illustration: MobileSvg },
    { id: 5, title: "Fractional CTO",       desc: "Strategic technical leadership and guidance to accelerate your product development.",                          Illustration: CtoSvg },
];

function FeatureCard({ title, desc, Illustration }: { title: string; desc: string; Illustration: React.FC }) {
    return (
        <motion.div
            variants={cardVariants}
            whileHover={{ y: -4, boxShadow: "0 12px 36px rgba(0,0,0,0.10)" }}
            transition={{ duration: 0.2 }}
            className="bg-white border border-black/10 rounded-2xl overflow-hidden shadow-sm flex flex-col cursor-pointer"
        >
            <div className="w-full h-[160px] flex items-center justify-center p-4 bg-[#fafafa] border-b border-black/8">
                <Illustration />
            </div>
            <div className="p-5 flex flex-col gap-1.5">
                <h3 className="text-[14.5px] font-semibold text-black tracking-tight">{title}</h3>
                <p className="text-[13px] text-black/50 leading-relaxed">{desc}</p>
            </div>
        </motion.div>
    );
}

export default function FeaturesSection() {
    return (
        <section className="w-full bg-white py-20 px-4 font-[Inter,system-ui,sans-serif]">
            <div className="max-w-5xl mx-auto">
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} variants={containerVariants}>
                    {/* Row 1 — 2 cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        {features.slice(0, 2).map((f) => <FeatureCard key={f.id} {...f} />)}
                    </div>
                    {/* Row 2 — 3 cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {features.slice(2).map((f) => <FeatureCard key={f.id} {...f} />)}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}