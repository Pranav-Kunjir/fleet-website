"use client";

import Link from "next/link";
import SquigglyUnderline, {
  smoothScrollToHref,
  useSquigglyHover,
} from "@/components/ui/SquigglyUnderline";
import { BrandLogo } from "@/components/navbar/Navbar";

export interface FooterLinkItem {
  label: string;
  href: string;
  external?: boolean;
}

export interface FooterProps {
  brandTitle?: string;
  navigationLinks?: FooterLinkItem[];
  meetupLines?: string[];
  meetupMapHref?: string;
  contactLinks?: FooterLinkItem[];
  socialLinks?: FooterLinkItem[];
  bottomLinks?: FooterLinkItem[];
}

function FooterHoverLink({
  item,
  variant = 0,
  className = "",
}: {
  item: FooterLinkItem;
  variant?: number;
  className?: string;
}) {
  const isExternal = item.external ?? item.href.startsWith("http");
  const { pathRef, hoverHandlers } = useSquigglyHover(false, variant);

  return (
    <Link
      href={item.href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      onClick={(e) => {
        if (!isExternal) smoothScrollToHref(e, item.href);
      }}
      onMouseEnter={hoverHandlers.onMouseEnter}
      onMouseLeave={hoverHandlers.onMouseLeave}
      className={`relative inline-flex flex-col items-start w-fit text-white/75 hover:text-white transition-colors ${className}`}
    >
      <span className="relative z-10">{item.label}</span>
      <SquigglyUnderline
        pathRef={pathRef}
        variant={variant}
        color="#FF4438"
        strokeWidth={10}
        className="absolute -bottom-[5px] left-0 h-[7px] w-full"
      />
    </Link>
  );
}

const DEFAULT_NAV_LINKS: FooterLinkItem[] = [
  { label: "About", href: "#about" },
  { label: "Events", href: "#runs" },
  { label: "Manifesto", href: "#manifesto" },
  {
    label: "AroundU Club",
    href: "https://aroundu.in/club/fleet-pune",
    external: true,
  },
  {
    label: "Join WhatsApp",
    href: "https://chat.whatsapp.com/JjWiqqEtATd4FxIgWjf61k",
    external: true,
  },
];

const DEFAULT_MEETUP_LINES: string[] = [
  "Across Pune",
  "Every weekend",
  "7:00 AM start",
];

const DEFAULT_CONTACT_LINKS: FooterLinkItem[] = [
  {
    label: "aroundu.in/club/fleet-pune",
    href: "https://aroundu.in/club/fleet-pune",
    external: true,
  },
  {
    label: "@fleet.pune",
    href: "https://www.instagram.com/fleet.pune/",
    external: true,
  },
];

const DEFAULT_SOCIAL_LINKS: FooterLinkItem[] = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/fleet.pune/",
    external: true,
  },
  {
    label: "WhatsApp",
    href: "https://chat.whatsapp.com/JjWiqqEtATd4FxIgWjf61k",
    external: true,
  },
  {
    label: "AroundU",
    href: "https://aroundu.in/club/fleet-pune",
    external: true,
  },
];

const DEFAULT_BOTTOM_LINKS: FooterLinkItem[] = [
  {
    label: "WhatsApp Community",
    href: "https://chat.whatsapp.com/JjWiqqEtATd4FxIgWjf61k",
    external: true,
  },
  {
    label: "AroundU Storefront",
    href: "https://aroundu.in/club/fleet-pune",
    external: true,
  },
];

