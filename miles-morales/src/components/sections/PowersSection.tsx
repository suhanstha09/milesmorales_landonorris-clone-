"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { powers } from "@/lib/data";

export default function PowersSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      id="powers"
      className="relative py-32 md:py-48 px-6 md:px-12 overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* Background accent */}
      <div className="absolute inset-0 web-pattern opacity-30 pointer-events-none" />

      <div className="max-w-[1400px] mx-auto relative z-10">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-4 mb-16"
        >
          <span className="font-mono text-xs tracking-[0.3em] text-spider-red uppercase">
            03
          </span>
          <div className="w-12 h-[1px] bg-spider-red" />
          <span className="font-mono text-xs tracking-[0.3em] text-muted uppercase">
            Powers & Abilities
          </span>
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.9] tracking-tight mb-20"
        >
          POWERS &<br />
          <span className="gradient-text-cyan">ABILITIES</span>
        </motion.h2>

        {/* Powers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {powers.map((power, i) => (
            <motion.div
              key={power.id}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                delay: 0.2 + i * 0.1,
                duration: 0.6,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="group relative p-8 bg-surface border border-border hover:border-spider-red/40 transition-all duration-500 cursor-default overflow-hidden"
            >
              {/* Hover glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-spider-red/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Power level bar background */}
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-border">
                <motion.div
                  className="h-full bg-spider-red"
                  initial={{ width: 0 }}
                  animate={isInView ? { width: `${power.level}%` } : {}}
                  transition={{ delay: 0.5 + i * 0.1, duration: 1.2, ease: "easeOut" }}
                />
              </div>

              {/* Icon */}
              <div className="text-4xl mb-4">{power.icon}</div>

              {/* Content */}
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-display text-xl tracking-wide group-hover:text-spider-red transition-colors duration-300">
                    {power.name}
                  </h3>
                  <span className="font-mono text-xs text-spider-red">
                    {power.level}%
                  </span>
                </div>

                <p className="text-sm text-muted leading-relaxed">
                  {power.description}
                </p>
              </div>

              {/* Corner accent */}
              <div className="absolute top-0 right-0 w-0 h-0 border-t-[40px] border-t-spider-red/10 border-l-[40px] border-l-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>
          ))}
        </div>

        {/* Bottom callout */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-16 text-center"
        >
          <p className="font-mono text-xs text-muted tracking-[0.3em] uppercase">
            Power data sourced from{" "}
            <span className="text-spider-cyan">Earth-1610 Registry</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
