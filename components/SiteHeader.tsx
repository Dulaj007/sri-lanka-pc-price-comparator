"use client";

// The sticky nav shared by every page. Logo stays fixed on the left;
// everything else - nav links, search, the sites/GitHub shortcuts - is
// clustered together on the right as one group, collapsing into a
// hamburger-triggered panel below the md breakpoint rather than
// stacking every row on top of each other. Rendered once from the root
// layout rather than inside each page, so it never unmounts as the
// user moves between pages.

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import { SitesModal } from "./SitesModal";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/docs", label: "Docs" },
  { href: "/about", label: "About" },
];

// A small chip glyph - a body with a few contact pins - standing in for
// a logo next to the title.
function ChipIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0">
      <rect x="6" y="6" width="12" height="12" rx="1.5" stroke="white" strokeWidth="1.5" />
      <rect x="10" y="10" width="4" height="4" rx="0.5" fill="white" />
      <path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="shrink-0">
      <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M11 11l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M8 1.5C8 1.5 5.5 4 5.5 8s2.5 6.5 2.5 6.5M8 1.5C8 1.5 10.5 4 10.5 8S8 14.5 8 14.5M1.5 8h13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

export function SiteHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const [sitesOpen, setSitesOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = searchValue.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
    setMenuOpen(false);
  }

  return (
    <>
      {sitesOpen && <SitesModal onClose={() => setSitesOpen(false)} />}

      <header className="sticky top-0 z-30 border-b border-white/10 bg-black/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3">
          <Link href="/" className="flex min-w-0 shrink-0 items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/sri-lanka-flag.png" alt="Sri Lankan flag" width={22} height={22} className="shrink-0" />
            <ChipIcon />
            <span className="truncate text-sm font-semibold text-white drop-shadow-[0_0_16px_rgba(255,255,255,0.25)]">
              PC Price Comparator
            </span>
          </Link>

          {/* Everything else lives in one cluster on the right */}
          <div className="ml-auto flex items-center gap-2">
            <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                      isActive ? "bg-white text-black" : "text-zinc-400 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <form onSubmit={handleSearchSubmit} className="hidden md:block">
              <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-zinc-500 transition-all focus-within:border-white/40 focus-within:bg-white/10 focus-within:text-zinc-300 focus-within:shadow-[0_0_20px_-4px_rgba(255,255,255,0.3)]">
                <SearchIcon />
                <input
                  type="search"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Search a part…"
                  aria-label="Search for a PC component"
                  className="w-32 bg-transparent text-sm text-white placeholder:text-zinc-500 focus:outline-none lg:w-48"
                />
              </div>
            </form>

            <div className="hidden items-center gap-1 sm:flex">
              <button
                onClick={() => setSitesOpen(true)}
                aria-label="View sites"
                className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-400 transition-all hover:bg-white/10 hover:text-white"
              >
                <GlobeIcon />
              </button>
              <a
                href="https://github.com/Dulaj007"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub profile"
                className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-400 transition-all hover:bg-white/10 hover:text-white"
              >
                <GitHubIcon />
              </a>
            </div>

            {/* Below md, the nav links and the sites/GitHub shortcuts
                collapse into this one toggle. The search bar below does
                not - it stays on-screen at all times, since searching
                is the one thing almost every visitor opens this site to
                do, and burying it behind a tap on a phone-sized screen
                wastes the most-used control on the page. */}
            <button
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-zinc-300 transition-colors hover:bg-white/10 md:hidden"
            >
              {menuOpen ? (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Always visible below md, independent of the hamburger - see
            the note above the toggle button for why search specifically
            never hides behind it. */}
        <form onSubmit={handleSearchSubmit} className="border-t border-white/5 px-4 pb-3 pt-1 md:hidden">
          <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-2.5 text-zinc-500 focus-within:border-white/40 focus-within:bg-white/10 focus-within:text-zinc-300">
            <SearchIcon />
            <input
              type="search"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search a part…"
              aria-label="Search for a PC component"
              className="w-full bg-transparent text-sm text-white placeholder:text-zinc-500 focus:outline-none"
            />
          </div>
        </form>

        {/* Kept mounted at all times rather than conditionally rendered,
            so it has something to animate between. The outer element
            transitions its grid track from 0fr to 1fr - which, unlike
            transitioning a fixed max-height, settles on exactly the
            content's real height with no guessing - while the inner
            wrapper's own "overflow: hidden" is what actually clips that
            content away during the collapsed state. */}
        <div
          className={`grid overflow-hidden transition-[grid-template-rows] duration-300 ease-in-out md:hidden ${
            menuOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
        >
          <div className="overflow-hidden" aria-hidden={!menuOpen} inert={!menuOpen}>
            <div
              className={`border-t border-white/10 bg-black/90 px-4 py-4 transition-opacity duration-200 ${
                menuOpen ? "opacity-100" : "opacity-0"
              }`}
            >
              <nav aria-label="Primary" className="flex flex-col gap-0.5">
                {NAV_LINKS.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      aria-current={isActive ? "page" : undefined}
                      className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                        isActive ? "bg-white/10 text-white" : "text-zinc-300 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-3 flex items-center gap-2 border-t border-white/10 pt-3">
                <button
                  onClick={() => {
                    setSitesOpen(true);
                    setMenuOpen(false);
                  }}
                  className="flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-white"
                >
                  <GlobeIcon />
                  View sites
                </button>
                <a
                  href="https://github.com/Dulaj007"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-white"
                >
                  <GitHubIcon />
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
