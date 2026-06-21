// Static knowledge behind the PC Builder feature: which generic specs a
// user can choose for each component, and which of those specs are
// compatible with each other. None of this comes from scraping - it's
// ordinary hardware knowledge, written down once. Scraping only happens
// after a generic spec is picked, to find real listings that match it.
//
// The chain that actually matters for compatibility is short: a CPU's
// brand decides which motherboards will accept it, and a motherboard's
// chipset decides which RAM generation its slots support. Everything
// else (graphics card, storage, power supply, case) doesn't have a hard
// compatibility rule worth modelling here - virtually any modern GPU
// fits any modern motherboard's PCIe slot, any NVMe drive fits any M.2
// slot, and PSU wattage / case size are headroom choices rather than
// pass/fail constraints. Those are offered as flat lists instead.
//
// The Sri Lankan market deals in a lot more than the newest generation
// of everything - plenty of builds here are upgrades of older systems
// or deliberately budget-conscious - so every list spans from genuinely
// old, entry-level parts through to the current generation rather than
// only offering the latest options.

import type {
  ComponentCategory,
  ComponentOption,
  CpuOption,
  MotherboardOption,
} from "./types";

// The eight blocks shown in the builder, in the order a build is
// logically assembled.
export const CATEGORIES: ComponentCategory[] = [
  { key: "cpu", label: "Processor" },
  { key: "motherboard", label: "Motherboard" },
  { key: "ram", label: "Memory (RAM)" },
  { key: "gpu", label: "Graphics Card" },
  { key: "storage", label: "Primary Storage" },
  { key: "storageSecondary", label: "Secondary Storage" },
  { key: "psu", label: "Power Supply" },
  { key: "case", label: "Case" },
];

export const CPU_OPTIONS: CpuOption[] = [
  { id: "amd-athlon", label: "AMD Athlon", searchTerm: "amd athlon", brand: "amd", group: "Entry-level" },
  { id: "intel-celeron", label: "Intel Celeron", searchTerm: "intel celeron", brand: "intel", group: "Entry-level" },
  { id: "intel-pentium", label: "Intel Pentium Gold", searchTerm: "intel pentium", brand: "intel", group: "Entry-level" },

  { id: "amd-ryzen-3", label: "AMD Ryzen 3", searchTerm: "ryzen 3", brand: "amd", group: "AMD Ryzen" },
  { id: "amd-ryzen-5", label: "AMD Ryzen 5", searchTerm: "ryzen 5", brand: "amd", group: "AMD Ryzen" },
  { id: "amd-ryzen-7", label: "AMD Ryzen 7", searchTerm: "ryzen 7", brand: "amd", group: "AMD Ryzen" },
  { id: "amd-ryzen-9", label: "AMD Ryzen 9", searchTerm: "ryzen 9", brand: "amd", group: "AMD Ryzen" },

  { id: "intel-core-i3", label: "Intel Core i3", searchTerm: "intel core i3", brand: "intel", group: "Intel Core" },
  { id: "intel-core-i5", label: "Intel Core i5", searchTerm: "intel core i5", brand: "intel", group: "Intel Core" },
  { id: "intel-core-i7", label: "Intel Core i7", searchTerm: "intel core i7", brand: "intel", group: "Intel Core" },
  { id: "intel-core-i9", label: "Intel Core i9", searchTerm: "intel core i9", brand: "intel", group: "Intel Core" },
];

