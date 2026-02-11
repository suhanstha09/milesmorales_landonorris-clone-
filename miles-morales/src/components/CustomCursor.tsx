"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${e.clientX - 20}px, ${e.clientY - 20}px)`;
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX - 3}px, ${e.clientY - 3}px)`;
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
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

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  // Only show on desktop
  return (
    <>
      <div
        ref={cursorRef}
        className="hidden lg:block fixed top-0 left-0 pointer-events-none z-[9998] mix-blend-difference"
        style={{ transition: "transform 0.15s ease-out" }}
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
      <div
        ref={dotRef}
        className="hidden lg:block fixed top-0 left-0 w-[6px] h-[6px] bg-spider-red rounded-full pointer-events-none z-[9998]"
        style={{ transition: "transform 0.05s linear" }}
      />
    </>
  );
}
