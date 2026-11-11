"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import SlideArrowButton, {
  type SlideArrowButtonProps,
} from "@/components/ui/SlideArrowButton";

export interface EventSlideItem {
  id: string;
  title: string;
  subtitle?: string;
  frameColor: string;
  imageSrc: string;
  videoSrc?: string;
  href?: string;
  cursorText?: string;
}

export interface RecentEventsSectionProps {
  id?: string;
  eyebrowLines?: string[];
  headingSans?: string;
  headingSerif?: string;
  events?: EventSlideItem[];
  cta?: SlideArrowButtonProps;
}

export const DEFAULT_RECENT_EVENTS: EventSlideItem[] = [
  {
    id: "kalyani-nagar-sunrise",
    title: "KALYANI NAGAR 5K",
    subtitle: "SUNDAY SUNRISE SESSION · PUNE",
    frameColor: "#fee897",
    imageSrc:
      "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=1400&q=85",
    href: "https://www.instagram.com/fleet.pune/",
    cursorText: "VIEW EVENT →",
  },
  {
    id: "koregaon-coffee-rave",
    title: "KP COFFEE RUN",
    subtitle: "5K PACE + SPECIALTY BREW HANGOUT",
    frameColor: "#0038ff",
    imageSrc:
      "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=1400&q=85",
    href: "https://www.instagram.com/fleet.pune/",
    cursorText: "VIEW EVENT →",
  },
  {
    id: "fc-road-night-miles",
    title: "MIDNIGHT MILES",
    subtitle: "CITY LIGHTS 7K · FC ROAD TO BANER",
    frameColor: "#f45034",
    imageSrc:
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1400&q=85",
    href: "https://www.instagram.com/fleet.pune/",
    cursorText: "VIEW EVENT →",
  },
];

function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(max, val));
}

/**
 * Circular "THIS IS HOW WE SCROLL" badge in the bottom-right corner
 * that rotates as the user scrolls through the stacked event cards.
 */
function ScrollSpinBadge({
  badgeRef,
}: {
  badgeRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div
      ref={badgeRef}
      data-featured-stack-badge=""
      aria-hidden="true"
      className="hidden sm:flex fixed-or-absolute right-6 bottom-6 md:right-8 md:bottom-8 w-[88px] h-[88px] md:w-[104px] md:h-[104px] rounded-full bg-[#9db2ff] text-[#111111] items-center justify-center shadow-lg select-none pointer-events-none z-30 will-change-transform"
      style={{ position: "absolute" }}
    >
      <svg viewBox="0 0 120 120" className="w-full h-full">
        <defs>
          <path
            id="scrollBadgeCircle"
            d="M 60, 60 m -42, 0 a 42,42 0 1,1 84,0 a 42,42 0 1,1 -84,0"
          />
        </defs>
        <text
          fill="#111111"
          fontSize="11.5"
          fontWeight="900"
          fontFamily="var(--font-sans), Arial, sans-serif"
          letterSpacing="0.09em"
        >
          <textPath href="#scrollBadgeCircle" startOffset="0%">
            THIS IS HOW • WE SCROLL •
          </textPath>
        </text>
        {/* Center wireframe globe icon */}
        <g
          transform="translate(60, 60)"
          stroke="#111111"
          strokeWidth="1.8"
          fill="none"
        >
          <circle r="17" />
          <ellipse rx="9" ry="17" />
          <line x1="-17" y1="0" x2="17" y2="0" />
          <path d="M -14 -8 Q 0 -5 14 -8" />
          <path d="M -14 8 Q 0 5 14 8" />
        </g>
      </svg>
    </div>
  );
}

