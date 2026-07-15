"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";
import { FaGithub } from "react-icons/fa6";
import Navbar from "@/components/navbar";
import { Footer } from "@/components/footer";

const perks = [
  "Your name (or logo) featured on the sponsors page",
  "Priority access to discuss upcoming features",
  "The satisfaction of keeping the project 100% open source",
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 pt-10 pb-4 border-x border-gray-200">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-18 text-center m-6"
        >
          <p className="text-sm tracking-[0.25em] text-gray-500 mb-4">
            Open Source
          </p>

          <h1 className="text-6xl font-bold tracking-tight text-black mb-4">
            Free. Forever.
          </h1>

          <p className="text-gray-500 text-sm max-w-xl leading-relaxed mx-auto">
            The project is now 100% open source. Every block, every template,
            the full source code &mdash; free to use, no account required, no
            limits. If the project helps you out, you can support its
            development below.
          </p>
        </motion.div>

        <div className="border-t border-gray-100 mb-10" />

        {/* Sponsor card */}
        <div className="max-w-xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="relative flex flex-col rounded-xl border border-black bg-black text-white p-8"
          >
            <span className="absolute -top-3 left-6 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-green-200 border border-green-300 text-green-600">
              Optional
            </span>

            <div className="flex items-center gap-2 mb-4">
              <Heart size={18} className="text-white" />
              <p className="text-xs uppercase tracking-widest font-medium text-gray-400">
                Sponsor the project
              </p>
            </div>

            <p className="text-2xl font-bold tracking-tight mb-2">Any amount</p>

            <p className="text-sm mb-6 leading-relaxed text-gray-300">
              No obligation, no strings attached &mdash; just a way to say
              thanks and help fund the time spent building this project.
            </p>

            <Link
              href="https://github.com/sponsors/anelkabag"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 text-center text-sm font-medium py-2.5 rounded-lg transition-all mb-6 bg-white text-black hover:bg-gray-100"
            >
              <FaGithub size={16} />
              Become a sponsor on GitHub
            </Link>

            <div className="border-t border-white/10 mb-5" />

            <p className="text-[11px] uppercase tracking-widest font-semibold mb-3 text-gray-400">
              As a sponsor
            </p>
            <ul className="space-y-2.5">
              {perks.map((p) => (
                <li key={p} className="flex items-start gap-2.5">
                  <Sparkles size={14} className="mt-0.5 shrink-0 text-white" />
                  <span className="text-sm text-gray-200">{p}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <p className="text-xs text-gray-400 text-center mb-16">
          Got a question, an idea, or want to contribute?{" "}
          <a
            href="mailto:anelka.bag@gmail.com"
            className="underline underline-offset-2 text-gray-500 hover:text-black transition-colors"
          >
            Reach out
          </a>{" "}
          or open an issue on the GitHub repo.
        </p>
      </div>

      <Footer />
    </div>
  );
}
