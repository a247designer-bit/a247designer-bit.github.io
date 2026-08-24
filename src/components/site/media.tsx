import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Slots for the app material.
 *
 * The real screens, mockups and flow clips are still being produced, so every
 * one of these renders a visible, labelled placeholder when it has no source
 * yet. A marked gap is honest and drops out the moment a file is dropped in;
 * a decorative stand-in would quietly ship as if it were the real thing.
 */

export function DeviceFrame({
  children,
  className,
  label,
}: {
  children?: ReactNode;
  className?: string;
  label?: string;
}) {
  return (
    <div
      className={cn(
        // A 9:19 frame is inherently tall, so it is capped tighter on
        // narrow screens — at the desktop width it would fill almost the
        // whole card and push the section past any useful length.
        "relative mx-auto aspect-[9/19] w-full max-w-[190px] overflow-hidden sm:max-w-[240px]",
        "rounded-[36px] border border-border bg-ink-06 p-1.5",
        className,
      )}
    >
      <div className="size-full overflow-hidden rounded-[30px] bg-ink-06">
        {children ?? <Placeholder label={label ?? "App screen"} />}
      </div>
    </div>
  );
}

export function MediaFrame({
  children,
  ratio = "16 / 10",
  className,
  label,
}: {
  children?: ReactNode;
  ratio?: string;
  className?: string;
  label?: string;
}) {
  return (
    <div
      style={{ aspectRatio: ratio }}
      className={cn("w-full overflow-hidden rounded-[20px] bg-ink-06", className)}
    >
      {children ?? <Placeholder label={label ?? "Media"} />}
    </div>
  );
}

export function Placeholder({ label }: { label: string }) {
  return (
    <div className="grid size-full place-items-center p-4">
      <span className="text-center font-mono text-[11px] tracking-[0.06em] text-ink-62">
        [ {label} ]
      </span>
    </div>
  );
}
