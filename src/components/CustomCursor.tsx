"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";

// ── Blob configuration for the liquid cursor ─────────────────────────────
const BLOB_CONFIGS = [
  { size: 44, speed: 0.25 },
  { size: 34, speed: 0.18 },
  { size: 28, speed: 0.12 },
  { size: 22, speed: 0.08 },
  { size: 38, speed: 0.14 },
  { size: 18, speed: 0.06 },
  { size: 16, speed: 0.045 },
];

const BLOB_COLORS = [
  "#e11d48",
  "rgba(225, 29, 72, 0.92)",
  "rgba(168, 85, 247, 0.85)",
  "rgba(225, 29, 72, 0.8)",
  "rgba(6, 182, 212, 0.75)",
  "rgba(168, 85, 247, 0.7)",
  "rgba(225, 29, 72, 0.65)",
];

interface BlobState {
  x: number;
  y: number;
  size: number;
  speed: number;
}

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const blobRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [isHovering, setIsHovering] = useState(false);
  const [isLiquid, setIsLiquid] = useState(false);
  const mousePos = useRef({ x: -100, y: -100 });
  const blobsRef = useRef<BlobState[]>(
    BLOB_CONFIGS.map((c) => ({ x: -100, y: -100, size: c.size, speed: c.speed }))
  );
  const rafRef = useRef<number>(0);

  // ── Liquid blob animation loop ──────────────────────────────────────────
  const animateBlobs = useCallback(() => {
    blobsRef.current.forEach((blob, i) => {
      blob.x += (mousePos.current.x - blob.x) * blob.speed;
      blob.y += (mousePos.current.y - blob.y) * blob.speed;

      const el = blobRefs.current[i];
      if (el) {
        el.style.transform = `translate3d(${blob.x - blob.size / 2}px, ${blob.y - blob.size / 2}px, 0)`;
      }
    });
    rafRef.current = requestAnimationFrame(animateBlobs);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${e.clientX - 20}px, ${e.clientY - 20}px)`;
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX - 3}px, ${e.clientY - 3}px)`;
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Check for liquid cursor trigger
      if (target.closest("[data-liquid-cursor]")) {
        setIsLiquid(true);
        setIsHovering(false);
        return;
      }

      setIsLiquid(false);

      if (
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.classList.contains("cursor-pointer")
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const related = e.relatedTarget as HTMLElement | null;
      if (!related?.closest("[data-liquid-cursor]")) {
        setIsLiquid(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mouseout", handleMouseOut);

    rafRef.current = requestAnimationFrame(animateBlobs);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mouseout", handleMouseOut);
      cancelAnimationFrame(rafRef.current);
    };
  }, [animateBlobs]);

  return (
    <>
      {/* ── SVG gooey filter (metaball liquid merge) ─────────────────────── */}
      <svg
        aria-hidden="true"
        style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
      >
        <defs>
          <filter id="liquid-gooey" colorInterpolationFilters="sRGB">
            <feGaussianBlur in="SourceGraphic" stdDeviation="11" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -9"
              result="gooey"
            />
            <feComposite in="SourceGraphic" in2="gooey" operator="atop" />
          </filter>
        </defs>
      </svg>

      {/* ── Liquid cursor blobs ──────────────────────────────────────────── */}
      <div
        className="hidden lg:block fixed inset-0 pointer-events-none z-[9999]"
        style={{
          filter: "url(#liquid-gooey)",
          opacity: isLiquid ? 1 : 0,
          transition: "opacity 0.35s ease",
          willChange: "opacity",
        }}
      >
        {BLOB_CONFIGS.map((cfg, i) => (
          <div
            key={i}
            ref={(el) => {
              blobRefs.current[i] = el;
            }}
            className="absolute top-0 left-0 rounded-full"
            style={{
              width: cfg.size,
              height: cfg.size,
              background: BLOB_COLORS[i],
              willChange: "transform",
            }}
          />
        ))}
      </div>

      {/* ── Normal ring cursor ───────────────────────────────────────────── */}
      <div
        ref={cursorRef}
        className="hidden lg:block fixed top-0 left-0 pointer-events-none z-[9998] mix-blend-difference"
        style={{
          transition: "transform 0.15s ease-out, opacity 0.3s ease",
          opacity: isLiquid ? 0 : 1,
        }}
      >
        <motion.div
          animate={{
            width: isHovering ? 60 : 40,
            height: isHovering ? 60 : 40,
            borderColor: isHovering ? "#e11d48" : "rgba(245,245,245,0.3)",
          }}
          transition={{ duration: 0.2 }}
          className="rounded-full border"
        />
      </div>

      {/* ── Normal dot cursor ────────────────────────────────────────────── */}
      <div
        ref={dotRef}
        className="hidden lg:block fixed top-0 left-0 w-[6px] h-[6px] bg-spider-red rounded-full pointer-events-none z-[9998]"
        style={{
          transition: "transform 0.05s linear, opacity 0.3s ease",
          opacity: isLiquid ? 0 : 1,
        }}
      />
    </>
  );
}
