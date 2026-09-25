/**
 * Export the seed content in src/data/ to dist-sanity/seed.ndjson, one
 * document per line, for a one-time `sanity dataset import`.
 *
 *   npm run sanity:seed                                # everything
 *   npm run sanity:seed -- --only=siteSettings,clinic  # just these types
 *   cd studio-drmattvalentine
 *   SANITY_AUTH_TOKEN=… npx sanity dataset import ../dist-sanity/seed.ndjson --dataset production
 *
 * IDs: Site Settings and the fixed set of pages (one per route) have fixed
 * IDs, so re-importing with --replace overwrites them, or --missing skips
 * them. Clinics have no _id; importing them again DUPLICATES them. To
 * re-seed clinics, delete them first.
 *
 * Images: `{ __image: path, alt }` becomes a Sanity image whose file the
 * import uploads (identical files are stored once).
 *
 * Runs the TypeScript data files directly via Node's type stripping.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { CHROME, SITE, STATS } from "../src/data/site.ts";
import { valentineStates, cashionStates } from "../src/data/locations.ts";
import { pages } from "../src/data/pages.ts";
import { ROUTES } from "../studio-drmattvalentine/schemaTypes/lib/routes.ts";
import { DOCTORS, REGIONS } from "../studio-drmattvalentine/schemaTypes/lib/regions.ts";

const root = new URL("../", import.meta.url);
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const key = (...parts) => createHash("sha1").update(parts.join("|")).digest("hex").slice(0, 12);

/** "text [label](href) more" → one Portable Text block. */
function block(text, seed) {
  const children = [];
  const markDefs = [];
  const re = /\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0;
  let m;
  const span = (t, marks = []) =>
    t && children.push({ _type: "span", _key: key(seed, "s", children.length), text: t, marks });
  while ((m = re.exec(text))) {
    span(text.slice(last, m.index));
    const def = key(seed, "l", markDefs.length);
    markDefs.push({ _type: "link", _key: def, href: m[2] });
    span(m[1], [def]);
    last = re.lastIndex;
  }
  span(text.slice(last));
  return { _type: "block", _key: key(seed, "b"), style: "normal", markDefs, children };
}

/** Turn the seed conventions into Sanity values, adding _key to array items. */
function convert(value, path) {
  if (Array.isArray(value))
    return value.map((v, i) => {
      const c = convert(v, `${path}.${i}`);
      return c && typeof c === "object" && !Array.isArray(c) ? { _key: key(path, i), ...c } : c;
    });
  if (value && typeof value === "object") {
    if (value.__rich) return value.__rich.map((p, i) => block(p, `${path}.${i}`));
    if (value.__image) {
      const img = {
        _type: value.decorative ? "decorativeImage" : "imageWithAlt",
        _sanityAsset: `image@${new URL(value.__image, root).href}`,
      };
      if (!value.decorative) img.alt = value.alt;
      return img;
    }
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, convert(v, `${path}.${k}`)]));
  }
  return value;
}

// The Studio derives the tel: link from the digits; refuse to drop a
// phoneHref that would not round-trip.
if (SITE.phoneHref !== `tel:${SITE.phoneDigits.replace(/\s/g, "")}`) {
  throw new Error("SITE.phoneHref does not match SITE.phoneDigits");
}

const docs = [
  convert(
    {
      _id: "siteSettings",
      _type: "siteSettings",
      name: SITE.name,
      ahpra: SITE.ahpra,
      phoneLabel: SITE.phoneLabel,
      phoneDigits: SITE.phoneDigits,
      email: SITE.email,
      facebook: SITE.facebook,
      vasectomyAustralia: SITE.vasectomyAustralia,
      header: { ...CHROME.header, links: CHROME.header.links.map((l) => ({ _type: "link", ...l })) },
      footer: { ...CHROME.footer, links: CHROME.footer.links.map((l) => ({ _type: "link", ...l })) },
      referBand: CHROME.referBand,
      figures: { ...STATS },
    },
    "siteSettings",
  ),
];

for (const r of ROUTES) {
  const content = pages[r.id];
  if (!content) throw new Error(`No seed content for ${r.id}`);
  docs.push({ _id: r.id, _type: r.type, route: r.path, ...convert(content, r.id) });
}
const unused = Object.keys(pages).filter((id) => !ROUTES.some((r) => r.id === id));
if (unused.length) throw new Error(`Seed content for unknown routes: ${unused.join(", ")}`);

// Clinics: each doctor's groups are in REGIONS order, so the Nth group is
// that doctor's Nth region.
for (const [doctorKey, groups] of [
  ["valentine", valentineStates],
  ["cashion", cashionStates],
]) {
  const doctor = DOCTORS.find((d) => d.key === doctorKey).value;
  const regions = REGIONS.filter((r) => r.doctor === doctor);
  if (regions.length !== groups.length) throw new Error(`${doctor}: ${groups.length} groups, ${regions.length} regions`);
  groups.forEach((g, gi) => {
    const region = regions[gi];
    if (region.title !== g.name || region.code !== g.code)
      throw new Error(`${doctor}: group ${g.name} (${g.code}) does not match region ${region.title} (${region.code})`);
    g.clinics.forEach((c, ci) =>
      docs.push({
        _type: "clinic",
        doctor,
        region: region.value,
        area: c.area,
        clinic: c.clinic,
        order: ci + 1,
        base: Boolean(c.base),
      }),
    );
  });
}

const only = process.argv.find((a) => a.startsWith("--only="))?.slice(7).split(",");
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

const byType = Object.entries(docs.reduce((n, d) => ({ ...n, [d._type]: (n[d._type] ?? 0) + 1 }), {})).map(
  ([t, n]) => `${t} ${n}`,
);
const images = new Set(JSON.stringify(docs).match(/image@file:[^"]+/g));
console.log(`Wrote ${docs.length} documents to dist-sanity/seed.ndjson (${byType.join(", ")}), ${images.size} image files`);
console.log(`${ids.length} with a fixed _id, ${docs.length - ids.length} without (re-importing those duplicates them)`);
