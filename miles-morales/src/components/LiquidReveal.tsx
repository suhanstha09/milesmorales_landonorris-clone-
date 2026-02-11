"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";

// ─── Tuning Knobs ────────────────────────────────────────────────────────────
//
//   blobSize     → main blob radius (SVG units out of 500×620 viewBox)
//   speed        → main follow duration in seconds (lower = snappier)
//   lagStep      → extra seconds of lag per satellite blob
//   wobble       → feTurbulence displacement scale (0 = circle, 50 = very wavy)
//   softness     → final edge feather (0 = hard, 3 = dreamy)
//   turbFreq     → organic noise frequency (lower = bigger lumps)
//   metaballBlur → merge distance between blobs (higher = gooier merge)
//
// ─────────────────────────────────────────────────────────────────────────────

interface LiquidRevealProps {
  /** Image revealed inside the blob */
  src: string;
  alt?: string;
  className?: string;
  /** Main blob radius in SVG units. Default 90 */
  blobSize?: number;
  /** Follow duration in seconds (lower = snappier). Default 0.45 */
  speed?: number;
  /** Per-satellite extra lag in seconds. Default 0.18 */
  lagStep?: number;
  /** Turbulence displacement scale. Default 30 */
  wobble?: number;
  /** Final edge softness. Default 1.5 */
  softness?: number;
  /** Noise frequency. Default 0.012 */
  turbFreq?: number;
  /** Metaball merge blur. Default 10 */
  metaballBlur?: number;
}

// SVG viewBox dimensions (arbitrary coordinate space — scales with container)
const VW = 500;
const VH = 620;

export default function LiquidReveal({
  src,
  alt = "",
  className = "",
  blobSize = 90,
  speed = 0.45,
  lagStep = 0.18,
  wobble = 30,
  softness = 1.5,
  turbFreq = 0.012,
  metaballBlur = 10,
}: LiquidRevealProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const mainRef = useRef<SVGCircleElement>(null);
  const sat1Ref = useRef<SVGCircleElement>(null);
  const sat2Ref = useRef<SVGCircleElement>(null);
  const sat3Ref = useRef<SVGCircleElement>(null);

  // Instance-unique IDs so multiple LiquidReveals don't collide
  const uid = useRef(`lr${Math.random().toString(36).slice(2, 7)}`).current;

  // Satellite radii — proportional to main blob
  const r1 = Math.round(blobSize * 0.72);
  const r2 = Math.round(blobSize * 0.53);
  const r3 = Math.round(blobSize * 0.38);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const parent = svg.parentElement;
    if (!parent) return;

    const circles = [
      { el: mainRef.current, r: blobSize },
      { el: sat1Ref.current, r: r1 },
      { el: sat2Ref.current, r: r2 },
      { el: sat3Ref.current, r: r3 },
    ];

    // ── Mouse enters wrapper → grow blobs with elastic spring ──────────
    const onEnter = () => {
      circles.forEach(({ el, r }, i) => {
        if (!el) return;
        gsap.to(el, {
          attr: { r },
          duration: 0.6 + i * 0.08,
          ease: "elastic.out(1.0, 0.45)",
          overwrite: true,
        });
      });
    };

    // ── Mouse leaves wrapper → shrink blobs ────────────────────────────
    const onLeave = () => {
      circles.forEach(({ el }, i) => {
        if (!el) return;
        gsap.to(el, {
          attr: { r: 0 },
          duration: 0.45,
          delay: i * 0.03,
          ease: "power2.inOut",
          overwrite: true,
        });
      });
    };

    // ── Mouse moves → blobs follow with staggered inertia ──────────────
    const onMove = (e: MouseEvent) => {
      const rect = parent.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      // Map pixel coords → SVG viewBox coords
      const x = ((e.clientX - rect.left) / rect.width) * VW;
      const y = ((e.clientY - rect.top) / rect.height) * VH;

      circles.forEach(({ el }, i) => {
        if (!el) return;
        gsap.to(el, {
          attr: { cx: x, cy: y },
          duration: speed + i * lagStep,
          ease: "power3.out",
          overwrite: "auto",
        });
      });
    };

    parent.addEventListener("mouseenter", onEnter);
    parent.addEventListener("mouseleave", onLeave);
    parent.addEventListener("mousemove", onMove);

    return () => {
      parent.removeEventListener("mouseenter", onEnter);
      parent.removeEventListener("mouseleave", onLeave);
      parent.removeEventListener("mousemove", onMove);
    };
  }, [blobSize, r1, r2, r3, speed, lagStep]);

  const cx = VW / 2;
  const cy = VH / 2;
  const freq = `${turbFreq} ${turbFreq}`;

  return (
    <svg
      ref={svgRef}
      className={`absolute inset-0 w-full h-full pointer-events-none select-none ${className}`}
      viewBox={`0 0 ${VW} ${VH}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        {/* ── Liquid metaball + organic turbulence filter ─────────────── */}
        <filter id={`${uid}-f`} x="-20%" y="-20%" width="140%" height="140%">
          {/* 1. Blur circles together → soft metaball merge */}
          <feGaussianBlur in="SourceGraphic" stdDeviation={metaballBlur} result="blur" />
          {/* 2. Threshold → sharp merged blob shapes */}
          <feColorMatrix
            in="blur"
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -9"
            result="meta"
          />
          {/* 3. Organic noise field */}
          <feTurbulence
            type="fractalNoise"
            baseFrequency={freq}
            numOctaves={3}
            seed={2}
            result="noise"
          />
          {/* 4. Displace blob edges with noise → wobbly organic shape */}
          <feDisplacementMap
            in="meta"
            in2="noise"
            scale={wobble}
            xChannelSelector="R"
            yChannelSelector="G"
            result="displaced"
          />
          {/* 5. Feather final edges for soft, cinematic feel */}
          <feGaussianBlur in="displaced" stdDeviation={softness} />
        </filter>

        {/* ── Liquid mask (black = hidden, white blob = revealed) ─────── */}
        <mask id={`${uid}-m`}>
          <rect width={VW} height={VH} fill="black" />
          <g filter={`url(#${uid}-f)`}>
            <circle ref={mainRef} cx={cx} cy={cy} r={0} fill="white" />
            <circle ref={sat1Ref} cx={cx} cy={cy} r={0} fill="white" />
            <circle ref={sat2Ref} cx={cx} cy={cy} r={0} fill="white" />
            <circle ref={sat3Ref} cx={cx} cy={cy} r={0} fill="white" />
          </g>
        </mask>
      </defs>

      {/* ── Revealed content behind the liquid mask ───────────────────── */}
      <g mask={`url(#${uid}-m)`}>
        <rect width={VW} height={VH} fill="#050505" />
        <image
          href={src}
          width={VW}
          height={VH}
          preserveAspectRatio="xMidYMid slice"
        />
      </g>
    </svg>
  );
}
