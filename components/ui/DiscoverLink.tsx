"use client";

import Link from "next/link";
import SquigglyUnderline, {
  useSquigglyHover,
} from "@/components/ui/SquigglyUnderline";

export interface DiscoverLinkProps {
  label?: string;
  href?: string;
  external?: boolean;
  lineVariant?: number;
  className?: string;
}

export default function DiscoverLink({
  label = "Join the fleet",
  href = "https://www.instagram.com/fleet.pune/",
  external,
  lineVariant = 0,
  className = "",
}: DiscoverLinkProps) {
  const isExternal = external ?? href.startsWith("http");
  const { pathRef, hoverHandlers } = useSquigglyHover(true, lineVariant);

  return (
    <Link
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      onMouseEnter={hoverHandlers.onMouseEnter}
      onMouseLeave={hoverHandlers.onMouseLeave}
      className={`group inline-flex items-start gap-2.5 text-[#111111] focus:outline-none ${className}`}
    >
      <span className="relative inline-flex flex-col items-center">
        <span className="font-serif text-[21px] md:text-[23px] leading-none tracking-[-0.01em]">
          {label}
        </span>
        {/* Hand-drawn organic squiggly underline that animates left-to-right on hover */}
        <SquigglyUnderline
          pathRef={pathRef}
          variant={lineVariant}
          alwaysVisible
          color="#0033ff"
          strokeWidth={9.5}
          className="h-[11px] mt-1.5"
        />
      </span>

      {/* Royal blue square button with downward arrow */}
      <span
        className="w-[22px] h-[22px] bg-[#0033ff] text-white inline-flex items-center justify-center mt-0.5 transition-transform duration-200 group-hover:translate-y-0.5"
        aria-hidden="true"
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6 2V9.5M6 9.5L2.5 6M6 9.5L9.5 6"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="square"
          />
        </svg>
      </span>
    </Link>
  );
}
