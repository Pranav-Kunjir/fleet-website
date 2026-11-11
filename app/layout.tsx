import type { Metadata } from "next";
import {
  Archivo,
  Cormorant_Garamond,
  Teko,
  Yellowtail,
} from "next/font/google";
import "./globals.css";

const archivoSans = Archivo({
  variable: "--font-sans-display",
  subsets: ["latin"],
});

const cormorantSerif = Cormorant_Garamond({
  variable: "--font-serif-display",
  subsets: ["latin"],
});

const tekoCondensed = Teko({
  variable: "--font-condensed-display",
  subsets: ["latin"],
  weight: ["600", "700"],
});

const yellowtailScript = Yellowtail({
  variable: "--font-script-logo",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Fleet Pune — Start anywhere, celebrate together",
  description:
    "Fleet Club Pune (@fleet.pune) — Wherever you're starting from, there's a place for you at Fleet.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${archivoSans.variable} ${cormorantSerif.variable} ${tekoCondensed.variable} ${yellowtailScript.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#f3f3f1] text-[#111111]">
        {children}
      </body>
    </html>
  );
}
