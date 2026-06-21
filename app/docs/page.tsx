import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Docs - How to Use the Builder",
  description:
    "A step-by-step guide to building a PC and comparing prices: how the canvas works, how compatibility unlocking works, and how to quick-search a single part.",
  alternates: {
    canonical: "/docs",
  },
};

interface Step {
  title: string;
  body: string;
}

const BUILD_STEPS: Step[] = [
  {
    title: "Pick a processor",
    body:
      "This is the one block that isn't locked from the start. Choose a brand and tier - AMD Athlon up through Ryzen 9, or Intel Celeron up through Core i9. The motherboard and memory blocks both wait on this choice.",
  },
  {
    title: "Motherboard and memory unlock",
    body:
      "Picking a processor narrows the Motherboard block to chipsets that actually accept that brand. Picking a motherboard then narrows the Memory block to whichever RAM generation - DDR4 or DDR5 - that chipset's slots are wired for. There's no way to end up with an incompatible pairing here.",
  },
  {
    title: "Fill in the rest",
    body:
      "Graphics card, primary storage, secondary storage (or choose \"None\" if you only need one drive), power supply, and case don't depend on anything else, so they can be filled in any order. Don't need a part? Click the ✕ on its block, or click its wire, to unplug it from the build entirely - it's then skipped by the search.",
  },
  {
    title: "Drag blocks around",
    body:
      "Every block can be dragged anywhere on the canvas by clicking and moving it - there's no fixed layout to fight with. This is purely visual; it doesn't change what gets searched.",
  },
  {
    title: "Press the centre button",
    body:
      "Every block's wire runs to the \"Search My PC Price\" button in the middle of the canvas, since searching is the one thing all eight blocks feed into. Once every plugged-in block has a choice, the button activates. Each block is then searched one at a time against all seven stores, with the button itself showing progress and the wire to whichever block is currently being searched lighting up.",
  },
  {
    title: "Compare and swap",
    body:
      "Each block defaults to its cheapest listing, which is what the running build total is based on. Click any block to open every listing found for it - store, price, warranty, stock - and click a different row to swap it in. Mixing stores across a build (memory from one, a graphics card from another) is the whole point.",
  },
  {
    title: "Check the reference builds",
    body:
      "Alongside the running total, four other totals are computed automatically: the cheapest possible build regardless of stock, the cheapest build using only parts in stock right now, the build with the longest warranty coverage, and the most expensive in-stock build. None of these affect your own picks - they're just reference points.",
  },
  {
    title: "Export the build",
    body:
      "Once you're happy with it, \"Save build as JSON\" downloads exactly what was picked for every category, the listing chosen for each, and all of the totals above.",
  },
];

const SEARCH_STEPS: Step[] = [
  {
    title: "Type a part name",
    body:
      "Use the search bar in the navigation, on any page - try something like \"RTX 5070\", \"Ryzen 7 9800X3D\", or \"32GB DDR5\".",
  },
  {
    title: "Press Search",
    body:
      "This opens the Quick Search page with every listing found for that term across all seven stores, sorted cheapest first by default.",
  },
  {
    title: "Sort, export, or visit the listing",
    body:
      "Switch between cheapest-first and most-expensive-first, download the full result set as JSON, or click \"View\" on any row to open that exact listing on the store's own site.",
  },
];

function StepCard({ index, step }: { index: number; step: Step }) {
  return (
    <div className="flex gap-4 rounded-xl border border-white/10 bg-zinc-950/60 p-4 sm:p-5">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/20 bg-black text-sm font-bold text-white">
        {index}
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-semibold text-white sm:text-base">{step.title}</h3>
        <p className="text-sm leading-relaxed text-zinc-400">{step.body}</p>
      </div>
    </div>
  );
}

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ: FaqItem[] = [
  {
    question: "Why does the motherboard block stay greyed out at first?",
    answer:
      "It's locked until a processor is chosen, since a motherboard's socket only accepts chips from one manufacturer. Once a processor is picked, only compatible chipsets become selectable.",
  },
  {
    question: "What does unplugging a block actually do?",
    answer:
      "It removes that category from the search entirely. The wire to it turns into a faint dashed line, the block dims, and the centre button no longer requires (or searches) that part. Useful for pricing a partial upgrade rather than a full build.",
  },
  {
    question: "Why does a search for one part return such a wide price range?",
    answer:
      "A generic spec like \"AMD Ryzen 7\" searches every Ryzen 7 generation and model a store happens to carry, at very different prices. The build flow expects you to open the result list afterward and pick the specific model you actually want.",
  },
  {
    question: "Why did a search come back empty, or show a stale-results notice?",
    answer:
      "If a store's site is briefly slow or unreachable, that one store is skipped without failing the whole search. If every store fails for a particular query, the app falls back to the last successful result it cached for that exact search.",
  },
  {
    question: "Are these used or second-hand prices?",
    answer:
      "No. Listings categorised or titled as used are filtered out before they're ever shown - every price displayed is for a brand-new item.",
  },
];

export default function DocsPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:py-14">
      <header className="mb-10 flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-white drop-shadow-[0_0_16px_rgba(255,255,255,0.2)] sm:text-3xl">
          How to use it
        </h1>
        <p className="text-sm text-zinc-400">
          Everything below applies whether this is your first PC build or your tenth.
        </p>
      </header>

      <div className="flex flex-col gap-12">
        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-white">Building a PC, step by step</h2>
          <div className="flex flex-col gap-3">
            {BUILD_STEPS.map((step, i) => (
              <StepCard key={step.title} index={i + 1} step={step} />
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-white">Quick-searching a single part</h2>
          <div className="flex flex-col gap-3">
            {SEARCH_STEPS.map((step, i) => (
              <StepCard key={step.title} index={i + 1} step={step} />
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-white">Frequently asked questions</h2>
          <div className="flex flex-col gap-2">
            {FAQ.map((item) => (
              <details
                key={item.question}
                className="group rounded-xl border border-white/10 bg-zinc-950/60 px-4 py-3 open:bg-zinc-950"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-medium text-zinc-200">
                  {item.question}
                  <span className="shrink-0 text-zinc-500 transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
