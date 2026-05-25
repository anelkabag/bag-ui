"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import Navbar from "@/components/navbar";
import Hero from "@/components/Hero";
import BlocksCatalog from "@/components/Blockscatalog";

export default function Page() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  const pathname = usePathname();

  return (
    <>
      <Navbar />
      <Hero />
      <BlocksCatalog key={pathname} />
    </>
  );
}
