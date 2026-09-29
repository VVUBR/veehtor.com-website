/**
 * Build-time validation: the two credit prototype entry pages must be
 * static, small, free of embedded data/secrets/trackers, and must point
 * to the correct Google Apps Script destination.
 *
 * Run: bun scripts/validate-credit-pages.ts
 * Exits non-zero on any violation.
 */
import { readFileSync, statSync } from "fs";
import { resolve } from "path";

const EXEC_BASE =
  "https://script.google.com/macros/s/AKfycbw79aiLCiqlcs0LsqRsg-a0fxSX5AhX3jvTCQpb790NpIWBPZ1eRjO-viMWDZW3kQ7F/exec";

interface PageSpec {
  file: string;
  expectedHref: string;
  maxBytes: number;
}

const pages: PageSpec[] = [
  { file: "public/score-dcarvalho.html", expectedHref: `${EXEC_BASE}?painel=dcarvalho`, maxBytes: 8192 },
  { file: "public/score-unimaq.html", expectedHref: `${EXEC_BASE}?painel=unimaq`, maxBytes: 8192 },
];

// Patterns that must never appear in these files (embedded data, secrets,
// local login logic, trackers, external scripts).
const forbidden: Array<{ re: RegExp; label: string }> = [
  { re: /ALL_DATA|\bDATA\s*=\s*[\[{]/i, label: "embedded data base" },
  { re: /KPIS/i, label: "financial KPIs" },
  { re: /SENHA|PW_HASH|password|sha-?256|bcrypt/i, label: "password/hash/login secret" },
  { re: /GTM-|googletagmanager|google-analytics|gtag\(|fbq\(|hotjar|clarity/i, label: "tracker" },
  { re: /<script/i, label: "script tag (no scripts allowed)" },
  { re: /<iframe/i, label: "iframe" },
  { re: /location\.(replace|href|assign)|meta[^>]+http-equiv=["']?refresh/i, label: "automatic redirect" },
  { re: /supabase/i, label: "supabase reference" },
  { re: /eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/, label: "JWT-like token" },
];

let failures = 0;

for (const { file, expectedHref, maxBytes } of pages) {
  const path = resolve(file);
  const html = readFileSync(path, "utf8");
  const size = statSync(path).size;
  const fail = (msg: string) => {
    console.error(`FAIL ${file}: ${msg}`);
    failures++;
  };

  if (size > maxBytes) fail(`file too large (${size} bytes > ${maxBytes})`);
  if (!html.includes(`href="${expectedHref}"`)) fail(`missing expected link to ${expectedHref}`);
  if (!/target="_self"/.test(html)) fail('link must use target="_self"');
  if (!/rel="noreferrer"/.test(html)) fail('link must use rel="noreferrer"');
  if (!/name="robots"\s+content="noindex,nofollow"/.test(html)) fail("missing noindex,nofollow robots meta");
  if (!/name="referrer"\s+content="no-referrer"/.test(html)) fail("missing referrer no-referrer meta");
  if (!/Content-Security-Policy/.test(html)) fail("missing CSP meta");
  if (!/default-src 'none'/.test(html)) fail("CSP must include default-src 'none'");

  for (const { re, label } of forbidden) {
    if (re.test(html)) fail(`contains forbidden content: ${label}`);
  }
}

if (failures > 0) {
  console.error(`\n${failures} validation failure(s).`);
  process.exit(1);
}
console.log("OK: credit entry pages are clean and point to the correct destinations.");
