"use client";

import { useEffect, useState } from "react";

export interface PageThemeCanvasProps {
  /** ID of the first dark section (defaults to "runs") */
  darkTriggerId?: string;
}

/**
 * Single continuous fixed background canvas for the entire page.
 * Starts in the warm editorial light theme (#f3f3f1) for Sections 1 & 2,
 * and smoothly crossfades to the deep obsidian dark theme (#0d0a12)
 * when scrolling into Section 3 ("runs") and Section 4 ("manifesto")
 * so there are zero horizontal section seams anywhere on the page.
 */
export default function PageThemeCanvas({
  darkTriggerId = "runs",
}: PageThemeCanvasProps) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkScrollTheme = () => {
      const triggerEl = document.getElementById(darkTriggerId);
      if (!triggerEl) return;
      const rect = triggerEl.getBoundingClientRect();
      // Switch smoothly to dark theme as the Recent Events section enters the upper half of viewport
      setIsDark(rect.top <= window.innerHeight * 0.55);
    };

    checkScrollTheme();
    window.addEventListener("scroll", checkScrollTheme, { passive: true });
    window.addEventListener("resize", checkScrollTheme, { passive: true });

    return () => {
      window.removeEventListener("scroll", checkScrollTheme);
      window.removeEventListener("resize", checkScrollTheme);
    };
  }, [darkTriggerId]);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-0 overflow-hidden transition-colors duration-700 ease-out ${
        isDark ? "bg-[#0d0a12]" : "bg-[#f3f3f1]"
      }`}
    >
      {/* Subtle ambient coral-red glow in dark mode */}
      <div
        className={`absolute inset-0 transition-opacity duration-700 ease-out ${
          isDark ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="absolute -top-[10%] left-[20%] w-[60vw] h-[60vh] rounded-full bg-[#FF4438]/[0.09] blur-[150px]" />
        <div className="absolute -bottom-[15%] right-[12%] w-[55vw] h-[55vh] rounded-full bg-[#6b1d2f]/[0.12] blur-[160px]" />
      </div>

      {/* Continuous film-grain texture across the entire viewport */}
      <svg
        className={`absolute inset-0 w-full h-full mix-blend-overlay transition-opacity duration-700 ${
          isDark ? "opacity-[0.14]" : "opacity-[0.04]"
        }`}
      >
        <filter id="globalFilmGrain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="3"
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#globalFilmGrain)" />
      </svg>
    </div>
  );
}
