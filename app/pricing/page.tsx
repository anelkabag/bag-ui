"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import Navbar from "@/components/navbar";
import { Footer } from "@/components/footer";

const plans = [
  {
    id: "monthly",
    label: "Pro Monthly",
    badge: null,
    price: "$9",
    period: "/month",
    description: "For developers who want to try before committing.",
    cta: "Get started",
    ctaHref: "/access",
    features: [
      "Every block in the catalog",
      "All templates included",
      "Full TypeScript source",
      "Commercial license",
      "Email support",
    ],
    highlight: false,
  },
  {
    id: "yearly",
    label: "Pro Yearly",
    badge: "Best value",
    price: "$79",
    period: "/year",
    description: "Save over 30% compared to monthly. Most popular choice.",
    cta: "Get yearly access",
    ctaHref: "/access",
    features: [
      "Every block in the catalog",
      "All templates included",
      "Full TypeScript source",
      "Commercial license, unlimited projects",
      "Priority support",
      "All future blocks & templates",
    ],
    highlight: true,
  },
  {
    id: "lifetime",
    label: "Lifetime",
    badge: "One-time",
    price: "$149",
    period: " once",
    description: "Pay once. Own everything forever. No renewals, ever.",
    cta: "Get lifetime access",
    ctaHref: "/access",
    features: [
      "Everything in Pro Yearly",
      "Lifetime updates — included automatically",
      "All future blocks, forever",
      "Full TypeScript source",
      "Commercial license, unlimited projects",
      "Priority support",
    ],
    highlight: false,
  },
];

export default function PricingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

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
                  Pricing
              </p>

              <h1 className="text-6xl font-bold tracking-tight text-black mb-4">
                  Build faster. Pay once.
              </h1>

              <p className="text-gray-500 text-sm max-w-xl leading-relaxed mx-auto">
                  Get lifetime access to every block and template. No recurring fees,
                  no hidden costs, and no limitations — just everything you need to build
                  faster and launch with confidence.
              </p>
          </motion.div>

        <div className="border-t border-gray-100 mb-10" />

        {/* Plans grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.08 }}
              className={`relative flex flex-col rounded-xl border p-6 ${
                plan.highlight
                  ? "border-black bg-black text-white"
                  : "border-gray-200 bg-white text-black"
              }`}
            >
                {plan.badge && (
                    <span
                        className="absolute -top-3 left-5 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-green-200 border border-green-300 text-green-600"
                    >
                        {plan.badge}
                    </span>
                )}

              {/* Label */}
              <p
                className={`text-xs uppercase tracking-widest font-medium mb-4 ${
                  plan.highlight ? "text-gray-400" : "text-gray-400"
                }`}
              >
                {plan.label}
              </p>

              {/* Price */}
              <div className="flex items-end gap-1 mb-1">
                <span className="text-4xl font-bold tracking-tight">
                  {plan.price}
                </span>
                <span
                  className={`text-sm mb-1 ${
                    plan.highlight ? "text-gray-400" : "text-gray-400"
                  }`}
                >
                  {plan.period}
                </span>
              </div>

              <p
                className={`text-sm mb-6 leading-relaxed ${
                  plan.highlight ? "text-gray-300" : "text-gray-500"
                }`}
              >
                {plan.description}
              </p>

              {/* CTA */}
              <Link
                href={plan.ctaHref}
                className={`w-full text-center text-sm font-medium py-2.5 rounded-lg transition-all mb-6 ${
                  plan.highlight
                    ? "bg-white text-black hover:bg-gray-100"
                    : "bg-black text-white hover:bg-gray-800"
                }`}
              >
                {plan.cta}
              </Link>

              {/* Divider */}
              <div
                className={`border-t mb-5 ${
                  plan.highlight ? "border-white/10" : "border-gray-100"
                }`}
              />

              {/* Features */}
              <p
                className={`text-[11px] uppercase tracking-widest font-semibold mb-3 ${
                  plan.highlight ? "text-gray-400" : "text-gray-400"
                }`}
              >
                What you get
              </p>
              <ul className="space-y-2.5 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <Check
                      size={14}
                      className={`mt-0.5 shrink-0 ${
                        plan.highlight ? "text-white" : "text-black"
                      }`}
                    />
                    <span
                      className={`text-sm ${
                        plan.highlight ? "text-gray-200" : "text-gray-600"
                      }`}
                    >
                      {f}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
          <p className="text-xs text-gray-400 text-center mb-16">
              Digital products are non-refundable. Have a question before purchasing?{" "}
              <a
                  href="mailto:anelka.bag@gmail.com"
                  className="underline underline-offset-2 text-gray-500 hover:text-black transition-colors"
              >
                  Reach out
              </a>{" "}
              or try the free blocks first.
          </p>
      </div>

      <Footer />
    </div>
  );
}
