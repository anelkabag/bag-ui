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
    let lenis: Lenis | undefined;
    const frame = window.requestAnimationFrame(() => {
      const shellScroller = document.getElementById("main");
      const content = shellScroller?.firstElementChild;

      lenis = new Lenis({
        ...(shellScroller
          ? {
              wrapper: shellScroller,
              content: content instanceof HTMLElement ? content : shellScroller,
            }
          : {}),
        autoRaf: true,
        lerp: 0.08,
        wheelMultiplier: 0.9,
        smoothWheel: true,
        syncTouch: false,
        anchors: true,
        stopInertiaOnNavigate: true,
        respectReducedMotion: true,
        prevent: (node) => node.hasAttribute("data-lenis-prevent"),
      });
    });

    return () => {
      window.cancelAnimationFrame(frame);
      lenis?.destroy();
    };
  }, [pathname]);

  return children;
}
