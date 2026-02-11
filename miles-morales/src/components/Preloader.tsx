"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsLoading(false), 600);
          return 100;
        }
        return prev + Math.floor(Math.random() * 8) + 2;
      });
    }, 40);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-background"
          exit={{ y: "-100%"  }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* Web pattern background */}
          <div className="absolute inset-0 opacity-5">
            <svg className="w-full h-full" viewBox="0 0 800 800">
              {[...Array(12)].map((_, i) => (
                <line
                  key={i}
                  x1="400"
                  y1="400"
                  x2={400 + 400 * Math.cos((i * Math.PI * 2) / 12)}
                  y2={400 + 400 * Math.sin((i * Math.PI * 2) / 12)}
                  stroke="#e11d48"
                  strokeWidth="0.5"
                />
              ))}
              {[...Array(8)].map((_, i) => (
                <circle
                  key={i}
                  cx="400"
                  cy="400"
                  r={50 + i * 50}
                  fill="none"
                  stroke="#e11d48"
                  strokeWidth="0.3"
                />
              ))}
            </svg>
          </div>

          {/* Spider icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8"
          >
            <svg
              width="60"
              height="60"
              viewBox="0 0 100 100"
              className="text-spider-red"
            >
              <path
                fill="currentColor"
                d="M50 15 C50 15, 35 25, 35 40 C35 55, 45 60, 50 65 C55 60, 65 55, 65 40 C65 25, 50 15, 50 15Z M30 35 L10 20 M30 45 L5 45 M30 55 L10 70 M70 35 L90 20 M70 45 L95 45 M70 55 L90 70"
                strokeWidth="3"
                stroke="currentColor"
                fillOpacity="0.8"
              />
              <circle cx="42" cy="38" r="5" fill="#050505" />
              <circle cx="58" cy="38" r="5" fill="#050505" />
            </svg>
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-center"
          >
            <p className="font-display text-6xl tracking-wider text-foreground mb-2">
              SUHAN
            </p>
            <p className="font-display text-2xl tracking-[0.3em] text-spider-red">
              SHRESTHA
            </p>
          </motion.div>

          {/* Progress bar */}
          <div className="mt-12 w-48 h-[2px] bg-border overflow-hidden">
            <motion.div
              className="h-full bg-spider-red"
              initial={{ width: "0%" }}
              animate={{ width: `${Math.min(count, 100)}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>

          {/* Counter */}
          <motion.p
            className="mt-4 font-mono text-sm text-muted"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {Math.min(count, 100)}%
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
