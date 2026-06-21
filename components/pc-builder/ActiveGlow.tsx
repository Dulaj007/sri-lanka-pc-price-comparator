// The glowing border that rings whichever build block is currently
// active. All four edges are positioned with plain CSS percentages
// (see .edge-glow in app/globals.css), so this scales to whatever size
// the block it's layered over actually renders at without ever
// measuring anything in JavaScript. Must sit inside a `position:
// relative` ancestor matching the block's own box.
export function ActiveGlow() {
  return (
    <div className="pointer-events-none absolute inset-0">
      <div className="edge-glow edge-glow-l" />
      <div className="edge-glow edge-glow-r" />
      <div className="edge-glow edge-glow-t" />
      <div className="edge-glow edge-glow-b" />
    </div>
  );
}
