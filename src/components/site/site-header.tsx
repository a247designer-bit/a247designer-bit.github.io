"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/services", label: "Services" },
  { href: "/workspaces", label: "Workspaces" },
  { href: "/professionals", label: "Professionals" },
  { href: "/hosts", label: "Hosts" },
  { href: "/about", label: "About" },
];

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
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "rounded-full px-3.5 py-2 text-[15px] transition-colors",
                    active
                      ? "bg-ink-06 text-ink"
                      : "text-ink-62 hover:text-ink",
                  )}
                >
                  {item.label}
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
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              aria-current={pathname === item.href ? "page" : undefined}
              className="border-b border-border py-5 font-display text-[28px] tracking-[-0.03em]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
