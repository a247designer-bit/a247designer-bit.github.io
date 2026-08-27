import type { Metadata } from "next";

import { LegalPage, LegalPending } from "@/components/site/legal-page";

export const metadata: Metadata = {
  title: "Cancellation Policy",
  description:
    "How cancellations, reschedules and refunds work for bookings made through Blookd.",
};

export default function CancellationPolicyPage() {
  return (
    <LegalPage
      title="Cancellation Policy"
      lede="How cancellations, reschedules and refunds work for bookings made through Blookd."
    >
      <LegalPending document="Cancellation Policy" />
    </LegalPage>
  );
}
