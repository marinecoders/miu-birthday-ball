// Shared button styles so every page's buttons look the same.
const base =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold uppercase tracking-[0.15em] transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gold/40 active:scale-[0.98]";

export const BUTTON_PRIMARY = `${base} bg-scarlet text-white shadow-lg shadow-scarlet/30 hover:bg-scarlet-light`;
export const BUTTON_SECONDARY = `${base} border border-gold/40 text-gold hover:bg-gold/10 hover:border-gold`;
