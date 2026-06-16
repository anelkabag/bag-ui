'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, CodeXml, Sun, Moon } from 'lucide-react';
import Link from "next/link";

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
};

const staggerContainer = {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: { once: true },
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
};

const staggerItem = {
    initial: { opacity: 0, y: 10 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
};

export default function OpenAgents() {
    const [dark, setDark] = useState(false);

    const toggle = () => {
        setDark(!dark);
        document.documentElement.classList.toggle('dark', !dark);
    };

    const bg = dark ? 'bg-black' : 'bg-white';
    const text = dark ? 'text-white' : 'text-black';
    const border = dark ? 'border-white/10' : 'border-black/10';
    const muted = dark ? 'text-white/50' : 'text-black/50';
    const subtle = dark ? 'text-white/70' : 'text-black/70';
    const btnPrimary = dark ? 'bg-white text-black hover:bg-white/90' : 'bg-black text-white hover:bg-black/80';
    const btnOutline = dark ? 'border-white/20 hover:border-white/60' : 'border-black/20 hover:border-black/60';
    const cardBg = dark ? 'bg-white/5' : 'bg-black/5';
    const logoSrc = dark
        ? "https://bagui.vercel.app/faviconblack.png"
        : "https://bagui.vercel.app/faviconwhite.png";

    return (
        <div className={`min-h-screen ${bg} ${text} transition-colors duration-300`}>
            {/* Navigation */}
            <nav className={`sticky top-0 z-50 border-b ${border} ${bg}/80 backdrop-blur-md`}>
                <div className={`max-w-7xl mx-auto px-6 h-16 flex items-center justify-between border-x ${border}`}>
                    <div className="flex items-center gap-3 shrink-0">
                        <Link href="/" className="flex items-center gap-2">
                            <img src={logoSrc} alt="BagUI Logo" width={30} height={30} />
                            <span className={`text-sm font-semibold tracking-tight ${text}`}>Bag\Ui</span>
                        </Link>
                        <Link
                            href="https://x.com/anelkabag"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`text-xs ${muted} hover:${text} transition-colors`}
                        >
                            by Anelka
                        </Link>
                    </div>
                    <div className="flex items-center gap-8">
                        <Link href="/docs" className={`text-sm ${muted} hover:${text} transition-colors`}>Docs</Link>
                        <Link href="/pricing" className={`text-sm ${muted} hover:${text} transition-colors`}>Pricing</Link>
                        <Link href="/blog" className={`text-sm ${muted} hover:${text} transition-colors`}>Blog</Link>
                    </div>
                </div>
            </nav>

            <div className={`max-w-7xl mx-auto px-6 border-x border-b ${border}`}>
                {/* Hero */}
                <motion.section
                    className="pt-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="max-w-2xl">
                        <motion.h1
                            className="text-5xl md:text-6xl font-bold mb-6 leading-tight tracking-tight"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                        >
                            Open Agents.
                        </motion.h1>
                        <motion.p
                            className={`text-lg ${muted} mb-8 leading-relaxed`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            Spawn coding agents that run infinitely in the cloud.
                            <br />
                            Powered by AI SDK, Gateway, Sandbox, and Workflow SDK.
                        </motion.p>
                        <motion.div
                            className="flex items-center gap-4 mb-10"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                        >
                            <button className={`px-6 py-3 ${btnPrimary} text-sm font-medium rounded-lg transition flex items-center gap-2 cursor-pointer`}>
                                <span>Sign in with Bag\Ui</span>
                                <ChevronRight size={16} />
                            </button>
                            <button className={`px-6 py-3 border ${btnOutline} text-sm font-medium rounded-lg transition flex items-center gap-2 cursor-pointer`}>
                                <CodeXml size={24} />
                                <span>Open Source</span>
                            </button>
                        </motion.div>
                    </div>
                </motion.section>

                {/* Featured Image */}
                <motion.section {...fadeInUp}>
                    <div className={`aspect-video ${cardBg} rounded-xl overflow-hidden mb-10`}>
                        <div className={`w-full h-full flex items-center justify-center ${muted} text-sm`}>
                            [Dashboard Preview]
                        </div>
                    </div>
                </motion.section>
            </div>

            {/* Feature 1 */}
            <motion.section className={`max-w-7xl mx-auto px-6 py-20 border-x border-b ${border}`} {...fadeInUp}>
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-4xl font-bold mb-6 leading-tight">Agents that ship real code.</h2>
                        <p className={`${muted} mb-6 leading-relaxed`}>
                            Each agent gets a full sandbox environment with filesystem, networks, and runtime access. Describe what to build and let the agent work autonomously until it's done.
                        </p>
                        <ul className={`space-y-3 ${subtle}`}>
                            <li className="flex gap-3"><span>•</span><span>File ops, search, shell, and task delegation built in</span></li>
                            <li className="flex gap-3"><span>•</span><span>Explorer and executor subagents for parallel work</span></li>
                            <li className="flex gap-3"><span>•</span><span>Multi-model support with AI Gateway</span></li>
                        </ul>
                    </div>
                    <motion.div
                        className={`aspect-video ${cardBg} rounded-xl`}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className={`w-full h-full flex items-center justify-center ${muted} text-sm`}>[Code Preview]</div>
                    </motion.div>
                </div>
            </motion.section>

            {/* Feature 2 */}
            <motion.section className={`max-w-7xl mx-auto px-6 py-20 border-x border-b ${border}`} {...fadeInUp}>
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <motion.div
                        className={`aspect-video ${cardBg} rounded-xl order-last md:order-first`}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className={`w-full h-full flex items-center justify-center ${muted} text-sm`}>[Sandbox Preview]</div>
                    </motion.div>
                    <div className="order-first md:order-last">
                        <h2 className="text-4xl font-bold mb-6 leading-tight">Cloud sandboxes, not local machines.</h2>
                        <p className={`${muted} mb-6 leading-relaxed`}>
                            Every session runs in an isolated Vercel sandbox with its own filesystem. Work is committed and pushed automatically — nothing is lost when the sandbox expires.
                        </p>
                        <ul className={`space-y-3 ${subtle}`}>
                            <li className="flex gap-3"><span>•</span><span>Ephemeral environments with full git integration</span></li>
                            <li className="flex gap-3"><span>•</span><span>Auto-hibernation on inactivity, instant restore</span></li>
                            <li className="flex gap-3"><span>•</span><span>Snapshot and restore filesystem state</span></li>
                        </ul>
                    </div>
                </div>
            </motion.section>

            {/* Feature 3 */}
            <motion.section className={`max-w-7xl mx-auto px-6 py-20 border-x border-b ${border}`} {...fadeInUp}>
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-4xl font-bold mb-6 leading-tight">Durable workflows that survive anything.</h2>
                        <p className={`${muted} mb-6 leading-relaxed`}>
                            Agent loops run as durable workflows that survive restarts, retry on failure, and coordinate multi-step operations over time. No work is ever lost mid-run.
                        </p>
                        <ul className={`space-y-3 ${subtle}`}>
                            <li className="flex gap-3"><span>•</span><span>Resumable agent loops with automatic checkpointing</span></li>
                            <li className="flex gap-3"><span>•</span><span>Post-finish usage tracking, off caching, auto-commit</span></li>
                            <li className="flex gap-3"><span>•</span><span>Reconnect to running workflows from any client</span></li>
                        </ul>
                    </div>
                    <motion.div
                        className={`aspect-video ${cardBg} rounded-xl`}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className={`w-full h-full flex items-center justify-center ${muted} text-sm`}>[Workflow Preview]</div>
                    </motion.div>
                </div>
            </motion.section>

            {/* Infrastructure */}
            <motion.section className={`max-w-7xl mx-auto px-6 pt-10 border-x ${border}`} {...fadeInUp}>
                <div className="max-w-7xl mx-auto px-6 py-20">
                    <div className="grid md:grid-cols-2 gap-12 items-start">
                        <div>
                            <h2 className="text-5xl md:text-6xl font-bold leading-tight tracking-tight">Infrastructure that ships.</h2>
                        </div>
                        <div className="space-y-6">
                            <p className={`${subtle} text-base leading-relaxed`}>
                                Built on production-grade primitives from the Vercel ecosystem. No synthetic demos — real infrastructure for real agents.
                            </p>
                            <button className={`px-6 py-3 ${btnPrimary} text-sm font-medium rounded-lg transition flex items-center gap-2`}>
                                <span>▲</span>
                                <span>Sign in with Vercel</span>
                            </button>
                        </div>
                    </div>
                </div>

                <motion.div
                    className={`w-full border-t ${border}`}
                    variants={staggerContainer}
                    initial="initial"
                    whileInView="whileInView"
                    viewport={{ once: true }}
                >
                    <div className="grid md:grid-cols-4">
                        {[
                            { number: '001', title: 'AI SDK', description: 'Unified interface across models. Switch providers, stream responses, and call tools with a single API.' },
                            { number: '002', title: 'AI Gateway', description: 'Route requests across providers with built-in fallbacks, rate limiting, and observability.' },
                            { number: '003', title: 'Sandbox', description: 'Secure, isolated environments for every session. Full filesystem, network, and runtime access.' },
                            { number: '004', title: 'Workflow SDK', description: 'Durable, resumable agent workflows that survive restarts and coordinate multi-step operations.' }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                className={`px-6 py-12 ${i < 3 ? `border-r ${border}` : ''}`}
                                variants={staggerItem}
                            >
                                <div className={`text-xs ${muted} font-mono tracking-wider mb-6`}>{item.number}</div>
                                <div className={`w-8 h-8 mb-6 ${muted}`}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <rect x="4" y="4" width="5" height="5" />
                                        <rect x="15" y="4" width="5" height="5" />
                                        <rect x="4" y="15" width="5" height="5" />
                                        <rect x="15" y="15" width="5" height="5" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-bold mb-3">{item.title}</h3>
                                <p className={`text-sm ${muted} leading-relaxed`}>{item.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </motion.section>

            <motion.section className={`w-full border-t ${border}`} {...fadeInUp}>
                <div className={`text-center max-w-7xl mx-auto px-6 py-24 border-x ${border}`}>
                    <p className={`${muted} text-sm mb-6`}>
                        Built on production-grade primitives from the Vercel ecosystem.
                        No synthetic demos — real infrastructure for real agents.
                    </p>
                    <button className={`px-6 py-3 ${btnPrimary} text-sm font-medium rounded-lg transition flex items-center gap-2 mx-auto`}>
                        <span>Sign in with Vercel</span>
                        <ChevronRight size={16} />
                    </button>
                </div>
            </motion.section>

            {/* Footer */}
            <footer className={`w-full border-t ${border}`}>
                <div className={`max-w-7xl mx-auto px-6 pt-10 border-x ${border}`}>
                    <div className="grid md:grid-cols-3 gap-16 mb-12">
                        <div>
                            <h4 className={`text-xs font-semibold ${muted} uppercase tracking-widest mb-4`}>Open Agents</h4>
                            <p className={`text-sm ${subtle} leading-relaxed`}>Open Agents for shipping code.</p>
                        </div>
                        <div>
                            <h4 className={`text-xs font-semibold ${muted} uppercase tracking-widest mb-6`}>Product</h4>
                            <ul className={`space-y-3 text-sm ${subtle}`}>
                                <li><a href="#" className={`hover:${text} transition`}>AI SDK</a></li>
                                <li><a href="#" className={`hover:${text} transition`}>AI Gateway</a></li>
                                <li><a href="#" className={`hover:${text} transition`}>Sandbox</a></li>
                                <li><a href="#" className={`hover:${text} transition`}>Workflow SDK</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className={`text-xs font-semibold ${muted} uppercase tracking-widest mb-6`}>Links</h4>
                            <ul className={`space-y-3 text-sm ${subtle}`}>
                                <li><a href="#" className={`hover:${text} transition`}>GitHub</a></li>
                                <li><a href="#" className={`hover:${text} transition`}>Vercel</a></li>
                                <li><a href="#" className={`hover:${text} transition`}>AI SDK Docs</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className={`border-t ${border} pt-12 pb-10 flex items-center justify-between`}>
                        <Link href="/">
                            <img src={logoSrc} width={30} height={30} />
                        </Link>
                        <button
                            onClick={toggle}
                            className={`p-2 rounded-full border cursor-pointer ${btnOutline} transition`}
                            aria-label="Toggle theme"
                        >
                            {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        </button>
                    </div>
                </div>
            </footer>
        </div>
    );
}