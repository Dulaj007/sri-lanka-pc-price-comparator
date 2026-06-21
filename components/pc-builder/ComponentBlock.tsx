// One block on the PC builder canvas - e.g. "Processor" or "Memory
// (RAM)". Each block is just a labelled dropdown until a build search
// has run; afterwards it also shows the listing currently chosen for it.
// Activating a block (to open its full result list) and dragging it
// around the canvas both happen one level up, in DraggableNode - this
// component only renders content, it doesn't own any pointer handling
// itself.

import { formatPrice } from "@/lib/format";
import type { ComponentCategoryKey, ComponentOption } from "@/lib/pcbuild/types";
import type { Product } from "@/lib/types";
import { ActiveGlow } from "./ActiveGlow";
import { ComponentIcon } from "./ComponentIcon";

interface ComponentBlockProps {
  category: ComponentCategoryKey;
  title: string;
  options: ComponentOption[];
  selectedId: string | null;
  onChange: (id: string) => void;
  disabled?: boolean;
  disabledHint?: string;
  chosenListing?: Product | null;
  searching?: boolean;
  searchedWithNoResults?: boolean;
  isActive?: boolean;
  highlight?: boolean;
  // Connection state doesn't apply to the processor hub, which can't be
  // unplugged from itself - both are left undefined there.
  connected?: boolean;
  onToggleConnect?: () => void;
}

// Long lists (graphics cards, motherboard chipsets) tag each option with
// a "group" so they render as <optgroup> sections instead of one
// undifferentiated wall of names. Shorter lists leave "group" unset and
// just render as a flat list, which this groups into a single bucket.
function groupOptions(options: ComponentOption[]): Map<string | undefined, ComponentOption[]> {
  const groups = new Map<string | undefined, ComponentOption[]>();
  for (const option of options) {
    const bucket = groups.get(option.group);
    if (bucket) {
      bucket.push(option);
    } else {
      groups.set(option.group, [option]);
    }
  }
  return groups;
}

// A small 2x2 dot grid, purely decorative - it's there to read as "this
// can be dragged" at a glance. The drag gesture itself works from
// anywhere on the block, not just this icon. Only meaningful on the
// desktop canvas (lg and up) where blocks are actually draggable - the
// same ComponentBlock renders inside a plain, non-draggable mobile
// list below that, where this would be a dead affordance pointing at a
// gesture that doesn't exist. "invisible" rather than "hidden" so the
// row's layout (and the unplug control's alignment within it) doesn't
// shift between the two contexts.
function GripIcon() {
  return (
    <span className="invisible grid grid-cols-2 gap-0.5 lg:visible" aria-hidden="true">
      <span className="h-1 w-1 rounded-full bg-zinc-400" />
      <span className="h-1 w-1 rounded-full bg-zinc-400" />
      <span className="h-1 w-1 rounded-full bg-zinc-400" />
      <span className="h-1 w-1 rounded-full bg-zinc-400" />
    </span>
  );
}

