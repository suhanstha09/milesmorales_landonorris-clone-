"use client";

import { useEffect, useRef, useCallback } from "react";
import Lenis from "lenis";

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<Lenis | null>(null);

  const raf = useCallback((time: number) => {
    lenisRef.current?.raf(time);
    requestAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
      infinite: false,
    });

    lenisRef.current = lenis;
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, [raf]);

  return <>{children}</>;
}
