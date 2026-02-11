"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";

// ─── Spider-Man Mask SVG Path (simplified Suhan Shrestha mask shape) ──────────
const MASK_PATH =
  "M250,30 C180,30 120,70 90,130 C60,190 50,260 60,320 C70,380 100,430 140,460 C170,480 200,500 250,510 C300,500 330,480 360,460 C400,430 430,380 440,320 C450,260 440,190 410,130 C380,70 320,30 250,30Z";

// Eye paths for the mask
const LEFT_EYE =
  "M170,200 C180,170 210,160 230,175 C245,185 245,215 230,230 C215,245 185,240 175,225 C165,215 165,210 170,200Z";
const RIGHT_EYE =
  "M270,200 C280,170 310,160 330,175 C345,185 345,215 330,230 C315,245 285,240 275,225 C265,215 265,210 270,200Z";

// Web line paths radiating from center of mask
const WEB_LINES = [
  "M250,30 L250,510",
  "M250,270 L90,130",
  "M250,270 L410,130",
  "M250,270 L60,320",
  "M250,270 L440,320",
  "M250,270 L140,460",
  "M250,270 L360,460",
  "M250,270 L60,270",
  "M250,270 L440,270",
  "M250,270 L170,80",
  "M250,270 L330,80",
  "M250,270 L120,400",
  "M250,270 L380,400",
];

