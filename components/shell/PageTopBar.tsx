"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { FaGithub } from "react-icons/fa6";
import { Star } from "lucide-react";

export default function PageTopBar() {
  const { user } = useAuth();
  const [stars, setStars] = useState<number | null>(null);

  const link =
    "text-[15px] text-muted-foreground transition-colors hover:text-foreground";

  useEffect(() => {
    fetch("https://api.github.com/repos/anelkabag/bag-ui")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch GitHub stars");
        return res.json();
      })
      .then((data) => setStars(data.stargazers_count))
      .catch(() => setStars(null));
  }, []);

  return (
    <div className="mx-auto flex h-14 max-w-[1440px] items-center justify-end gap-6 px-6">
      <a
        href="https://github.com/anelkabag/bag-ui"
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-2 ${link}`}
      >
        <FaGithub size={17} />

        {stars !== null ? (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[12px] font-medium text-foreground transition-colors hover:bg-white/[0.08]">
            <Star size={13} className="fill-yellow-400 text-yellow-400" />
            <span>{stars.toLocaleString("en-US")}</span>
            <span className="text-muted-foreground">Stars</span>
          </span>
        ) : (
          <span>GitHub</span>
        )}
      </a>

      <a
        href={"/pricing"}
        target="_blank"
        rel="noopener noreferrer"
        className={link}
      >
        Become a Sponsor
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
          <Link
            href="/register"
            className="text-[15px] font-medium text-foreground"
          >
            Sign up
          </Link>
        </>
      )}
    </div>
  );
}