// Keyed by CPU brand - a motherboard's socket only accepts chips from
// one manufacturer, so picking a CPU brand is what unlocks this list.
// Spans three sockets per brand: an older DDR4 generation, a
// budget-to-high-end DDR4 lineup, and the current DDR5 generation.
const MOTHERBOARD_OPTIONS: Record<"amd" | "intel", MotherboardOption[]> = {
  amd: [
    { id: "amd-a320", label: "A320 (entry-level, AM4)", searchTerm: "a320 motherboard", ramGeneration: "ddr4", group: "AM4, DDR4 (older)" },
    { id: "amd-b350", label: "B350 (older mid-range, AM4)", searchTerm: "b350 motherboard", ramGeneration: "ddr4", group: "AM4, DDR4 (older)" },
    { id: "amd-b450", label: "B450 (budget, AM4)", searchTerm: "b450 motherboard", ramGeneration: "ddr4", group: "AM4, DDR4 (older)" },
    { id: "amd-x470", label: "X470 (older high-end, AM4)", searchTerm: "x470 motherboard", ramGeneration: "ddr4", group: "AM4, DDR4 (older)" },
    { id: "amd-a520", label: "A520 (budget, AM4)", searchTerm: "a520 motherboard", ramGeneration: "ddr4", group: "AM4, DDR4 (newer)" },
    { id: "amd-b550", label: "B550 (mid-range, AM4)", searchTerm: "b550 motherboard", ramGeneration: "ddr4", group: "AM4, DDR4 (newer)" },
    { id: "amd-x570", label: "X570 (high-end, AM4)", searchTerm: "x570 motherboard", ramGeneration: "ddr4", group: "AM4, DDR4 (newer)" },
    { id: "amd-a620", label: "A620 (budget, AM5)", searchTerm: "a620 motherboard", ramGeneration: "ddr5", group: "AM5, DDR5 (current)" },
    { id: "amd-b650", label: "B650 (mid-range, AM5)", searchTerm: "b650 motherboard", ramGeneration: "ddr5", group: "AM5, DDR5 (current)" },
    { id: "amd-x670", label: "X670 (high-end, AM5)", searchTerm: "x670 motherboard", ramGeneration: "ddr5", group: "AM5, DDR5 (current)" },
  ],
  intel: [
    { id: "intel-h110", label: "H110 (very old, LGA1151)", searchTerm: "h110 motherboard", ramGeneration: "ddr4", group: "LGA1151/1200, DDR4 (older)" },
    { id: "intel-h310", label: "H310 (old, LGA1151)", searchTerm: "h310 motherboard", ramGeneration: "ddr4", group: "LGA1151/1200, DDR4 (older)" },
    { id: "intel-b460", label: "B460 (older mid-range, LGA1200)", searchTerm: "b460 motherboard", ramGeneration: "ddr4", group: "LGA1151/1200, DDR4 (older)" },
    { id: "intel-h510", label: "H510 (budget, LGA1200)", searchTerm: "h510 motherboard", ramGeneration: "ddr4", group: "LGA1200, DDR4 (newer)" },
    { id: "intel-b560", label: "B560 (mid-range, LGA1200)", searchTerm: "b560 motherboard", ramGeneration: "ddr4", group: "LGA1200, DDR4 (newer)" },
    { id: "intel-z590", label: "Z590 (high-end, LGA1200)", searchTerm: "z590 motherboard", ramGeneration: "ddr4", group: "LGA1200, DDR4 (newer)" },
    { id: "intel-h610", label: "H610 (budget, LGA1700)", searchTerm: "h610 motherboard", ramGeneration: "ddr4", group: "LGA1700, DDR4" },
    { id: "intel-b760", label: "B760 (mid-range, LGA1700)", searchTerm: "b760 motherboard", ramGeneration: "ddr5", group: "LGA1700, DDR5 (current)" },
    { id: "intel-z790", label: "Z790 (high-end, LGA1700)", searchTerm: "z790 motherboard", ramGeneration: "ddr5", group: "LGA1700, DDR5 (current)" },
  ],
};

// Keyed by RAM generation - the one spec a motherboard's RAM slots
// actually enforce.
const RAM_OPTIONS: Record<"ddr4" | "ddr5", ComponentOption[]> = {
  ddr4: [
    { id: "ddr4-4gb", label: "4GB DDR4", searchTerm: "4gb ddr4 ram" },
    { id: "ddr4-8gb", label: "8GB DDR4", searchTerm: "8gb ddr4 ram" },
    { id: "ddr4-16gb", label: "16GB DDR4", searchTerm: "16gb ddr4 ram" },
    { id: "ddr4-32gb", label: "32GB DDR4", searchTerm: "32gb ddr4 ram" },
    { id: "ddr4-64gb", label: "64GB DDR4", searchTerm: "64gb ddr4 ram" },
  ],
  ddr5: [
    { id: "ddr5-16gb", label: "16GB DDR5", searchTerm: "16gb ddr5 ram" },
    { id: "ddr5-32gb", label: "32GB DDR5", searchTerm: "32gb ddr5 ram" },
    { id: "ddr5-64gb", label: "64GB DDR5", searchTerm: "64gb ddr5 ram" },
    { id: "ddr5-96gb", label: "96GB DDR5", searchTerm: "96gb ddr5 ram" },
  ],
};

