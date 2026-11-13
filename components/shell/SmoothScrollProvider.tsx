"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  useEffect(() => {
    const shellScroller = document.getElementById("main");
    const lenis = new Lenis({
      ...(shellScroller
        ? { wrapper: shellScroller, content: shellScroller }
        : {}),
      autoRaf: true,
      lerp: 0.12,
      wheelMultiplier: 0.9,
      smoothWheel: true,
      syncTouch: false,
      anchors: true,
      stopInertiaOnNavigate: true,
      respectReducedMotion: true,
      prevent: (node) => node.hasAttribute("data-lenis-prevent"),
    });

    return () => lenis.destroy();
  }, [pathname]);

  return children;
}
