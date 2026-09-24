/**
 * Export the seed content in src/data/ to dist-sanity/seed.ndjson, one
 * document per line, for a one-time `sanity dataset import`.
 *
 *   npm run sanity:seed
 *   cd studio-drmattvalentine
 *   SANITY_AUTH_TOKEN=… npx sanity dataset import ../dist-sanity/seed.ndjson --dataset production
 *
 * IDs: singletons and anything another document references get a fixed _id
 * (siteSettings, stats, page-*, region-*), so re-importing with --replace
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
import { SITE, STATS } from "../src/data/site.ts";
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
  },
  { _id: "stats", _type: "stats", ...STATS },

  ...ordered(pages, (p) => ({
    _id: `page-${slug(p.path) || "home"}`,
    _type: "sitePage",
    path: p.path,
    title: p.title,
    blurb: p.blurb,
  })),
];

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
