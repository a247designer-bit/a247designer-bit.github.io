"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Placeholder } from "@/components/site/media";

/**
 * A feature card that flips on hover to reveal the reserved slot on the back,
 * while the front keeps the plain title/body card look.
 *
 * Only the back is absolutely positioned; the front stays in flow and is what
 * gives the card its height. That way the reserved slot is exactly the front's
 * box — the two faces cannot disagree about their size — and the card is only
 * as tall as its own copy instead of being padded out to clear a fixed height.
 */
export function FlipCard({
  title,
  body,
  icon,
  mockupLabel,
  className,
}: {
  title: string;
  body: string;
  icon?: ReactNode;
  mockupLabel?: string;
  className?: string;
}) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      // Square, so the card is the same object whichever way it is facing and
      // whatever length its copy runs to. The aspect ratio gives the shell a
      // definite height, which is what the faces inside size themselves against.
      className={cn(
        "group relative aspect-square w-full [perspective:1200px]",
        className,
      )}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <div
        className={cn(
          "relative h-full w-full [transform-style:preserve-3d] transition-transform duration-700",
          isFlipped ? "[transform:rotateY(180deg)]" : "[transform:rotateY(0deg)]",
        )}
      >
        {/* Front — copy sits at the top of the square, inside the padding, and
            the room left over below it is simply room. `justify-start` is the
            flex default but is stated here because it is a decision now: the
            card is much taller than its text and centring would otherwise be
            the tempting thing to do. */}
        <div
          className={cn(
            "flex h-full w-full flex-col justify-start gap-3 overflow-hidden",
            "rounded-[24px] bg-[var(--surface)] p-6 md:p-7",
            "[backface-visibility:hidden]",
          )}
        >
          {icon ? (
            <span className="mb-3 text-foreground [&>svg]:size-8 [&>svg]:stroke-[1.25]">
              {icon}
            </span>
          ) : null}
          <h3 className="text-[19px] leading-[1.2] tracking-[-0.025em]">{title}</h3>
          <p className="text-[15px] leading-[1.55] text-ink-62">{body}</p>
        </div>

        {/* Back — the reserved slot, laid over the front so it takes exactly
            the front's box rather than a shape of its own. */}
        <div
          className={cn(
            "absolute inset-0 overflow-hidden",
            "rounded-[24px] bg-[var(--surface)]",
            "[backface-visibility:hidden] [transform:rotateY(180deg)]",
          )}
        >
          <Placeholder label={mockupLabel ?? title} />
        </div>
      </div>
    </div>
  );
}
