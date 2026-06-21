import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/seo";

// /search is deliberately left out - it's marked noindex (see its own
// metadata) since its content is just whatever query happens to be in
// the URL, with no unique value of its own for a search engine to rank.
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    { url: SITE_URL, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/docs`, lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/about`, lastModified, changeFrequency: "monthly", priority: 0.6 },
  ];
}