export function ComponentBlock({
  category,
  title,
  options,
  selectedId,
  onChange,
  disabled = false,
  disabledHint,
  chosenListing,
  searching = false,
  searchedWithNoResults = false,
  isActive = false,
  highlight = false,
  connected,
  onToggleConnect,
}: ComponentBlockProps) {
  const groupedOptions = groupOptions(options);
  const isUnplugged = connected === false;

  return (
    <div
      // "isolate" gives this card its own stacking context, which is
      // what keeps ActiveGlow's negative z-index halo layers contained
      // to this block specifically - without it they have no local
      // context to stay behind, and on a canvas this deeply nested they
      // can end up painted behind the wrong ancestor entirely. No
      // border-radius anywhere on the card - the glow is drawn as sharp
      // edges, so a rounded card underneath it would fight that look.
      className={`relative isolate flex flex-col gap-1.5 border bg-zinc-950 p-3 transition-all lg:gap-2 lg:p-4 ${
        isActive ? "active-pulse border-white/40" : "border-white/20 shadow-[0_0_16px_-10px_rgba(255,255,255,0.15)]"
      }`}
    >
      {isActive && <ActiveGlow />}

      {/* The "Start here" tag and the unplug/reconnect button stay at
          full brightness even when the block is unplugged - the
          reconnect control needs to stay easy to spot, not fade away
          along with everything else. Shared between the two header
          layouts below rather than written out twice. */}
      {(() => {
        const badges = (
          <div className="flex items-center gap-1.5">
            {highlight && (
              <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-medium text-black">
                Start here
              </span>
            )}
            {onToggleConnect && (
              <button
                onClick={onToggleConnect}
                title={connected ? "Unplug from this build" : "Plug back into this build"}
                className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold transition-colors ${
                  connected
                    ? "border border-white/15 text-zinc-400 hover:border-white/30 hover:text-white"
                    : "bg-emerald-500 text-black shadow-[0_0_12px_-1px_rgba(16,185,129,0.8)] hover:bg-emerald-400"
                }`}
              >
                {connected ? "✕" : "+"}
              </button>
            )}
          </div>
        );

        return (
          <>
            {/* Mobile (below lg): name and the close/reconnect button
                share one line, since the grip handle is invisible here
                anyway (dragging doesn't apply to the mobile list) and
                there's no reason to spend a second line on it. Extra
                right-side clearance only while active - the glow's
                blur reaches a good 20px or so past the card's own
                edge, so the badges need real room to actually clear
                it, but there's no reason to spend that space on every
                inactive block too. */}
            <div className={`flex items-center justify-between gap-2 lg:hidden ${isActive ? "pr-5" : ""}`}>
              <div className="flex items-center gap-2">
                <ComponentIcon category={category} className="text-zinc-300 [&>svg]:h-5 [&>svg]:w-5" />
                <span className="text-[11px] font-medium uppercase tracking-wide text-zinc-100">{title}</span>
              </div>
              {badges}
            </div>

            {/* Desktop canvas (lg and up): the grip needs its own line
                since the block is only ~190px wide there, too narrow
                to also fit the name and badges alongside it. */}
            <div className="hidden items-center justify-between gap-2 lg:flex">
              <GripIcon />
              {badges}
            </div>
          </>
        );
      })()}

      <div className={`flex flex-col gap-1.5 lg:gap-2 ${isUnplugged ? "opacity-40" : ""}`}>
        <div className="hidden items-center gap-2.5 lg:flex">
          <ComponentIcon category={category} className="text-zinc-300 [&>svg]:h-7 [&>svg]:w-7" />
          <span className="text-xs font-medium uppercase tracking-wide text-zinc-100">{title}</span>
        </div>

        <select
          value={selectedId ?? ""}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled || options.length === 0}
          className="w-full border border-white/20 bg-black px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-white/40 disabled:cursor-not-allowed disabled:text-zinc-500 lg:px-3 lg:py-2 lg:text-sm"
        >
          <option value="" disabled>
            {disabled ? (disabledHint ?? "Locked") : "Choose…"}
          </option>
          {[...groupedOptions.entries()].map(([group, groupedItems]) =>
            group ? (
              <optgroup key={group} label={group}>
                {groupedItems.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </optgroup>
            ) : (
              groupedItems.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))
            ),
          )}
        </select>

        {/* Result of the build search for this block, once it has run */}
        {searching && (
          <div className="flex items-center gap-2 text-[11px] text-zinc-300 lg:text-xs">
            <div className="h-3 w-3 animate-spin rounded-full border-2 border-white/15 border-t-white" />
            Searching…
          </div>
        )}

        {!searching && chosenListing && (
          // Plain div, not a button - clicking it should activate the
          // whole block (handled by the DraggableNode wrapper), not be
          // swallowed as a separate click target of its own.
          <div className="flex flex-col items-start gap-0.5 border border-white/20 bg-black px-2.5 py-1.5 text-left lg:px-3 lg:py-2">
            <span className="text-xs font-semibold text-white lg:text-sm">{formatPrice(chosenListing.price)}</span>
            <span className="text-[11px] text-zinc-200 lg:text-xs">
              {chosenListing.site}
              {chosenListing.warranty ? ` · ${chosenListing.warranty}` : ""}
            </span>
          </div>
        )}

        {!searching && searchedWithNoResults && (
          <p className="text-[11px] text-zinc-300 lg:text-xs">No listings found for this spec.</p>
        )}

        {isUnplugged && (
          <p className="text-[11px] text-zinc-300 lg:text-xs">Unplugged - left out of the next search.</p>
        )}
      </div>
    </div>
  );
}
