// Four different ways to assemble a finished build out of whatever a
// search already found, on top of the "current build total" the user
// is actually configuring by hand in PcBuilder. Each one answers a
// different question:
//
//   - Cheapest:        what's the lowest this could possibly cost?
//   - Best value:      what's the lowest this could cost using only
//                       parts that are actually in stock right now?
//   - Best warranty:   ignoring price, which in-stock parts come with
//                       the longest warranty coverage?
//   - Premium:         what's the highest this could cost using only
//                       parts that are in stock right now?
//
// None of these touch the user's own per-block selections - they're
// computed fresh from the full result list every time, as reference
// points alongside whatever the user has actually picked.

import type { Product } from "../types";
import type { BuildSearchResults, ChosenListings, ComponentCategory } from "./types";

export interface StrategyResult {
  total: number;
  // Labels of categories that were searched but had no listing
  // matching this strategy's rule (most commonly: nothing in stock).
  missingLabels: string[];
  // The actual listing this strategy picked for each category - lets
  // a strategy be "applied", swapping every block over to these exact
  // listings, rather than only ever being a read-only total.
  picks: ChosenListings;
}

// Warranty strings look like "3 Years" or "6 Months" (see
// lib/scrapers/util.ts's extractWarranty) - this turns one back into a
// plain number of months so two warranties can be compared, with "no
// warranty mentioned" sorting as the lowest possible value.
function warrantyMonths(warranty: string | undefined): number {
  if (!warranty) return 0;
  const match = warranty.match(/(\d+)\s*(year|month)/i);
  if (!match) return 0;
  const amount = Number.parseInt(match[1], 10);
  return match[2].toLowerCase().startsWith("year") ? amount * 12 : amount;
}

function runStrategy(
  categories: ComponentCategory[],
  categoryResults: BuildSearchResults,
  pick: (products: Product[]) => Product | undefined,
): StrategyResult {
  let total = 0;
  const missingLabels: string[] = [];
  const picks: ChosenListings = {};

  for (const category of categories) {
    const response = categoryResults[category.key];
    if (!response || response.results.length === 0) continue;

    const chosen = pick(response.results);
    if (chosen) {
      total += chosen.price;
      picks[category.key] = chosen;
    } else {
      missingLabels.push(category.label);
    }
  }

  return { total, missingLabels, picks };
}

export function cheapestOverallStrategy(
  categories: ComponentCategory[],
  categoryResults: BuildSearchResults,
): StrategyResult {
  return runStrategy(categories, categoryResults, (products) =>
    [...products].sort((a, b) => a.price - b.price)[0],
  );
}

export function bestValueInStockStrategy(
  categories: ComponentCategory[],
  categoryResults: BuildSearchResults,
): StrategyResult {
  return runStrategy(categories, categoryResults, (products) =>
    products.filter((p) => p.inStock).sort((a, b) => a.price - b.price)[0],
  );
}

export function bestWarrantyInStockStrategy(
  categories: ComponentCategory[],
  categoryResults: BuildSearchResults,
): StrategyResult {
  return runStrategy(categories, categoryResults, (products) =>
    products
      .filter((p) => p.inStock)
      .sort((a, b) => warrantyMonths(b.warranty) - warrantyMonths(a.warranty) || a.price - b.price)[0],
  );
}

export function premiumInStockStrategy(
  categories: ComponentCategory[],
  categoryResults: BuildSearchResults,
): StrategyResult {
  return runStrategy(categories, categoryResults, (products) =>
    products.filter((p) => p.inStock).sort((a, b) => b.price - a.price)[0],
  );
}
