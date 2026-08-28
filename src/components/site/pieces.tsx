import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/reveal";
import { FeatureCard } from "@/components/ui/feature-card";
import { cn } from "@/lib/utils";

/** Three or four short claims, side by side. */
export function FeatureCards({
  items,
  columns = 3,
  tintedAtRest = false,
  className,
}: {
  items: { title: string; body: string; image?: string; icon?: ReactNode }[];
  columns?: 2 | 3 | 4;
  /** Passed straight through: see FeatureCard. Set per row, not per card. */
  tintedAtRest?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid gap-4",
        columns === 2 && "sm:grid-cols-2",
        columns === 3 && "sm:grid-cols-2 lg:grid-cols-3",
        columns === 4 && "sm:grid-cols-2 lg:grid-cols-4",
        className,
      )}
    >
      {items.map((item, i) => (
        <Reveal key={item.title} delay={i * 70} as="article">
          <FeatureCard
            title={item.title}
            body={item.body}
            image={item.image}
            icon={item.icon}
            tintedAtRest={tintedAtRest}
          />
        </Reveal>
      ))}
    </div>
  );
}

/**
 * A full-band pause: one sentence at display size, nothing else competing.
 * The trailing clause drops to a lower contrast so the band reads as a
 * statement with its own aside rather than as a wall of large type.
 */
export function Statement({
  lead,
  tail,
  className,
}: {
  lead: ReactNode;
  tail?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("container-site", className)}>
      <Reveal>
        <p className="max-w-[20ch] font-display text-display-2">{lead}</p>
      </Reveal>
      {tail ? (
        <Reveal delay={120}>
          <p className="mt-8 max-w-[58ch] text-[17px] leading-[1.6] text-ink-62">
            {tail}
          </p>
        </Reveal>
      ) : null}
    </div>
  );
}

/** Copy on one side, media on the other; media leads on even rows. */
export function Split({
  eyebrow,
  heading,
  children,
  media,
  reverse = false,
  headingId,
}: {
  eyebrow?: ReactNode;
  heading: ReactNode;
  children: ReactNode;
  media: ReactNode;
  reverse?: boolean;
  headingId?: string;
}) {
  return (
    <div className="container-site">
      <div
        className={cn(
          "grid items-center gap-12 lg:grid-cols-2 lg:gap-20",
          reverse && "lg:[&>*:first-child]:order-2",
        )}
      >
        <Reveal className="flex flex-col items-start gap-6">
          {eyebrow}
          <h2 id={headingId} className="text-display-2">
            {heading}
          </h2>
          {children}
        </Reveal>
        <Reveal delay={120}>{media}</Reveal>
      </div>
    </div>
  );
}
