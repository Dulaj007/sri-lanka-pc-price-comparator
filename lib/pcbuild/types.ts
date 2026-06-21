// Types behind the PC Builder feature. Kept separate from lib/types.ts
// because those types describe scraped listings, while these describe
// the build itself - the generic specs a user picks before any scraping
// happens at all.

import type { Product, SearchResponse } from "../types";

export type ComponentCategoryKey =
  | "cpu"
  | "motherboard"
  | "ram"
  | "gpu"
  | "storage"
  | "storageSecondary"
  | "psu"
  | "case";

// One choice inside a category's dropdown. "searchTerm" is the only field
// that ever reaches the scrapers - everything else exists to decide what
// else should be selectable once this option is picked.
//
// "group" is purely cosmetic - long lists (graphics cards, motherboard
// chipsets) use it to render <optgroup> headings so older and current
// generations don't blur into one undifferentiated list. An empty
// "searchTerm" is a special case meaning "nothing to search for" - used
// by the secondary storage block's "None" option, which the build search
// skips over entirely.
export interface ComponentOption {
  id: string;
  label: string;
  searchTerm: string;
  group?: string;
}

// CPU options carry a brand, since that's what determines which
// motherboards will physically accept the chip.
export interface CpuOption extends ComponentOption {
  brand: "amd" | "intel";
}

// Motherboard options carry the RAM generation their slots are wired
// for, since that's what determines which RAM sticks will fit.
export interface MotherboardOption extends ComponentOption {
  ramGeneration: "ddr4" | "ddr5";
}

// Static metadata describing one block in the builder grid.
export interface ComponentCategory {
  key: ComponentCategoryKey;
  label: string;
}

// The generic spec chosen for every category, before any scraping has
// run. Categories the user hasn't reached yet are null.
export interface BuildSelections {
  cpu: CpuOption | null;
  motherboard: MotherboardOption | null;
  ram: ComponentOption | null;
  gpu: ComponentOption | null;
  storage: ComponentOption | null;
  storageSecondary: ComponentOption | null;
  psu: ComponentOption | null;
  case: ComponentOption | null;
}

// What "Search My PC Price" produced for each category: either the full
// API response, null if that category's search failed outright, or
// undefined if it hasn't been searched yet (still queued, or skipped).
export type BuildSearchResults = Partial<Record<ComponentCategoryKey, SearchResponse | null>>;

// The specific real-world listing currently chosen for each category.
// Starts out as the cheapest listing found, but the user can override
// any single category by picking a different listing from that
// category's result list.
export type ChosenListings = Partial<Record<ComponentCategoryKey, Product>>;
