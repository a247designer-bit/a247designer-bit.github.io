"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/services", label: "Services" },
  { href: "/professionals", label: "Professionals" },
  { href: "/workspaces", label: "Workspaces" },
  { href: "/hosts", label: "Hosts" },
  { href: "/about", label: "About" },
];

/**
 * Trailing slashes are the site's URL style (`trailingSlash: true` in
 * next.config), so `usePathname()` hands back "/services/" while NAV holds
 * "/services". Comparing them raw never matched, which is why the current page
 * was never marked in the nav at all. Both sides are trimmed before comparing;
 * "/" is left alone because it is a path, not a trailing slash.
 */
const samePath = (a: string, b: string) =>
  a.replace(/(.)\/$/, "$1") === b.replace(/(.)\/$/, "$1");

/**
 * A floating pill that rides above whatever band is under it.
 *
 * It has its own solid background rather than a translucent one, so it stays
 * legible over the hero photo, the light bands and the dark bands alike
 * without needing to know which is behind it.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // The menu is a fixed overlay; leaving the page scrollable behind it lets
  // the background drift while a link is being chosen.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4 md:top-6">
        <div className="pointer-events-auto flex items-center gap-1 rounded-full bg-paper p-1.5 shadow-[0_2px_20px_rgba(26,26,26,0.10)]">
          <Link
            href="/"
            aria-label="Blookd"
            // The visual pill stays compact; the pseudo-element carries the
            // touch target out to 44px so the chrome does not have to grow.
            className="relative flex items-center rounded-full px-4 py-2 after:absolute after:-inset-x-1 after:-inset-y-[6px] after:content-['']"
          >
            <img
              src="/brand/blookd-logotype-brand.svg"
              alt="Blookd"
              className="h-[19px] w-auto"
            />
          </Link>

          <nav className="hidden items-center lg:flex">
            {NAV.map((item) => {
              const active = samePath(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "grid place-items-center rounded-full px-3.5 py-2 text-[15px] transition-colors",
                    active
                      ? "bg-ink-06 font-semibold text-ink"
                      : "text-ink-62 hover:text-ink",
                  )}
                >
                  {/* Every item is sized by its own label AT THE BOLD WEIGHT,
                      whether or not it is the current one: this copy is laid in
                      the same grid cell as the visible label and only reserves
                      width. Without it the row re-flows the moment the active
                      item changes — and since these are client-side links, that
                      reflow happens live, under the pointer, as a shove. */}
                  <span
                    aria-hidden
                    className="invisible col-start-1 row-start-1 font-semibold"
                  >
                    {item.label}
                  </span>
                  <span className="col-start-1 row-start-1">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="site-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="relative grid size-9 place-items-center rounded-full bg-ink-06 text-ink transition-colors after:absolute after:-inset-1 after:content-[''] hover:bg-ink-12 lg:hidden"
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </header>

      <div
        id="site-menu"
        hidden={!open}
        className="fixed inset-0 z-40 bg-paper px-6 pt-28 lg:hidden"
      >
        <nav className="flex flex-col">
          {/* The display face ships Bold only, so weight cannot mark the
              current page here the way it does in the desktop pill. The ink
              ramp does it instead: the current page keeps full contrast and
              the rest step back to 62% — the lowest alpha that still clears
              4.5:1, so nothing in the menu becomes hard to read in order to
              make one line easy. */}
          {NAV.map((item) => {
            const active = samePath(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "border-b border-border py-5 font-display text-[28px] tracking-[-0.03em] transition-colors",
                  active ? "text-foreground" : "text-ink-62",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
