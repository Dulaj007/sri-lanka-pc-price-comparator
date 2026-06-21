// Small display helpers shared by every part of the UI that shows a
// price or lets a user export data, so the formatting stays identical
// whether it's the quick search table or the PC builder summary.

// Turns a raw LKR number into a readable string like "LKR 28,000.00".
// "LKR " is prepended by hand rather than using Intl's currency
// formatter, so the symbol placement doesn't shift between locales.
export function formatPrice(price: number): string {
  return (
    "LKR " +
    price.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
}

// Triggers a browser download of any JSON-serialisable object. Works
// entirely client-side - no server round-trip needed.
export function downloadJson(data: unknown, filename: string): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// Turns free text into a filesystem-safe filename fragment, e.g.
// "RTX 5070" -> "rtx-5070".
export function slugify(text: string): string {
  return text.replace(/[^a-z0-9]/gi, "-").toLowerCase();
}
