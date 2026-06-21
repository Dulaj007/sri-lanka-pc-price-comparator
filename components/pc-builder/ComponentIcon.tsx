// A small line-art glyph per build category, purely decorative - it's
// there so each block reads at a glance as "the GPU one" or "the RAM
// one" rather than every card looking identical apart from its label.

import type { ComponentCategoryKey } from "@/lib/pcbuild/types";

const STROKE = { stroke: "currentColor", strokeWidth: 1.4, fill: "none" } as const;

function CpuGlyph() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" {...STROKE}>
      <rect x="6" y="6" width="12" height="12" rx="1.2" />
      <rect x="9.5" y="9.5" width="5" height="5" rx="0.5" />
      <path d="M9 2v3M13 2v3M9 19v3M13 19v3M2 9h3M2 13h3M19 9h3M19 13h3" strokeLinecap="round" />
    </svg>
  );
}

function MotherboardGlyph() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" {...STROKE}>
      <rect x="3" y="3" width="18" height="18" rx="1.2" />
      <rect x="6" y="6" width="5" height="5" rx="0.5" />
      <path d="M14 6h4M14 9h4M6 14h2v4H6zM10 14h2v4h-2zM15 14v4M18 14v4" strokeLinecap="round" />
    </svg>
  );
}

function RamGlyph() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" {...STROKE}>
      <path d="M4 5h13l3 3v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z" />
      <path d="M7 9v3M10 9v3M13 9v3M16 9v3" strokeLinecap="round" />
    </svg>
  );
}

function GpuGlyph() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" {...STROKE}>
      <rect x="3" y="7" width="18" height="9" rx="1.2" />
      <circle cx="8" cy="11.5" r="2" />
      <circle cx="15" cy="11.5" r="2" />
      <path d="M3 19h4M17 19h4" strokeLinecap="round" />
    </svg>
  );
}

function StorageGlyph() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" {...STROKE}>
      <rect x="4" y="4" width="16" height="16" rx="1.2" />
      <circle cx="9" cy="9" r="1" fill="currentColor" stroke="none" />
      <path d="M7 14h10M7 17h10" strokeLinecap="round" />
    </svg>
  );
}

function PsuGlyph() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" {...STROKE}>
      <rect x="3" y="5" width="18" height="14" rx="1.2" />
      <circle cx="9" cy="12" r="3" />
      <path d="M15 9h3M15 12h3M15 15h3" strokeLinecap="round" />
    </svg>
  );
}

function CaseGlyph() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" {...STROKE}>
      <rect x="6" y="2" width="12" height="20" rx="1.2" />
      <circle cx="12" cy="6" r="1.1" fill="currentColor" stroke="none" />
      <path d="M9 10h6M9 13h6M9 16h3" strokeLinecap="round" />
    </svg>
  );
}

const GLYPHS: Record<ComponentCategoryKey, () => React.JSX.Element> = {
  cpu: CpuGlyph,
  motherboard: MotherboardGlyph,
  ram: RamGlyph,
  gpu: GpuGlyph,
  storage: StorageGlyph,
  storageSecondary: StorageGlyph,
  psu: PsuGlyph,
  case: CaseGlyph,
};

export function ComponentIcon({ category, className }: { category: ComponentCategoryKey; className?: string }) {
  const Glyph = GLYPHS[category];
  return <span className={className}>{<Glyph />}</span>;
}
