import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { GetAppFab } from "@/components/site/get-app-fab";

/**
 * Marketing shell — the promo site.
 *
 * A route group, so none of these pages carry `/marketing` in their URL. The
 * booking product lands in a sibling group with its own layout (app chrome,
 * auth) without disturbing these routes.
 */
export default function MarketingLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-full flex-col bg-quiet">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <GetAppFab />
    </div>
  );
}
