"use client";

import { useEffect, useMemo, useRef } from "react";

export interface QuoteManifestoSectionProps {
  id?: string;
  quoteLines?: [string, string, string] | string[];
  subtitleLines?: string[];
}

function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(max, val));
}

/**
 * Geometric double quotation mark icon (“ ”) matching jjettas.com
 */
function DoubleQuoteIcon() {
  return (
    <svg
      viewBox="0 0 116 42"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-[68px] sm:w-[84px] md:w-[96px] h-auto mx-auto text-[#FF4438]"
      aria-hidden="true"
    >
      {/* Left opening quote “ */}
      <path
        d="M18 0H31L22 18H31V42H7V18L18 0ZM45 0H58L49 18H58V42H34V18L45 0Z"
        fill="currentColor"
      />
      {/* Right closing quote ” */}
      <path
        d="M71 42H58L67 24H58V0H82V24L71 42ZM98 42H85L94 24H85V0H109V24L98 42Z"
        transform="translate(7, 0)"
        fill="currentColor"
      />
    </svg>
  );
}

const INITIAL_ZOOM_SCALE = 3.95;

export default function QuoteManifestoSection({
  id = "manifesto",
  quoteLines = [
    "WE WANT PUNE TO",
    "REMEMBER US FOR",
    "MORE THAN MILES",
  ],
  subtitleLines = [
    "More than paces, more than distance, more than the run itself.",
    "Writing a story that outlasts every Sunday, every season, every era.",
  ],
}: QuoteManifestoSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const quoteStageRef = useRef<HTMLDivElement>(null);
  const quoteIconRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const dotWordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const solidWordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const wordWrapRefs = useRef<(HTMLSpanElement | null)[]>([]);

  // Parse lines into words with global word indices for staggered word-by-word animation
  const parsedLines = useMemo(() => {
    const wordsPerLine = quoteLines.map((line) =>
      line.split(/\s+/).filter(Boolean)
    );
    return wordsPerLine.map((words, lineIndex) => {
      const offset = wordsPerLine
        .slice(0, lineIndex)
        .reduce((sum, prevWords) => sum + prevWords.length, 0);
      return words.map((word, wordIndex) => ({
        word,
        globalIndex: offset + wordIndex,
      }));
    });
  }, [quoteLines]);

  const totalWords = useMemo(
    () => parsedLines.reduce((acc, line) => acc + line.length, 0),
    [parsedLines]
  );

  useEffect(() => {
    const section = sectionRef.current;
    const stage = quoteStageRef.current;
    if (!section || !stage || totalWords === 0) return;

    const state = {
      targetProgress: 0,
      currentProgress: 0,
    };

    const computeScroll = () => {
      const rect = section.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      if (scrollable <= 0) {
        state.targetProgress = 0;
        return;
      }
      state.targetProgress = clamp(-rect.top / scrollable, 0, 1);
    };

    computeScroll();

    let rafId: number | null = null;

    const animate = () => {
      // Smooth scrub interpolation
      state.currentProgress +=
        (state.targetProgress - state.currentProgress) * 0.12;
      const p = state.currentProgress;

      // 1. Massive full-bleed zoom-out:
      //    Holds at scale(3.95) for the first ~22% of scroll so the giant full-screen
      //    dot-matrix wall can be viewed before zooming down to scale(1.0) (p: 0.22 -> 0.74)
      const zoomNorm = clamp((p - 0.22) / 0.52, 0, 1);
      const zoomEased = 1 - Math.pow(1 - zoomNorm, 2.2);
      const scale =
        INITIAL_ZOOM_SCALE - (INITIAL_ZOOM_SCALE - 1) * zoomEased;
      stage.style.opacity = "1";
      stage.style.transform = `translate3d(-50%, -50%, 0) scale(${scale.toFixed(
        4
      )})`;

      // 2. Staggered word-by-word animation:
      //    - Stage A (p: 0 -> 0.38): while held at full-screen 3.95x zoom, the dot-matrix words
      //      are already visible and sweep to full brightness word-by-word
      //    - Stage B (p: 0.44 -> 0.88): as zoom settles, each word morphs one-by-one
      //      from the dot-matrix pattern into solid chiseled lettering
      for (let i = 0; i < totalWords; i++) {
        const wordRatio = totalWords > 1 ? i / (totalWords - 1) : 0;

        // Word-by-word dot-matrix sweep while zoomed in
        const dotStart = wordRatio * 0.24;
        const dotProgress = clamp((p - dotStart) / 0.22, 0, 1);

        // Word-by-word solid fill as zoom settles
        const solidStart = 0.44 + wordRatio * 0.34;
        const solidProgress = clamp((p - solidStart) / 0.14, 0, 1);
        const solidEased =
          solidProgress * solidProgress * (3 - 2 * solidProgress);

        const wrapEl = wordWrapRefs.current[i];
        const dotEl = dotWordRefs.current[i];
        const solidEl = solidWordRefs.current[i];

        if (wrapEl) {
          const yLift = (1 - dotProgress) * 4;
          wrapEl.style.transform = `translate3d(0, ${yLift.toFixed(1)}px, 0)`;
        }

        if (dotEl) {
          // Keep dots visible right from the start (minimum 0.38 alpha across the whole word,
          // with a bright 1.0 wave sweeping left-to-right across each word)
          const sweepPct = 35 + dotProgress * 100;
          const solidEdge = Math.max(0, sweepPct - 30).toFixed(1);
          const fadeEdge = sweepPct.toFixed(1);
          const maskGrad = `linear-gradient(90deg, rgba(0,0,0,1) ${solidEdge}%, rgba(0,0,0,0.65) ${(
            sweepPct - 12
          ).toFixed(1)}%, rgba(0,0,0,0.38) ${fadeEdge}%)`;

          dotEl.style.webkitMaskImage = maskGrad;
          dotEl.style.maskImage = maskGrad;
          const dotAlpha = clamp(1 - solidEased * 0.9, 0, 1);
          dotEl.style.opacity = dotAlpha.toFixed(3);
        }

        if (solidEl) {
          const clipRight = ((1 - solidEased) * 100).toFixed(1);
          solidEl.style.opacity = solidEased.toFixed(3);
          solidEl.style.clipPath = `inset(-6% ${clipRight}% -6% 0%)`;
        }
      }

      // 3. Top quotation mark (“ ”) reveal
      if (quoteIconRef.current) {
        const iconProg = clamp((p - 0.56) / 0.2, 0, 1);
        quoteIconRef.current.style.opacity = iconProg.toFixed(3);
        quoteIconRef.current.style.transform = `translate3d(0, ${(
          (1 - iconProg) *
          14
        ).toFixed(1)}px, 0) scale(${(0.9 + 0.1 * iconProg).toFixed(3)})`;
      }

      // 4. Bottom 2-line subtitle reveal
      if (subtitleRef.current) {
        const subProg = clamp((p - 0.66) / 0.22, 0, 1);
        subtitleRef.current.style.opacity = (subProg * 0.88).toFixed(3);
        subtitleRef.current.style.transform = `translate3d(-50%, ${(
          (1 - subProg) *
          16
        ).toFixed(1)}px, 0)`;
      }

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    window.addEventListener("scroll", computeScroll, { passive: true });
    window.addEventListener("resize", computeScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", computeScroll);
      window.removeEventListener("resize", computeScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [totalWords]);

  return (
    <section
      ref={sectionRef}
      id={id}
      className="relative w-full h-[360vh] bg-transparent text-[#d5cdc0] select-none"
    >
      {/* Sticky Full-Screen Viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">

        {/* Zooming & Word-Animating Center Stage */}
        <div
          ref={quoteStageRef}
          className="absolute left-1/2 top-1/2 z-20 text-center w-max max-w-none will-change-transform origin-center"
          style={{
            opacity: 1,
            transform: `translate3d(-50%, -50%, 0) scale(${INITIAL_ZOOM_SCALE})`,
          }}
        >
          {/* Top Quotation Marks “ ” */}
          <div
            ref={quoteIconRef}
            style={{ opacity: 0 }}
            className="mb-6 sm:mb-8 will-change-transform"
          >
            <DoubleQuoteIcon />
          </div>

          {/* 3-Line Display Quote with Very Zoomed Dot-Matrix -> Solid Word-by-Word Morph */}
          <h2 className="font-condensed font-bold uppercase text-[11.2vw] sm:text-[11.2vw] lg:text-[138px] xl:text-[154px] leading-[0.86] sm:leading-[0.84] tracking-[-0.01em] whitespace-nowrap">
            {parsedLines.map((words, lineIdx) => (
              <span
                key={lineIdx}
                data-quote-line="true"
                className="block w-max mx-auto"
              >
                {words.map(({ word, globalIndex }, wordIdx) => (
                  <span
                    key={globalIndex}
                    ref={(el) => {
                      wordWrapRefs.current[globalIndex] = el;
                    }}
                    className="relative inline-block mx-[0.12em] will-change-transform"
                  >
                    {/* Layer 1: LED Dot-Matrix Word (with fine 3.4px pitch so at 3.95x zoom it forms crisp stadium dots) */}
                    <span
                      ref={(el) => {
                        dotWordRefs.current[globalIndex] = el;
                      }}
                      aria-hidden="true"
                      style={{
                        backgroundImage:
                          "radial-gradient(circle, #d5cdc0 1.05px, transparent 1.25px)",
                        backgroundSize: "3.4px 3.4px",
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        color: "transparent",
                      }}
                      className="block select-none"
                    >
                      {word}
                    </span>

                    {/* Layer 2: Solid Chiseled Word (animates in word-by-word on scroll) */}
                    <span
                      ref={(el) => {
                        solidWordRefs.current[globalIndex] = el;
                      }}
                      style={{
                        opacity: 0,
                        clipPath: "inset(-6% 100% -6% 0%)",
                      }}
                      className="absolute inset-0 block text-[#d5cdc0] will-change-[clip-path,opacity]"
                    >
                      {word}
                    </span>

                    {wordIdx < words.length - 1 ? "" : null}
                  </span>
                ))}
              </span>
            ))}
          </h2>

          {/* Bottom 2-Line Subtitle Paragraph */}
          <p
            ref={subtitleRef}
            style={{
              opacity: 0,
              transform: "translate3d(-50%, 16px, 0)",
            }}
            className="font-sans text-[13px] sm:text-[15px] md:text-[16px] leading-[1.55] sm:leading-[1.6] text-[#F5F3EF] absolute top-[calc(100%+1.5rem)] sm:top-[calc(100%+2rem)] left-1/2 w-[88vw] sm:w-max max-w-[min(34em,88vw)] whitespace-normal will-change-transform"
          >
            {subtitleLines.map((line, idx) => (
              <span key={idx} className="inline sm:block">
                {line}
                {idx < subtitleLines.length - 1 ? " " : ""}
              </span>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}
