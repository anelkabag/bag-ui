"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/navbar";
import {Footer} from "@/components/footer";

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

// Custom Button Component
function Button({
  children,
  variant = "default",
  size = "md",
  className = "",
  ...props
}: {
  children: React.ReactNode;
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "md";
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-colors rounded-md focus:outline-none disabled:opacity-50";
  const variants = {
    default: "bg-foreground text-background hover:bg-foreground/90",
    outline: "border border-border text-foreground hover:bg-muted",
    ghost: "text-foreground hover:bg-muted/50",
  };
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
  };
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
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
          <span className="text-gray-600">Blocks</span>
        </div>

          {/* ── Hero ── */}
          <div className="mb-6 sm:mb-10">
              <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-black mb-2 sm:mb-3 leading-tight">
                  Bag/UI Templates —{" "}
                  <span className="text-gray-400">{}+ Free &amp; Pro</span>
              </h1>
              <p className="text-gray-500 text-sm sm:text-base leading-relaxed max-w-2xl">
                  Explore complete, production-ready website templates built with
                  shadcn/ui, Tailwind CSS, and React. Launch modern landing pages,
                  dashboards, SaaS apps, and more in minutes.
              </p>
          </div>

      </div>
        <Footer/>
    </div>
  );
}
