"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export default function PageTopBar() {
  const { user } = useAuth();
  const link =
    "text-[15px] text-muted-foreground transition-colors hover:text-foreground";

  return (
    <div className="mx-auto flex h-14 max-w-[1440px] items-center justify-end gap-6 px-6">
      <a
        href="https://github.com/anelkabag/bag-ui"
        target="_blank"
        rel="noopener noreferrer"
        className={link}
      >
        Star on GitHub
      </a>
      <a
        href={process.env.NEXT_PUBLIC_CHECKOUT_URL || "#"}
        target="_blank"
        rel="noopener noreferrer"
        className={link}
      >
        Become a sponsor
      </a>
      {user ? (
        <Link href="/account" className={link}>
          Account
        </Link>
      ) : (
        <>
          <Link href="/login" className={link}>
            Log in
          </Link>
          <Link href="/register" className="text-[15px] font-medium text-foreground">
            Sign up
          </Link>
        </>
      )}
    </div>
  );
}
