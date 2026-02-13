"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { navLinks } from "@/lib/data";

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const isInView = useInView(footerRef, { once: true, margin: "-50px" });

  return (
    <footer
      ref={footerRef}
      className="relative py-24 md:py-32 px-8 md:px-16 lg:px-24 border-t border-border overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 halftone opacity-[0.02] pointer-events-none" />

      <div className="max-w-[1200px] mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16">
          {/* Left: brand */}
          <div className="md:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-display text-6xl md:text-8xl tracking-tight leading-none">
                SUHAN
                <br />
                <span className="text-spider-red">SHRESTHA</span>
              </h2>
              <p className="mt-6 text-sm text-muted max-w-xs leading-relaxed">
                Anyone can wear the mask  but there&apos;s only one Suhan Shrestha. 
                Brooklyn&apos;s one and only Spider-Man.
              </p>
            </motion.div>
          </div>

          {/* Center: links */}
          <div className="md:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <p className="font-mono text-xs tracking-[0.3em] text-spider-red uppercase mb-6">
                Navigation
              </p>
              <nav className="flex flex-col gap-3">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="font-display text-xl tracking-wider text-muted hover:text-foreground hover:translate-x-2 transition-all duration-300 inline-block"
                  >
                    {link.label.toUpperCase()}
                  </a>
                ))}
              </nav>
            </motion.div>
          </div>

          {/* Right: info */}
          <div className="md:col-span-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <p className="font-mono text-xs tracking-[0.3em] text-spider-red uppercase mb-6">
                Details
              </p>
              <div className="space-y-4 text-sm text-muted">
                <div>
                  <p className="font-mono text-[10px] tracking-[0.2em] text-muted/50 uppercase">
                    Universe
                  </p>
                  <p className="mt-1">Earth-1610</p>
                </div>
                <div>
                  <p className="font-mono text-[10px] tracking-[0.2em] text-muted/50 uppercase">
                    Location
                  </p>
                  <p className="mt-1">Brooklyn, New York</p>
                </div>
                <div>
                  <p className="font-mono text-[10px] tracking-[0.2em] text-muted/50 uppercase">
                    Affiliation
                  </p>
                  <p className="mt-1">Spider-Society (Defected)</p>
                </div>
                <div>
                  <p className="font-mono text-[10px] tracking-[0.2em] text-muted/50 uppercase">
                    Status
                  </p>
                  <p className="mt-1 text-spider-red">Active</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-20 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <p className="font-mono text-[10px] tracking-[0.2em] text-muted/40 uppercase">
            © 2026 Suhan Shrestha. All Dimensions Reserved.
          </p>
          <p className="font-mono text-[10px] tracking-[0.2em] text-muted/40 uppercase">
            Built with 🕷 in Brooklyn
          </p>
        </motion.div>

        {/* Giant background text */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden pointer-events-none select-none">
          <p className="font-display text-[20vw] leading-none text-foreground/[0.015] whitespace-nowrap text-center">
            SPIDER-VERSE
          </p>
        </div>
      </div>
    </footer>
  );
}
