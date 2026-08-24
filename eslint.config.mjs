import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Not application source: the pre-Next static build kept as the design
    // reference, and the original Claude Design handoff.
    "legacy/**",
    "project/**",
    // Local AI-harness tooling (also gitignored), not project code.
    ".claude/**",
    ".impeccable/**",
    ".cursor/**",
    ".agents/**",
    ".gemini/**",
    ".kiro/**",
    ".opencode/**",
  ]),
]);

export default eslintConfig;
