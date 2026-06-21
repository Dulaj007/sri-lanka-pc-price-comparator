// Small pill showing whether a listing is in stock. Shared between the
// quick search results table and the PC builder's per-category result
// list, so the two features look consistent.
export function StockBadge({ inStock }: { inStock: boolean }) {
  return inStock ? (
    <span className="inline-block rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-400">
      In stock
    </span>
  ) : (
    <span className="inline-block rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs font-medium text-zinc-400">
      Out of stock
    </span>
  );
}
