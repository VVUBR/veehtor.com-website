// Runs before `vite dev` and `vite build` (predev/prebuild); writes public/sitemap.xml.
import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

const BASE_URL = "https://www.veehtor.com";

// Public, indexable routes declared in src/App.tsx (internal app areas excluded).
const staticPaths = [
  "/",
  "/case-studies",
  "/cervejarias",
  "/raio-x",
  "/complo",
  "/Score.de.credito.DCarvalho",
  "/PodunkAnnies",
  "/privacy",
  "/terms",
];

// Case study addresses come from the single source of truth.
const data = readFileSync(resolve("src/data/caseStudies.ts"), "utf8");
const caseSlugs = Array.from(data.matchAll(/^\s{4}slug:\s*"([^"]+)"/gm)).map((m) => m[1]);

const paths = Array.from(
  new Set([...staticPaths, ...caseSlugs.map((s) => `/case-studies/${s}`)]),
);

const xml = [
  `<?xml version="1.0" encoding="UTF-8"?>`,
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
  ...paths.map((p) => `  <url>\n    <loc>${BASE_URL}${p}</loc>\n  </url>`),
  `</urlset>`,
].join("\n");

writeFileSync(resolve("public/sitemap.xml"), xml + "\n");
console.log(`sitemap.xml written (${paths.length} entries)`);
