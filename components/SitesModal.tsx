// The "View sites" popup in the header. Lists every store the app
// searches, each one linking out to the real site.

const SITES = [
  { name: "PC Builders", url: "https://pcbuilders.lk" },
  { name: "TechZone", url: "https://techzone.lk" },
  { name: "Game Street", url: "https://gamestreet.lk" },
  { name: "MD Computers", url: "https://mdcomputers.lk" },
  { name: "Nanotek", url: "https://www.nanotek.lk" },
  { name: "Chama Computers", url: "https://www.chamacomputers.lk" },
  { name: "Barclays", url: "https://www.barclays.lk" },
];

export function SitesModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-zinc-950 p-6 shadow-[0_0_40px_-8px_rgba(255,255,255,0.15)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-white">Stores we search</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-zinc-500 hover:bg-white/10 hover:text-white"
            aria-label="Close"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <ul className="flex flex-col gap-1">
          {SITES.map((site) => (
            <li key={site.url}>
              <a
                href={site.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:bg-white/5 hover:text-white"
              >
                <span>{site.name}</span>
                <span className="text-xs text-zinc-500">
                  {site.url.replace("https://", "").replace("www.", "")}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
