"use client";

// A one-time welcome popup explaining the builder, shown automatically
// the first time someone lands on the page. Dismissing it (either
// button works the same way) sets a localStorage flag so it never
// shows again on that browser - the "How to use" tooltip on the canvas
// covers the same ground for anyone who wants a reminder later.

import { useEffect, useState } from "react";

const SEEN_FLAG_KEY = "pc-builder-seen-welcome";

const STEPS = [
  { title: "Pick a processor", body: "Everything else on the canvas unlocks from this one choice." },
  { title: "Fill in the rest", body: "Motherboard and memory only show options that actually fit. Drag any block, or unplug one to skip it." },
  { title: "Search and compare", body: "One button prices every connected part at once and adds up a real, buildable total." },
];

export function WelcomeModal() {
  const [open, setOpen] = useState(false);

  // This has to run in an effect rather than a lazy useState initializer
  // - localStorage doesn't exist during server rendering, so reading it
  // any earlier than this would either crash the server render or risk
  // a hydration mismatch between what the server and client each think
  // the initial state is.
  useEffect(() => {
    try {
      if (!window.localStorage.getItem(SEEN_FLAG_KEY)) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setOpen(true);
      }
    } catch {
      // Private browsing or storage disabled - just skip the popup
      // rather than risk it reappearing every load with no way to tell.
    }
  }, []);

  function dismiss() {
    setOpen(false);
    try {
      window.localStorage.setItem(SEEN_FLAG_KEY, "1");
    } catch {
      // Nothing we can do if storage is unavailable - worst case the
      // popup shows again next visit, which is harmless.
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={dismiss}
    >
      <div
        className="w-full max-w-md border border-white/20 bg-zinc-950 p-6 shadow-[0_0_60px_-10px_rgba(255,255,255,0.25)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <h2 className="text-lg font-semibold text-white">Welcome to the PC Builder</h2>
          <button
            onClick={dismiss}
            aria-label="Close"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/15 text-zinc-400 transition-colors hover:border-white/30 hover:text-white"
          >
            ✕
          </button>
        </div>

        <p className="mb-5 text-sm leading-relaxed text-zinc-300">
          Assemble a build out of eight wired-together blocks, then search all seven Sri Lankan
          stores at once for every part.
        </p>

        <ol className="mb-6 flex flex-col gap-3">
          {STEPS.map((step, i) => (
            <li key={step.title} className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/25 text-xs font-bold text-white">
                {i + 1}
              </span>
              <span className="text-sm text-zinc-300">
                <span className="font-medium text-white">{step.title}.</span> {step.body}
              </span>
            </li>
          ))}
        </ol>

        <button
          onClick={dismiss}
          className="w-full rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-black shadow-[0_0_20px_-4px_rgba(255,255,255,0.4)] transition-colors hover:bg-zinc-200"
        >
          Got it, let&apos;s build
        </button>
      </div>
    </div>
  );
}
