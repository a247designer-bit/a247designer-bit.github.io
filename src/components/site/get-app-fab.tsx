"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { AppBadgeButton } from "@/components/ui/app-badge-button";

/**
 * Which app the visitor is actually being told about, page by page.
 *
 * Only the four audience pages carry it. The home page argues for the whole
 * network rather than for one app, and About is not a pitch — offering a
 * download on either would mean picking an app the page never named.
 */
const APP_BY_PATH: Record<string, { icon: string; app: string }> = {
  "/services": { icon: "/images/app-icon-people.svg", app: "Blookd" },
  "/professionals": { icon: "/images/app-icon-pros.svg", app: "Blookd" },
  "/workspaces": { icon: "/images/app-icon-rental.svg", app: "Blookd Rental" },
  "/hosts": { icon: "/images/app-icon-rental.svg", app: "Blookd Rental" },
};

/** Trailing slashes are the site's URL style; see the note in site-header. */
const normalise = (p: string) => p.replace(/(.)\/$/, "$1");

/** A standing offer to download the app, parked in the bottom-right corner. */
export function GetAppFab() {
  const app = APP_BY_PATH[normalise(usePathname())];
  if (!app) return null;

  return (
    // Under the mobile menu's z-40 overlay on purpose: with the menu open the
    // page behind it is not being read, and a download badge floating over a
    // navigation sheet is just one more thing to dismiss.
    //
    // The inset matches the header's — top-4/md:top-6 up there, the same down
    // here — so the two floating objects sit the same distance from the frame.
    <div className="pointer-events-none fixed bottom-4 right-4 z-30 md:bottom-6 md:right-6">
      <AppBadgeButton
        href="/"
        className="pointer-events-auto"
        title="Get App"
        subtitle={app.app}
        icon={
          <Image
            src={app.icon}
            // Decorative: "Get App / Blookd Rental" beside it already names
            // the thing, and a second reading of the same name is noise.
            alt=""
            width={80}
            height={80}
            className="size-10 rounded-[10px]"
          />
        }
      />
    </div>
  );
}
