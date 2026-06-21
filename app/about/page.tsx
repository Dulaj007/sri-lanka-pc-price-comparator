import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description:
    "What the Sri Lanka PC Price Comparator does, which stores it searches, how it works, and the project's full disclaimer.",
  alternates: {
    canonical: "/about",
  },
};

const STORES = [
  { name: "PC Builders", url: "https://pcbuilders.lk" },
  { name: "TechZone", url: "https://techzone.lk" },
  { name: "Game Street", url: "https://gamestreet.lk" },
  { name: "MD Computers", url: "https://mdcomputers.lk" },
  { name: "Nanotek", url: "https://www.nanotek.lk" },
  { name: "Chama Computers", url: "https://www.chamacomputers.lk" },
  { name: "Barclays", url: "https://www.barclays.lk" },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      <div className="flex flex-col gap-3 text-sm leading-relaxed text-zinc-400">{children}</div>
    </section>
  );
}

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:py-14">
      <header className="mb-10 flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-white drop-shadow-[0_0_16px_rgba(255,255,255,0.2)] sm:text-3xl">
          About this project
        </h1>
        <p className="text-sm text-zinc-400">Why this exists, what it does, and what it doesn&apos;t.</p>
      </header>

      <div className="flex flex-col gap-10">
        <Section title="What it does">
          <p>
            Pricing a PC component in Sri Lanka usually means opening half a dozen store
            websites in separate tabs, searching each one, and comparing manually. This project
            does that automatically: type a part name, and it searches{" "}
            <span className="font-medium text-zinc-300">all seven stores at once</span>, merges
            the results, and sorts them by price.
          </p>
          <p>
            The main feature - <strong className="text-zinc-300">Build a PC</strong> - takes that
            a step further. Instead of searching one part at a time, it lays out every component
            a working desktop needs on a small canvas: processor, motherboard, memory, graphics
            card, storage, power supply, and case. The motherboard and memory choices are
            automatically filtered to whatever is actually compatible with the processor you
            picked, so it&apos;s not possible to end up with a DDR5 memory kit and a motherboard
            that only has DDR4 slots. One search button then prices out every connected part and
            adds it all up into one buildable total.
          </p>
          <p>
            <strong className="text-zinc-300">Quick Search</strong> - reachable from the search
            bar in the navigation on any page - skips the build entirely and just searches one
            part name directly.
          </p>
        </Section>

        <Section title="Stores searched">
          <p>Every search runs against these seven Sri Lankan online stores:</p>
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {STORES.map((store) => (
              <li key={store.url}>
                <a
                  href={store.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-lg border border-white/10 bg-zinc-950/60 px-3 py-2 text-zinc-300 transition-colors hover:border-white/25 hover:text-white"
                >
                  <span>{store.name}</span>
                  <span className="text-xs text-zinc-500">
                    {store.url.replace("https://", "").replace("www.", "")}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Brand-new prices only">
          <p>
            Every result shown is filtered to be a brand-new listing. Used and second-hand items
            are detected by their category and title and discarded before they ever reach the
            page - this is a price comparator for new hardware, not a second-hand marketplace.
          </p>
        </Section>

        <Section title="How it stays polite to the stores it searches">
          <p>
            Each store&apos;s <code className="text-zinc-300">robots.txt</code> is checked before
            every search, and the project identifies itself honestly with a descriptive
            User-Agent rather than pretending to be a regular browser. Requests are spaced out
            per store, respecting any crawl-delay a store publishes, and a hard timeout means a
            single slow store can never hold up the rest of a search.
          </p>
        </Section>

        <Section title="Disclaimer">
          <p>
            This is an independent educational project, not affiliated with, endorsed by, or
            operated in partnership with any of the stores it searches. Prices are scraped live
            from public store pages and may be out of date, incorrect, or missing promotions and
            taxes by the time you check out - always verify the final price on the store&apos;s
            own site before purchasing.
          </p>
          <p>Built for learning and personal use only, not for commercial resale or redistribution.</p>
        </Section>

        <Section title="Curious how it actually works?">
          <p>
            The{" "}
            <Link href="/docs" className="font-medium text-zinc-200 underline underline-offset-2 hover:text-white">
              Docs page
            </Link>{" "}
            walks through building a PC and using Quick Search step by step.
          </p>
        </Section>
      </div>
    </div>
  );
}