// Spans five generations per brand - from genuinely old budget cards
// still common in second-hand and entry-level builds, through to the
// current generation. Grouped so the dropdown doesn't turn into one
// undifferentiated wall of model numbers.
export const GPU_OPTIONS: ComponentOption[] = [
  { id: "gt-1030", label: "GeForce GT 1030", searchTerm: "gt 1030", group: "Budget / older generation" },
  { id: "gtx-1650", label: "GeForce GTX 1650", searchTerm: "gtx 1650", group: "Budget / older generation" },
  { id: "gtx-1660-super", label: "GeForce GTX 1660 Super", searchTerm: "gtx 1660 super", group: "Budget / older generation" },
  { id: "rx-580", label: "Radeon RX 580", searchTerm: "rx 580", group: "Budget / older generation" },

  { id: "rtx-2060", label: "GeForce RTX 2060", searchTerm: "rtx 2060", group: "RTX 20 / 30 series" },
  { id: "rtx-3050", label: "GeForce RTX 3050", searchTerm: "rtx 3050", group: "RTX 20 / 30 series" },
  { id: "rtx-3060", label: "GeForce RTX 3060", searchTerm: "rtx 3060", group: "RTX 20 / 30 series" },
  { id: "rtx-3060-ti", label: "GeForce RTX 3060 Ti", searchTerm: "rtx 3060 ti", group: "RTX 20 / 30 series" },
  { id: "rtx-3070", label: "GeForce RTX 3070", searchTerm: "rtx 3070", group: "RTX 20 / 30 series" },
  { id: "rtx-3070-ti", label: "GeForce RTX 3070 Ti", searchTerm: "rtx 3070 ti", group: "RTX 20 / 30 series" },
  { id: "rtx-3080", label: "GeForce RTX 3080", searchTerm: "rtx 3080", group: "RTX 20 / 30 series" },
  { id: "rtx-3090", label: "GeForce RTX 3090", searchTerm: "rtx 3090", group: "RTX 20 / 30 series" },

  { id: "rx-6600", label: "Radeon RX 6600", searchTerm: "rx 6600", group: "RX 6000 series" },
  { id: "rx-6700-xt", label: "Radeon RX 6700 XT", searchTerm: "rx 6700 xt", group: "RX 6000 series" },
  { id: "rx-6800-xt", label: "Radeon RX 6800 XT", searchTerm: "rx 6800 xt", group: "RX 6000 series" },

  { id: "rtx-4060", label: "GeForce RTX 4060", searchTerm: "rtx 4060", group: "RTX 40 series" },
  { id: "rtx-4060-ti", label: "GeForce RTX 4060 Ti", searchTerm: "rtx 4060 ti", group: "RTX 40 series" },
  { id: "rtx-4070", label: "GeForce RTX 4070", searchTerm: "rtx 4070", group: "RTX 40 series" },
  { id: "rtx-4070-ti-super", label: "GeForce RTX 4070 Ti Super", searchTerm: "rtx 4070 ti super", group: "RTX 40 series" },
  { id: "rtx-4080-super", label: "GeForce RTX 4080 Super", searchTerm: "rtx 4080 super", group: "RTX 40 series" },
  { id: "rtx-4090", label: "GeForce RTX 4090", searchTerm: "rtx 4090", group: "RTX 40 series" },

  { id: "rx-7600", label: "Radeon RX 7600", searchTerm: "rx 7600", group: "RX 7000 series" },
  { id: "rx-7700-xt", label: "Radeon RX 7700 XT", searchTerm: "rx 7700 xt", group: "RX 7000 series" },
  { id: "rx-7800-xt", label: "Radeon RX 7800 XT", searchTerm: "rx 7800 xt", group: "RX 7000 series" },
  { id: "rx-7900-xtx", label: "Radeon RX 7900 XTX", searchTerm: "rx 7900 xtx", group: "RX 7000 series" },

  { id: "rtx-5060", label: "GeForce RTX 5060", searchTerm: "rtx 5060", group: "Current generation" },
  { id: "rtx-5070", label: "GeForce RTX 5070", searchTerm: "rtx 5070", group: "Current generation" },
  { id: "rtx-5070-ti", label: "GeForce RTX 5070 Ti", searchTerm: "rtx 5070 ti", group: "Current generation" },
  { id: "rtx-5080", label: "GeForce RTX 5080", searchTerm: "rtx 5080", group: "Current generation" },
  { id: "rx-9060-xt", label: "Radeon RX 9060 XT", searchTerm: "rx 9060 xt", group: "Current generation" },
  { id: "rx-9070-xt", label: "Radeon RX 9070 XT", searchTerm: "rx 9070 xt", group: "Current generation" },
];

