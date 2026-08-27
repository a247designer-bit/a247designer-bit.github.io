import type { Metadata } from "next";

import { LegalPage, LegalPending } from "@/components/site/legal-page";

export const metadata: Metadata = {
  title: "Cookies Policy",
  description:
    "What Blookd stores in your browser, what it is used for and how to change it.",
};

export default function CookiesPolicyPage() {
  return (
    <LegalPage
      title="Cookies Policy"
      lede="What Blookd stores in your browser, what it is used for and how to change it."
    >
      <LegalPending document="Cookies Policy" />
    </LegalPage>
  );
}
