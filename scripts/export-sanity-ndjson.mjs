/**
 * Export the seed content in src/data/ to dist-sanity/seed.ndjson, one
 * document per line, for a one-time `sanity dataset import`.
 *
 *   npm run sanity:seed                          # everything
 *   npm run sanity:seed -- --only=siteSettings,page   # just these types
 *   cd studio-drmattvalentine
 *   SANITY_AUTH_TOKEN=… npx sanity dataset import ../dist-sanity/seed.ndjson --dataset production
 *
 * IDs: singletons, the fixed set of pages (one per route) and anything
 * another document references get a fixed _id (siteSettings, stats, page-*,
 * region-*), so re-importing with --replace
 * overwrites them, or --missing skips them. Collection documents (clinics
 * and the list items) have no _id; importing them again DUPLICATES them.
 * To re-seed a collection, delete that type's documents first.
 *
 * Every curated list carries order: 1, 2, 3… The import gives every
 * document the same _createdAt, so creation order is meaningless, and
 * alphabetical would reshuffle lists whose order is the information.
 *
 * Runs the TypeScript data files directly via Node's type stripping.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { CHROME, SITE, STATS } from "../src/data/site.ts";
import { valentineStates, cashionStates } from "../src/data/locations.ts";
import { pages } from "../src/data/pages.ts";
import {
  advantages,
  appointmentSteps,
  career,
  commitments,
  credentials,
} from "../src/data/lists.ts";

const slug = (s) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const ordered = (list, fn) => list.map((item, i) => ({ ...fn(item, i), order: i + 1 }));
/** Array items that are objects need a _key; slugs keep it stable across exports. */
const keyed = (links) => links.map((l) => ({ _key: slug(l.label), _type: "link", ...l }));

const only = process.argv.find((a) => a.startsWith("--only="))?.slice(7).split(",");

// The Studio schema derives the tel: link from the digits; refuse to drop a
// phoneHref that would not round-trip.
if (SITE.phoneHref !== `tel:${SITE.phoneDigits.replace(/\s/g, "")}`) {
  throw new Error("SITE.phoneHref does not match SITE.phoneDigits");
}

const docs = [
  {
    _id: "siteSettings",
    _type: "siteSettings",
    name: SITE.name,
    credentials,
    ahpra: SITE.ahpra,
    phoneLabel: SITE.phoneLabel,
    phoneDigits: SITE.phoneDigits,
    email: SITE.email,
    facebook: SITE.facebook,
    vasectomyAustralia: SITE.vasectomyAustralia,
    header: { ...CHROME.header, links: keyed(CHROME.header.links) },
    footer: { ...CHROME.footer, links: keyed(CHROME.footer.links) },
    referBand: CHROME.referBand,
  },
  { _id: "stats", _type: "stats", ...STATS },

  // Thank-you pages are in the fixed set but never on the sitemap, so they
  // take no blurb and no order.
  ...pages.map((p) => ({
    _id: `page-${slug(p.path) || "home"}`,
    _type: "page",
    ...p,
  })),
];
let sitemapOrder = 0;
for (const d of docs) if (d._type === "page" && d.blurb) d.order = ++sitemapOrder;

for (const [doctor, groups] of [
  ["valentine", valentineStates],
  ["cashion", cashionStates],
]) {
  groups.forEach((g, gi) => {
    const regionId = `region-${doctor}-${slug(g.name)}`;
    docs.push({ _id: regionId, _type: "clinicRegion", doctor, name: g.name, code: g.code, order: gi + 1 });
    docs.push(
      ...ordered(g.clinics, (c) => ({
        _type: "clinic",
        area: c.area,
        clinic: c.clinic,
        region: { _type: "reference", _ref: regionId },
        base: Boolean(c.base),
      })),
    );
  });
}

docs.push(
  ...ordered(career, (c) => ({ _type: "careerMilestone", ...c })),
  ...ordered(commitments, (c) => ({ _type: "commitment", ...c })),
  ...ordered(appointmentSteps, (s) => ({ _type: "appointmentStep", ...s })),
  ...ordered(advantages, (a) => ({ _type: "advantage", ...a })),
);

if (only) {
  const unknown = only.filter((t) => !docs.some((d) => d._type === t));
  if (unknown.length) throw new Error(`--only: no documents of type ${unknown.join(", ")}`);
  docs.splice(0, docs.length, ...docs.filter((d) => only.includes(d._type)));
}

const ids = docs.filter((d) => d._id).map((d) => d._id);
if (new Set(ids).size !== ids.length) throw new Error("Duplicate _id in seed");

const out = new URL("../dist-sanity/seed.ndjson", import.meta.url);
mkdirSync(new URL(".", out), { recursive: true });
writeFileSync(out, docs.map((d) => JSON.stringify(d)).join("\n") + "\n");

const byType = Object.entries(
  docs.reduce((n, d) => ({ ...n, [d._type]: (n[d._type] ?? 0) + 1 }), {}),
).map(([t, n]) => `${t} ${n}`);
console.log(`Wrote ${docs.length} documents to dist-sanity/seed.ndjson (${byType.join(", ")})`);
console.log(`${ids.length} with a fixed _id, ${docs.length - ids.length} without (re-importing those duplicates them)`);
