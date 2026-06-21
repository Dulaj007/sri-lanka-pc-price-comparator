// Draws the wires from the processor hub out to every other block on
// the canvas, as a right-angled "circuit trace" rather than a straight
// diagonal line. A connected wire is solid and clickable to unplug; an
// unplugged one is drawn faint and dashed so it's still obvious where
// it would reconnect to. Whichever wire matches the category currently
// being searched gets a brighter stroke plus a couple of small dots
// travelling along it, end to end, to read as "data moving through this
// connection right now."

import type { NodePosition } from "@/lib/pcbuild/layout";
import type { ComponentCategoryKey } from "@/lib/pcbuild/types";

interface Wire {
  key: ComponentCategoryKey;
  to: NodePosition;
  connected: boolean;
}

interface WireLayerProps {
  hub: NodePosition;
  wires: Wire[];
  onToggle: (key: ComponentCategoryKey) => void;
  activeSearchKey: ComponentCategoryKey | null;
}

// An elbow path: out from the hub horizontally to the halfway point,
// then vertically, then horizontally into the target. This is what
// gives the canvas its "wired together" look instead of plain straight
// lines crossing over each other.
function elbowPath(from: NodePosition, to: NodePosition): string {
  const midX = (from.x + to.x) / 2;
  return `M ${from.x} ${from.y} L ${midX} ${from.y} L ${midX} ${to.y} L ${to.x} ${to.y}`;
}

export function WireLayer({ hub, wires, onToggle, activeSearchKey }: WireLayerProps) {
  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
      {wires.map((wire) => {
        const path = elbowPath(hub, wire.to);
        const isTransferring = wire.key === activeSearchKey;

        return (
          <g key={wire.key}>
            <path
              d={path}
              fill="none"
              stroke={isTransferring ? "rgba(255,255,255,0.6)" : wire.connected ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.08)"}
              strokeWidth={isTransferring ? 2.5 : 2}
              strokeDasharray={wire.connected ? undefined : "4 5"}
            />
            {/* Invisible wide hit area - a 2px line is too thin to click
                reliably, so the actual click target is much wider than
                what's drawn. */}
            <path
              d={path}
              fill="none"
              stroke="transparent"
              strokeWidth={18}
              className="pointer-events-auto cursor-pointer"
              onClick={() => onToggle(wire.key)}
            />
            {isTransferring && (
              <>
                <circle r={3.5} fill="white">
                  <animateMotion dur="1s" repeatCount="indefinite" path={path} />
                </circle>
                <circle r={3.5} fill="white" opacity={0.45}>
                  <animateMotion dur="1s" begin="-0.5s" repeatCount="indefinite" path={path} />
                </circle>
              </>
            )}
            <circle cx={wire.to.x} cy={wire.to.y} r={3} fill={wire.connected ? "white" : "rgba(255,255,255,0.2)"} />
          </g>
        );
      })}
      <circle cx={hub.x} cy={hub.y} r={4} fill="white" />
    </svg>
  );
}
