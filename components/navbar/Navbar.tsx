"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import SquigglyUnderline, {
  useSquigglyHover,
} from "@/components/ui/SquigglyUnderline";

export interface NavItem {
  label: string;
  href: string;
  external?: boolean;
  /** Optional index to pick a specific squiggly underline SVG variant */
  lineVariant?: number;
}

export interface NavbarAction {
  label: string;
  href: string;
  showIndicator?: boolean;
  indicatorColor?: string;
  external?: boolean;
  lineVariant?: number;
}

export interface NavbarProps {
  brand?: ReactNode;
  brandHref?: string;
  items?: NavItem[];
  action?: NavbarAction;
  className?: string;
}

const DEFAULT_NAV_ITEMS: NavItem[] = [
  { label: "ABOUT", href: "#about", lineVariant: 0 },
  { label: "RUNS", href: "#runs", lineVariant: 1 },
  {
    label: "COMMUNITY",
    href: "https://www.instagram.com/fleet.pune/",
    external: true,
    lineVariant: 2,
  },
];

const DEFAULT_ACTION: NavbarAction = {
  label: "JOIN US",
  href: "https://www.instagram.com/fleet.pune/",
  showIndicator: true,
  external: true,
  lineVariant: 3,
};

/**
 * Reusable white pill/box container used by navbar groups and action buttons.
 */
export function NavSurface({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-white px-5 py-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.03)] flex items-center ${className}`}
    >
      {children}
    </div>
  );
}

/**
 * Reusable single navigation link item with a unique left-to-right animated squiggly underline.
 */
export function NavbarLink({
  item,
  variant = 0,
}: {
  item: NavItem;
  variant?: number;
}) {
  const isExternal = item.external ?? item.href.startsWith("http");
  const resolvedVariant = item.lineVariant ?? variant;
  const { pathRef, hoverHandlers } = useSquigglyHover(false, resolvedVariant);

  return (
    <Link
      href={item.href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      onMouseEnter={hoverHandlers.onMouseEnter}
      onMouseLeave={hoverHandlers.onMouseLeave}
      className="relative inline-flex flex-col items-center text-[11px] font-extrabold tracking-[-0.02em] uppercase text-[#111111]"
    >
      <span className="relative z-10">{item.label}</span>
      <SquigglyUnderline
        pathRef={pathRef}
        variant={resolvedVariant}
        color="#0033ff"
        strokeWidth={11}
        className="absolute -bottom-[6px] left-0 h-[7px] w-full"
      />
    </Link>
  );
}

/**
 * Reusable action button with indicator dot and its own unique squiggly hover line.
 */
export function NavbarActionButton({
  action,
  variant = 3,
}: {
  action: NavbarAction;
  variant?: number;
}) {
  const isExternal = action.external ?? action.href.startsWith("http");
  const resolvedVariant = action.lineVariant ?? variant;
  const { pathRef, hoverHandlers } = useSquigglyHover(false, resolvedVariant);

  return (
    <Link
      href={action.href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      onMouseEnter={hoverHandlers.onMouseEnter}
      onMouseLeave={hoverHandlers.onMouseLeave}
      className="group inline-flex"
    >
      <NavSurface className="gap-2 px-4 py-3.5">
        {action.showIndicator !== false && (
          <span
            className="w-1.5 h-1.5 rounded-full bg-[#0033ff] transition-transform duration-200 group-hover:scale-125"
            aria-hidden="true"
          />
        )}
        <span className="relative inline-flex flex-col items-center text-[11px] font-extrabold tracking-[-0.02em] uppercase text-[#111111]">
          <span className="relative z-10">{action.label}</span>
          <SquigglyUnderline
            pathRef={pathRef}
            variant={resolvedVariant}
            color="#0033ff"
            strokeWidth={11}
            className="absolute -bottom-[6px] left-0 h-[7px] w-full"
          />
        </span>
      </NavSurface>
    </Link>
  );
}

/**
 * Default Fleet Pune brush-script logo mark.
 */
export function BrandLogo({ text = "Fleet Pune" }: { text?: string }) {
  return (
    <span className="font-script text-[28px] md:text-[32px] leading-none text-[#0033ff] inline-block -rotate-6 select-none tracking-tight">
      {text}
    </span>
  );
}

/**
 * Reusable top navigation bar with left brand, centered link island, and right CTA island.
 */
export default function Navbar({
  brand = <BrandLogo />,
  brandHref = "/",
  items = DEFAULT_NAV_ITEMS,
  action = DEFAULT_ACTION,
  className = "",
}: NavbarProps) {
  return (
    <header
      className={`fixed top-0 left-0 right-0 w-full px-6 py-5 md:px-8 md:py-6 flex items-center justify-between z-50 pointer-events-none ${className}`}
    >
      {/* Left: Brand Logo */}
      <Link
        href={brandHref}
        aria-label="Fleet Pune Home"
        className="pointer-events-auto inline-flex items-center focus:outline-none"
      >
        {brand}
      </Link>

      {/* Center: Navigation Links Box */}
      {items.length > 0 && (
        <nav
          aria-label="Primary Navigation"
          className="pointer-events-auto hidden sm:block absolute left-1/2 -translate-x-1/2"
        >
          <NavSurface className="gap-5 md:gap-6 px-5 py-3.5">
            {items.map((item, idx) => (
              <NavbarLink
                key={item.href + item.label}
                item={item}
                variant={idx}
              />
            ))}
          </NavSurface>
        </nav>
      )}

      {/* Right: Action / Join Us Button */}
      {action && (
        <div className="pointer-events-auto inline-flex">
          <NavbarActionButton action={action} variant={items.length} />
        </div>
      )}
    </header>
  );
}
