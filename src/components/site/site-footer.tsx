import Link from "next/link";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { href: "/services", label: "Services" },
      { href: "/workspaces", label: "Workspaces" },
      { href: "/professionals", label: "Professionals" },
      { href: "/hosts", label: "Hosts" },
    ],
  },
  {
    title: "Company",
    links: [{ href: "/about", label: "About" }],
  },
];

const APPS = [
  { name: "Blookd", icon: "/brand/app-icon-blookd.png" },
  { name: "Blookd Rental", icon: "/brand/app-icon-rental.png" },
];

/**
 * A dark card inset from the page edges, so the band behind it stays visible
 * down the sides — the footer reads as the last object on the page rather than
 * as the page running out.
 *
 * The inset runs on all four sides: the gap on top separates the card from the
 * last band, which rounds its own bottom edge to meet it (see globals.css).
 */
export function SiteFooter() {
  return (
    <div className="relative bg-quiet p-4 md:p-8">
      <footer className="dark rounded-[var(--radius-band)] bg-paper px-6 py-12 text-foreground md:px-12 md:py-16">
        <div className="mx-auto flex w-full max-w-[1160px] flex-col gap-14">
          <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
            <div className="flex flex-col gap-5">
              <img
                src="/brand/blookd-logotype-light.svg"
                alt="Blookd"
                className="h-6 w-auto self-start"
              />
              <p className="max-w-[34ch] text-[15px] leading-[1.55] text-ink-62">
                The network for independent beauty — people, professionals and
                the places they work.
              </p>

              {/* The two apps, as their own icons. Left unlinked on purpose:
                  there are no store listings to point at yet, and an icon that
                  looks like a download button but goes somewhere else is worse
                  than one that simply sits there. */}
              <ul className="mt-1 flex items-center gap-3">
                {APPS.map((app) => (
                  <li key={app.name}>
                    {/* eslint-disable-next-line @next/next/no-img-element -- fixed-size brand asset, nothing for the optimizer to do */}
                    <img
                      src={app.icon}
                      alt={app.name}
                      width={64}
                      height={64}
                      className="size-16 rounded-[14px]"
                    />
                  </li>
                ))}
              </ul>
            </div>

            {COLUMNS.map((col) => (
              <div key={col.title} className="flex flex-col gap-4">
                <span className="text-[13px] text-ink-62">{col.title}</span>
                <ul className="flex flex-col gap-1">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        // 44px rows so neighbouring links cannot steal each other's taps.
                        className="inline-flex min-h-11 items-center text-[15px] text-ink-70 transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3 border-t border-border pt-8 text-[13px] text-ink-62 sm:flex-row sm:items-center sm:justify-between">
            <span>© {new Date().getFullYear()} Blookd. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
