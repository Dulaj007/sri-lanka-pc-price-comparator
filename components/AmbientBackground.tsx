// A purely decorative layer fixed behind every page's content: two
// large colour blobs drifting slowly, and a perspective grid along the
// bottom for a sense of depth. All the actual animation lives in
// app/globals.css - this just places the elements it animates.
export function AmbientBackground() {
  return (
    <div className="ambient-bg" aria-hidden="true">
      <div className="ambient-glow ambient-glow-1" />
      <div className="ambient-glow ambient-glow-2" />
      <div className="ambient-grid" />
    </div>
  );
}
