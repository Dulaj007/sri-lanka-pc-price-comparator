// A single place for the site's canonical URL, used by the root
// layout's metadata, the sitemap, and robots.txt. Update this once the
// project has a real production domain - everything that needs it reads
// from here rather than hardcoding the URL in multiple files.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://sri-lanka-pc-price-comparator.vercel.app";

export const SITE_NAME = "Sri Lanka PC Price Comparator";
