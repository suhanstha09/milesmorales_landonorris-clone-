"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { mediaItems } from "@/lib/data";

export default function MediaSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      id="media"
      className="relative py-32 md:py-48 px-8 md:px-16 lg:px-24 overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="max-w-[1200px] mx-auto">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-4 mb-16"
        >
          <span className="font-mono text-xs tracking-[0.3em] text-spider-red uppercase">
            05
          </span>
          <div className="w-12 h-[1px] bg-spider-red" />
          <span className="font-mono text-xs tracking-[0.3em] text-muted uppercase">
            Media & Moments
          </span>
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.9] tracking-tight mb-20"
        >
          ICONIC
          <br />
          <span className="gradient-text-multi">MOMENTS</span>
        </motion.h2>

        {/* Bento Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 auto-rows-[200px] md:auto-rows-[250px]">
          {mediaItems.map((item, i) => {
            // Determine grid span based on aspect
            const spanClass =
              item.aspect === "wide"
                ? "col-span-2 row-span-1"
                : item.aspect === "tall"
                  ? "col-span-1 row-span-2"
                  : "col-span-1 row-span-1";

            const colors = [
              "#e11d48",
              "#06b6d4",
              "#a855f7",
              "#3b82f6",
              "#f59e0b",
              "#10b981",
            ];
            const color = colors[i % colors.length];

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{
                  delay: 0.2 + i * 0.1,
                  duration: 0.6,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={`${spanClass} group relative border border-border overflow-hidden cursor-pointer`}
                style={{
                  background: `linear-gradient(135deg, ${color}08, ${color}03, #0a0a0a)`,
                }}
              >
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80 z-10" />
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"
                  style={{
                    background: `linear-gradient(135deg, ${color}15, transparent)`,
                  }}
                />

                {/* Pattern inside */}
                <div
                  className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-500"
                  style={{
                    backgroundImage: `radial-gradient(circle, ${color} 0.5px, transparent 0.5px)`,
                    backgroundSize: "8px 8px",
                  }}
                />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                  <span
                    className="font-mono text-[10px] tracking-[0.2em] uppercase block mb-2"
                    style={{ color }}
                  >
                    {item.category}
                  </span>
                  <h3 className="font-display text-xl md:text-2xl tracking-wide text-foreground group-hover:translate-x-2 transition-transform duration-300">
                    {item.title}
                  </h3>
                </div>

                {/* Corner accent */}
                <div
                  className="absolute top-4 right-4 w-6 h-6 border-t border-r opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20"
                  style={{ borderColor: color }}
                />

                {/* Index number */}
                <div
                  className="absolute top-4 left-4 font-mono text-xs opacity-30 z-20"
                  style={{ color }}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
