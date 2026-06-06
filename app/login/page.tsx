"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [magicSent, setMagicSent] = useState(false);

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        await new Promise((r) => setTimeout(r, 1200));
        setLoading(false);
    };

    const handleMagicLink = async () => {
        setMagicSent(true);
        await new Promise((r) => setTimeout(r, 2000));
        setMagicSent(false);
    };

    return (
        <div className="min-h-screen bg-[#111111] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Radial glow background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-white/[0.03] blur-3xl" />
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-white/[0.02] blur-3xl" />
                <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full bg-white/[0.02] blur-3xl" />
            </div>

            {/* Card */}
            <motion.div
                initial={{ opacity: 0, y: 24, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="relative w-full max-w-[480px] bg-[#161616] border border-white/[0.07] rounded-2xl shadow-2xl shadow-black/60 overflow-hidden"
            >
                {/* Back button */}
                <div className="absolute top-5 left-5">
                    <Link href="/">
                        <motion.button
                            whileHover={{ x: -2 }}
                            className="flex items-center gap-1.5 text-white/40 hover:text-white/70 text-sm transition-colors cursor-pointer"
                        >
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path
                                    d="M10 12L6 8L10 4"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            Back
                        </motion.button>
                    </Link>
                </div>

                <div className="px-10 pt-16 pb-10">
                    {/* Logo / Icon */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.15, duration: 0.4 }}
                        className="flex justify-center mb-8"
                    >
                        <div className="items-center justify-center">
                            <Image
                                src="/faviconwhite.png"
                                alt="BagUI Logo"
                                width={50}
                                height={50}
                                className="object-contain"
                            />
                        </div>
                    </motion.div>

                    {/* Heading */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.4 }}
                        className="text-center mb-8"
                    >
                        <h1 className="text-white text-[1.65rem] font-semibold tracking-tight mb-1.5">
                            Yooo, welcome back!
                        </h1>
                        <p className="text-white/40 text-sm">
                            First time here?{" "}
                            <Link
                                href="/register"
                                className="text-white/70 hover:text-white underline underline-offset-2 transition-colors"
                            >
                                Sign up for free
                            </Link>
                        </p>
                    </motion.div>

                    {/* Form */}
                    <motion.form
                        onSubmit={handleSignIn}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.28, duration: 0.4 }}
                        className="space-y-3"
                    >
                        {/* Email */}
                        <div>
                            <input
                                type="email"
                                placeholder="Your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-[#1e1e1e] border border-white/[0.08] rounded-lg px-4 py-3 text-white/80 placeholder:text-white/25 text-sm outline-none focus:border-white/20 focus:bg-[#222] transition-all"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <input
                                type="password"
                                placeholder="Your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-[#1e1e1e] border border-white/[0.08] rounded-lg px-4 py-3 text-white/80 placeholder:text-white/25 text-sm outline-none focus:border-white/20 focus:bg-[#222] transition-all"
                            />
                        </div>

                        {/* Sign in button */}
                        <motion.button
                            type="submit"
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            disabled={loading}
                            className="w-full bg-white text-[#111] font-semibold text-sm rounded-lg py-3 flex items-center justify-center gap-2 hover:bg-white/90 transition-colors disabled:opacity-70 mt-1 cursor-pointer"
                        >
                            <AnimatePresence mode="wait">
                                {loading ? (
                                    <motion.span
                                        key="loading"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="flex items-center gap-2"
                                    >
                                        <svg
                                            className="animate-spin h-4 w-4"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            />
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8v8H4z"
                                            />
                                        </svg>
                                        Signing in…
                                    </motion.span>
                                ) : (
                                    <motion.span
                                        key="idle"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        Sign in
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </motion.button>
                    </motion.form>

                    {/* Magic link */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.35, duration: 0.4 }}
                        className="text-center mt-4"
                    >
                        <button
                            onClick={handleMagicLink}
                            className="text-white/45 hover:text-white/70 text-sm transition-colors"
                        >
                            <AnimatePresence mode="wait">
                                {magicSent ? (
                                    <motion.span
                                        key="sent"
                                        initial={{ opacity: 0, y: 4 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -4 }}
                                        className="text-emerald-400/80"
                                    >
                                        ✓ Bag\Ui link sent!
                                    </motion.span>
                                ) : (
                                    <motion.span
                                        key="idle"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        Sign in to unlock full access to Bag\Ui.
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </button>
                    </motion.div>

                    {/* Divider */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.4 }}
                        className="flex items-center gap-4 my-5"
                    >
                        <div className="flex-1 h-px bg-white/[0.06]" />
                        <span className="text-white/20 text-xs">or</span>
                        <div className="flex-1 h-px bg-white/[0.06]" />
                    </motion.div>

                    {/* SSO */}
                    <motion.button
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.45, duration: 0.4 }}
                        whileHover={{ scale: 1.01, borderColor: "rgba(255,255,255,0.15)" }}
                        whileTap={{ scale: 0.99 }}
                        className="w-full border border-white/[0.09] rounded-lg py-3 text-white/60 hover:text-white/80 text-sm font-medium transition-colors cursor-pointer"
                    >
                        Single sign-on (SSO)
                    </motion.button>

                    {/* Terms */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.4 }}
                        className="text-center text-white/20 text-xs mt-7 leading-relaxed"
                    >
                        You acknowledge that you read, and agree, to our{" "}
                        <Link href="/terms" className="text-white/35 hover:text-white/55 underline underline-offset-2 transition-colors cursor-pointer">
                            Terms of Service
                        </Link>{" "}
                        and our{" "}
                        <Link href="/privacy" className="text-white/35 hover:text-white/55 underline underline-offset-2 transition-colors cursor-pointer">
                            Privacy Policy
                        </Link>
                    </motion.p>
                </div>
            </motion.div>
        </div>
    );
}