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

/**
 * A dark card inset from the page edges, so the band behind it stays visible
 * down the sides — the footer reads as the last object on the page rather than
 * as the page running out.
 */
export function SiteFooter() {
  return (
    <div className="relative bg-quiet px-4 pb-4 md:px-8 md:pb-8">
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
