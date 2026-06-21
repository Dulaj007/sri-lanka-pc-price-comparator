"use client";

// The PC Builder: pick a generic spec for every component a working
// desktop needs, then search all of them at once and assemble a real,
// buildable price out of whichever store turns out cheapest for each
// part.
//
// On a wide enough screen the build lives on a small canvas rather than
// a fixed grid. Every block wires into one fixed point in the middle -
// the "Search My PC Price" button itself, rather than any one
// component - since that's the one thing all eight blocks actually have
// in common: they all feed into the search. The user is free to drag
// any block wherever they like, or unplug its wire entirely to leave
// that part out of the search. Dragging doesn't translate to a small
// touchscreen though, so below the lg breakpoint the same eight blocks
// render as a plain vertical list instead, with an ordinary button at
// the bottom - same state, same handlers, just a different container.
// None of that changes how the search itself works: each block still
// becomes its own call to the existing /api/search endpoint, the same
// one the quick search box uses, run one after another with results
// kept separate per category instead of merged into one list.

import { useLayoutEffect, useRef, useState } from "react";

import {
  CASE_OPTIONS,
  CATEGORIES,
  CPU_OPTIONS,
  GPU_OPTIONS,
  PSU_OPTIONS,
  SECONDARY_STORAGE_OPTIONS,
  STORAGE_OPTIONS,
  getMotherboardOptions,
  getRamOptions,
} from "@/lib/pcbuild/catalog";
import { ESTIMATED_NODE_HEIGHT, ESTIMATED_NODE_WIDTH, getDefaultPositions } from "@/lib/pcbuild/layout";
import {
  bestValueInStockStrategy,
  bestWarrantyInStockStrategy,
  cheapestOverallStrategy,
  premiumInStockStrategy,
} from "@/lib/pcbuild/strategy";
import type {
  BuildSearchResults,
  BuildSelections,
  ChosenListings,
  ComponentCategoryKey,
  ComponentOption,
} from "@/lib/pcbuild/types";
import { downloadJson, formatPrice } from "@/lib/format";
import type { Product, SearchResponse } from "@/lib/types";
import { ComponentBlock } from "./ComponentBlock";
import { BuildResultsPanel } from "./BuildResultsPanel";
import { DraggableNode } from "./DraggableNode";
import { InfoTooltip } from "./InfoTooltip";
import { SearchHubButton } from "./SearchHubButton";
import { StrategyCard } from "./StrategyCard";
import { WelcomeModal } from "./WelcomeModal";
import { WireLayer } from "./WireLayer";

// The processor is the one category that can't be unplugged - choosing
// it is what drives the motherboard/memory compatibility cascade, so a
// build without one doesn't make sense. Everything else is optional.
const REQUIRED_KEY: ComponentCategoryKey = "cpu";

const TUTORIAL_TEXT =
  "Pick a processor first - everything else unlocks from there, and the motherboard and memory blocks will only show options that are actually compatible with it. Drag any block wherever you like, or click its wire (or the ✕ on the block) to unplug it and leave that part out of the search. Click a block to see what it found.";

const EMPTY_SELECTIONS: BuildSelections = {
  cpu: null,
  motherboard: null,
  ram: null,
  gpu: null,
  storage: null,
  storageSecondary: null,
  psu: null,
  case: null,
};

// The canvas measures its own size once mounted (see the layout effect
// below) so the default layout fits whatever space is actually
// available rather than assuming a fixed box. These are only the very
// first guess, used for the one render that happens before that
// measurement lands.
const FALLBACK_CANVAS_SIZE = { width: 1024, height: 650 };

// Clamped between a floor (below this the rows of blocks start
// crowding each other) and a ceiling (no need to get any taller than
// this) so the canvas has real room to breathe without growing
// unreasonably tall on very large screens.
const CANVAS_HEIGHT_STYLE = "clamp(620px, 78vh, 820px)";

type NodeSize = { width: number; height: number };

function defaultSizes(): Record<ComponentCategoryKey, NodeSize> {
  const size = { width: ESTIMATED_NODE_WIDTH, height: ESTIMATED_NODE_HEIGHT };
  return CATEGORIES.reduce(
    (acc, category) => ({ ...acc, [category.key]: size }),
    {} as Record<ComponentCategoryKey, NodeSize>,
  );
}