export default function RecentEventsSection({
  id = "runs",
  eyebrowLines = [
    "Not to be missed, made to be shared.",
    "A glimpse into our recent runs.",
  ],
  headingSans = "RECENT",
  headingSerif = "EVENTS",
  events = DEFAULT_RECENT_EVENTS,
  cta = {
    label: "VIEW ALL EVENTS",
    href: "https://www.instagram.com/fleet.pune/",
    external: true,
    bgColor: "#f472c4",
    textColor: "#111111",
  },
}: RecentEventsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const stackRootRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const badgeRef = useRef<HTMLDivElement>(null);
  const cursorPillRef = useRef<HTMLDivElement>(null);

  const [hoveredCursorText, setHoveredCursorText] = useState<string | null>(
    null
  );

  useEffect(() => {
    const section = sectionRef.current;
    const pin = pinRef.current;
    const stackRoot = stackRootRef.current;
    if (!section || !pin || !stackRoot || events.length === 0) return;

    const totalSlides = events.length;
    const totalSteps = Math.max(1, totalSlides - 1);

    // State for scrubbed scroll progress and 3D mouse tilt
    const state = {
      targetProgress: 0,
      currentProgress: 0,
      targetRotX: 0,
      targetRotY: 0,
      currentRotX: 0,
      currentRotY: 0,
      pillX: 0,
      pillY: 0,
      targetPillX: 0,
      targetPillY: 0,
      pillInitialized: false,
    };

    const computeScrollTarget = () => {
      const rect = section.getBoundingClientRect();
      const scrollableDistance = rect.height - window.innerHeight;
      if (scrollableDistance <= 0) {
        state.targetProgress = 0;
        return;
      }
      state.targetProgress = clamp(-rect.top / scrollableDistance, 0, 1);
    };

    computeScrollTarget();

    let rafId: number | null = null;

    const animate = () => {
      // Smooth scrub interpolation (matches GSAP ScrollTrigger scrub: 0.3)
      state.currentProgress +=
        (state.targetProgress - state.currentProgress) * 0.12;

      // Smooth 3D stack tilt interpolation
      state.currentRotX += (state.targetRotX - state.currentRotX) * 0.1;
      state.currentRotY += (state.targetRotY - state.currentRotY) * 0.1;

      stackRoot.style.transform = `perspective(1200px) rotateX(${state.currentRotX.toFixed(
        2
      )}deg) rotateY(${state.currentRotY.toFixed(2)}deg)`;

      // Timeline position across (N - 1) transitions
      const timelinePos = state.currentProgress * totalSteps;
      const vh = window.innerHeight;

      slideRefs.current.forEach((slideEl, idx) => {
        if (!slideEl) return;

        if (timelinePos <= idx || idx === totalSlides - 1) {
          // Card is either at the front of the stack or waiting behind it
          const depth = Math.max(0, idx - timelinePos);
          const yOffset = -depth * 20;
          const scale = 1 - depth * 0.042;
          slideEl.style.transform = `translate3d(0px, ${yOffset.toFixed(
            2
          )}px, 0px) scale(${scale.toFixed(4)})`;
          slideEl.style.opacity = "1";
          slideEl.style.pointerEvents = depth < 0.35 ? "auto" : "none";
        } else {
          // Card is currently peeling/sliding downward off the stack
          const slideProgress = clamp(timelinePos - idx, 0, 1);
          // Power2.in acceleration curve so the card drops away with gravity
          const easedDrop = Math.pow(slideProgress, 1.85);
          const yDrop = easedDrop * (vh * 0.9);
          const opacity =
            slideProgress > 0.7
              ? clamp(1 - (slideProgress - 0.7) / 0.25, 0, 1)
              : 1;

          slideEl.style.transform = `translate3d(0px, ${yDrop.toFixed(
            2
          )}px, 0px) scale(1)`;
          slideEl.style.opacity = opacity.toFixed(3);
          slideEl.style.pointerEvents = slideProgress < 0.15 ? "auto" : "none";
        }
      });

      // Rotate the bottom-right "THIS IS HOW WE SCROLL" badge
      if (badgeRef.current) {
        const spinDeg = state.currentProgress * 180;
        badgeRef.current.style.transform = `rotate(${spinDeg.toFixed(2)}deg)`;
      }

      // Update floating cursor marquee pill position
      if (cursorPillRef.current) {
        state.pillX += (state.targetPillX - state.pillX) * 0.2;
        state.pillY += (state.targetPillY - state.pillY) * 0.2;
        cursorPillRef.current.style.transform = `translate3d(${state.pillX.toFixed(
          1
        )}px, ${state.pillY.toFixed(1)}px, 0) translate(-50%, -50%)`;
      }

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    const handleScroll = () => {
      computeScrollTarget();
    };

    const handlePointerMove = (e: PointerEvent) => {
      const rect = pin.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width - 0.5;
      const relY = (e.clientY - rect.top) / rect.height - 0.5;

      state.targetRotX = -relY * 6;
      state.targetRotY = relX * 10;

      const localX = e.clientX - rect.left;
      const localY = e.clientY - rect.top;
      if (!state.pillInitialized) {
        state.pillInitialized = true;
        state.pillX = localX;
        state.pillY = localY;
      }
      state.targetPillX = localX;
      state.targetPillY = localY;
    };

    const handlePointerLeave = () => {
      state.targetRotX = 0;
      state.targetRotY = 0;
      setHoveredCursorText(null);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    pin.addEventListener("pointermove", handlePointerMove);
    pin.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      pin.removeEventListener("pointermove", handlePointerMove);
      pin.removeEventListener("pointerleave", handlePointerLeave);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [events.length]);

  return (
    <section
      ref={sectionRef}
      id={id}
      data-nav-theme="dark"
      data-featured-stack=""
      style={{ height: `${Math.max(2, events.length) * 115}vh` }}
      className="relative w-full bg-[#121212] text-white select-none"
    >
      {/* Sticky Pinned Viewport */}
      <div
        ref={pinRef}
        data-featured-stack-pin=""
        className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-between pt-20 pb-8 sm:pt-24 sm:pb-10 px-4 sm:px-8"
      >
        {/* Floating Cursor Pill Marquee when hovering an event card */}
        <div
          ref={cursorPillRef}
          aria-hidden="true"
          className={`pointer-events-none absolute left-0 top-0 z-50 transition-opacity duration-200 ${
            hoveredCursorText ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="bg-white text-[#0033ff] rounded-full px-3.5 py-1.5 shadow-md overflow-hidden max-w-[128px] whitespace-nowrap">
            <div className="inline-flex items-center gap-3 text-[11px] font-extrabold uppercase tracking-tight animate-pulse">
              <span>{hoveredCursorText ?? "VIEW EVENT →"}</span>
              <span>{hoveredCursorText ?? "VIEW EVENT →"}</span>
            </div>
          </div>
        </div>

        {/* Top Editorial Eyebrow + Mixed Display Heading */}
        <div className="flex flex-col items-center text-center z-20">
          <p className="font-serif text-[20px] sm:text-[25px] md:text-[29px] leading-[1.06] tracking-[-0.01em] text-white/95 mb-2 sm:mb-3">
            {eyebrowLines.map((line, index) => (
              <span key={index} className="block">
                {line}
              </span>
            ))}
          </p>

          <h2 className="inline-flex items-baseline gap-[0.22em] uppercase text-[11vw] sm:text-[68px] md:text-[86px] lg:text-[102px] leading-[0.86]">
            <span className="font-sans font-black tracking-[-0.045em]">
              {headingSans}
            </span>
            <span className="font-serif font-normal tracking-[-0.025em]">
              {headingSerif}
            </span>
          </h2>
        </div>

        {/* Center 3D Stacked Event Cards */}
        <div className="relative w-full max-w-[660px] aspect-[16/9.6] my-auto flex items-center justify-center z-20 pt-6">
          <div
            ref={stackRootRef}
            data-featured-stack-root=""
            className="relative w-full h-full will-change-transform"
          >
            {events.map((event, idx) => {
              const isExternal =
                (event.href ?? "").startsWith("http") || !event.href;
              return (
                <div
                  key={event.id}
                  ref={(el) => {
                    slideRefs.current[idx] = el;
                  }}
                  data-featured-stack-slide=""
                  style={{ zIndex: events.length - idx }}
                  className="absolute inset-0 w-full h-full will-change-transform origin-center"
                >
                  <Link
                    href={event.href ?? "https://www.instagram.com/fleet.pune/"}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                    onPointerEnter={() =>
                      setHoveredCursorText(event.cursorText ?? "VIEW EVENT →")
                    }
                    onPointerLeave={() => setHoveredCursorText(null)}
                    style={{ backgroundColor: event.frameColor }}
                    className="group block w-full h-full p-2.5 sm:p-3.5 shadow-[0_22px_60px_rgba(0,0,0,0.45)] focus:outline-none"
                  >
                    <div className="relative w-full h-full overflow-hidden bg-[#1a1a1a]">
                      {event.videoSrc ? (
                        <video
                          src={event.videoSrc}
                          poster={event.imageSrc}
                          autoPlay
                          loop
                          muted
                          playsInline
                          controls={false}
                          disablePictureInPicture
                          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 pointer-events-none"
                        />
                      ) : (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={event.imageSrc}
                          alt={event.title}
                          draggable={false}
                          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                      )}

                      {/* Dark bottom vignette overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />

                      {/* Event Title at Bottom Center */}
                      <div className="absolute inset-x-0 bottom-4 sm:bottom-6 px-4 flex flex-col items-center text-center">
                        {event.subtitle && (
                          <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.12em] uppercase text-white/80 mb-1">
                            {event.subtitle}
                          </span>
                        )}
                        <h3 className="font-sans font-black uppercase text-white text-[26px] sm:text-[40px] md:text-[50px] leading-[0.92] tracking-[-0.04em] drop-shadow-sm">
                          {event.title}
                        </h3>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Pink Split CTA Button */}
        <div className="z-20 pt-2">
          <SlideArrowButton {...cta} />
        </div>

        {/* Bottom-Right Spinning Scroll Badge */}
        <ScrollSpinBadge badgeRef={badgeRef} />
      </div>
    </section>
  );
}