export default function Footer({
  brandTitle = "Fleet Pune",
  navigationLinks = DEFAULT_NAV_LINKS,
  meetupLines = DEFAULT_MEETUP_LINES,
  meetupMapHref = "https://maps.google.com/?q=Pune,+Maharashtra",
  contactLinks = DEFAULT_CONTACT_LINKS,
  socialLinks = DEFAULT_SOCIAL_LINKS,
  bottomLinks = DEFAULT_BOTTOM_LINKS,
}: FooterProps) {
  const { pathRef: addressPathRef, hoverHandlers: addressHover } =
    useSquigglyHover(false, 2);

  return (
    <footer className="relative z-20 w-full bg-transparent text-[#F5F3EF] px-6 md:px-10 pt-10 select-none">
      <div className="max-w-[1440px] mx-auto">
        {/* Top Horizontal Rule */}
        <div className="w-full h-px bg-white/15" />

        {/* Main Footer Content */}
        <div className="py-10 sm:py-14 md:py-20 grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 lg:gap-8 items-start">
          {/* Left: Large Tilted Script Signature + Winged Emblem */}
          <div className="lg:col-span-6 flex items-center justify-between lg:justify-start pt-1 md:pt-4 md:pl-8">
            <Link
              href="/"
              onClick={(e) => smoothScrollToHref(e, "/")}
              aria-label="Scroll to top"
              className="group inline-flex items-center gap-4 sm:gap-5 focus:outline-none"
            >
              <BrandLogo />
              <span className="font-script text-[44px] sm:text-[72px] md:text-[86px] leading-none text-white -rotate-6 inline-block tracking-tight transition-colors duration-300 group-hover:text-[#FF4438]">
                {brandTitle}
              </span>
            </Link>

            {/* Mobile Scroll-to-Top Button */}
            <button
              type="button"
              onClick={() =>
                window.scrollTo({ top: 0, behavior: "smooth" })
              }
              aria-label="Back to top"
              className="sm:hidden group relative w-8 h-8 bg-[#2c2c30] text-white inline-flex items-center justify-center overflow-hidden shrink-0 cursor-pointer"
            >
              <span className="absolute inset-0 bg-[#FF4438] translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0" />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 15 16"
                fill="none"
                className="relative z-10 w-3.5 h-3.5 transition-colors duration-300 group-hover:text-[#0a0a0c]"
              >
                <path
                  d="M14.7835 9.48099L11.3653 6.86942L7.88099 4.15207L8.84628 2.02314L8.84628 16L5.93719 16L5.93719 2.02314L6.90248 4.15207L3.41818 6.86942L-2.84955e-07 9.48099L-4.51997e-07 5.65951L7.39173 -3.23103e-07L14.7835 5.65951L14.7835 9.48099Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>

          {/* Right: 3 Columns (Navigation, Contact, Socials) + Desktop Scroll Top Button */}
          <div className="lg:col-span-6 flex items-start justify-between gap-6 sm:gap-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-8 sm:gap-12 md:gap-16 flex-1">
              {/* Column 1: Navigation */}
              <div className="flex flex-col">
                <h3 className="font-sans font-black uppercase text-[12px] sm:text-[13px] tracking-[-0.02em] text-white mb-3 sm:mb-4">
                  NAVIGATION
                </h3>
                <div className="flex flex-col gap-2 font-serif text-[18px] sm:text-[20px] md:text-[22px] leading-[1.25]">
                  {navigationLinks.map((item, idx) => (
                    <FooterHoverLink
                      key={item.label}
                      item={item}
                      variant={idx}
                    />
                  ))}
                </div>
              </div>

              {/* Column 2: Contact / Meetup Spot */}
              <div className="flex flex-col">
                <h3 className="font-sans font-black uppercase text-[12px] sm:text-[13px] tracking-[-0.02em] text-white mb-3 sm:mb-4">
                  CONTACT
                </h3>
                <div className="flex flex-col gap-3.5 sm:gap-4 font-serif text-[18px] sm:text-[20px] md:text-[22px] leading-[1.25]">
                  <a
                    href={meetupMapHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    onMouseEnter={addressHover.onMouseEnter}
                    onMouseLeave={addressHover.onMouseLeave}
                    className="relative inline-flex flex-col items-start w-fit text-white/75 hover:text-white transition-colors"
                  >
                    {meetupLines.map((line, idx) => (
                      <span key={idx} className="block">
                        {line}
                      </span>
                    ))}
                    <SquigglyUnderline
                      pathRef={addressPathRef}
                      variant={2}
                      color="#FF4438"
                      strokeWidth={10}
                      className="absolute -bottom-[5px] left-0 h-[7px] w-full"
                    />
                  </a>

                  <div className="flex flex-col gap-2 pt-1 break-all sm:break-normal">
                    {contactLinks.map((item, idx) => (
                      <FooterHoverLink
                        key={item.label}
                        item={item}
                        variant={idx + 3}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Column 3: Socials */}
              <div className="flex flex-col col-span-2 sm:col-span-1">
                <h3 className="font-sans font-black uppercase text-[12px] sm:text-[13px] tracking-[-0.02em] text-white mb-3 sm:mb-4">
                  SOCIALS
                </h3>
                <div className="flex flex-row sm:flex-col gap-6 sm:gap-2 font-serif text-[18px] sm:text-[20px] md:text-[22px] leading-[1.25]">
                  {socialLinks.map((item, idx) => (
                    <FooterHoverLink
                      key={item.label}
                      item={item}
                      variant={idx + 5}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Far Right: Desktop Scroll-to-Top Square Button */}
            <button
              type="button"
              onClick={() =>
                window.scrollTo({ top: 0, behavior: "smooth" })
              }
              aria-label="Back to top"
              className="hidden sm:inline-flex group relative w-7 h-7 bg-[#2c2c30] text-white items-center justify-center overflow-hidden shrink-0 mt-0.5 cursor-pointer"
            >
              <span className="absolute inset-0 bg-[#FF4438] translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0" />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 15 16"
                fill="none"
                className="relative z-10 w-3 h-3 transition-colors duration-300 group-hover:text-[#0a0a0c]"
              >
                <path
                  d="M14.7835 9.48099L11.3653 6.86942L7.88099 4.15207L8.84628 2.02314L8.84628 16L5.93719 16L5.93719 2.02314L6.90248 4.15207L3.41818 6.86942L-2.84955e-07 9.48099L-4.51997e-07 5.65951L7.39173 -3.23103e-07L14.7835 5.65951L14.7835 9.48099Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Bottom Legal Bar */}
        <div className="w-full h-px bg-white/15" />
        <div className="py-5 flex flex-col sm:flex-row items-center justify-between gap-4 font-serif text-[15px] text-white/60">
          <div>© 2026 Fleet Pune</div>

          <div className="flex items-center gap-8">
            {bottomLinks.map((item, idx) => (
              <FooterHoverLink
                key={item.label}
                item={item}
                variant={idx + 1}
                className="text-[15px] text-white/60"
              />
            ))}
          </div>

          <div>Beyond Sports · Pune</div>
        </div>
      </div>
    </footer>
  );
}
