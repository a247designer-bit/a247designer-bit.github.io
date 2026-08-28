import type { Metadata } from "next";

import { LegalDocument, LegalPage } from "@/components/site/legal-page";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description:
    "The agreement governing the use of Blookd's site, applications and services.",
};

export default function TermsConditionsPage() {
  return (
    <LegalPage
      title="Terms and Conditions"
      lede="The agreement governing the use of Blookd's site, applications and services."
      updated="May 21, 2023"
    >
      <LegalDocument file="terms-conditions" />
    </LegalPage>
  );
}
