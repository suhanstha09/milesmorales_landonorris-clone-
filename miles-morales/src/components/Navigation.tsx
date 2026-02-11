"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { navLinks } from "@/lib/data";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const menuVariants = {
    closed: { clipPath: "circle(0% at calc(100% - 40px) 40px)" },
    open: { clipPath: "circle(150% at calc(100% - 40px) 40px)" },
  };

  const linkVariants = {
    closed: { y: 50, opacity: 0 },
    open: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: { delay: 0.3 + i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
    }),
  };

  return (
    <>
      {/* Fixed Nav Bar */}
      <motion.header
        className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${
          scrolled
            ? "bg-background/80 backdrop-blur-xl border-b border-border"
            : "bg-transparent"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between h-20">
          {/* Logo */}
          <a
            href="#"
            className="relative z-[110] flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-full border-2 border-spider-red flex items-center justify-center group-hover:bg-spider-red transition-colors duration-300">
              <span className="font-display text-lg text-spider-red group-hover:text-white transition-colors duration-300">
                MM
              </span>
            </div>
            <span className="hidden md:block font-display text-xl tracking-wider">
              MILES MORALES
            </span>
          </a>

          {/* Desktop Links */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-mono text-xs uppercase tracking-widest text-muted hover:text-spider-red transition-colors duration-300 relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-spider-red transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Menu Burger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="relative z-[110] w-10 h-10 flex flex-col items-center justify-center gap-1.5 group"
            aria-label="Toggle menu"
          >
            <motion.span
              animate={isOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
              className="w-6 h-[2px] bg-foreground group-hover:bg-spider-red transition-colors duration-300 block"
            />
            <motion.span
              animate={isOpen ? { opacity: 0, x: 10 } : { opacity: 1, x: 0 }}
              className="w-6 h-[2px] bg-foreground group-hover:bg-spider-red transition-colors duration-300 block"
            />
            <motion.span
              animate={isOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
              className="w-6 h-[2px] bg-foreground group-hover:bg-spider-red transition-colors duration-300 block"
            />
          </button>
        </div>
      </motion.header>

      {/* Full Screen Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-[105] bg-background flex items-center justify-center"
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 halftone opacity-[0.03]" />

            {/* Large decorative number */}
            <div className="absolute right-12 top-1/2 -translate-y-1/2 font-display text-[30vw] text-white/[0.02] leading-none select-none pointer-events-none">
              42
            </div>

            <nav className="relative flex flex-col gap-2 items-center">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  custom={i}
                  variants={linkVariants}
                  initial="closed"
                  animate="open"
                  onClick={() => setIsOpen(false)}
                  className="font-display text-6xl md:text-8xl tracking-wider text-foreground hover:text-spider-red transition-colors duration-300 relative group"
                >
                  <span className="relative z-10">{link.label.toUpperCase()}</span>
                  <span className="absolute left-0 bottom-0 w-0 h-1 bg-spider-red transition-all duration-500 group-hover:w-full" />
                  <span className="absolute -left-16 top-1/2 -translate-y-1/2 font-mono text-xs text-spider-red opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    0{i + 1}
                  </span>
                </motion.a>
              ))}
            </nav>

            {/* Footer info in menu */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="absolute bottom-12 left-12 font-mono text-xs text-muted"
            >
              <p>EARTH-1610</p>
              <p className="mt-1 text-spider-red">BROOKLYN, NY</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
