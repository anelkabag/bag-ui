"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, Moon, Sun } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import UserMenu from "@/components/auth/UserMenu";
import UnauthNav from "@/components/auth/UnauthNav";

const NAV_LINKS = [
  { label: "Blocks", href: "/blocks" },
  { label: "Templates", href: "/templates" },
  // { label: "Components", href: "/components" },
  { label: "Changelog", href: "/changelog" },
  { label: "Pricing", href: "/pricing" },
  { label: "Docs", href: "/docs" },
] as const;

const VS_CODE_MARKETPLACE_URL =
  "https://marketplace.visualstudio.com/items?itemName=bagui.bagui-vscode";

const Logo = () => (
  <div className="flex items-center gap-2 shrink-0">
    <Link href="/" className="flex items-center gap-2">
      <div className="relative h-5 w-5 shrink-0">
        {/* Light Logo */}
        <Image
          src="/logo.png"
          alt="BagUi Logo"
          fill
          priority
          className="object-contain dark:hidden"
        />

        {/* Dark Logo */}
        <Image
          src="/logoW.png"
          alt="BagUi Logo"
          fill
          priority
          className="hidden object-contain dark:block"
        />
      </div>

      <span className="text-[15px] font-semibold tracking-tight text-foreground">
        BagUi
      </span>
    </Link>

    <Link
      href="https://x.com/anelkabag"
      target="_blank"
      rel="noopener noreferrer"
      className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
    >
      by Anelka
    </Link>
  </div>
);

const NavLink = ({
  href,
  label,
  external,
  size = "sm",
  onClick,
}: {
  href: string;
  label: string;
  external?: boolean;
  size?: "sm" | "xs";
  onClick?: () => void;
}) => (
  <Link
    href={href}
    onClick={onClick}
    className={`relative ${size === "xs" ? "text-[13px]" : "text-sm"} font-medium text-muted-foreground transition-colors duration-150 hover:text-foreground group inline-flex items-baseline gap-0.5`}
  >
    {label}
    {external && (
      <sup className="text-[10px] text-muted-foreground leading-none">↗</sup>
    )}
    <span className="absolute left-0 -bottom-0.5 h-[1.5px] w-0 bg-foreground transition-all duration-300 group-hover:w-full" />
  </Link>
);

function ResourcesMenu() {
  return (
    <details className="group relative">
      <summary className="flex cursor-pointer list-none items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground [&::-webkit-details-marker]:hidden">
        Resources
        <ChevronDown
          size={14}
          className="transition-transform group-open:rotate-180"
          aria-hidden="true"
        />
      </summary>
      <div className="absolute right-0 top-full z-50 mt-3 w-64 rounded-xl border border-border bg-background p-2 shadow-lg">
        <Link
          href="/docs#mcp"
          className="block rounded-lg px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          <span className="block">BagUI MCP</span>
          <span className="mt-1 block text-xs font-normal text-muted-foreground">
            Connect BagUI to your AI assistant
          </span>
        </Link>
        <Link
          href={VS_CODE_MARKETPLACE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 block rounded-lg bg-foreground px-3 py-2.5 text-sm font-semibold text-background transition-opacity hover:opacity-85"
        >
          Download for VS Code <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </details>
  );
}

function getInitialTheme(): "dark" | "light" {
  if (typeof window === "undefined") {
    return "dark";
  }

  const savedTheme = window.localStorage.getItem("bagui-theme");
  return savedTheme === "light" || savedTheme === "dark" ? savedTheme : "dark";
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {});

  return (
    <>
      <div className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-sm">
        <nav className="max-w-7xl mx-auto flex h-14 items-center justify-between border-x border-border px-8">
          <Logo />

          <div className="hidden md:flex items-center gap-7">
            {NAV_LINKS.map((item) => (
              <NavLink key={item.href} {...item} />
            ))}
            <ResourcesMenu />
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2">
              {user ? <UserMenu /> : <UnauthNav />}
            </div>
            <button
              className="md:hidden p-2 text-foreground"
              onClick={() => setMobileOpen((v) => !v)}
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? "✕" : "☰"}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden fixed inset-0 z-40 ${
          mobileOpen ? "flex" : "hidden"
        } flex-col overflow-y-auto bg-background px-6 pt-24 pb-10`}
      >
        <nav className="flex flex-col gap-1 flex-1">
          {NAV_LINKS.map((item) => (
            <div key={item.href}>
              <Link
                href={item.href}
                className="block py-3 text-[38px] font-extrabold leading-none tracking-tight text-foreground transition-opacity hover:opacity-60"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            </div>
          ))}
          <div className="mt-5 border-t border-border pt-5">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Resources
            </p>
            <Link
              href="/docs#mcp"
              onClick={() => setMobileOpen(false)}
              className="block py-2 text-lg font-semibold text-foreground"
            >
              BagUI MCP
            </Link>
            <Link
              href={VS_CODE_MARKETPLACE_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileOpen(false)}
              className="block py-2 text-lg font-semibold text-foreground"
            >
              Download for VS Code ↗
            </Link>
          </div>
        </nav>
        <div className="flex flex-col gap-3">
          {user ? (
            <button
              onClick={() => {
                setMobileOpen(false);
                window.location.href = "/account";
              }}
              className="w-full py-4 rounded-xl border border-border text-foreground text-[14px] font-bold flex items-center justify-center hover:bg-muted transition-colors"
            >
              Account
            </button>
          ) : (
            <>
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="w-full py-4 rounded-xl border border-border text-foreground text-[14px] font-bold flex items-center justify-center hover:bg-muted transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileOpen(false)}
                className="w-full py-4 rounded-xl bg-black text-white text-[14px] font-bold flex items-center justify-center hover:bg-gray-800 transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}
