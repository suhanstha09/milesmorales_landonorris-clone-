"use client";

import { useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { stats } from "@/lib/data";

gsap.registerPlugin(ScrollTrigger);

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!sectionRef.current) return;

    gsap.fromTo(
      ".about-text-reveal",
      { y: 80, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          toggleActions: "play none none none",
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative py-32 md:py-48 px-6 md:px-12 overflow-hidden"
    >
      {/* Background accent */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="max-w-[1400px] mx-auto">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-4 mb-16"
        >
          <span className="font-mono text-xs tracking-[0.3em] text-spider-red uppercase">
            01
          </span>
          <div className="w-12 h-[1px] bg-spider-red" />
          <span className="font-mono text-xs tracking-[0.3em] text-muted uppercase">
            About
          </span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          {/* Left: Big statement */}
          <div className="lg:col-span-7">
            <h2 className="about-text-reveal font-display text-5xl md:text-7xl lg:text-8xl leading-[0.9] tracking-tight">
              NOT JUST
              <br />
              <span className="gradient-text-red">ANOTHER</span>
              <br />
              SPIDER-MAN
            </h2>

            <p className="about-text-reveal mt-10 text-lg md:text-xl text-muted leading-relaxed max-w-xl">
              Miles Morales isn&apos;t a replacement. He&apos;s the evolution. A kid from
              Brooklyn who was never supposed to be Spider-Man — and that&apos;s
              exactly why he&apos;s the best one.
            </p>

            <p className="about-text-reveal mt-6 text-base text-muted/60 leading-relaxed max-w-xl">
              Bitten by a genetically modified spider with abilities unique to
              him — the venom blast, camouflage, and a spider-sense that sees
              through lies. He carries the weight of two worlds on his shoulders:
              his family&apos;s legacy and Spider-Man&apos;s duty.
            </p>
          </div>

          {/* Right: Stats + details */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            {/* Quote card */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="relative p-8 bg-surface-elevated border border-border"
            >
              <div className="absolute -top-3 -left-3 w-6 h-6 border-t-2 border-l-2 border-spider-red" />
              <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b-2 border-r-2 border-spider-red" />

              <blockquote className="font-display text-2xl md:text-3xl leading-snug">
                &ldquo;ANYONE CAN WEAR THE MASK.
                <span className="text-spider-red"> YOU</span> COULD WEAR THE
                MASK.&rdquo;
              </blockquote>
              <p className="mt-4 font-mono text-xs text-muted tracking-wider">
                — PETER B. PARKER
              </p>
            </motion.div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-6 mt-12">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.6 + i * 0.1, duration: 0.6 }}
                  className="group"
                >
                  <p className="font-display text-3xl md:text-4xl text-spider-red group-hover:text-spider-cyan transition-colors duration-300">
                    {stat.value}
                  </p>
                  <p className="font-mono text-[10px] tracking-[0.2em] text-muted uppercase mt-1">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute right-0 top-1/4 w-px h-1/2 bg-gradient-to-b from-transparent via-border to-transparent" />
    </section>
  );
}
