"use client";

import Link from "next/link";

export interface SlideArrowButtonProps {
  label?: string;
  href?: string;
  external?: boolean;
  bgColor?: string;
  textColor?: string;
  className?: string;
}

function ArrowRightIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 14 13"
      fill="none"
      className="w-3.5 h-3.5"
      aria-hidden="true"
    >
      <path
        d="M5.70413 12.9355L7.98926 9.94463L10.3669 6.89587L12.2298 7.74049L0 7.74049L0 5.19504L12.2298 5.19504L10.3669 6.03967L7.98926 2.99091L5.70413 0L9.04793 0L14 6.46777L9.04793 12.9355H5.70413Z"
        fill="currentColor"
      />
    </svg>
  );
}

/**
 * Reusable royal-blue split CTA button matching the `[ → | MEER OVER ONS ]` button.
 * On hover, the arrow box smoothly slides from the left side to the right side.
 */
export default function SlideArrowButton({
  label = "MORE ABOUT US",
  href = "https://www.instagram.com/fleet.pune/",
  external,
  bgColor = "#FF4438",
  textColor = "#ffffff",
  className = "",
}: SlideArrowButtonProps) {
  const isExternal = external ?? href.startsWith("http");

  return (
    <Link
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      style={{ color: textColor }}
      className={`group inline-flex items-center select-none focus:outline-none ${className}`}
    >
      {/* Left arrow box (visible at rest, collapses on hover) */}
      <span
        style={{ backgroundColor: bgColor }}
        className="w-[42px] h-[42px] inline-flex items-center justify-center overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:w-0 group-hover:opacity-0 mr-[1.5px] group-hover:mr-0"
      >
        <ArrowRightIcon />
      </span>

      {/* Label pill */}
      <span
        style={{ backgroundColor: bgColor }}
        className="h-[42px] px-5 inline-flex items-center justify-center text-[11px] font-extrabold uppercase tracking-[-0.02em] whitespace-nowrap"
      >
        {label}
      </span>

      {/* Right arrow box (collapsed at rest, expands on hover) */}
      <span
        style={{ backgroundColor: bgColor }}
        className="w-0 h-[42px] opacity-0 inline-flex items-center justify-center overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:w-[42px] group-hover:opacity-100 ml-0 group-hover:ml-[1.5px]"
      >
        <ArrowRightIcon />
      </span>
    </Link>
  );
}
