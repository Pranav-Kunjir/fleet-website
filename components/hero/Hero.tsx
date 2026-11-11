"use client";

import { useEffect, useRef } from "react";
import DiscoverLink, { type DiscoverLinkProps } from "@/components/ui/DiscoverLink";
import CursorImageFrame, {
  DEFAULT_FLEET_FRAMES,
  type CursorFrameItem,
} from "@/components/ui/CursorImageFrame";

export interface HeroProps {
  subtitleLines?: [string, string] | string[];
  headlineBold?: string;
  headlineLight?: string;
  headlineSerif?: string;
  frames?: CursorFrameItem[];
  cursorThreshold?: number;
  cta?: DiscoverLinkProps;
}

export default function Hero({
  subtitleLines = ["Start anywhere,", "celebrate together"],
  headlineBold = "PUTS PUNE",
  headlineLight = "CREW IN",
  headlineSerif = "MOVEMENT",
  frames = DEFAULT_FLEET_FRAMES,
  cursorThreshold = 320,
  cta,
}: HeroProps) {
  const heroRef = useRef<HTMLElement>(null);
  const sansCharsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const serifCharsRef = useRef<(HTMLSpanElement | null)[]>([]);

  const fullSansLine = `${headlineBold} ${headlineLight}`;
  const boldBoundary = headlineBold.length;

  useEffect(() => {
    const heroEl = heroRef.current;
    if (!heroEl) return;

    const RADIUS = 360;
    const SANS_REST = 850;
    const SANS_NEAR = 220;
    const SERIF_REST = 350;
    const SERIF_NEAR = 700;

    const sansWeights = fullSansLine.split("").map((_, idx) => {
      const initial = idx <= boldBoundary ? SANS_REST : 300;
      return { current: initial, target: initial };
    });

    const serifWeights = headlineSerif.split("").map(() => ({
      current: SERIF_REST,
      target: SERIF_REST,
    }));

    let rafId: number | null = null;

    const updateWeights = () => {
      sansCharsRef.current.forEach((el, idx) => {
        if (!el || !sansWeights[idx]) return;
        const w = sansWeights[idx];
        w.current += (w.target - w.current) * 0.16;
        const rounded = Math.round(w.current);
        el.style.fontVariationSettings = `'wght' ${rounded}`;
        el.style.fontWeight = String(rounded);
      });

      serifCharsRef.current.forEach((el, idx) => {
        if (!el || !serifWeights[idx]) return;
        const w = serifWeights[idx];
        w.current += (w.target - w.current) * 0.16;
        const rounded = Math.round(w.current);
        el.style.fontVariationSettings = `'wght' ${rounded}`;
        el.style.fontWeight = String(rounded);
      });

      rafId = requestAnimationFrame(updateWeights);
    };

    rafId = requestAnimationFrame(updateWeights);

    const handlePointerMove = (e: PointerEvent | MouseEvent) => {
      const { clientX, clientY } = e;

      sansCharsRef.current.forEach((el, idx) => {
        if (!el || !sansWeights[idx]) return;
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dist = Math.hypot(clientX - cx, clientY - cy);
        const factor = Math.max(0, 1 - dist / RADIUS);
        // Smooth ease-out curve
        const eased = 1 - Math.pow(1 - factor, 2);
        sansWeights[idx].target =
          SANS_REST + (SANS_NEAR - SANS_REST) * eased;
      });

      serifCharsRef.current.forEach((el, idx) => {
        if (!el || !serifWeights[idx]) return;
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dist = Math.hypot(clientX - cx, clientY - cy);
        const factor = Math.max(0, 1 - dist / RADIUS);
        const eased = 1 - Math.pow(1 - factor, 2);
        serifWeights[idx].target =
          SERIF_REST + (SERIF_NEAR - SERIF_REST) * eased;
      });
    };

    const handlePointerLeave = () => {
      sansWeights.forEach((w, idx) => {
        w.target = idx <= boldBoundary ? SANS_REST : 300;
      });
      serifWeights.forEach((w) => {
        w.target = SERIF_REST;
      });
    };

    heroEl.addEventListener("pointermove", handlePointerMove);
    heroEl.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      heroEl.removeEventListener("pointermove", handlePointerMove);
      heroEl.removeEventListener("pointerleave", handlePointerLeave);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [fullSansLine, headlineSerif, boldBoundary]);

  return (
    <section
      ref={heroRef}
      data-cursor-cards=""
      data-cursor-cards-threshold={cursorThreshold}
      className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-8 pb-16 pt-24 bg-transparent text-[#111111] select-none overflow-x-clip"
    >
      {/* Cursor-following image frame that cycles frames as cursor moves */}
      <CursorImageFrame
        containerRef={heroRef}
        frames={frames}
        threshold={cursorThreshold}
      />

      <div className="relative w-full max-w-[1360px] mx-auto flex flex-col items-center text-center pointer-events-none">
        {/* Top editorial serif subtitle */}
        <p className="font-serif text-[26px] sm:text-[34px] md:text-[40px] leading-[1.03] tracking-[-0.015em] text-[#111111] mb-4 md:mb-6 relative z-20">
          {subtitleLines.map((line, index) => (
            <span key={index} className="block">
              {line}
            </span>
          ))}
        </p>

        {/* Main display typography block sitting in front of the cursor frame */}
        <div className="relative z-20 inline-flex flex-col items-center">
          <h1 className="relative flex flex-col items-center text-[#0b0b0b]">
            {/* Line 1: PUTS PUNE CREW IN */}
            <span className="relative inline-flex items-baseline whitespace-nowrap font-sans text-[10.8vw] sm:text-[10.5vw] lg:text-[138px] xl:text-[148px] leading-[0.86] tracking-[-0.045em] uppercase">
              {fullSansLine.split("").map((char, idx) => {
                const isBoldDefault = idx <= boldBoundary;
                return (
                  <span
                    key={idx}
                    ref={(el) => {
                      sansCharsRef.current[idx] = el;
                    }}
                    style={{
                      fontWeight: isBoldDefault ? 850 : 300,
                      fontVariationSettings: `'wght' ${isBoldDefault ? 850 : 300}`,
                    }}
                    className="inline-block"
                  >
                    {char === " " ? "\u00A0" : char}
                  </span>
                );
              })}
            </span>

            {/* Line 2: MOVEMENT */}
            <span className="font-serif uppercase text-[11.8vw] sm:text-[11.5vw] lg:text-[152px] xl:text-[166px] leading-[0.84] tracking-[-0.025em] mt-1">
              {headlineSerif.split("").map((char, idx) => (
                <span
                  key={idx}
                  ref={(el) => {
                    serifCharsRef.current[idx] = el;
                  }}
                  style={{
                    fontWeight: 350,
                    fontVariationSettings: "'wght' 350",
                  }}
                  className="inline-block"
                >
                  {char === " " ? "\u00A0" : char}
                </span>
              ))}
            </span>
          </h1>
        </div>

        {/* Bottom CTA: Join the fleet */}
        <div className="mt-7 md:mt-9 relative z-20 pointer-events-auto">
          <DiscoverLink {...cta} />
        </div>
      </div>
    </section>
  );
}
