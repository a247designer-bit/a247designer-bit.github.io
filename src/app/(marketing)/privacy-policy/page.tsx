import type { Metadata } from "next";

import { LegalDocument, LegalPage } from "@/components/site/legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "What personal information Blookd collects, how it is used and who it is shared with.",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      lede="What personal information Blookd collects, how it is used and who it is shared with."
      updated="May 21, 2023"
    >
      <LegalDocument file="privacy-policy" />
    </LegalPage>
  );
}
