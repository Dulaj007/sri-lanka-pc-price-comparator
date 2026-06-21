import type { Metadata } from "next";

import { PcBuilder } from "@/components/pc-builder/PcBuilder";

export const metadata: Metadata = {
  title: "Build a PC & Compare Live Prices",
  description:
    "Drag-and-drop PC builder that searches pcbuilders.lk, techzone.lk, gamestreet.lk, mdcomputers.lk, nanotek.lk, chamacomputers.lk and barclays.lk at once, then assembles a real, buildable total price for your build.",
};

// This page itself stays a server component (so it can export the
// metadata above) - the builder itself lives in PcBuilder. The header,
// footer, and ambient background all live in the root layout rather
// than here, so they stay mounted as the user moves between pages.
export default function Home() {
  return (
    <div className="mx-auto max-w-5xl px-3 py-4 sm:px-4 sm:py-6">
      <h1 className="sr-only">Sri Lanka PC Price Comparator - Build a PC</h1>
      <PcBuilder />
    </div>
  );
}
