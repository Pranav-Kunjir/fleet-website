"use client";

import { useState, type ReactNode } from "react";

export interface CollagePolaroidItem {
  imageSrc: string;
  alt: string;
}

export interface InteractiveCollageProps {
  largePolaroid?: CollagePolaroidItem;
  mediumPolaroid?: CollagePolaroidItem;
  stickerSrc?: string;
  stickerBadge?: ReactNode;
  className?: string;
}

/**
 * Default pink die-cut "RUN CLUB" sticker with the running bird crest,
 * matching the sticker overlapping the two Polaroids in the reference design.
 */
export function RunClubSticker({
  monogram = "FP",
  line1 = "RUN",
  line2 = "CLUB",
}: {
  monogram?: string;
  line1?: string;
  line2?: string;
}) {
  return (
    <svg
      viewBox="0 0 230 175"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto drop-shadow-[0_6px_16px_rgba(0,0,0,0.12)] select-none"
      role="img"
      aria-label={`${monogram} ${line1} ${line2} sticker`}
    >
      {/* Die-cut coral-red sticker base under the bird */}
      <path
        d="M84 52 C74 48 64 49 60 42 C56 35 66 28 76 29 C85 30 95 24 101 14 C105 6 115 2 124 6 C133 10 134 20 142 18 C150 16 157 22 155 31 C153 39 144 45 140 50 C145 55 148 62 145 68 L82 72 Z"
        fill="#FF4438"
      />

      {/* Die-cut coral-red rounded rectangle base for text */}
      <rect
        x="8"
        y="62"
        width="214"
        height="98"
        rx="18"
        transform="rotate(-4 115 111)"
        fill="#FF4438"
      />

      {/* Running bird illustration on top */}
      <g
        stroke="#0a0a0c"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Bird body & tail */}
        <path
          d="M68 41 C84 41 96 36 106 24 C110 18 112 11 118 11 C124 11 126 17 125 23 C124 31 131 38 124 46 C116 54 96 53 84 47 Z"
          fill="#FF4438"
        />
        {/* Wing raised */}
        <path
          d="M112 33 C122 25 135 20 145 23 C143 30 138 35 131 38 C137 38 142 40 144 44 C136 47 125 46 116 42"
          fill="#FF4438"
        />
        {/* Beak & eye */}
        <path d="M125 15 L133 18 L125 21" fill="#0a0a0c" />
        <circle cx="119" cy="16" r="1.8" fill="#0a0a0c" stroke="none" />
        {/* Tail feathers */}
        <path d="M68 41 L58 38 M71 44 L61 45" />
        {/* Running legs */}
        <path d="M102 51 L95 62 L88 60 M95 62 L101 64" />
        <path d="M116 50 L125 60 L132 57 M125 60 L121 64" />
      </g>

      {/* Main sticker text group tilted -4deg */}
      <g transform="rotate(-4 115 111)">
        {/* Bold Serif Monogram (FP / EF) */}
        <text
          x="20"
          y="138"
          fill="#111111"
          fontSize="74"
          fontWeight="900"
          fontFamily="Georgia, 'Times New Roman', serif"
          letterSpacing="-0.05em"
        >
          {monogram}
        </text>

        {/* Stacked Condensed Sans "RUN" / "CLUB" */}
        <text
          x="112"
          y="104"
          fill="#111111"
          fontSize="36"
          fontWeight="900"
          fontFamily="var(--font-sans), Arial, sans-serif"
          letterSpacing="-0.03em"
        >
          {line1}
        </text>
        <text
          x="112"
          y="138"
          fill="#111111"
          fontSize="36"
          fontWeight="900"
          fontFamily="var(--font-sans), Arial, sans-serif"
          letterSpacing="-0.03em"
        >
          {line2}
        </text>
      </g>
    </svg>
  );
}

const DEFAULT_LARGE_POLAROID: CollagePolaroidItem = {
  imageSrc:
    "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1000&q=85",
  alt: "Fleet Pune crew hanging out after a morning run",
};

const DEFAULT_MEDIUM_POLAROID: CollagePolaroidItem = {
  imageSrc:
    "https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=800&q=85",
  alt: "Fleet Pune club jersey and run gear",
};

