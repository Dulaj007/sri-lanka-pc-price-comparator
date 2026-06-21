![sri-lanka-pc-price-comparator](https://jpcdn.it/img/f443f5dc18884d721b04ee7e127f1548.png)

# Sri Lanka PC Price Comparator

A web application that searches seven Sri Lankan PC hardware stores simultaneously and presents their prices in a single, sortable table.

This project is an enhancement of an earlier version of the same idea, published at [github.com/Dulaj007/sri-lanka-pc-components-price-scraper](https://github.com/Dulaj007/sri-lanka-pc-components-price-scraper). What started as a single search box has grown into a full build planner with its own canvas, a dedicated quick-search page, and supporting documentation - all built on top of the original scraping foundation.

The site has four pages. **Home** holds the main feature, **Build a PC**: a canvas of draggable component blocks - processor, motherboard, memory, graphics card, primary storage, secondary storage, power supply, and case - each wired into a fixed search button at the centre of the canvas. Every choice is a generic spec rather than a specific product, the motherboard and memory options only show what's actually compatible with what's already been picked, and any block can be unplugged to leave it out of the search entirely. **Quick Search**, reachable from the search bar in the navigation on any page, looks up a single part by name instead. **Docs** walks through using both features step by step, and **About** explains what the project does and carries its full disclaimer.

Every result shown is a brand-new item. Used and second-hand listings are identified and discarded before anything reaches the screen.

---

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/Dulaj007/sri-lanka-pc-components-price-scraper.git
cd sri-lanka-pc-components-price-scraper
npm install
```

### Running locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The home page opens straight into the PC Builder - choose a processor, then a compatible motherboard, then a compatible memory size, fill in the rest of the blocks, and press the centre button. Use the search bar in the navigation at any time to look up a single part instead, for example `RTX 5070`, `Ryzen 7 9800X3D`, or `32GB DDR5`.

### Building for production

```bash
npm run build
npm start
```

### Deploying to Vercel

Connect the repository to a Vercel project. No environment variables or database setup is required. The framework is detected automatically as Next.js. Click Deploy.

Set the `NEXT_PUBLIC_SITE_URL` environment variable to the real deployed URL once it's known - it feeds the sitemap, robots.txt, and Open Graph tags (see `lib/seo.ts`). Without it, those fall back to a placeholder.

The one thing that does not carry over to Vercel's free (Hobby) tier is the local JSON cache, because the serverless runtime has a read-only filesystem. The scrapers themselves work fine. See the Limitations section for more detail.

---

## Project Structure

```
.
├── app/
│   ├── api/
│   │   └── search/
│   │       └── route.ts        # API endpoint — runs all scrapers in parallel
│   ├── about/
│   │   └── page.tsx            # What the project does, plus the full disclaimer
│   ├── docs/
│   │   └── page.tsx            # Step-by-step usage guide and FAQ
│   ├── search/
│   │   └── page.tsx            # Quick Search, pre-filled from ?q= in the URL
│   ├── globals.css
│   ├── icon.svg                # Browser tab favicon
│   ├── layout.tsx              # Root layout — nav, footer, ambient background, SEO metadata
│   ├── opengraph-image.tsx     # Generates the Open Graph preview image on demand
│   ├── twitter-image.tsx       # Generates the Twitter/X card preview image on demand
│   ├── page.tsx                # Home page — just the PC Builder
│   ├── robots.ts                # Generates /robots.txt
│   └── sitemap.ts               # Generates /sitemap.xml
├── components/
│   ├── QuickSearch.tsx         # The single-part search feature
│   ├── SiteHeader.tsx          # Sticky nav: logo, links, search bar, sites/GitHub shortcuts
│   ├── SiteFooter.tsx          # Footer links and signature
│   ├── SitesModal.tsx          # "View sites" popup in the header
│   ├── StockBadge.tsx          # Shared in-stock / out-of-stock pill
│   ├── AmbientBackground.tsx   # Fixed drifting-glow / perspective-grid backdrop
│   └── pc-builder/
│       ├── PcBuilder.tsx        # Orchestrates the whole builder feature
│       ├── ComponentBlock.tsx   # One block on the build canvas
│       ├── ComponentIcon.tsx    # Per-category glyph shown on each block
│       ├── DraggableNode.tsx    # Makes a block draggable + measures its size
│       ├── WireLayer.tsx        # SVG wires from every block to the centre button
│       ├── SearchHubButton.tsx  # The fixed centre button every wire runs to
│       ├── ActiveGlow.tsx       # Glowing edge border for the active block
│       ├── InfoTooltip.tsx      # Hover-revealed "How to use" button
│       ├── WelcomeModal.tsx     # One-time popup explaining the builder on first visit
│       ├── StrategyCard.tsx     # One of the four reference-build cards
│       └── BuildResultsPanel.tsx # Per-category listing picker
├── lib/
│   ├── cache.ts                # Read/write data/cache.json
│   ├── format.ts                # formatPrice, downloadJson, slugify
│   ├── http.ts                 # fetch wrapper with UA header, timeout, throttling
│   ├── robots.ts               # robots.txt parser
│   ├── seo.ts                   # Canonical site URL and name, used by metadata/sitemap/robots
│   ├── types.ts                # Shared TypeScript interfaces
│   ├── pcbuild/
│   │   ├── catalog.ts           # Generic component specs + compatibility rules
│   │   ├── layout.ts            # Default canvas positions for each block
│   │   ├── strategy.ts          # The four reference-build calculations
│   │   └── types.ts             # Types specific to the builder feature
│   └── scrapers/
│       ├── index.ts            # Scraper registry
│       ├── util.ts             # Shared parsing helpers
│       ├── woocommerce.ts      # Shared loop for WooCommerce stores
│       ├── pcbuilders.ts
│       ├── techzone.ts
│       ├── gamestreet.ts
│       ├── mdcomputers.ts
│       ├── nanotek.ts
│       ├── chamacomputers.ts
│       └── barclays.ts
├── public/
│   └── sri-lanka-flag.png      # Flag shown in the navigation logo
└── data/
    └── cache.json              # Local result cache (gitignored after first run)
```

---

## Stores Covered

| Store | URL | Backend |
|---|---|---|
| PC Builders | pcbuilders.lk | WooCommerce |
| TechZone | techzone.lk | WooCommerce (Electro theme) |
| Game Street | gamestreet.lk | Custom PHP |
| MD Computers | mdcomputers.lk | WooCommerce (custom theme) |
| Nanotek | nanotek.lk | CS-Cart style storefront |
| Chama Computers | chamacomputers.lk | Next.js |
| Barclays | barclays.lk | Classic ASP |

---

## Pages

The header and footer are rendered once, in `app/layout.tsx`, rather than inside each page. The App Router only swaps out the page content on navigation, so the navigation bar itself - including which link is currently highlighted - never unmounts or flickers as the user moves between pages.

- **Home (`/`)** - the PC Builder canvas. The main feature of the site.
- **Quick Search (`/search`)** - a single-part lookup, pre-filled and auto-run if the URL carries a `?q=` parameter, which is how the navigation's search bar hands off to it. Marked `noindex` in its metadata, since a results page has no unique content of its own for a search engine to rank.
- **Docs (`/docs`)** - a numbered walkthrough of building a PC and of Quick Search, plus a short FAQ built with native `<details>`/`<summary>` elements.
- **About (`/about`)** - what the project does, the list of stores it searches, and its full disclaimer.

---

## PC Builder

This is the main feature of the application. Rather than typing a search term, the user assembles a build out of eight blocks - Processor, Motherboard, Memory, Graphics Card, Primary Storage, Secondary Storage, Power Supply, and Case - laid out on a canvas, each one wired to a fixed button at the centre. Every block can be dragged anywhere on the canvas, and any wire can be unplugged to drop that part from the build entirely.

### A canvas with one fixed point

Every block's wire runs to the "Search My PC Price" button sitting at the exact centre of the canvas, rather than to any one component. Earlier versions of this wired everything to the processor block instead, but that didn't actually mean anything - there's no reason a graphics card's wire should run to the processor specifically rather than, say, the case. What every block genuinely has in common is that it all feeds into one action: searching. The button is the only thing on the canvas that never moves; every block around it can be dragged anywhere, and the wires redraw themselves in real time to follow wherever a block ends up.

The eight blocks default to three rows that fit a wide, short canvas: the processor and motherboard together across the top (the one pair with a real compatibility relationship), memory and the graphics card flanking the centre button, and the remaining four blocks across the bottom - all pulled in a little from the canvas's own edges so no block ever sits flush against the border.

A wire can be unplugged two ways: clicking directly on it, or clicking the small ✕ button in the corner of the block it leads to. An unplugged wire turns into a faint dashed line rather than disappearing outright, so it's still obvious where it would reconnect to, and the block it belonged to dims to make it visually clear that part has been left out. Clicking the wire (now showing a + button instead) plugs it back in. The processor itself can't be unplugged, since choosing it is what drives the motherboard and memory compatibility cascade.

This is what lets someone price out a partial build - say, just a processor, motherboard, and graphics card - by unplugging everything else rather than being forced to fill in all eight blocks before searching. Only blocks that are still plugged in need a spec chosen before the centre button activates, and the search itself skips every unplugged block entirely.

Whichever block is currently "active" - the processor by default, or whichever block's results panel is currently open - is ringed with a glowing edge border. While a search is running, the centre button itself shows progress, and the wire to whichever block is currently being searched brightens with a pair of small dots travelling along it, end to end, to read as data moving through that connection.

### Picking generic specs, not specific products

Every block's dropdown offers a generic spec, not a brand. For memory, that means an option reads "16GB DDR5" rather than listing every manufacturer that happens to sell a 16GB DDR5 kit. The reasoning is that a 16GB DDR5 kit from one manufacturer and a 16GB DDR5 kit from another are interchangeable for compatibility purposes - what actually varies between them is price, and that's exactly what the scrapers are for. The generic spec is what gets searched; the specific product, store, and price are what the search turns up afterward.

The Processor block is the one exception that goes slightly more specific, offering a brand and tier (AMD Athlon up through Ryzen 9, Intel Celeron up through Core i9) rather than just "CPU". That distinction is necessary because it drives the next step.

The Sri Lankan market spans far more than the newest generation of everything, so every list - processors, motherboard chipsets, memory, and especially graphics cards - deliberately covers genuinely old and entry-level parts alongside the current generation, not just whatever launched this year. The Graphics Card list, for instance, runs from a GT 1030 through the GTX 1660 Super and the RTX 20/30 series, AMD's RX 6000 and 7000 series, all the way to the RTX 50 and RX 9000 series - over two dozen options in total, grouped under headings in the dropdown so the list stays readable.

### Compatibility, not just a list of dropdowns

Two of the eight blocks are linked by a real compatibility rule:

1. **Processor → Motherboard.** A motherboard's socket only accepts chips from one manufacturer, so choosing an AMD processor narrows the Motherboard block to AMD chipsets - A320 and B350 through B450/X470 on the older AM4 boards, B550/X570 on the newer AM4 boards, and A620/B650/X670 on the current AM5 platform. Choosing an Intel processor narrows it to Intel chipsets spanning the old H110/H310 boards through B460/H510/B560/Z590, up to the current H610/B760/Z790 generation. The Motherboard block stays locked until a processor is chosen, and its options are grouped by socket and generation in the dropdown.

2. **Motherboard → Memory.** A motherboard's memory slots are wired for one RAM generation. Each chipset option in the catalog records whether it's a DDR4 or DDR5 board, and the Memory block only offers sizes in that generation - pick a DDR5 chipset and the Memory dropdown shows 16 through 96GB DDR5; pick a DDR4 chipset and it shows 4 through 64GB DDR4. The Memory block stays locked until a motherboard is chosen.

Changing an earlier choice clears anything downstream of it automatically. Switching the processor from AMD to Intel resets both the Motherboard and Memory blocks, since whatever was selected there is no longer guaranteed to be compatible.

Graphics card, storage, power supply, and case don't get the same treatment, because there isn't a meaningful pass/fail compatibility rule to enforce - almost any graphics card fits any motherboard's PCIe slot, any drive fits a standard SATA or M.2 connection, and PSU wattage and case size are headroom decisions rather than hard constraints. Those blocks are flat (if long) lists that can be filled in any order.

This compatibility logic is entirely static, hand-written domain knowledge living in `lib/pcbuild/catalog.ts`. None of it comes from scraping - it doesn't need to, because chipset-to-RAM-generation mapping doesn't change from one search to the next the way prices do.

### Two storage blocks, three drive types

Storage is split into a Primary and a Secondary block, because plenty of real builds pair a fast boot drive with a larger, cheaper bulk drive. Both blocks share the same catalog of options, grouped into three drive types: Hard Disk Drives for cheap bulk storage, SATA SSDs as the older standard, and NVMe SSDs as the current standard. The Secondary block has one extra option at the top of its list - "None — single drive only" - for builds that only need the one drive. Picking it tells the build search there is nothing to look up for that block, so it's skipped over rather than searched.

### Searching every block

Once every plugged-in block has a generic spec chosen, the centre button activates. Pressing it runs one ordinary search per block, one after another, each one being exactly the same `/api/search?q=<term>` call the Quick Search box makes - the term is just whatever generic spec was picked (for example, the Memory block's "16GB DDR5" becomes the search term `16gb ddr5 ram`).

The searches run sequentially rather than all at once, for two reasons. First, all eight categories would otherwise hit the same seven stores at the same moment, multiplying the load on each store for no benefit. Second, the existing per-host rate limiting (`lib/http.ts`) is shared process-wide - if every category tried to reach nanotek.lk (which asks for a 20-second gap between requests) at the same time, every category after the first would queue up behind it. Running one category at a time means each one finishes in roughly the same few seconds a normal Quick Search takes, and the next can't start until it's done.

While this runs, the centre button and a readout below the canvas both show which category is currently being searched and a rough estimate of the remaining time, based on roughly six seconds per category - enough to set expectations without pretending to a precision the search times don't actually have.

### Turning several searches into one price, four different ways

Each category keeps its own result list rather than being merged into one big table. As each search finishes, the cheapest listing that's actually in stock right now is automatically chosen for that category - that's what makes the running total a real, buildable number rather than an abstract estimate built on listings that might be sold out.

Five figures are shown once every category has been searched:

- **Current build total** - the sum of whichever listing is currently chosen for each block (the cheapest in-stock one, until the user overrides it).
- **Cheapest** - the cheapest listing found for every part, regardless of whether it's actually in stock right now.
- **Best Value** - the cheapest listing for every part that is in stock right now.
- **Best Warranty** - the longest warranty coverage among in-stock listings for every part, price aside.
- **Premium** - the most expensive in-stock listing for every part.

The four reference figures are computed fresh from the full result lists every time (see `lib/pcbuild/strategy.ts`) and never touch the user's own per-block choices - they exist purely as comparison points alongside whatever the user is actually configuring.

Clicking on any block that has results opens a panel below the canvas listing every store's listing for that category - price, warranty, stock status, same as the Quick Search results table, with the cheapest row tagged "Best price" and the currently chosen row highlighted. Clicking a row in that panel swaps it in as the chosen listing for that block, and the current build total recalculates immediately. This is what allows a finished build to mix stores freely - memory from one store, a graphics card from a completely different one - because each block's choice is independent of every other block's.

The finished build, including which generic spec was picked for each category, which specific listing was chosen, and all five totals, can be exported to a JSON file the same way Quick Search results can.

### Smaller screens get a plain list

Dragging absolutely-positioned blocks around doesn't translate to a small touchscreen, and there isn't reliably enough width below roughly 1024px for the canvas's bottom row of four blocks without them overlapping. Below that breakpoint the same eight blocks render as a plain vertical list instead, with an ordinary button at the bottom to trigger the search - same state, same handlers, just a different container. A first visit to either layout shows a one-time welcome popup explaining the basics, dismissed once and remembered in `localStorage`.

---

## Tech Stack

### Next.js 16 — App Router

The application uses the App Router introduced in Next.js 13 and stabilised in later versions. This means file-based routing under `app/`, where folders map directly to URL segments. Pages are React Server Components by default, which is what lets each one export its own page-specific `metadata` - the navigation, footer, and ambient background instead live once in the root layout, so they persist across client-side navigation rather than remounting on every page. The API route (`app/api/search/route.ts`) is a Route Handler - it runs on the server (or on a serverless function in production) and never ships its code to the browser.

This split matters because the scraping logic, file system access, and HTTP calls all live in the Route Handler, which means they are never exposed to end users. The client only ever talks to `/api/search`.

### TypeScript

The entire codebase is TypeScript. The main benefit here is not just type safety in individual files - it is the ability to define the shape of a `Product` once in `lib/types.ts` and have the compiler enforce that shape across every scraper, the API route, and the UI. When a new field is added to `Product` (for example, `warranty` was added partway through development), TypeScript immediately shows every file that needs updating.

### Tailwind CSS v4

Tailwind is used for all styling. Version 4 is configured differently from v3 - there is no `tailwind.config.js`. Instead, configuration lives directly in `globals.css` using `@theme` blocks and CSS custom properties. This makes the design token layer feel more like standard CSS rather than a separate config file.

The app has a single fixed theme rather than a light/dark toggle: a pure black background throughout, with white text and soft white glow shadows (Tailwind's arbitrary-value `shadow-[...]` syntax) standing in for the depth that shadows would normally provide on a light surface. Status colours sit on top of that base - emerald for in-stock badges and "best price" highlights, amber for stale-cache notices, red for errors - each rendered as a translucent tint (`bg-emerald-500/10`, `border-emerald-500/20`, and so on) so they read clearly against black without ever looking like a harsh patch of colour.

### Cheerio

Cheerio is a server-side HTML parsing library with a jQuery-style API. When a scraper fetches a page, it passes the raw HTML string to `cheerio.load()`, which returns a `$` function that behaves like jQuery's `$`. From there, CSS selectors like `$("ul.products li.product")` work exactly as they would in browser DevTools.

The reason for choosing Cheerio over a headless browser (Puppeteer, Playwright) is resource cost. A headless browser launches a full Chromium or Firefox instance - several hundred megabytes of binary, 1-2 seconds of startup time, significant memory per instance. Cheerio is a few kilobytes of JavaScript that parses static HTML in milliseconds. Since every store in this list renders its search results as server-side HTML (the product data is in the raw response body, not injected by JavaScript), a headless browser adds no value and only adds weight.

### Native fetch with AbortController

The Node.js runtime built into Next.js includes the browser-standard `fetch` API. Requests are made with `fetch()` directly, with an `AbortController` providing the request timeout. The controller's `signal` is passed to `fetch` as an option. When the timeout fires, `controller.abort()` is called, which causes the pending `fetch` to reject with an abort error. This is caught and reported as a site failure without affecting the other scrapers running in parallel.

No third-party HTTP library (axios, got, node-fetch) is needed.

### JSON file cache

Results are saved to `data/cache.json` after every successful search. The file is a plain JSON object keyed by the normalised query string (lowercase, trimmed). If a subsequent search returns zero results because all scrapers failed (network issue, site down, rate limiting), the API route checks the cache for the same query and returns the previous result with a `cachedAt` timestamp so the UI can display a notice.

The write is wrapped in a try/catch - failures are logged to the console but never thrown. This means the cache is a convenience, not a requirement. If the file cannot be written (for example, on Vercel's read-only filesystem), the app continues to work without it.

### SEO

Each page exports its own `title`, `description`, and canonical URL (`alternates.canonical`); the root layout applies a shared title template (`%s | Sri Lanka PC Price Comparator`) and Open Graph/Twitter defaults so they don't need repeating on every page. `app/sitemap.ts` and `app/robots.ts` generate `/sitemap.xml` and `/robots.txt` from the same canonical site URL defined once in `lib/seo.ts`. The Quick Search page is explicitly marked `noindex` in its metadata, since a results page built from whatever happens to be in its `?q=` parameter has no fixed content worth ranking.

`app/opengraph-image.tsx` and `app/twitter-image.tsx` use Next's built-in `ImageResponse` to render a branded preview image on demand rather than shipping a static file - any link to the site posted on social media or chat apps gets a proper card instead of a blank thumbnail. The root layout also emits a `WebSite` JSON-LD block with a `SearchAction` pointing at `/search?q=`, which is the structured data Google looks for when deciding whether to show a sitelinks search box for the domain.

---

## How It Was Built

### Step 1 — Defining the data contract

Before writing any scraping code, the TypeScript interfaces were defined in `lib/types.ts`. The key interface is `Product`:

```typescript
interface Product {
  site: string;
  title: string;
  price: number;
  currency: string;
  condition: "new" | "used" | "unknown";
  url: string;
  inStock: boolean;
  warranty?: string;
}
```

Defining this first means the compiler enforces the shape everywhere. A scraper that returns a price as a string, or forgets the `inStock` field, will fail at compile time rather than silently producing malformed data at runtime.

`SiteStatus` captures whether a site succeeded and how many results it returned. `SearchResponse` is the object the API route assembles and sends to the browser - the merged results array, the per-site statuses, and an optional cache timestamp.

### Step 2 — Shared HTTP infrastructure

All HTTP requests go through `lib/http.ts` rather than calling `fetch` directly in each scraper. This gives three things for free:

**User-Agent header.** Every request identifies the project honestly:
```
sri-lanka-pc-price-comparator/0.1 (portfolio project; educational, non-commercial price comparison)
```
This is the right thing to do when scraping publicly accessible pages. Sites can see what is hitting them and block it if they choose to.

**Request timeout.** An `AbortController` is created per request with a 10-second timer. If the server does not respond in time, the request is cancelled. Without this, a single unresponsive server could block the entire search indefinitely.

**Per-host throttling.** A `Map` tracks the timestamp of the last request to each hostname. If a scraper makes two requests to the same host in quick succession, it waits for the minimum interval to pass first. Most sites get a 1.5-second minimum delay. Two sites publish longer crawl delays in their `robots.txt` - techzone.lk requests 3 seconds, nanotek.lk requests 20 seconds - and those values are respected via a per-host override table.

`postForm()` was added alongside `fetchHtml()` for barclays.lk, whose search only accepts POST requests with form-encoded data. It shares the same throttle, timeout, and User-Agent logic as the GET path.

### Step 3 — robots.txt compliance

`lib/robots.ts` is called at the start of every scraper before any page is fetched. It downloads the site's `/robots.txt` once per process lifetime (subsequent calls hit an in-memory cache), parses the `User-agent: *` group, and applies longest-matching-path rules to determine whether the target URL is allowed.

The implementation covers the subset of the robots.txt spec that real-world files actually use: `User-agent`, `Disallow`, and `Allow` directives. The default when no matching rule exists is to allow the request. If a URL is disallowed, the scraper throws an error, and the API route's per-scraper error wrapper catches this and records it as a site failure rather than failing the whole search.

### Step 4 — Shared parsing utilities

`lib/scrapers/util.ts` contains the parsing helpers used across all scrapers.

**`parsePrice(text)`** was the most important one to get right. Sri Lankan stores write prices in at least five different formats: `"Rs.28,000.00"`, `"Rs. 235,000.00"`, `"LKR 16,000.00"`, `"Rs:27,000.00"`, and `"23,100.00 per unit"`. The naive approach - strip all non-digit, non-comma, non-period characters - breaks on `"Rs.28,000.00"` because the period in `"Rs."` survives the strip, leaving `".28,000.00"`, which JavaScript's `parseFloat` interprets as `0.28` instead of `28000`. The fix is to search for the number rather than the currency symbol: the regex `/\d[\d,]*(\.\d+)?/` matches a sequence that starts with a digit, which the leading `"Rs."` can never satisfy.

**`extractWarranty(title)`** uses a regex to find patterns like `"3 YEARS WARRANTY"` or `"(2y)"` in the product title and normalises them to `"3 Years"` or `"2 Years"`.

**`resolveUrl(href, base)`** turns relative paths like `/product/some-item` into absolute URLs.

**`looksUsed(...texts)`** checks for the word "used" as a whole word in any number of strings, against both the product title and the container element's CSS classes.

### Step 5 — The scraper modules

Each scraper is a TypeScript module that exports a `SITE` constant and an async `search(query)` function returning `Product[]`. WooCommerce-based stores (pcbuilders.lk, techzone.lk, mdcomputers.lk) share a `searchWooCommerceStore()` loop in `lib/scrapers/woocommerce.ts`, since all three return the same `ul.products li.product` markup shape. The remaining four - gamestreet.lk's custom PHP storefront, nanotek.lk's CS-Cart style layout, chamacomputers.lk's server-rendered Next.js pages, and barclays.lk's classic ASP form-POST search - each have their own module, since none of them share enough structure to generalise.

### Step 6 — The scraper registry

`lib/scrapers/index.ts` holds a single exported array mapping each `SITE` to its `search` function. The API route imports this array and iterates over it. Adding a new store means writing a scraper module and adding one line to this array - nothing else in the codebase needs to change.

### Step 7 — The API route

`app/api/search/route.ts` calls every scraper in the registry in parallel with `Promise.all()`, racing each one against an 8-second timeout so a single slow store can never hold up the rest. Successful results are merged and sorted by price; if every scraper fails for a query, the route falls back to whatever was cached for that exact query the last time it succeeded.

### Step 8 — Modelling component compatibility

The PC Builder needed a way to express "a DDR5 motherboard only takes DDR5 RAM" without inventing a structured hardware database. `lib/pcbuild/catalog.ts` solves this with two small lookup tables and two lookup functions:

```typescript
function getMotherboardOptions(cpu: CpuOption | null): MotherboardOption[] {
  if (!cpu) return [];
  return MOTHERBOARD_OPTIONS[cpu.brand];
}

function getRamOptions(motherboard: MotherboardOption | null): ComponentOption[] {
  if (!motherboard) return [];
  return RAM_OPTIONS[motherboard.ramGeneration];
}
```

Each `CpuOption` carries a `brand` field, and each `MotherboardOption` carries a `ramGeneration` field. The builder component calls these two functions on every render, and gets back exactly the list of options that should be selectable next. When nothing upstream has been chosen yet, both functions return an empty array, which the block component reads as "stay locked."

### Step 9 — Cascading state without it turning into a mess

The tricky part of the builder's state isn't the compatibility logic itself - it's keeping selections consistent as the user changes their mind. Each selection handler resets exactly what depends on it:

```typescript
function handleSelectCpu(id: string) {
  const option = findOption(CPU_OPTIONS, id);
  setSelections((prev) => ({ ...prev, cpu: option, motherboard: null, ram: null }));
  clearDownstreamResults(["cpu", "motherboard", "ram"]);
}
```

`clearDownstreamResults` also wipes any search results and chosen listings already recorded for those categories. The graphics card, storage, PSU, and case handlers are simpler - they only ever need to clear their own category, since nothing depends on them.

### Step 10 — Searching every category without overwhelming seven stores

`runBuildSearch()` walks the list of chosen categories with a plain `for` loop and `await`, rather than `Promise.all()` - the opposite of the parallelism used inside `/api/search` itself, and deliberately so. That route already fans out to all seven stores at once for a single search term; doing that simultaneously once per category would mean every store receiving several concurrent requests instead of one, colliding head-on with the per-host rate limiter from Step 2. Running one category to completion before starting the next keeps each individual search at the same speed a Quick Search already runs at. Categories whose selection has an empty search term - the Secondary Storage block's "None" option - are skipped without making a request at all.

### Step 11 — A canvas built from pointer events, not a layout library

Dragging a block needed three pieces of state: its position and rendered size (kept in `PcBuilder.tsx`, keyed by category) and a record of the pointer drag in progress (kept entirely inside `DraggableNode.tsx`, since nothing outside that one block cares about it mid-drag). The drag itself is plain pointer events:

```typescript
function handlePointerDown(e: React.PointerEvent) {
  dragRef.current = { startX: e.clientX, startY: e.clientY, originX: x, originY: y, moved: false };
  e.currentTarget.setPointerCapture(e.pointerId);
}
```

`setPointerCapture` keeps the drag working even if the pointer moves faster than the block and briefly ends up outside it. A `ref` rather than `useState` holds the drag state because it changes on every pointermove and doesn't need to trigger a render by itself - only the resulting `onMove()` call does. A small movement threshold (8 pixels) distinguishes an ordinary click - which almost always involves a pixel or two of incidental movement - from a deliberate drag; below that threshold, nothing moves at all and the press is treated as a click that activates the block instead.

A block's actual rendered size comes from a `ResizeObserver` set up once per block, so the wires described below can be drawn to a block's true centre rather than a guess.

### Step 12 — Wires that run to a fixed point, and a way to unplug them

`WireLayer.tsx` is one absolutely-positioned `<svg>` underneath all the blocks. Every wire is a right-angled path computed from two points - the fixed centre of the canvas and a block's centre:

```typescript
function elbowPath(from: NodePosition, to: NodePosition): string {
  const midX = (from.x + to.x) / 2;
  return `M ${from.x} ${from.y} L ${midX} ${from.y} L ${midX} ${to.y} L ${to.x} ${to.y}`;
}
```

Because this is recalculated from the current block positions on every render, a wire never needs to be told to redraw after a drag. Making a 2-pixel-wide line clickable needed a second, invisible path drawn on top with a much wider stroke and `pointer-events: auto` (the `<svg>` itself is `pointer-events: none`, so clicks pass through to the canvas everywhere except this one path). A click toggles a `connected` flag for that category; unplugging clears any search results already recorded for it, so totals update immediately rather than waiting for the next full search.

### Step 13 — A fixed button instead of a draggable hub

The search trigger itself - `SearchHubButton.tsx` - sits at the exact centre of the canvas and is never wrapped in `DraggableNode`, so it can't be moved or mistaken for a part of the build. Every block's wire endpoint is computed against this same fixed point rather than against any one block's position, which is what makes unplugging or rearranging blocks have no effect on where the wires converge. While a search runs, the button shows a small spinner and a rotating conic-gradient ring chases around its rim - the gradient sits behind the button's own circular background, so only a thin band around the edge is ever visible.

### Step 14 — An animated border without measuring anything

The glowing border around the active block (`ActiveGlow.tsx`) needed to fit blocks of different sizes without ever knowing their pixel dimensions. Each edge is positioned with a CSS percentage along whichever side it sits on, which resolves against the size of the nearest positioned ancestor - so it scales to whatever size the block actually renders at. The glow itself is layered two ways: a thin gradient line for a crisp edge, plus a blurred copy behind it for the halo, corrected with an SVG `feColorMatrix` filter (defined once in the root layout) that boosts the alpha channel back up after the blur fades it - blurring a translucent gradient quietly washes its opacity toward zero otherwise.

### Step 15 — Four reference builds from one set of results

Once a search completes, `lib/pcbuild/strategy.ts` runs the same result lists through four different selection rules - cheapest regardless of stock, cheapest in stock, longest warranty in stock, and most expensive in stock - each implemented as a small filter-and-sort over the same `Product[]` arrays the build itself already has. Each strategy returns both a total and the specific listing it picked per category (`StrategyResult.picks`), so a card isn't only a number - clicking its "Apply this build" button merges those picks straight into `chosenListings`, the same state backing the user's own per-block choices. Applying a strategy doesn't touch categories it had nothing to pick for (no results, or a "None" choice), and the user can still override any individual block afterwards exactly as if they'd picked it from that block's own result list.

### Step 16 — A persistent navigation bar

The header and footer originally lived inside every page component, which meant navigating between pages unmounted and remounted them each time. Moving `<SiteHeader />` and `<SiteFooter />` into `app/layout.tsx`, outside of `{children}`, fixed this - the App Router only re-renders the page content on navigation, so anything in the shared layout simply stays mounted. The active link's highlight comes from comparing `usePathname()` against each link's `href` on every render, which is cheap enough to not need any extra state.

---

## How to Add a New Store

1. Save the store's search results page HTML and inspect it with browser DevTools to identify the CSS selectors for the product container, title, URL, price, and stock status.

2. Create `lib/scrapers/<sitename>.ts` and implement the `search()` function:

```typescript
import * as cheerio from "cheerio";
import { fetchHtml } from "../http";
import { isAllowedByRobots } from "../robots";
import type { Product } from "../types";
import { extractWarranty, looksUsed, parsePrice, resolveUrl } from "./util";

export const SITE = "example.lk";

export async function search(query: string): Promise<Product[]> {
  const url = `https://example.lk/search?q=${encodeURIComponent(query)}`;

  if (!(await isAllowedByRobots(url))) {
    throw new Error("Blocked by robots.txt");
  }

  const html = await fetchHtml(url);
  const $ = cheerio.load(html);
  const products: Product[] = [];

  $(".product-card").each((_, el) => {
    const card = $(el);
    const title = card.find(".product-title").text().trim();
    const href = card.find("a").attr("href");
    if (!title || !href) return;

    if (looksUsed(title)) return;

    const price = parsePrice(card.find(".price").text());
    if (price === null || price <= 0) return;

    products.push({
      site: SITE,
      title,
      price,
      currency: "LKR",
      condition: "new",
      url: resolveUrl(href, "https://example.lk"),
      inStock: true,
      warranty: extractWarranty(title),
    });
  });

  return products;
}
```

3. Register it in `lib/scrapers/index.ts`:

```typescript
import * as example from "./example";

export const scrapers: SiteScraper[] = [
  // existing entries...
  { site: example.SITE, search: example.search },
];
```

The parallel execution, timeout handling, cache, and UI all pick it up automatically.

---

## Ethical Considerations

This project fetches publicly accessible search result pages - the same pages a regular visitor would see in a browser. No authentication is bypassed, no private APIs are called, and no personal data is collected.

The following practices are built in as first-class requirements, not afterthoughts:

- robots.txt is parsed and respected before every scrape
- A descriptive, honest User-Agent header is sent with every request
- Per-host request delays are applied based on each site's published Crawl-delay directive
- Hard timeouts prevent any single site from being hammered with retries
- The project is non-commercial and identifies itself as such in the User-Agent string

---

## Known Limitations

**JavaScript-rendered content.** The scraper uses `fetch` plus HTML parsing. Stores that load their product listings via client-side JavaScript after the initial page load are not supported. All seven stores currently covered render their search results as part of the server response.

**Search relevance.** The results shown are whatever each store's own search algorithm returns. Broad queries produce broad results - searching for "ram" will match any product title containing those letters, including monitors with "Frameless" in the name (which contains the substring "ram"). There is no re-ranking or filtering by relevance on this side.

**Warranty extraction.** Warranty is detected from the product title text using pattern matching. It handles the common Sri Lankan retail formats well (`"3 YEARS WARRANTY"`, `"(2y)"`, `"10 Years Warranty"`) but will miss warranties that are only mentioned in the product description body, which would require loading each individual product page.

**Stock status accuracy.** gamestreet.lk does not display stock status on its search results page. Items from that store default to showing as in stock.

**Vercel free tier cache.** The serverless functions on Vercel's Hobby plan run on a read-only filesystem. Cache writes fail silently and the fallback to cached results when all scrapers fail does not apply. The live scraping works normally.

**Repeat searches and crawl delays.** nanotek.lk specifies a 20-second crawl delay in its robots.txt. A second search sent within 20 seconds of the first will cause nanotek's scraper to time out because the rate limiter holds the request past the 8-second function timeout. The other six stores will still return results normally.

**Compatibility coverage in the PC Builder.** Only the processor-to-motherboard and motherboard-to-RAM relationships are modelled. Other real-world considerations - case form factor versus motherboard size, PSU wattage versus total system draw, CPU cooler clearance - are not enforced, because they're headroom decisions rather than hard compatibility failures, and modelling them properly would require a structured parts database well beyond what scraped listings provide.

**Generic CPU and motherboard searches return a wide spread.** Picking "AMD Ryzen 7" as a generic tier searches for the literal term "ryzen 7", which matches every Ryzen 7 generation and model a store carries, at very different price points. This is intentional - the build flow expects the user to open the result panel and pick the specific model they actually want - but it means the auto-selected cheapest match is not necessarily the most sensible default for a serious build.

**Build search time scales with how many categories are filled in.** Because categories are searched one after another rather than in parallel, a full eight-category build takes roughly eight times as long as a single Quick Search - typically well under a minute, but noticeably longer than looking up one part. Choosing "None" for the Secondary Storage block skips that category's search entirely, so it doesn't add to this.

**The catalog is curated, not exhaustive.** The processor, motherboard, and graphics card lists deliberately span old and current generations rather than only the newest parts, since that better reflects what's actually bought and sold in Sri Lanka - but they're still a hand-picked selection rather than every chipset or GPU model that has ever existed. A part that exists in the real market but isn't in `lib/pcbuild/catalog.ts` simply isn't selectable yet; adding it is a matter of adding one more entry to the relevant list.

**The build canvas doesn't persist or resize itself.** Block positions live only in React state for the current page session - reloading the page resets every block back to its default position, and there's no save/restore of a custom layout.

**Unplugging is a build-time filter, not a real compatibility check.** Disconnecting a block only controls whether that category gets searched - it doesn't mean anything about whether the parts that remain plugged in are sufficient for a working PC (a build with no storage plugged in will happily return a price for whatever's left). The processor-to-motherboard and motherboard-to-memory rules described above are the only real compatibility logic; unplugging is purely a "don't search this" toggle.

**The "Best Warranty" reference build optimises for warranty length alone.** It picks the longest warranty among in-stock listings for each part without regard to price, which can occasionally produce a noticeably more expensive total than necessary if a long warranty happens to be bundled with a premium model. It's a reference figure for whoever values warranty coverage over price, not a recommendation by itself.
