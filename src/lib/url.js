// Builds a link that works wherever the site is hosted: at the root of a
// custom domain, or under /miu-birthday-ball/ on GitHub Pages.
// The prefix comes from `base` in astro.config.mjs.
export function url(path = "") {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  return `${base}/${path.replace(/^\//, "")}`;
}