export default function InteractiveCollage({
  largePolaroid = DEFAULT_LARGE_POLAROID,
  mediumPolaroid = DEFAULT_MEDIUM_POLAROID,
  stickerSrc,
  stickerBadge,
  className = "",
}: InteractiveCollageProps) {
  const [hoveredItem, setHoveredItem] = useState<
    "large" | "sticker" | "medium" | null
  >(null);

  // Compute smooth transform values matching the Extrafazant interactive-collage physics
  const getLargeTransform = () => {
    if (hoveredItem === "large") {
      return "translate3d(0%, 0%, 0) scale(1.075) rotate(0deg)";
    }
    if (hoveredItem === "sticker") {
      return "translate3d(-5.5%, 2.5%, 0) scale(0.91) rotate(-3.2deg)";
    }
    if (hoveredItem === "medium") {
      return "translate3d(-6.5%, -2.5%, 0) scale(0.9) rotate(-3.8deg)";
    }
    return "translate3d(0%, 0%, 0) scale(1) rotate(0deg)";
  };

  const getMediumTransform = () => {
    if (hoveredItem === "medium") {
      return "translate3d(0%, 0%, 0) scale(1.075) rotate(0deg)";
    }
    if (hoveredItem === "large") {
      return "translate3d(7.5%, 4.5%, 0) scale(0.9) rotate(3.8deg)";
    }
    if (hoveredItem === "sticker") {
      return "translate3d(5.5%, 4%, 0) scale(0.91) rotate(3.2deg)";
    }
    return "translate3d(0%, 0%, 0) scale(1) rotate(0deg)";
  };

  const getStickerTransform = () => {
    if (hoveredItem === "sticker") {
      return "translate3d(0%, -4%, 0) scale(1.12) rotate(2deg)";
    }
    if (hoveredItem === "large") {
      return "translate3d(9%, -8%, 0) scale(0.92) rotate(5deg)";
    }
    if (hoveredItem === "medium") {
      return "translate3d(-10%, -9%, 0) scale(0.92) rotate(-5.5deg)";
    }
    return "translate3d(0%, 0%, 0) scale(1) rotate(0deg)";
  };

  return (
    <div
      data-interactive-collage-init=""
      onPointerLeave={() => setHoveredItem(null)}
      className={`relative w-full max-w-[680px] aspect-[1.08/1] mx-auto select-none ${className}`}
    >
      {/* 1. Large Left Polaroid */}
      <div
        data-interactive-collage-item=""
        onPointerEnter={() => setHoveredItem("large")}
        onPointerMove={() => {
          if (hoveredItem !== "large") setHoveredItem("large");
        }}
        className={`absolute left-[2%] top-[2%] w-[58%] cursor-pointer ${
          hoveredItem === "large" ? "z-20" : "z-10"
        }`}
      >
        <div
          data-interactive-collage-item-inner=""
          style={{ transform: getLargeTransform() }}
          className="transition-transform duration-[750ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform"
        >
          <div className="bg-white p-3 sm:p-4 pb-8 sm:pb-11 -rotate-[2.8deg] shadow-[0_18px_45px_rgba(0,0,0,0.08)]">
            <div className="relative w-full aspect-[4/5.1] overflow-hidden bg-[#e5e5e2]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={largePolaroid.imageSrc}
                alt={largePolaroid.alt}
                draggable={false}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Medium Right Polaroid */}
      <div
        data-interactive-collage-item=""
        onPointerEnter={() => setHoveredItem("medium")}
        onPointerMove={() => {
          if (hoveredItem !== "medium") setHoveredItem("medium");
        }}
        className={`absolute left-[51%] bottom-[2%] w-[44%] cursor-pointer ${
          hoveredItem === "medium" ? "z-20" : "z-10"
        }`}
      >
        <div
          data-interactive-collage-item-inner=""
          style={{ transform: getMediumTransform() }}
          className="transition-transform duration-[750ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform"
        >
          <div className="bg-white p-2.5 sm:p-3.5 pb-8 sm:pb-11 rotate-[4.2deg] shadow-[0_18px_45px_rgba(0,0,0,0.09)]">
            <div className="relative w-full aspect-[4/4.7] overflow-hidden bg-[#1b2230]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={mediumPolaroid.imageSrc}
                alt={mediumPolaroid.alt}
                draggable={false}
                className="w-full h-full object-cover"
              />
              {/* Subtle club tee graphic overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent flex items-center justify-center p-4 text-center">
                <span className="font-sans font-black uppercase text-white text-[13px] sm:text-[17px] leading-[0.95] tracking-tight -rotate-12 drop-shadow">
                  WEEKEND PLANS,
                  <br />
                  FIXED BY FLEET
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Center Overlapping Die-Cut Run Club Sticker */}
      <div
        data-interactive-collage-item=""
        onPointerEnter={() => setHoveredItem("sticker")}
        onPointerMove={() => {
          if (hoveredItem !== "sticker") setHoveredItem("sticker");
        }}
        className="absolute left-[41%] top-[32%] w-[27%] z-30 cursor-pointer"
      >
        <div
          data-interactive-collage-item-inner=""
          style={{ transform: getStickerTransform() }}
          className="transition-transform duration-[750ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform"
        >
          {stickerSrc ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={stickerSrc}
              alt="Run Club Sticker"
              draggable={false}
              className="w-full h-auto"
            />
          ) : (
            stickerBadge ?? <RunClubSticker monogram="FP" line1="RUN" line2="CLUB" />
          )}
        </div>
      </div>
    </div>
  );
}
