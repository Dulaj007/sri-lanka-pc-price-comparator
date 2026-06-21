import { formatPrice } from "@/lib/format";

type StrategyVariant = "default" | "recommended" | "warranty" | "premium";

const VARIANT_CARD_CLASSES: Record<StrategyVariant, string> = {
  default: "border-white/20 bg-zinc-950 shadow-[0_0_20px_-8px_rgba(255,255,255,0.12)]",
  recommended: "border-white bg-white text-black shadow-[0_0_30px_-6px_rgba(255,255,255,0.5)]",
  warranty: "border-sky-500/30 bg-zinc-950 shadow-[0_0_20px_-8px_rgba(56,189,248,0.25)]",
  premium: "border-amber-500/30 bg-zinc-950 shadow-[0_0_20px_-8px_rgba(245,158,11,0.25)]",
};

const VARIANT_AMOUNT_CLASSES: Record<StrategyVariant, string> = {
  default: "text-white",
  recommended: "text-black",
  warranty: "text-sky-400",
  premium: "text-amber-400",
};

interface StrategyCardProps {
  label: string;
  total: number;
  note: string;
  missingLabels: string[];
  variant: StrategyVariant;
  onApply: () => void;
}

const VARIANT_BUTTON_CLASSES: Record<StrategyVariant, string> = {
  default: "border-white/20 text-zinc-200 hover:border-white/40 hover:bg-white/5",
  recommended: "border-black/20 text-black hover:bg-black/5",
  warranty: "border-sky-500/30 text-sky-300 hover:bg-sky-500/10",
  premium: "border-amber-500/30 text-amber-300 hover:bg-amber-500/10",
};

// One of the four "alternative build" cards shown once a search
// completes - each represents the same parts list priced under a
// different rule (cheapest overall, cheapest in stock, best warranty,
// most expensive in stock), computed in lib/pcbuild/strategy.ts.
// "Apply" swaps every block's chosen listing over to this strategy's
// picks in one go, rather than this card being read-only.
export function StrategyCard({ label, total, note, missingLabels, variant, onApply }: StrategyCardProps) {
  const mutedClass = variant === "recommended" ? "text-black/70" : "text-zinc-400";

  return (
    <div className={`flex min-w-[200px] flex-1 flex-col gap-1 border px-5 py-4 ${VARIANT_CARD_CLASSES[variant]}`}>
      {variant === "recommended" && (
        <span className="mb-1 inline-block w-fit rounded-full bg-black px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
          Recommended
        </span>
      )}
      <span className={`text-xs font-medium uppercase tracking-wide ${mutedClass}`}>{label}</span>
      <span className={`text-2xl font-bold ${VARIANT_AMOUNT_CLASSES[variant]}`}>{formatPrice(total)}</span>
      <span className={`text-sm ${mutedClass}`}>{note}</span>
      {missingLabels.length > 0 && (
        <span className="text-xs text-amber-400">No stock option for: {missingLabels.join(", ")}</span>
      )}
      <button
        onClick={onApply}
        className={`mt-2 w-fit rounded-full border px-3 py-1 text-xs font-medium transition-colors ${VARIANT_BUTTON_CLASSES[variant]}`}
      >
        Apply this build
      </button>
    </div>
  );
}
