// Starting positions for the build canvas. The processor used to sit at
// the centre with every other block wired into it, but that didn't
// actually mean anything - there's no reason a graphics card's wire
// should run to the processor specifically rather than, say, the case.
// What every block actually has in common is that it all feeds into one
// action: searching. So the centre is reserved for the fixed "Search My
// PC Price" button (see SearchHubButton.tsx) instead, and all eight
// blocks - including the processor - wire into that.
//
// The eight blocks are arranged in three rows that match a wide, short
// canvas: processor and motherboard together across the top (they're
// the pair with the actual compatibility relationship), memory and the
// graphics card flanking the centre button, and the remaining four
// blocks across the bottom.

import type { ComponentCategoryKey } from "./types";

export interface NodePosition {
  x: number;
  y: number;
}

// Used as a stand-in for a block's real size before it's actually been
// measured (see DraggableNode's ResizeObserver), so the first layout
// pass doesn't need to wait on a render round-trip. Also used directly
// as the canvas's default node width.
export const ESTIMATED_NODE_WIDTH = 190;
export const ESTIMATED_NODE_HEIGHT = 165;

// The fixed search button's footprint, used both to size it and to
// make sure no block's default position lands underneath it.
export const HUB_BUTTON_SIZE = 130;

// Each entry is a fraction of the canvas's own width/height - 0.5 is
// the centre, 0 is the left/top edge. Fractions (rather than fixed
// pixels) are what let the same layout fit a 992px-wide canvas and a
// 1400px-wide one without the blocks bunching up on one side. Pulled in
// a little from 0/1 on every edge deliberately, so a block's edge is
// never the same as the canvas's own edge.
const LAYOUT_FRACTIONS: Record<ComponentCategoryKey, { x: number; y: number }> = {
  cpu: { x: 0.28, y: 0.2 },
  motherboard: { x: 0.72, y: 0.2 },
  ram: { x: 0.16, y: 0.5 },
  gpu: { x: 0.84, y: 0.5 },
  storage: { x: 0.17, y: 0.8 },
  storageSecondary: { x: 0.39, y: 0.8 },
  psu: { x: 0.61, y: 0.8 },
  case: { x: 0.83, y: 0.8 },
};

export function getDefaultPositions(
  canvasWidth: number,
  canvasHeight: number,
): Record<ComponentCategoryKey, NodePosition> {
  const positions: Partial<Record<ComponentCategoryKey, NodePosition>> = {};

  for (const key of Object.keys(LAYOUT_FRACTIONS) as ComponentCategoryKey[]) {
    const fraction = LAYOUT_FRACTIONS[key];
    positions[key] = {
      x: canvasWidth * fraction.x - ESTIMATED_NODE_WIDTH / 2,
      y: canvasHeight * fraction.y - ESTIMATED_NODE_HEIGHT / 2,
    };
  }

  return positions as Record<ComponentCategoryKey, NodePosition>;
}