// Spans the three drive types still actually sold: hard disks for cheap
// bulk storage, SATA SSDs as the old standard, and NVMe SSDs as the
// current standard.
export const STORAGE_OPTIONS: ComponentOption[] = [
  { id: "hdd-500gb", label: "500GB", searchTerm: "500gb hdd", group: "Hard Disk Drive (budget, bulk storage)" },
  { id: "hdd-1tb", label: "1TB", searchTerm: "1tb hdd", group: "Hard Disk Drive (budget, bulk storage)" },
  { id: "hdd-2tb", label: "2TB", searchTerm: "2tb hdd", group: "Hard Disk Drive (budget, bulk storage)" },

  { id: "sata-128gb", label: "128GB", searchTerm: "128gb sata ssd", group: "SATA SSD" },
  { id: "sata-256gb", label: "256GB", searchTerm: "256gb sata ssd", group: "SATA SSD" },
  { id: "sata-500gb", label: "500GB", searchTerm: "500gb sata ssd", group: "SATA SSD" },
  { id: "sata-1tb", label: "1TB", searchTerm: "1tb sata ssd", group: "SATA SSD" },

  { id: "nvme-256gb", label: "256GB", searchTerm: "256gb nvme ssd", group: "NVMe SSD (fastest)" },
  { id: "nvme-500gb", label: "500GB", searchTerm: "500gb nvme ssd", group: "NVMe SSD (fastest)" },
  { id: "nvme-1tb", label: "1TB", searchTerm: "1tb nvme ssd", group: "NVMe SSD (fastest)" },
  { id: "nvme-2tb", label: "2TB", searchTerm: "2tb nvme ssd", group: "NVMe SSD (fastest)" },
];

// The secondary storage block is optional, since plenty of builds only
// need one drive. Its first option has an empty searchTerm - the build
// search recognises that as "nothing to look for" and skips straight
// past it instead of running a search.
export const SECONDARY_STORAGE_OPTIONS: ComponentOption[] = [
  { id: "storage2-none", label: "None — single drive only", searchTerm: "" },
  ...STORAGE_OPTIONS,
];

export const PSU_OPTIONS: ComponentOption[] = [
  { id: "psu-450w", label: "450W", searchTerm: "450w power supply" },
  { id: "psu-550w", label: "550W", searchTerm: "550w power supply" },
  { id: "psu-650w", label: "650W", searchTerm: "650w power supply" },
  { id: "psu-750w", label: "750W", searchTerm: "750w power supply" },
  { id: "psu-850w", label: "850W", searchTerm: "850w power supply" },
  { id: "psu-1000w", label: "1000W", searchTerm: "1000w power supply" },
];

export const CASE_OPTIONS: ComponentOption[] = [
  { id: "case-mini-itx", label: "Mini ITX", searchTerm: "mini itx case" },
  { id: "case-mid-tower", label: "Mid Tower", searchTerm: "mid tower case" },
  { id: "case-full-tower", label: "Full Tower", searchTerm: "full tower case" },
];

// The motherboard choices compatible with a given CPU. Empty until a CPU
// is chosen - the builder UI uses that to keep the motherboard block
// locked.
export function getMotherboardOptions(cpu: CpuOption | null): MotherboardOption[] {
  if (!cpu) return [];
  return MOTHERBOARD_OPTIONS[cpu.brand];
}

// The RAM choices compatible with a given motherboard. Empty until a
// motherboard is chosen.
export function getRamOptions(motherboard: MotherboardOption | null): ComponentOption[] {
  if (!motherboard) return [];
  return RAM_OPTIONS[motherboard.ramGeneration];
}
