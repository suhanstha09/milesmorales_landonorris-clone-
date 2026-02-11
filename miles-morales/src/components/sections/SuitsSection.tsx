"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { suits } from "@/lib/data";

export default function SuitsSection() {
  const [activeSuit, setActiveSuit] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const suit = suits[activeSuit];

  return (
    <section
      ref={sectionRef}
      id="suits"
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
            02
          </span>
          <div className="w-12 h-[1px] bg-spider-red" />
          <span className="font-mono text-xs tracking-[0.3em] text-muted uppercase">
            Suits & Variants
          </span>
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.9] tracking-tight mb-20"
        >
          SUIT
          <br />
          <span className="gradient-text-multi">VARIANTS</span>
        </motion.h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left: Suit selector tabs */}
          <div className="lg:col-span-4">
            <div className="space-y-2">
              {suits.map((s, i) => (
                <motion.button
                  key={s.id}
                  onClick={() => setActiveSuit(i)}
                  className={`w-full text-left px-6 py-5 border transition-all duration-500 group relative overflow-hidden ${
                    activeSuit === i
                      ? "border-spider-red bg-spider-red/5"
                      : "border-border hover:border-spider-red/30 bg-transparent"
                  }`}
                  initial={{ opacity: 0, x: -30 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.6 }}
                >
                  {/* Active indicator */}
                  <motion.div
                    className="absolute left-0 top-0 w-1 h-full bg-spider-red"
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: activeSuit === i ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                  />

                  <div className="flex items-center justify-between">
                    <div>
                      <p
                        className={`font-display text-xl tracking-wide transition-colors duration-300 ${
                          activeSuit === i
                            ? "text-foreground"
                            : "text-muted group-hover:text-foreground"
                        }`}
                      >
                        {s.name}
                      </p>
                      <p className="font-mono text-[10px] tracking-[0.2em] text-muted mt-1">
                        {s.universe}
                      </p>
                    </div>
                    <span
                      className="font-mono text-xs"
                      style={{ color: s.accentColor }}
                    >
                      0{i + 1}
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Right: Suit display */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={suit.id}
                initial={{ opacity: 0, y: 30, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.98 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="relative"
              >
                {/* Suit visual */}
                <div
                  className="relative w-full aspect-[3/4] border border-border overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${suit.color}, ${suit.color}dd, #0a0a0a)`,
                  }}
                >
                  {/* Suit image */}
                  <img
                    src={suit.image}
                    alt={suit.name}
                    className="absolute inset-0 w-full h-full object-cover object-top"
                  />

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />

                  {/* Big suit number */}
                  <div className="absolute bottom-6 right-8 font-display text-[12rem] leading-none opacity-5 text-foreground select-none pointer-events-none">
                    0{activeSuit + 1}
                  </div>

                  {/* Corner accents */}
                  <div
                    className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2"
                    style={{ borderColor: suit.accentColor }}
                  />
                  <div
                    className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2"
                    style={{ borderColor: suit.accentColor }}
                  />
                </div>

                {/* Suit info below */}
                <div className="mt-8">
                  <h3 className="font-display text-3xl md:text-4xl tracking-wide">
                    {suit.name}
                  </h3>
                  <p className="font-mono text-xs tracking-[0.2em] mt-2" style={{ color: suit.accentColor }}>
                    {suit.universe}
                  </p>
                  <p className="text-base text-muted leading-relaxed mt-4 max-w-lg">
                    {suit.description}
                  </p>

                  {/* Color swatch */}
                  <div className="flex items-center gap-3 mt-6">
                    <div
                      className="w-4 h-4 rounded-full border border-border"
                      style={{ background: suit.color }}
                    />
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ background: suit.accentColor }}
                    />
                    <span className="font-mono text-[10px] text-muted uppercase tracking-wider">
                      {suit.accentColor}
                    </span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
