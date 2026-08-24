import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * The page's type roles.
 *
 * Anything that sets a heading size should come from here rather than reaching
 * for text-4xl in a page — that is how a scale drifts. Sizes live in
 * globals.css as --text-display-*.
 */

export function Eyebrow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-ink-06 px-3 py-1.5",
        "font-sans text-[13px] font-medium text-ink-62",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function SectionHeading({
  children,
  as: Tag = "h2",
  className,
  id,
}: {
  children: ReactNode;
  as?: "h1" | "h2" | "h3";
  className?: string;
  id?: string;
}) {
  return (
    <Tag id={id} className={cn("text-display-2", className)}>
      {children}
    </Tag>
  );
}

/**
 * A statement paragraph where the opening clause carries full contrast and the
 * rest drops back — the reference uses this to make one long sentence read as
 * a headline plus its own footnote.
 */
export function LeadStatement({
  lead,
  children,
  className,
}: {
  lead: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "max-w-[46ch] text-[22px] leading-[1.35] md:text-[28px]",
        className,
      )}
    >
      <span className="text-foreground">{lead}</span>{" "}
      <span className="text-ink-62">{children}</span>
    </p>
  );
}

export function Lede({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={cn("max-w-[52ch] text-[17px] leading-[1.55] text-ink-62", className)}>
      {children}
    </p>
  );
}
