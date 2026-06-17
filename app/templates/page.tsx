"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, Code, Copy, Check } from "lucide-react";
import Navbar from "@/components/navbar";
import { Footer } from "@/components/footer";
import registryJson from "@/registry.json";
import { RegistryItem } from "@/lib/block-categories";
import { ComponentPreview } from "@/components/ComponentPreview";

const registry = registryJson as { items: RegistryItem[] };

// Filter templates from registry
const templates = registry.items.filter((item) =>
  item.name.toLowerCase().includes("template"),
);

interface TemplateItem {
  id: string;
  title: string;
  description: string;
  name: string;
}

const templateItems: TemplateItem[] = templates.map((item) => ({
  id: item.name,
  title: item.title || item.name,
  description: item.description || "Template example",
  name: item.name,
}));

// Custom Badge Component
function Badge({
  children,
  variant = "default",
  className = "",
}: {
  children: React.ReactNode;
  variant?: "default" | "secondary" | "outline" | "premium";
  className?: string;
}) {
  const baseStyles =
    "inline-flex items-center px-2.5 py-1 rounded text-xs font-semibold";
  const variants = {
    default: "bg-foreground text-background",
    secondary: "bg-muted text-muted-foreground",
    outline: "border border-border text-foreground bg-transparent",
    premium: "bg-green-500 text-white",
  };
  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}

// Template Card Component
function TemplateCard({ template }: { template: TemplateItem }) {
  const [showPreview, setShowPreview] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`<${template.name} />`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
      className="group"
    >
      <div className="border border-gray-200 rounded-lg overflow-hidden bg-white hover:border-gray-300 transition-colors">
        {/* Preview Section */}
        <div className="aspect-video bg-gray-50 overflow-hidden relative">
          {showPreview && (
            <ComponentPreview
              registryItem={templates.find((t) => t.name === template.name)!}
            />
          )}
          {!showPreview && (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <button
                onClick={() => setShowPreview(true)}
                className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-md hover:bg-black/90 transition-colors"
              >
                <Eye size={16} />
                Preview
              </button>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-sm font-semibold text-black">
                {template.title}
              </h3>
              <p className="text-xs text-gray-600 mt-1">
                {template.description}
              </p>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded transition-colors flex-1"
            >
              {copied ? (
                <>
                  <Check size={14} />
                  Copied!
                </>
              ) : (
                <>
                  <Copy size={14} />
                  Copy
                </>
              )}
            </button>
            <Link
              href={`/templates/${template.name}`}
              className="flex items-center gap-1 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded transition-colors flex-1"
            >
              <Code size={14} />
              View Code
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function TemplatesPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 pt-6 sm:pt-10 pb-16 sm:pb-20 border-x border-gray-200">
        {/* ── Breadcrumb ── */}
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-6 sm:mb-10">
          <Link href="/" className="hover:text-black transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-gray-600">Templates</span>
        </div>

        {/* ── Hero ── */}
        <div className="mb-6 sm:mb-10">
          <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-black mb-2 sm:mb-3 leading-tight">
            Bag/UI Templates —{" "}
            <span className="text-gray-400">
              {templateItems.length}+ Free &amp; Pro
            </span>
          </h1>
          <p className="text-gray-500 text-sm sm:text-base leading-relaxed max-w-2xl">
            Explore complete, production-ready website templates built with
            shadcn/ui, Tailwind CSS, and React. Launch modern landing pages,
            dashboards, SaaS apps, and more in minutes.
          </p>
        </div>

        {/* ── Templates Grid ── */}
        {templateItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templateItems.map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No templates available yet.</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