function defaultConnections(): Record<ComponentCategoryKey, boolean> {
  return CATEGORIES.reduce(
    (acc, category) => ({ ...acc, [category.key]: true }),
    {} as Record<ComponentCategoryKey, boolean>,
  );
}

// Used to give the user a rough idea of how long the full build search
// will take, since each category is searched one after another rather
// than all at once. Based on how long a single quick search typically
// takes against all 7 stores.
const ESTIMATED_SECONDS_PER_CATEGORY = 6;

function findOption<T extends ComponentOption>(options: T[], id: string): T | null {
  return options.find((option) => option.id === id) ?? null;
}

// True once a category has been searched and came back empty - either
// because the request itself failed (stored as null) or because it
// succeeded but no store had a matching listing (stored as a
// SearchResponse with an empty results array). Both look the same to
// the user: nothing to show for that block.
function hasNoResults(response: SearchResponse | null | undefined): boolean {
  if (response === undefined) return false;
  return response === null || response.results.length === 0;
}

export function PcBuilder() {
  const [selections, setSelections] = useState<BuildSelections>(EMPTY_SELECTIONS);
  const [categoryResults, setCategoryResults] = useState<BuildSearchResults>({});
  const [chosenListings, setChosenListings] = useState<ChosenListings>({});
  const [activeCategory, setActiveCategory] = useState<ComponentCategoryKey | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchProgress, setSearchProgress] = useState<{
    done: number;
    total: number;
    key: ComponentCategoryKey;
    label: string;
  } | null>(null);

  // Canvas state: where every block sits, how big it actually rendered
  // (DraggableNode reports this via ResizeObserver), and whether its
  // wire back to the processor is currently plugged in.
  const canvasRef = useRef<HTMLDivElement>(null);
  const hasMeasuredCanvas = useRef(false);
  const [canvasSize, setCanvasSize] = useState(FALLBACK_CANVAS_SIZE);
  const [positions, setPositions] = useState(() =>
    getDefaultPositions(FALLBACK_CANVAS_SIZE.width, FALLBACK_CANVAS_SIZE.height),
  );
  const [sizes, setSizes] = useState<Record<ComponentCategoryKey, NodeSize>>(defaultSizes);
  const [connected, setConnected] = useState<Record<ComponentCategoryKey, boolean>>(defaultConnections);

  // Runs once, before the first paint, so the fallback-size layout above
  // is never actually visible - it's corrected to the canvas's real
  // rendered size before the browser draws anything. On a screen narrow
  // enough that the canvas is hidden in favour of the mobile list (see
  // the render below), this simply finds nothing to measure and leaves
  // the fallback in place, which is harmless since that layout is never
  // shown there anyway.
  useLayoutEffect(() => {
    if (hasMeasuredCanvas.current) return;
    const node = canvasRef.current;
    if (!node) return;
    const { clientWidth, clientHeight } = node;
    if (!clientWidth || !clientHeight) return;
    setCanvasSize({ width: clientWidth, height: clientHeight });
    setPositions(getDefaultPositions(clientWidth, clientHeight));
    hasMeasuredCanvas.current = true;
  }, []);

  const motherboardOptions = getMotherboardOptions(selections.cpu);
  const ramOptions = getRamOptions(selections.motherboard);

  // A category only needs a choice if it's actually wired in - an
  // unplugged block is allowed to sit there empty since it's being left
  // out of the search anyway. The processor is always required.
  const requiredCategories = CATEGORIES.filter(
    (category) => category.key === REQUIRED_KEY || connected[category.key],
  );
  const allSelected = requiredCategories.every((category) => selections[category.key] !== null);
  const hasSearchedOnce = Object.keys(categoryResults).length > 0;

  // ------------------------------------------------------------------
  // Canvas interactions: moving blocks, measuring them, plugging and
  // unplugging their wire, and activating one to view its results.
  // ------------------------------------------------------------------

  function handleMove(key: ComponentCategoryKey, x: number, y: number) {
    // Keeps at least a corner of every block within the canvas, so a
    // long drag can't fling a block somewhere it's no longer possible
    // to grab again.
    const clampedX = Math.max(-60, Math.min(x, canvasSize.width - 60));
    const clampedY = Math.max(-20, Math.min(y, canvasSize.height - 40));
    setPositions((prev) => ({ ...prev, [key]: { x: clampedX, y: clampedY } }));
  }

  function handleResize(key: ComponentCategoryKey, size: NodeSize) {
    setSizes((prev) => ({ ...prev, [key]: size }));
  }

  function handleActivate(key: ComponentCategoryKey) {
    setActiveCategory(key);
  }

  // Used by the mobile list, which has no drag gesture to distinguish
  // from a click - every tap should activate the block, except taps on
  // the dropdown or the connect toggle, which already handle themselves.
  function handleMobileBlockClick(e: React.MouseEvent, key: ComponentCategoryKey) {
    if ((e.target as HTMLElement).closest("select, button")) return;
    handleActivate(key);
  }

  function handleToggleConnect(key: ComponentCategoryKey) {
    // The processor's wire can't be clicked loose - see REQUIRED_KEY.
    if (key === REQUIRED_KEY) return;

    const willConnect = !connected[key];
    setConnected((prev) => ({ ...prev, [key]: willConnect }));

    // Unplugging a block also drops whatever it found in the last
    // search, so the totals update immediately instead of waiting for
    // the next "Search My PC Price" run.
    if (!willConnect) {
      clearDownstreamResults([key]);
    }
  }

  // ------------------------------------------------------------------
  // Selection handlers - each one resets whatever depends on it, so a
  // stale downstream choice (e.g. DDR4 RAM after switching to a DDR5
  // motherboard) can never linger.
  // ------------------------------------------------------------------

  function clearDownstreamResults(keys: ComponentCategoryKey[]) {
    setCategoryResults((prev) => {
      const next = { ...prev };
      for (const key of keys) delete next[key];
      return next;
    });
    setChosenListings((prev) => {
      const next = { ...prev };
      for (const key of keys) delete next[key];
      return next;
    });
    if (activeCategory && keys.includes(activeCategory)) {
      setActiveCategory(null);
    }
  }

  function handleSelectCpu(id: string) {
    const option = findOption(CPU_OPTIONS, id);
    setSelections((prev) => ({ ...prev, cpu: option, motherboard: null, ram: null }));
    clearDownstreamResults(["cpu", "motherboard", "ram"]);
  }

  function handleSelectMotherboard(id: string) {
    const option = findOption(motherboardOptions, id);
    setSelections((prev) => ({ ...prev, motherboard: option, ram: null }));
    clearDownstreamResults(["motherboard", "ram"]);
  }

  function handleSelectRam(id: string) {
    const option = findOption(ramOptions, id);
    setSelections((prev) => ({ ...prev, ram: option }));
    clearDownstreamResults(["ram"]);
  }

  // Graphics card, storage (both blocks), PSU and case don't constrain
  // anything downstream, so changing one only needs to clear its own
  // stale results.
  function handleSelectIndependent(
    key: "gpu" | "storage" | "storageSecondary" | "psu" | "case",
    options: ComponentOption[],
  ) {
    return (id: string) => {
      const option = findOption(options, id);
      setSelections((prev) => ({ ...prev, [key]: option }));
      clearDownstreamResults([key]);
    };
  }

  // ------------------------------------------------------------------
  // Running the build search
  // ------------------------------------------------------------------

  async function runBuildSearch() {
    setIsSearching(true);
    setCategoryResults({});
    setChosenListings({});

    // Deliberately not clearing activeCategory: whichever block the
    // user last had open stays "open" through the search, so its
    // results reappear the moment that category's turn comes up rather
    // than requiring an extra click afterward. If nothing was selected
    // yet, default to the processor - it's already the one shown active
    // by default before any search has run.
    if (activeCategory === null) {
      setActiveCategory(REQUIRED_KEY);
    }

    const queue = CATEGORIES.filter(
      (category) =>
        selections[category.key] !== null && (category.key === REQUIRED_KEY || connected[category.key]),
    );

    for (let i = 0; i < queue.length; i++) {
      const category = queue[i];
      const option = selections[category.key];
      if (!option) continue;

      setSearchProgress({ done: i, total: queue.length, key: category.key, label: category.label });

      // A "None" choice (the secondary storage block's default) has
      // nothing to search for - skip straight to the next category
      // instead of firing a request with an empty query.
      if (!option.searchTerm) continue;

      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(option.searchTerm)}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as SearchResponse;

        setCategoryResults((prev) => ({ ...prev, [category.key]: data }));

        // Default every block to the cheapest listing that's actually
        // in stock right now - the same rule "Best Value" uses - so the
        // running total reflects a build that can really be bought
        // today, not the lowest price across listings that might be
        // sold out. Falls back to the absolute cheapest only if nothing
        // in this category is in stock at all, so the block still gets
        // a sensible default rather than nothing. The user can override
        // any single block afterwards.
        const inStockCheapest = data.results.filter((p) => p.inStock).sort((a, b) => a.price - b.price)[0];
        const defaultChoice = inStockCheapest ?? [...data.results].sort((a, b) => a.price - b.price)[0];
        if (defaultChoice) {
          setChosenListings((prev) => ({ ...prev, [category.key]: defaultChoice }));
        }
      } catch {
        setCategoryResults((prev) => ({ ...prev, [category.key]: null }));
      }
    }

    setSearchProgress(null);
    setIsSearching(false);
  }

  function handleChooseListing(key: ComponentCategoryKey, product: Product) {
    setChosenListings((prev) => ({ ...prev, [key]: product }));
  }

  // Swaps every block over to one of the four reference builds at once
  // - only touches categories the strategy actually picked something
  // for, so a category with no results (or "None") is left as-is
  // rather than being cleared.
  function handleApplyStrategy(picks: ChosenListings) {
    setChosenListings((prev) => ({ ...prev, ...picks }));
  }

  // ------------------------------------------------------------------
  // Totals - the user's own running total, plus four reference builds
  // computed fresh from the full result lists (see lib/pcbuild/strategy.ts)
  // ------------------------------------------------------------------

  const searchedCategories = CATEGORIES.filter((category) => category.key in categoryResults);

  const currentTotal = searchedCategories.reduce((sum, category) => {
    const listing = chosenListings[category.key];
    return sum + (listing ? listing.price : 0);
  }, 0);

  const categoriesWithNoResults = searchedCategories.filter((category) => {
    const response = categoryResults[category.key];
    return !response || response.results.length === 0;
  });

  const cheapestOverall = cheapestOverallStrategy(searchedCategories, categoryResults);
  const bestValue = bestValueInStockStrategy(searchedCategories, categoryResults);
  const bestWarranty = bestWarrantyInStockStrategy(searchedCategories, categoryResults);
  const premium = premiumInStockStrategy(searchedCategories, categoryResults);

  function handleExportBuild() {
    downloadJson(
      {
        selections: Object.fromEntries(
          CATEGORIES.map((category) => [
            category.key,
            connected[category.key] ? selections[category.key]?.label ?? null : "unplugged",
          ]),
        ),
        chosenListings,
        currentTotal,
        referenceBuilds: {
          cheapestOverall: cheapestOverall.total,
          bestValueInStock: bestValue.total,
          bestWarrantyInStock: bestWarranty.total,
          premiumInStock: premium.total,
        },
      },
      "my-pc-build.json",
    );
  }

  const activeCategoryMeta = CATEGORIES.find((category) => category.key === activeCategory);
  const activeCategoryResults = activeCategory ? categoryResults[activeCategory] : undefined;

  // The processor reads as "active" by default, before the user has
  // clicked into any other block - that's what gives it the glowing
  // edge out of the box, matching its role as the natural starting
  // point even though it no longer doubles as the canvas's wiring hub.
  const isCategoryActive = (key: ComponentCategoryKey) =>
    activeCategory === key || (key === REQUIRED_KEY && activeCategory === null);

  // Every wire now runs to one fixed point at the exact centre of the
  // canvas - the search button itself - rather than to any one
  // component. Unlike a block's position, this never moves.
  const hubCenter = { x: canvasSize.width / 2, y: canvasSize.height / 2 };

  const wires = CATEGORIES.map((category) => {
    const pos = positions[category.key];
    const size = sizes[category.key];
    return {
      key: category.key,
      to: { x: pos.x + size.width / 2, y: pos.y + size.height / 2 },
      connected: category.key === REQUIRED_KEY ? true : connected[category.key],
    };
  });

  // Built once per render and reused for both the desktop canvas and the
  // mobile list below - the two only differ in what wraps each block
  // (a draggable, wired node vs. a plain list item), not in the block's
  // own props.
  const blockEntries: { key: ComponentCategoryKey; node: React.ReactNode }[] = [
    {
      key: "cpu",
      node: (
        <ComponentBlock
          category="cpu"
          title="Processor"
          options={CPU_OPTIONS}
          selectedId={selections.cpu?.id ?? null}
          onChange={handleSelectCpu}
          chosenListing={chosenListings.cpu}
          searching={isSearching && searchProgress?.key === "cpu"}
          searchedWithNoResults={hasNoResults(categoryResults.cpu)}
          isActive={isCategoryActive("cpu")}
          highlight
        />
      ),
    },
    {
      key: "motherboard",
      node: (
        <ComponentBlock
          category="motherboard"
          title="Motherboard"
          options={motherboardOptions}
          selectedId={selections.motherboard?.id ?? null}
          onChange={handleSelectMotherboard}
          disabled={!selections.cpu}
          disabledHint="Choose a processor first"
          chosenListing={chosenListings.motherboard}
          searching={isSearching && searchProgress?.key === "motherboard"}
          searchedWithNoResults={hasNoResults(categoryResults.motherboard)}
          isActive={isCategoryActive("motherboard")}
          connected={connected.motherboard}
          onToggleConnect={() => handleToggleConnect("motherboard")}
        />
      ),
    },
    {
      key: "ram",
      node: (
        <ComponentBlock
          category="ram"
          title="Memory (RAM)"
          options={ramOptions}
          selectedId={selections.ram?.id ?? null}
          onChange={handleSelectRam}
          disabled={!selections.motherboard}
          disabledHint="Choose a motherboard first"
          chosenListing={chosenListings.ram}
          searching={isSearching && searchProgress?.key === "ram"}
          searchedWithNoResults={hasNoResults(categoryResults.ram)}
          isActive={isCategoryActive("ram")}
          connected={connected.ram}
          onToggleConnect={() => handleToggleConnect("ram")}
        />
      ),
    },
    {
      key: "gpu",
      node: (
        <ComponentBlock
          category="gpu"
          title="Graphics Card"
          options={GPU_OPTIONS}
          selectedId={selections.gpu?.id ?? null}
          onChange={handleSelectIndependent("gpu", GPU_OPTIONS)}
          chosenListing={chosenListings.gpu}
          searching={isSearching && searchProgress?.key === "gpu"}
          searchedWithNoResults={hasNoResults(categoryResults.gpu)}
          isActive={isCategoryActive("gpu")}
          connected={connected.gpu}
          onToggleConnect={() => handleToggleConnect("gpu")}
        />
      ),
    },
    {
      key: "storage",
      node: (
        <ComponentBlock
          category="storage"
          title="Primary Storage"
          options={STORAGE_OPTIONS}
          selectedId={selections.storage?.id ?? null}
          onChange={handleSelectIndependent("storage", STORAGE_OPTIONS)}
          chosenListing={chosenListings.storage}
          searching={isSearching && searchProgress?.key === "storage"}
          searchedWithNoResults={hasNoResults(categoryResults.storage)}
          isActive={isCategoryActive("storage")}
          connected={connected.storage}
          onToggleConnect={() => handleToggleConnect("storage")}
        />
      ),
    },
    {
      key: "storageSecondary",
      node: (
        <ComponentBlock
          category="storageSecondary"
          title="Secondary Storage"
          options={SECONDARY_STORAGE_OPTIONS}
          selectedId={selections.storageSecondary?.id ?? null}
          onChange={handleSelectIndependent("storageSecondary", SECONDARY_STORAGE_OPTIONS)}
          chosenListing={chosenListings.storageSecondary}
          searching={isSearching && searchProgress?.key === "storageSecondary"}
          searchedWithNoResults={hasNoResults(categoryResults.storageSecondary)}
          isActive={isCategoryActive("storageSecondary")}
          connected={connected.storageSecondary}
          onToggleConnect={() => handleToggleConnect("storageSecondary")}
        />
      ),
    },
    {
      key: "psu",
      node: (
        <ComponentBlock
          category="psu"
          title="Power Supply"
          options={PSU_OPTIONS}
          selectedId={selections.psu?.id ?? null}
          onChange={handleSelectIndependent("psu", PSU_OPTIONS)}
          chosenListing={chosenListings.psu}
          searching={isSearching && searchProgress?.key === "psu"}
          searchedWithNoResults={hasNoResults(categoryResults.psu)}
          isActive={isCategoryActive("psu")}
          connected={connected.psu}
          onToggleConnect={() => handleToggleConnect("psu")}
        />
      ),
    },
    {
      key: "case",
      node: (
        <ComponentBlock
          category="case"
          title="Case"
          options={CASE_OPTIONS}
          selectedId={selections.case?.id ?? null}
          onChange={handleSelectIndependent("case", CASE_OPTIONS)}
          chosenListing={chosenListings.case}
          searching={isSearching && searchProgress?.key === "case"}
          searchedWithNoResults={hasNoResults(categoryResults.case)}
          isActive={isCategoryActive("case")}
          connected={connected.case}
          onToggleConnect={() => handleToggleConnect("case")}
        />
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <WelcomeModal />

      {/* ── Build canvas (lg and up - narrower than that and there
          isn't room for the bottom row of four blocks without
          overlapping, so the plain list below takes over instead) ── */}
      <div
        ref={canvasRef}
        className="relative hidden w-full overflow-hidden border border-white/15 bg-[radial-gradient(circle,rgba(255,255,255,0.07)_1px,transparent_1px)] bg-size-[24px_24px] lg:block"
        style={{ height: CANVAS_HEIGHT_STYLE }}
      >
        <div className="absolute right-3 top-3">
          <InfoTooltip label="How to use" text={TUTORIAL_TEXT} icon="info" side="bottom" align="right" />
        </div>

        <WireLayer
          hub={hubCenter}
          wires={wires}
          onToggle={handleToggleConnect}
          activeSearchKey={isSearching ? searchProgress?.key ?? null : null}
        />

        {blockEntries.map(({ key, node }) => (
          <DraggableNode
            key={key}
            x={positions[key].x}
            y={positions[key].y}
            width={ESTIMATED_NODE_WIDTH}
            onMove={(x, y) => handleMove(key, x, y)}
            onResize={(size) => handleResize(key, size)}
            onActivate={() => handleActivate(key)}
          >
            {node}
          </DraggableNode>
        ))}

        <SearchHubButton
          centerX={hubCenter.x}
          centerY={hubCenter.y}
          disabled={!allSelected || isSearching}
          searching={isSearching}
          label={hasSearchedOnce ? "Search Again" : "Search My PC Price"}
          onClick={runBuildSearch}
        />
      </div>

      {/* ── Mobile fallback (below lg): a plain stacked list, since
          dragging absolutely-positioned blocks around doesn't work well
          on a small touchscreen, and there isn't reliably enough width
          for the canvas's bottom row of four blocks either ─────────── */}
      <div className="flex flex-col gap-2 lg:hidden">
        <div className="flex items-center justify-end pb-2">
          <InfoTooltip label="How to use" text={TUTORIAL_TEXT} icon="info" side="bottom" align="right" />
        </div>
        {/* Narrower than the full list width and centred, on purpose -
            the active glow drawn around a selected block blurs out a
            little past its own edge, and a block touching the side of
            the screen leaves no room for that halo to actually show. */}
        {blockEntries.map(({ key, node }) => (
          <div
            key={key}
            onClick={(e) => handleMobileBlockClick(e, key)}
            className="mx-auto w-[88%] cursor-pointer"
          >
            {node}
          </div>
        ))}
      </div>

      {/* ── Search trigger + progress. The button itself only shows up
          here below lg - on a wider screen the canvas's own centre
          button is the trigger instead. The progress readout stays
          visible on every screen size, since the canvas button has no
          room to show the time estimate. ────────────────────────── */}
      <div className="flex flex-col items-center gap-3">
        <button
          onClick={runBuildSearch}
          disabled={!allSelected || isSearching}
          className="rounded-lg bg-white px-5 py-2 text-xs font-medium text-black shadow-[0_0_25px_-4px_rgba(255,255,255,0.45)] transition-colors hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none lg:hidden"
        >
          {isSearching
            ? "Searching…"
            : hasSearchedOnce
              ? "Search Again"
              : "Search My PC Price"}
        </button>

        {!allSelected && !isSearching && (
          <p className="text-[11px] text-zinc-500 lg:text-xs">
            Choose every plugged-in component above to enable the search.
          </p>
        )}

        {isSearching && searchProgress && (
          <div className="flex flex-col items-center gap-2 text-zinc-400">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/15 border-t-white lg:h-6 lg:w-6" />
            <p className="text-xs lg:text-sm">
              Searching {searchProgress.label.toLowerCase()} ({searchProgress.done + 1} of{" "}
              {searchProgress.total})…
            </p>
            <p className="text-[11px] lg:text-xs">
              Estimated time remaining: ~
              {(searchProgress.total - searchProgress.done) * ESTIMATED_SECONDS_PER_CATEGORY}s
            </p>
          </div>
        )}
      </div>

      {/* ── Totals ─────────────────────────────────────────────── */}
      {hasSearchedOnce && !isSearching && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1 border border-white bg-white px-5 py-4 text-black shadow-[0_0_30px_-6px_rgba(255,255,255,0.5)]">
            <span className="text-xs font-medium uppercase tracking-wide opacity-70">
              Current build total
            </span>
            <span className="text-2xl font-bold">{formatPrice(currentTotal)}</span>
            <span className="text-sm opacity-70">Based on your selections below</span>
          </div>

          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500">
              Four other ways to build this
            </p>
            <div className="flex flex-wrap gap-3">
              <StrategyCard
                label="Cheapest"
                total={cheapestOverall.total}
                note="Some of these items may not be available in stock at the moment."
                missingLabels={cheapestOverall.missingLabels}
                variant="default"
                onApply={() => handleApplyStrategy(cheapestOverall.picks)}
              />
              <StrategyCard
                label="Best Value"
                total={bestValue.total}
                note="The cheapest parts that are actually in stock right now."
                missingLabels={bestValue.missingLabels}
                variant="recommended"
                onApply={() => handleApplyStrategy(bestValue.picks)}
              />
              <StrategyCard
                label="Best Warranty"
                total={bestWarranty.total}
                note="Longest warranty coverage among parts in stock now."
                missingLabels={bestWarranty.missingLabels}
                variant="warranty"
                onApply={() => handleApplyStrategy(bestWarranty.picks)}
              />
              <StrategyCard
                label="Premium"
                total={premium.total}
                note="The highest-priced in-stock option for every part."
                missingLabels={premium.missingLabels}
                variant="premium"
                onApply={() => handleApplyStrategy(premium.picks)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-xs text-zinc-500">
              Click any block above to see every listing found for it and pick a specific one.
            </p>
            <button
              onClick={handleExportBuild}
              className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-zinc-950 px-4 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:bg-white/5 hover:border-white/20"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="shrink-0">
                <path d="M8 2v8m0 0L5 7m3 3 3-3M2 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Save build as JSON
            </button>
          </div>

          {categoriesWithNoResults.length > 0 && (
            <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-400">
              No listings were found for: {categoriesWithNoResults.map((c) => c.label).join(", ")}.
              These parts are excluded from every total above.
            </div>
          )}
        </div>
      )}

      {/* ── Active category's full result list ────────────────── */}
      {activeCategory && activeCategoryMeta && activeCategoryResults && (
        <BuildResultsPanel
          categoryLabel={activeCategoryMeta.label}
          searchResponse={activeCategoryResults}
          chosenUrl={chosenListings[activeCategory]?.url}
          onChoose={(product) => handleChooseListing(activeCategory, product)}
        />
      )}
    </div>
  );
}
