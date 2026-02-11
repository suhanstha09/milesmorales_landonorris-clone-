"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { timeline } from "@/lib/data";

export default function TimelineSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      id="story"
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
            04
          </span>
          <div className="w-12 h-[1px] bg-spider-red" />
          <span className="font-mono text-xs tracking-[0.3em] text-muted uppercase">
            Story Timeline
          </span>
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.9] tracking-tight mb-24"
        >
          ORIGIN
          <br />
          <span className="gradient-text-red">STORY</span>
        </motion.h2>

        {/* Timeline */}
        <div className="relative">
          {/* Center line */}
          <motion.div
            className="absolute left-8 md:left-1/2 top-0 bottom-0 w-[1px] bg-border"
            initial={{ scaleY: 0 }}
            animate={isInView ? { scaleY: 1 } : {}}
            transition={{ duration: 1.5, ease: "easeOut" }}
            style={{ transformOrigin: "top" }}
          />

          {/* Timeline events */}
          <div className="space-y-16 md:space-y-24">
            {timeline.map((event, i) => {
              const isLeft = i % 2 === 0;

              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{
                    delay: 0.3 + i * 0.15,
                    duration: 0.7,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="relative pl-20 md:pl-0 md:grid md:grid-cols-2 md:gap-16 items-center"
                >
                  {/* Dot on the line */}
                  <div className="absolute left-[26px] md:left-1/2 md:-translate-x-1/2 w-5 h-5 rounded-full border-2 border-spider-red bg-background z-10 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-spider-red" />
                  </div>

                  {/* Content */}
                  <div
                    className={`${
                      isLeft
                        ? "md:text-right md:pr-16"
                        : "md:col-start-2 md:text-left md:pl-16"
                    }`}
                    style={{ direction: "ltr" }}
                  >
                    {/* Tag */}
                    <span className="inline-block px-3 py-1 border border-spider-red/30 font-mono text-[10px] tracking-[0.2em] text-spider-red uppercase mb-4">
                      {event.tag}
                    </span>

                    {/* Year */}
                    <p className="font-display text-6xl md:text-7xl text-foreground/10 leading-none mb-2">
                      {event.year}
                    </p>

                    {/* Title */}
                    <h3 className="font-display text-2xl md:text-3xl tracking-wide mb-3">
                      {event.title}
                    </h3>

                    {/* Description */}
                    <p className={`text-sm text-muted leading-relaxed max-w-md ${isLeft ? "md:ml-auto" : ""}`}>
                      {event.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
