"use client";

// The original single-component search box: type a part name, see every
// listing found for it across all 7 stores. Kept around as a fast path
// for when someone just wants to price-check one item rather than plan
// a whole build. The nav's search bar lands here with a query already
// in the URL (/search?q=...), which is what initialQuery carries in.

import { useEffect, useState } from "react";

import { downloadJson, formatPrice, slugify } from "@/lib/format";
import type { Product, SearchResponse } from "@/lib/types";
import { StockBadge } from "./StockBadge";

function PriceCard({ label, product }: { label: string; product: Product }) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-white/10 bg-zinc-950 px-5 py-4 shadow-[0_0_20px_-8px_rgba(255,255,255,0.12)]">
      <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">{label}</span>
      <span className="text-2xl font-bold text-white">{formatPrice(product.price)}</span>
      <span className="text-sm text-zinc-400">{product.site}</span>
    </div>
  );
}

export function QuickSearch({ initialQuery = "" }: { initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState(true);

  async function runSearch(q: string) {
    if (!q) return;

    setLoading(true);
    setSearchError(null);
    setResults(null);

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      if (!res.ok) throw new Error(`Server responded with HTTP ${res.status}`);
      const data = (await res.json()) as SearchResponse;
      setResults(data);
    } catch (err) {
      setSearchError(err instanceof Error ? err.message : "Search failed");
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    runSearch(query.trim());
  }

  // Auto-run once for whichever query the page loaded with (the nav
  // search bar arrives here via /search?q=...) - typing a new query and
  // pressing the button goes through handleSearch instead. This is the
  // standard "fetch on mount" effect shape - setLoading/setResults firing
  // before the awaited fetch resolves is expected here, not a bug.
  useEffect(() => {
    if (initialQuery.trim()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      runSearch(initialQuery.trim());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sort the results independently of the order the API returns them.
  // Defaulting to cheapest-first makes price comparison the most natural
  // way to read the table.
  const sorted = results
    ? [...results.results].sort((a, b) =>
        sortAsc ? a.price - b.price : b.price - a.price,
      )
    : [];

  const lowestProduct = sorted.length > 0 ? sorted[0] : null;
  const highestProduct = sorted.length > 0 ? sorted[sorted.length - 1] : null;
  const sitesOk = results?.sites.filter((s) => s.ok).length ?? 0;
  const sitesTotal = results?.sites.length ?? 0;

  return (
    <div>
      {/* ── Search form ────────────────────────────────────────── */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. RTX 5070, Ryzen 7 9800X3D, 32GB DDR5…"
          className="flex-1 rounded-lg border border-white/10 bg-zinc-950 px-4 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/40"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-black shadow-[0_0_20px_-4px_rgba(255,255,255,0.4)] transition-colors hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
        >
          {loading ? "Searching…" : "Search"}
        </button>
      </form>

      {/* ── Loading state ─────────────────────────────────────── */}
      {loading && (
        <div className="mt-10 flex flex-col items-center gap-3 text-zinc-400">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/15 border-t-white" />
          <p className="text-sm">Searching all 7 stores simultaneously…</p>
        </div>
      )}

      {/* ── Fetch error ───────────────────────────────────────── */}
      {searchError && (
        <div className="mt-6 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {searchError}
        </div>
      )}

      {/* ── Results ──────────────────────────────────────────── */}
      {results && !loading && (
        <div className="mt-8 flex flex-col gap-6">
          {/* Stale cache notice */}
          {results.cachedAt && (
            <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-400">
              All sites failed to respond — showing cached results from{" "}
              {new Date(results.cachedAt).toLocaleString()}.
            </div>
          )}

          {sorted.length === 0 ? (
            <p className="text-sm text-zinc-400">
              No results found for &ldquo;{results.query}&rdquo; across any of the {sitesTotal} stores.
            </p>
          ) : (
            <>
              {/* ── Summary row ──────────────────────────────── */}
              <div className="flex flex-wrap items-start gap-3">
                {lowestProduct && (
                  <PriceCard label="Lowest price" product={lowestProduct} />
                )}
                {highestProduct && lowestProduct !== highestProduct && (
                  <PriceCard label="Highest price" product={highestProduct} />
                )}
                <div className="flex flex-col gap-1 rounded-xl border border-white/10 bg-zinc-950 px-5 py-4 shadow-[0_0_20px_-8px_rgba(255,255,255,0.12)]">
                  <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                    Stores responded
                  </span>
                  <span className="text-2xl font-bold text-white">
                    {sitesOk} / {sitesTotal}
                  </span>
                  <span className="text-sm text-zinc-400">
                    {sorted.length} listing{sorted.length !== 1 ? "s" : ""} found
                  </span>
                </div>
              </div>

              {/* ── Toolbar: sort + export ────────────────────── */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <label className="text-xs text-zinc-500">Sort by price:</label>
                  <button
                    onClick={() => setSortAsc(true)}
                    className={`rounded-md border px-3 py-1 text-xs font-medium transition-colors ${
                      sortAsc
                        ? "border-white bg-white text-black"
                        : "border-white/10 bg-zinc-950 text-zinc-400 hover:bg-white/5"
                    }`}
                  >
                    Cheapest first
                  </button>
                  <button
                    onClick={() => setSortAsc(false)}
                    className={`rounded-md border px-3 py-1 text-xs font-medium transition-colors ${
                      !sortAsc
                        ? "border-white bg-white text-black"
                        : "border-white/10 bg-zinc-950 text-zinc-400 hover:bg-white/5"
                    }`}
                  >
                    Most expensive first
                  </button>
                </div>
                <button
                  onClick={() => downloadJson(results, `${slugify(results.query)}-prices.json`)}
                  className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-zinc-950 px-4 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:bg-white/5 hover:border-white/20"
                >
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="shrink-0">
                    <path d="M8 2v8m0 0L5 7m3 3 3-3M2 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Save as JSON
                </button>
              </div>

              {/* ── Results table ────────────────────────────── */}
              <div className="overflow-x-auto rounded-xl border border-white/10 shadow-[0_0_25px_-10px_rgba(255,255,255,0.1)]">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/5 text-left">
                      <th className="px-4 py-3 font-medium text-zinc-400">Store</th>
                      <th className="px-4 py-3 font-medium text-zinc-400">Product</th>
                      <th className="px-4 py-3 font-medium text-zinc-400">Price</th>
                      <th className="px-4 py-3 font-medium text-zinc-400">Warranty</th>
                      <th className="px-4 py-3 font-medium text-zinc-400">Stock</th>
                      <th className="px-4 py-3 font-medium text-zinc-400"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {sorted.map((product, i) => (
                      <tr
                        key={`${product.site}-${product.url}-${i}`}
                        className="border-b border-white/5 bg-black transition-colors last:border-0 hover:bg-white/5"
                      >
                        <td className="whitespace-nowrap px-4 py-3 font-medium text-white">
                          {product.site}
                        </td>
                        <td className="px-4 py-3 text-zinc-300">{product.title}</td>
                        <td className="whitespace-nowrap px-4 py-3 font-semibold text-white">
                          {formatPrice(product.price)}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-zinc-400">
                          {product.warranty ?? "—"}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3">
                          <StockBadge inStock={product.inStock} />
                        </td>
                        <td className="whitespace-nowrap px-4 py-3">
                          <a
                            href={product.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-medium text-zinc-400 underline underline-offset-2 hover:text-white"
                          >
                            View
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* ── Per-site error messages ───────────────────── */}
              {results.sites.some((s) => !s.ok) && (
                <div className="flex flex-col gap-2">
                  <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                    Sites that did not respond
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {results.sites
                      .filter((s) => !s.ok)
                      .map((s) => (
                        <span
                          key={s.site}
                          title={s.error}
                          className="rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs text-red-400"
                        >
                          {s.site}: {s.error ?? "failed"}
                        </span>
                      ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
