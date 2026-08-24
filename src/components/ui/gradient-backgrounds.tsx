import { cn } from "@/lib/utils";

export function GradientBackground({
  className,
  from = "#fff",
  to = "#6366f1",
  stop = "40%",
  position = "50% 10%",
  size = "125% 125%",
}: {
  className?: string;
  from?: string;
  to?: string;
  stop?: string;
  position?: string;
  size?: string;
}) {
  return (
    <div
      className={cn("absolute inset-0", className)}
      style={{
        background: `radial-gradient(${size} at ${position}, ${from} ${stop}, ${to} 100%)`,
      }}
    />
  );
}
