import type { Metadata } from "next";
import { headline, manrope } from "./fonts";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Blookd — The network for independent beauty",
    template: "%s — Blookd",
  },
  description:
    "Blookd connects people with beauty professionals — and professionals with the places where they work.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${headline.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
