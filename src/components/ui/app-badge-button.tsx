import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * An app-store style badge: mark, two lines, a chevron, and a light that sweeps
 * across on hover.
 *
 * Adapted from the supplied gradient button, with three changes worth naming.
 *
 * It renders a `Link`, not a `button` — every use of it navigates, and a button
 * that navigates loses middle-click, open-in-new-tab and the status bar.
 *
 * The gradient stops are fixed classes rather than props. Passing them in reads
 * well but cannot work: Tailwind finds classes by scanning source text, and
 * `dark:${gradientDark.from}` is assembled at runtime, so that string is never
 * in the source and the rule is never generated. The original's dark variants
 * were silently dead for exactly this reason.
 *
 * The icon slot takes a node and styles nothing inside it. The original cloned
 * the element to force `w-7 h-7 text-white`, which suits a lucide stroke and
 * ruins a full-colour app icon — and these badges exist to show the app icon.
 */
export function AppBadgeButton({
  href,
  icon,
  title,
  subtitle,
  className,
}: {
  href: string;
  /** Sized by the caller. A 40px app mark is what this was built around. */
  icon: ReactNode;
  title: string;
  subtitle?: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        // 12px, not a full pill. At `rounded-full` the badge had no corner of
        // its own and read as a lozenge stuck to the page; a soft rectangle
        // sits in the same family as the cards and bands it floats over.
        // `overflow-hidden` means the hover sweep is clipped to this radius
        // too, so the light turns the same corners the badge does.
        "group relative isolate flex items-center gap-3 overflow-hidden rounded-[12px]",
        // Ink rather than the brand orange or the reference's indigo: this
        // badge carries a different app on different pages — Blookd's orange
        // mark on two, Rental's indigo on the other two — and a neutral ground
        // is the only one all three sit on without arguing. It also matches
        // CtaSecondary, so the site already owns this colour.
        "bg-linear-to-b from-[#2e2e2e] to-ink p-2 pr-4",
        "ring-1 ring-inset ring-white/10",
        "shadow-[0_2px_20px_rgba(26,26,26,0.18)]",
        "transition-[transform,box-shadow] duration-500 ease-[var(--ease-out)]",
        "hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(26,26,26,0.28)]",
        "active:translate-y-0 active:scale-[0.985]",
        "motion-reduce:transition-none motion-reduce:hover:translate-y-0",
        className,
      )}
    >
      {/* The sweep. Hidden outright under reduced motion rather than sped up:
          a light travelling across a control is decoration, and decoration is
          what that setting is asking to be spared. */}
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 -translate-x-full",
          "bg-linear-to-r from-transparent via-white/20 to-transparent",
          "transition-transform duration-1000 ease-out group-hover:translate-x-full",
          "motion-reduce:hidden",
        )}
      />

      <span className="relative z-10 flex shrink-0 items-center">{icon}</span>

      {/* leading-tight, not the body default: two stacked lines at 1.55 would
          make the badge taller than the mark beside it, and the mark is what
          sets this object's height. */}
      <span className="relative z-10 flex flex-col text-left leading-tight">
        <span className="text-[15px] font-semibold text-white">{title}</span>
        {subtitle ? (
          <span className="text-[13px] text-white/65 transition-colors duration-300 group-hover:text-white/85">
            {subtitle}
          </span>
        ) : null}
      </span>

      <svg
        aria-hidden
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        className="relative z-10 size-4 shrink-0 text-white/45 transition-[color,transform] duration-300 group-hover:translate-x-0.5 group-hover:text-white"
      >
        <path
          d="M9 5l7 7-7 7"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Link>
  );
}
