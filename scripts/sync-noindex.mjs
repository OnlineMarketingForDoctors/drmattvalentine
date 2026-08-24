/**
 * Keeps vercel.json's X-Robots-Tag header in sync with NOINDEX in
 * src/site.config.ts, so a single constant drives both the header and the
 * <meta name="robots"> tag. See CLAUDE.md.
 *
 *   node scripts/sync-noindex.mjs           rewrite vercel.json to match
 *   node scripts/sync-noindex.mjs --check   fail if the header is wrong
 *
 * vercel.json is a committed, generated file. The build runs --check rather
 * than rewriting, because Vercel reads vercel.json to configure the build
 * before our prebuild step runs — rewriting it there would be too late to
 * affect the headers actually served.
 *
 * --check compares the *meaning* of the file, not its formatting, so
 * whitespace or key order cannot fail a build on their own.
 */
import { readFileSync, writeFileSync } from "node:fs";

const check = process.argv.includes("--check");

const ROUTE = "/(.*)";
const HEADER = "x-robots-tag";
const VALUE = "noindex, nofollow";

const configPath = new URL("../src/site.config.ts", import.meta.url);
const config = readFileSync(configPath, "utf8");
const match = config.match(/export const NOINDEX\s*=\s*(true|false)/);
if (!match) {
  console.error("sync-noindex: could not find NOINDEX in src/site.config.ts");
  process.exit(1);
}
const noindex = match[1] === "true";

const vercelPath = new URL("../vercel.json", import.meta.url);
const vercel = JSON.parse(readFileSync(vercelPath, "utf8"));

/** Is a correct site-wide noindex header currently declared? */
const declared = (vercel.headers ?? []).some(
  (rule) =>
    rule.source === ROUTE &&
    (rule.headers ?? []).some(
      (h) => h.key?.toLowerCase() === HEADER && h.value?.trim() === VALUE
    )
);

if (check) {
  if (declared === noindex) {
    console.log(`sync-noindex: in sync (NOINDEX=${noindex})`);
    process.exit(0);
  }
  console.error(
    `sync-noindex: NOINDEX=${noindex} but vercel.json ` +
      `${declared ? "declares" : "does not declare"} a site-wide ` +
      `X-Robots-Tag header.\nRun "npm run sync:noindex" and commit the result.`
  );
  process.exit(1);
}

// write mode
vercel.headers = (vercel.headers ?? []).filter(
  (rule) => !(rule.headers ?? []).some((h) => h.key?.toLowerCase() === HEADER)
);
if (noindex) {
  vercel.headers.unshift({
    source: ROUTE,
    headers: [{ key: "X-Robots-Tag", value: VALUE }],
  });
}
if (vercel.headers.length === 0) delete vercel.headers;

writeFileSync(vercelPath, JSON.stringify(vercel, null, 2) + "\n");
console.log(
  `sync-noindex: updated vercel.json — X-Robots-Tag ${noindex ? "present" : "removed"}`
);
