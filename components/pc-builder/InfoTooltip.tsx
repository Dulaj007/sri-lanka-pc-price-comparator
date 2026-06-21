// A small labelled button that reveals a block of text on hover,
// instead of that text sitting permanently on the page as a paragraph.
// Used for both the "How to use" tutorial blurb and the disclaimer -
// pure CSS (Tailwind's group/group-hover), no state needed.

interface InfoTooltipProps {
  label: string;
  text: string;
  icon: "info" | "warning";
  // Which direction the panel opens, and which edge of the trigger it
  // stays aligned to - kept independent of each other (rather than one
  // combined "corner" prop) because the same tooltip needs to open
  // downward in some layouts (e.g. a row at the top of the mobile list)
  // and upward in others (e.g. the canvas's bottom-left corner), even
  // when its horizontal alignment doesn't change.
  side: "top" | "bottom";
  align: "left" | "right";
}

export function InfoTooltip({ label, text, icon, side, align }: InfoTooltipProps) {
  const sideClass = side === "bottom" ? "top-full mt-2" : "bottom-full mb-2";
  const alignClass = align === "right" ? "right-0" : "left-0";

  return (
    <div className="group relative z-20 inline-flex">
      <button
        type="button"
        aria-label={label}
        className="flex items-center gap-1.5 rounded-full border border-white/20 bg-black/70 px-2.5 py-1.5 text-xs font-medium text-zinc-300 backdrop-blur-sm transition-colors hover:border-white/40 hover:text-white"
      >
        <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-current text-[10px] font-bold leading-none">
          {icon === "warning" ? "!" : "i"}
        </span>
        {label}
      </button>
      <div
        className={`pointer-events-none absolute z-30 w-72 border border-white/10 bg-zinc-950/95 p-3 text-xs leading-relaxed text-zinc-300 opacity-0 shadow-[0_0_30px_-8px_rgba(255,255,255,0.25)] backdrop-blur-md transition-opacity group-hover:opacity-100 ${sideClass} ${alignClass}`}
      >
        {text}
      </div>
    </div>
  );
}
