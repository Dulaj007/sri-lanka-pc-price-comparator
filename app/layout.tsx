import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { AmbientBackground } from "@/components/AmbientBackground";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Build a custom PC and compare live, brand-new component prices across 7 Sri Lankan online stores - or quick-search a single part in seconds.",
  keywords: [
    "Sri Lanka PC prices",
    "PC builder Sri Lanka",
    "PC component price comparison",
    "computer parts Sri Lanka",
    "pcbuilders.lk",
    "techzone.lk",
    "build a pc Sri Lanka",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_LK",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description:
      "Build a custom PC and compare live, brand-new component prices across 7 Sri Lankan online stores.",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description:
      "Build a custom PC and compare live, brand-new component prices across 7 Sri Lankan online stores.",
  },
};

// Read by search engines to enable rich results - a sitewide WebSite
// entity, plus the search action that backs Google's sitelinks search
// box for this domain. Static and content-free of any user input, so
// it's safe to inline as-is.
const STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/search?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(STRUCTURED_DATA) }}
        />
        {/* Defines the alpha-boosting filter the active-block edge glow
            relies on (see .edge-glow in globals.css) - blurring a
            translucent gradient fades its alpha along with it, and this
            feColorMatrix multiplies the alpha channel back up afterward
            so the blurred halo stays visible instead of washing out to
            nothing. Defined once here rather than per-block, since every
            block's glow references the same #unopaq id. */}
        <svg aria-hidden="true" style={{ position: "absolute", width: 0, height: 0 }}>
          <filter id="unopaq" x="-1000%" y="-1000%" width="3000%" height="3000%">
            <feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 3 0" />
          </filter>
        </svg>
        <AmbientBackground />
        {/* The header and footer live here, once, rather than inside
            each page - the App Router only swaps out {children} on
            navigation, so anything outside it (this nav included)
            never unmounts or re-renders as the user moves between
            pages. */}
        <SiteHeader />
        <main className="relative z-10 flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
