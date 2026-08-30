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
        // 18px: the mark's own 10px corner plus the 8px of padding around it.
        // Nested corners only look like one object when they share a centre,
        // and at 12px this badge turned tighter than the icon 8px inside it —
        // the outer corner cutting in front of the inner one, which is what
        // made the mark read as pressed into the left edge.
        //
        // Still not a full pill: that would be 28px at this height, and at
        // `rounded-full` the badge had no corner of its own and read as a
        // lozenge stuck to the page. 18px leaves 20px of straight edge and
        // sits in the same family as the cards and bands it floats over.
        // `overflow-hidden` means the hover sweep is clipped to this radius
        // too, so the light turns the same corners the badge does.
        "group relative isolate flex items-center gap-3 overflow-hidden rounded-[18px]",
        // Ink rather than the brand orange or the reference's indigo: this
        // badge carries a different app on different pages — Blookd's orange
        // mark on two, Rental's indigo on the other two — and a neutral ground
        // is the only one all three sit on without arguing. It also matches
        // CtaSecondary, so the site already owns this colour.
        // 10px on the left against 8px top and bottom — an optical
        // compensation, not an arithmetic one. The mark is a squircle: only
        // the middle 20px of its left edge is actually flat and the corners
        // fall away from the badge's edge, so a measured 8px reads tighter
        // there than the same 8px reads above and below a flat run. Two
        // pixels back is what makes the four sides look equal.
        //
        // Written out rather than left to `p-2` plus an override, so the one
        // side that differs from the rest says so where it is set.
        "bg-linear-to-b from-[#2e2e2e] to-ink py-2 pr-4 pl-2.5",
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
