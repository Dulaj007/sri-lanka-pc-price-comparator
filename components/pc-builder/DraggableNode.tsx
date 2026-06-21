"use client";

// Positions a build block absolutely on the canvas, makes the whole
// block draggable from anywhere on it, and reports its rendered size
// back up via ResizeObserver - the canvas needs real pixel dimensions
// (not the estimates in lib/pcbuild/layout.ts) to draw wires that
// actually touch each block's edge.
//
// A plain click (pointer down then up again without much movement in
// between) is treated as "activate this block" rather than a drag -
// that's what lets clicking anywhere on a block select it without
// fighting the drag gesture.

import { useEffect, useRef } from "react";

interface DraggableNodeProps {
  x: number;
  y: number;
  width: number;
  onMove: (x: number, y: number) => void;
  onResize: (size: { width: number; height: number }) => void;
  onActivate: () => void;
  children: React.ReactNode;
}

// How far the pointer has to travel before a press counts as a drag
// instead of a click. Too small and an ordinary click - which almost
// always involves a pixel or two of incidental movement - gets
// misread as a drag and silently fails to activate the block; too
// large and real drags feel sluggish to start.
const DRAG_THRESHOLD_PX = 8;

export function DraggableNode({ x, y, width, onMove, onResize, onActivate, children }: DraggableNodeProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  // Drag state lives in a ref rather than useState because it changes
  // on every pointermove and never needs to trigger a render of its own
  // - only the resulting onMove()/onActivate() calls do.
  const dragRef = useRef<{ startX: number; startY: number; originX: number; originY: number; moved: boolean } | null>(
    null,
  );

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      onResize({ width, height });
    });
    observer.observe(node);
    return () => observer.disconnect();
    // onResize is a fresh closure every render in the parent, but it
    // always does the same thing (updates state for this node's key) -
    // re-subscribing on every render would be wasted work for no
    // behavioural difference.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handlePointerDown(e: React.PointerEvent) {
    // Let native controls - the spec dropdown, the unplug button -
    // handle their own clicks instead of having them swallowed into a
    // drag-or-activate gesture meant for the block as a whole.
    if ((e.target as HTMLElement).closest("select, button")) return;

    dragRef.current = { startX: e.clientX, startY: e.clientY, originX: x, originY: y, moved: false };
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e: React.PointerEvent) {
    const drag = dragRef.current;
    if (!drag) return;

    const dx = e.clientX - drag.startX;
    const dy = e.clientY - drag.startY;
    if (!drag.moved && Math.abs(dx) <= DRAG_THRESHOLD_PX && Math.abs(dy) <= DRAG_THRESHOLD_PX) {
      // Still within "this might just be a click" territory - don't
      // move the block at all yet, so an ordinary click never causes
      // even a one-pixel visual flinch.
      return;
    }
    drag.moved = true;
    onMove(drag.originX + dx, drag.originY + dy);
  }

  function handlePointerUp(e: React.PointerEvent) {
    const drag = dragRef.current;
    dragRef.current = null;
    if (!drag) return;

    e.currentTarget.releasePointerCapture(e.pointerId);
    if (!drag.moved) {
      onActivate();
    }
  }

  return (
    <div
      ref={rootRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className="absolute touch-none cursor-grab select-none active:cursor-grabbing"
      style={{ left: x, top: y, width }}
    >
      {children}
    </div>
  );
}
