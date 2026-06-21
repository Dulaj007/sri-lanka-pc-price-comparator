// The fixed circle in the middle of the canvas that every block's wire
// runs to. Unlike every other element on the canvas this one never
// moves - it's not wrapped in DraggableNode - since it represents the
// one action ("search") that all eight blocks feed into, rather than a
// part of the build itself.

import { HUB_BUTTON_SIZE } from "@/lib/pcbuild/layout";

interface SearchHubButtonProps {
  centerX: number;
  centerY: number;
  disabled: boolean;
  searching: boolean;
  label: string;
  onClick: () => void;
}

function SearchIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M15.5 15.5L21 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function SearchHubButton({ centerX, centerY, disabled, searching, label, onClick }: SearchHubButtonProps) {
  return (
    <div
      className="absolute z-20"
      style={{
        left: centerX - HUB_BUTTON_SIZE / 2,
        top: centerY - HUB_BUTTON_SIZE / 2,
        width: HUB_BUTTON_SIZE,
        height: HUB_BUTTON_SIZE,
      }}
    >
      {/* A "comet" of light chasing around the rim while a search is
          running - a plain conic-gradient rotating behind the button,
          only visible through the rim since the button's own
          background covers the centre. */}
      {searching && <div className="hub-ring" aria-hidden="true" />}

      <button
        onClick={onClick}
        disabled={disabled}
        title={disabled ? "Choose every plugged-in component first" : label}
        className={`relative flex h-full w-full flex-col items-center justify-center gap-1 rounded-full border-2 bg-zinc-950 text-white transition-all ${
          disabled
            ? "cursor-not-allowed border-white/10 text-zinc-600"
            : searching
              ? "hub-pulse border-white/50"
              : "cursor-pointer border-white/30 hover:border-white/60 hover:shadow-[0_0_40px_-4px_rgba(255,255,255,0.5)]"
        }`}
      >
        {searching ? (
          <div className="h-7 w-7 animate-spin rounded-full border-2 border-white/15 border-t-white" />
        ) : (
          <SearchIcon />
        )}
        <span className="px-3 text-center text-[11px] font-semibold uppercase leading-tight tracking-wide">
          {searching ? "Searching…" : label}
        </span>
      </button>
    </div>
  );
}