// Concentric web rings
const WEB_RINGS = [
  "M250,270 m-40,0 a40,40 0 1,0 80,0 a40,40 0 1,0 -80,0",
  "M250,270 m-80,0 a80,80 0 1,0 160,0 a80,80 0 1,0 -160,0",
  "M250,270 m-120,0 a120,120 0 1,0 240,0 a120,120 0 1,0 -240,0",
  "M250,270 m-170,0 a170,170 0 1,0 340,0 a170,170 0 1,0 -340,0",
];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
}

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const maskImgRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, px: 0, py: 0 });
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);
  const [isHovering, setIsHovering] = useState(false);
  const clipPosRef = useRef({ x: 50, y: 50 });

  // ─── Particle System ────────────────────────────────────────────────────
  const spawnParticles = useCallback((x: number, y: number, speed: number) => {
    const count = Math.floor(speed * 0.5) + 1;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const velocity = speed * 0.3 + Math.random() * 2;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        life: 1,
        maxLife: 0.5 + Math.random() * 0.8,
        size: 1 + Math.random() * 3,
        color:
          Math.random() > 0.5
            ? "#e11d48"
            : Math.random() > 0.5
              ? "#06b6d4"
              : "#a855f7",
      });
    }
  }, []);

  const animateParticles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

    particlesRef.current = particlesRef.current.filter((p) => p.life > 0);

    particlesRef.current.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.98;
      p.vy *= 0.98;
      p.life -= 0.016 / p.maxLife;

      ctx.save();
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = p.color;

      // Draw as small web-like splats
      if (p.size > 2) {
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          const a = (i / 5) * Math.PI * 2;
          const r = p.size * (0.5 + Math.random() * 0.5);
          if (i === 0) ctx.moveTo(p.x + Math.cos(a) * r, p.y + Math.sin(a) * r);
          else ctx.lineTo(p.x + Math.cos(a) * r, p.y + Math.sin(a) * r);
        }
        ctx.closePath();
        ctx.fill();
      } else {
        ctx.fillRect(p.x, p.y, p.size, p.size);
      }

      ctx.restore();
    });

    rafRef.current = requestAnimationFrame(animateParticles);
  }, []);

  // ─── Mouse Tracking + Clip Reveal ───────────────────────────────────────
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Speed for particle density
      const dx = x - mouseRef.current.px;
      const dy = y - mouseRef.current.py;
      const speed = Math.sqrt(dx * dx + dy * dy);

      mouseRef.current = { x, y, px: mouseRef.current.x, py: mouseRef.current.y };

      // Spawn particles on movement
      if (speed > 2) {
        spawnParticles(x, y, speed);
      }

      // Update circular clip position on the mask image container
      const imgContainer = container.querySelector(".face-mask-wrapper") as HTMLElement;
      if (imgContainer && maskImgRef.current) {
        const imgRect = imgContainer.getBoundingClientRect();
        const relX = ((e.clientX - imgRect.left) / imgRect.width) * 100;
        const relY = ((e.clientY - imgRect.top) / imgRect.height) * 100;
        clipPosRef.current = { x: relX, y: relY };

        gsap.to(maskImgRef.current, {
          clipPath: `circle(18% at ${relX}% ${relY}%)`,
          duration: 0.4,
          ease: "power2.out",
        });
      }
    },
    [spawnParticles]
  );

  // Close the clip circle when mouse leaves
  const handleMouseLeave = useCallback(() => {
    if (maskImgRef.current) {
      gsap.to(maskImgRef.current, {
        clipPath: `circle(0% at ${clipPosRef.current.x}% ${clipPosRef.current.y}%)`,
        duration: 0.5,
        ease: "power2.inOut",
      });
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);
    rafRef.current = requestAnimationFrame(animateParticles);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(rafRef.current);
    };
  }, [handleMouseMove, handleMouseLeave, animateParticles]);

  // ─── GSAP entrance animation ────────────────────────────────────────────
  useEffect(() => {
    const tl = gsap.timeline({ delay: 2.5 });

    tl.from(".hero-title-line", {
      y: 120,
      opacity: 0,
      duration: 1,
      stagger: 0.15,
      ease: "power4.out",
    })
      .from(
        ".hero-subtitle",
        { y: 30, opacity: 0, duration: 0.8, ease: "power3.out" },
        "-=0.5"
      )
      .from(
        ".hero-scroll-indicator",
        { y: 20, opacity: 0, duration: 0.6 },
        "-=0.3"
      )
      .from(
        ".hero-stats > div",
        { y: 40, opacity: 0, duration: 0.6, stagger: 0.1, ease: "power3.out" },
        "-=0.5"
      );
  }, []);

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Particle Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-20"
      />

      {/* Background Grid */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(225,29,72,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(225,29,72,0.3) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Halftone corner accent */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 halftone opacity-[0.04] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 halftone-cyan opacity-[0.03] pointer-events-none" />

      {/* Main Content */}
      <div className="relative z-10 text-center px-8 md:px-16 lg:px-24 flex flex-col items-center">
        {/* Small tag above */}
        <motion.p
          className="hero-subtitle font-mono text-xs md:text-sm tracking-[0.4em] text-spider-red uppercase mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.8 }}
        >
          Earth-1610 &mdash; Brooklyn, New York
        </motion.p>

        {/* FACE + MASK Lando-style Reveal */}
        <div className="relative">
          {/* Face / Mask wrapper */}
          <div
            className="face-mask-wrapper absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[380px] md:w-[450px] md:h-[560px] lg:w-[500px] lg:h-[620px]"
          >
            {/* Mask image - always visible as base layer */}
            <motion.img
              src="/milesm.png"
              alt="Mask"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 2.2, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            />
            {/* Face image - revealed through circular clip that follows cursor */}
            <div
              ref={maskImgRef}
              className="absolute inset-0 w-full h-full pointer-events-none select-none"
              style={{ clipPath: "circle(0% at 50% 50%)" }}
            >
              <img
                src="/meface.png"
                alt="Suhan Shrestha"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Title Text */}
          <div className="relative z-10 overflow-hidden">
            <h1 className="font-display leading-[0.85] tracking-tight">
              <span className="hero-title-line block text-[15vw] md:text-[12vw] lg:text-[10vw] text-foreground">
                SUHAN
              </span>
              <span className="hero-title-line block text-[15vw] md:text-[12vw] lg:text-[10vw] text-transparent" style={{ WebkitTextStroke: "2px #e11d48" }}>
                SHRESTHA
              </span>
            </h1>
          </div>
        </div>

        {/* Tagline */}
        <motion.p
          className="hero-subtitle mt-8 font-mono text-xs md:text-sm text-muted max-w-md mx-auto tracking-wide"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.2, duration: 0.8 }}
        >
          Anyone can wear the mask. But not everyone has what it takes to be{" "}
          <span className="text-spider-red">Spider-Man</span>.
        </motion.p>

        {/* Stats Row */}
        <div className="hero-stats flex flex-wrap justify-center gap-8 md:gap-16 mt-16">
          {[
            { label: "Universe", value: "1610" },
            { label: "Dimensions", value: "∞" },
            { label: "Status", value: "ACTIVE" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-display text-3xl md:text-4xl text-spider-red">
                {stat.value}
              </p>
              <p className="font-mono text-[10px] tracking-[0.3em] text-muted uppercase mt-1">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="hero-scroll-indicator absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="font-mono text-[10px] tracking-[0.3em] text-muted uppercase mb-3">
          Scroll
        </span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-spider-red to-transparent" />
      </motion.div>

      {/* Side decorations */}
      <div className="hidden lg:block absolute left-8 top-1/2 -translate-y-1/2 z-10">
        <div className="flex flex-col gap-4 items-center">
          <div className="w-[1px] h-24 bg-gradient-to-b from-transparent via-spider-red to-transparent" />
          <span className="font-mono text-[10px] tracking-[0.3em] text-muted [writing-mode:vertical-lr] rotate-180">
            EST. 2011
          </span>
          <div className="w-[1px] h-24 bg-gradient-to-b from-transparent via-spider-red to-transparent" />
        </div>
      </div>

      <div className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2 z-10">
        <div className="flex flex-col gap-4 items-center">
          <div className="w-[1px] h-24 bg-gradient-to-b from-transparent via-spider-cyan to-transparent" />
          <span className="font-mono text-[10px] tracking-[0.3em] text-muted [writing-mode:vertical-lr]">
            #SPIDER-VERSE
          </span>
          <div className="w-[1px] h-24 bg-gradient-to-b from-transparent via-spider-cyan to-transparent" />
        </div>
      </div>
    </section>
  );
}
