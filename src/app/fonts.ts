import { Manrope } from "next/font/google";
import localFont from "next/font/local";

/**
 * Two families, no more.
 *
 * Stack Sans Headline carries every heading — it is the one voice the brand
 * owns. It ships as a variable font, but only the Bold static instance is
 * loaded, which suits the type system here: headings never vary by weight,
 * only by size.
 *
 * Manrope carries everything else. Body text stays on one weight too; emphasis
 * comes from size and from the opacity ramp in globals.css, not from bolding.
 */

export const manrope = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const headline = localFont({
  src: "../fonts/StackSansHeadline-Bold.ttf",
  variable: "--font-display",
  weight: "700",
  style: "normal",
  display: "swap",
  fallback: ["Helvetica Neue", "Arial", "sans-serif"],
});
