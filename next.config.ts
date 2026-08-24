import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // GitHub Pages serves plain files off a CDN with no Node process behind it,
  // so the site has to ship as a fully static export rather than a server
  // build. Every route here already prerenders, so nothing is lost.
  output: "export",

  // Emit directory-style URLs (out/about/index.html) instead of bare
  // about.html. Pages resolves those with or without the trailing slash;
  // the flat form only works without one.
  trailingSlash: true,

  // next/image's optimizer is a server route, which a static export cannot
  // carry. Without it the original files are served as-is — the reason the
  // source images below public/ matter more here than on a Node host.
  images: { unoptimized: true },
};

export default nextConfig;
