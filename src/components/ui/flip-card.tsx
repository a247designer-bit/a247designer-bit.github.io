"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { DeviceFrame } from "@/components/site/media";

/**
 * A feature card that flips on hover to reveal a (shrunk) mockup placeholder
 * on the back, while the front keeps the plain title/body card look.
 *
 * Both faces are absolutely positioned so they can overlap during the 3D
 * rotation, which is why the outer shell needs an explicit height rather than
 * sizing to content like the plain card it replaces.
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
      className={cn("group relative h-60 w-full [perspective:1200px]", className)}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <div
        className={cn(
          "relative h-full w-full [transform-style:preserve-3d] transition-transform duration-700",
          isFlipped ? "[transform:rotateY(180deg)]" : "[transform:rotateY(0deg)]",
        )}
      >
        {/* Front — identical to the plain (non-flipping) feature card */}
        <div
          className={cn(
            "absolute inset-0 flex h-full w-full flex-col gap-3 overflow-hidden",
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

        {/* Back — shrunk mockup placeholder */}
        <div
          className={cn(
            "absolute inset-0 flex h-full w-full items-center justify-center",
            "rounded-[24px] bg-[var(--surface)] p-6 md:p-7",
            "[backface-visibility:hidden] [transform:rotateY(180deg)]",
          )}
        >
          <DeviceFrame label={mockupLabel ?? title} className="max-w-[76px]" />
        </div>
      </div>
    </div>
  );
}
