// Shown beneath the build grid once at least one category has been
// searched. Lists every listing found for whichever block the user last
// clicked, and lets them swap the auto-picked (cheapest) listing for a
// different one - a different store, a higher-warranty option, etc.

import { formatPrice } from "@/lib/format";
import type { Product, SearchResponse } from "@/lib/types";
import { StockBadge } from "../StockBadge";

interface BuildResultsPanelProps {
  categoryLabel: string;
  searchResponse: SearchResponse;
  chosenUrl: string | undefined;
  onChoose: (product: Product) => void;
}

export function BuildResultsPanel({
  categoryLabel,
  searchResponse,
  chosenUrl,
  onChoose,
}: BuildResultsPanelProps) {
  const sorted = [...searchResponse.results].sort((a, b) => a.price - b.price);
  const cheapestPrice = sorted.length > 0 ? sorted[0].price : null;

  return (
    <div className="rounded-xl border border-white/10 shadow-[0_0_30px_-10px_rgba(255,255,255,0.15)]">
      <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-4 py-3">
        <h3 className="text-sm font-semibold text-white">
          {categoryLabel} — {sorted.length} listing{sorted.length !== 1 ? "s" : ""} found
        </h3>
        <span className="text-xs text-zinc-500">Click a row to use it in your build</span>
      </div>

      {sorted.length === 0 ? (
        <p className="px-4 py-6 text-sm text-zinc-400">
          No listings found for &ldquo;{searchResponse.query}&rdquo; across any store.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left">
                <th className="px-4 py-2 font-medium text-zinc-500">Store</th>
                <th className="px-4 py-2 font-medium text-zinc-500">Product</th>
                <th className="px-4 py-2 font-medium text-zinc-500">Price</th>
                <th className="px-4 py-2 font-medium text-zinc-500">Warranty</th>
                <th className="px-4 py-2 font-medium text-zinc-500">Stock</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((product, i) => {
                const isChosen = product.url === chosenUrl;
                const isCheapest = product.price === cheapestPrice;

                return (
                  <tr
                    key={`${product.site}-${product.url}-${i}`}
                    onClick={() => onChoose(product)}
                    className={`cursor-pointer border-b border-white/5 transition-colors last:border-0 ${
                      isChosen
                        ? "bg-white/10 shadow-[inset_0_0_20px_-6px_rgba(255,255,255,0.25)]"
                        : "bg-black hover:bg-white/5"
                    }`}
                  >
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-white">
                      <div className="flex items-center gap-2">
                        {isChosen && (
                          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] font-bold text-black" aria-label="Selected">
                            ✓
                          </span>
                        )}
                        {product.site}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-zinc-300">{product.title}</td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className={`font-semibold ${isCheapest ? "text-emerald-400" : "text-white"}`}>
                          {formatPrice(product.price)}
                        </span>
                        {isCheapest && (
                          <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
                            Best price
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-zinc-400">
                      {product.warranty ?? "—"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <StockBadge inStock={product.inStock} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
