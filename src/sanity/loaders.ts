/**
 * Content loaders. Pages read everything they say and show from here.
 *
 * They fail loudly. A query error throws, and so does reading any field that
 * is missing or empty: each document comes back wrapped so that
 * `page.about.heading` throws "Sanity: page-home → about.heading is missing"
 * if an editor cleared it. A throw fails the build and leaves the previous
 * deploy live. There is deliberately no hard-coded fallback — it would
 * silently publish stale regulated-health claims.
 *
 * {tokens} in any text are filled in before the page sees it. Only
 * published documents are read (the client has no token), and each query
 * runs once per build however many pages ask for it.
 */
import { sanityClient } from "sanity:client";
import { clinicsQuery, pageQuery, settingsQuery, sitemapQuery } from "./queries";
import type { SanityImage } from "./image";
// Shared with the Studio so the two cannot disagree.
import { ROUTES, isThankYou } from "../../studio-drmattvalentine/schemaTypes/lib/routes";
import { DOCTORS, REGIONS } from "../../studio-drmattvalentine/schemaTypes/lib/regions";

// ------------------------------------------------------------ plumbing

const cache = new Map<string, Promise<unknown>>();

function fetchOnce<T>(label: string, query: string, params: Record<string, unknown> = {}): Promise<T> {
  const k = query + JSON.stringify(params);
  if (!cache.has(k)) {
    cache.set(
      k,
      sanityClient.fetch<T>(query, params, { perspective: "published" }).catch((err: unknown) => {
        throw new Error(`Sanity: ${label} query failed: ${err instanceof Error ? err.message : err}`);
      }),
    );
  }
  return cache.get(k) as Promise<T>;
}

/** Keys that are legitimately absent: Sanity internals and image extras. */
const OPTIONAL = new Set(["hotspot", "crop", "marks", "markDefs", "alt", "base", "then", "toJSON", "asymmetricMatch"]);
const PASSTHROUGH = (k: string) => k.startsWith("_") || k === "asset";

/**
 * Wraps a document so reading a missing or empty field throws, naming the
 * document and field. Only fields a page actually reads are required.
 */
function strict<T>(value: T, label: string, path = ""): T {
  if (value === null || typeof value !== "object") return value;
  return new Proxy(value as object, {
    get(target, prop, receiver) {
      const v = Reflect.get(target, prop, receiver);
      if (typeof prop !== "string" || PASSTHROUGH(prop) || prop in Array.prototype) return v;
      const here = path ? `${path}.${prop}` : prop;
      const empty =
        v === undefined || v === null || (typeof v === "string" && !v.trim()) || (Array.isArray(v) && !v.length);
      if (empty) {
        if (OPTIONAL.has(prop)) return v;
        throw new Error(`Sanity: ${label} → ${here} is missing or empty — fill it in and publish`);
      }
      return strict(v, label, here);
    },
  }) as T;
}

/** Fills {tokens} in every string, rich-text spans and link targets included. */
function fillDeep<T>(value: T, fill: (s: string) => string): T {
  if (typeof value === "string") return fill(value) as T;
  if (Array.isArray(value)) return value.map((v) => fillDeep(v, fill)) as T;
  if (value && typeof value === "object")
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, PASSTHROUGH(k) ? v : fillDeep(v, fill)]),
    ) as T;
  return value;
}

// ------------------------------------------------------------ settings

export interface Link {
  label: string;
  href: string;
}

export interface Stats {
  career: string;
  annual: string;
  cost: string;
  urgentWeeks: number;
  minutes: number;
  nsvYear: number;
  startYear: number;
}

export interface Settings {
  name: string;
  phoneLabel: string;
  phoneDigits: string;
  phoneHref: string;
  email: string;
  facebook: string;
  vasectomyAustralia: string;
  ahpra: string;
  header: { brandName: string; brandTagline: string; cta: string; links: Link[] };
  footer: { tagline: string; phoneTag: string; copyrightHolder: string; links: Link[] };
  referBand: {
    eyebrow: string;
    heading: string;
    lede: string;
    cta: string;
    noteBefore: string;
    noteLink: string;
    noteAfter: string;
    orchidometer: {
      eyebrow: string;
      heading: string;
      body: string;
      linkLabel: string;
      emailSubject: string;
      image: SanityImage;
    };
  };
  figures: Stats;
}

async function getRawSettings(): Promise<Settings> {
  const s = await fetchOnce<Omit<Settings, "phoneHref"> | null>("Site settings", settingsQuery);
  if (!s) throw new Error("Sanity: Site Settings is missing — publish it in Studio");
  const checked = strict(s, "Site Settings");
  return { ...s, phoneHref: `tel:${checked.phoneDigits.replace(/\s/g, "")}` };
}

export async function getSettings(): Promise<Settings> {
  const [s, fill] = await Promise.all([getRawSettings(), tokenFiller()]);
  return strict(fillDeep(s, fill), "Site Settings");
}

export async function getStats(): Promise<Stats> {
  return strict((await getRawSettings()).figures, "Site Settings → Figures");
}

// ------------------------------------------------------------- clinics

export interface Clinic {
  area: string;
  clinic: string;
  /** His home base — he practises here between trips. */
  base?: boolean;
}

export interface StateGroup {
  code: string;
  name: string;
  clinics: Clinic[];
}

export interface Locations {
  valentineStates: StateGroup[];
  cashionStates: StateGroup[];
  valentineCount: number;
  cashionCount: number;
}

export async function getLocations(): Promise<Locations> {
  type Row = Clinic & { doctor: string; region: string };
  const rows = (await fetchOnce<Row[]>("clinics", clinicsQuery)) ?? [];
  rows.forEach((r, i) => {
    const c = strict(r, `Clinic #${i + 1} (${r.area ?? "no area"})`);
    for (const field of ["doctor", "region", "area", "clinic"] as const) void c[field];
    if (!REGIONS.some((g) => g.value === c.region && g.doctor === c.doctor))
      throw new Error(`Sanity: clinic ${r.area} has region "${r.region}", which is not in ${r.doctor}'s list`);
  });
  const group = (doctor: string): StateGroup[] => {
    const groups = REGIONS.filter((g) => g.doctor === doctor)
      .map((g) => ({
        code: g.code,
        name: g.title,
        clinics: rows
          .filter((r) => r.region === g.value)
          .map(({ area, clinic, base }) => (base ? { area, clinic, base } : { area, clinic })),
      }))
      // A region with no clinics is simply not shown.
      .filter((g) => g.clinics.length);
    if (!groups.length) throw new Error(`Sanity: no published clinics for ${doctor}`);
    return groups;
  };
  const valentineStates = group(DOCTORS[0].value);
  const cashionStates = group(DOCTORS[1].value);
  const count = (gs: StateGroup[]) => gs.reduce((n, s) => n + s.clinics.length, 0);
  return {
    valentineStates,
    cashionStates,
    valentineCount: count(valentineStates),
    cashionCount: count(cashionStates),
  };
}

export async function getStates(doctor: "valentine" | "cashion" = "valentine"): Promise<StateGroup[]> {
  const l = await getLocations();
  return doctor === "valentine" ? l.valentineStates : l.cashionStates;
}

// --------------------------------------------------------------- pages

export interface SitePage {
  path: string;
  title: string;
  blurb: string;
}

/**
 * Everything one route says and shows, with {tokens} filled. The shape is
 * the Studio schema for that page's type (studio-drmattvalentine/schemaTypes/pages.ts).
 * Reading any empty field throws.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getPage(path: string): Promise<any> {
  const route = ROUTES.find((r) => r.path === path);
  if (!route) throw new Error(`Sanity: ${path} is not in the fixed set of routes (studio-drmattvalentine/schemaTypes/lib/routes.ts)`);
  const [doc, fill] = await Promise.all([
    fetchOnce<Record<string, unknown> | null>(route.id, pageQuery, { id: route.id }),
    tokenFiller(),
  ]);
  if (!doc) throw new Error(`Sanity: page ${route.id} (${path}) is missing — publish it in Studio`);
  if (doc._type !== route.type) throw new Error(`Sanity: page ${route.id} is a ${doc._type}, expected ${route.type}`);
  return strict(fillDeep(doc, fill), route.id);
}

/** The pages listed on /sitemap/ and in llms.txt, in route order. Never the thank-you pages. */
export async function getPages(): Promise<SitePage[]> {
  const listed = ROUTES.filter((r) => !isThankYou(r.path));
  const docs = await fetchOnce<{ _id: string; title: string; blurb: string }[]>("sitemap", sitemapQuery, {
    ids: listed.map((r) => r.id),
  });
  return listed.map((r) => {
    const d = docs.find((x) => x._id === r.id);
    if (!d) throw new Error(`Sanity: page ${r.id} (${r.path}) is missing — publish it in Studio`);
    const s = strict(d, r.id);
    return { path: r.path, title: s.title, blurb: s.blurb };
  });
}

// -------------------------------------------------------------- tokens

/**
 * Copy in Studio writes figures as {tokens} so they cannot disagree with
 * Site Settings → Figures or the clinic list. Unknown tokens throw rather
 * than print braces.
 */
async function tokenFiller(): Promise<(text: string) => string> {
  const [settings, locations] = await Promise.all([getRawSettings(), getLocations()]);
  const stats = strict(settings.figures, "Site Settings → Figures");
  const values: Record<string, string | number> = {
    career: stats.career,
    careerNumber: stats.career.replace("+", ""),
    annual: stats.annual,
    cost: stats.cost,
    minutes: stats.minutes,
    urgentWeeks: stats.urgentWeeks,
    nsvYear: stats.nsvYear,
    startYear: stats.startYear,
    clinicCount: locations.valentineCount,
    stateCount: locations.valentineStates.length,
    cashionCount: locations.cashionCount,
    phoneLabel: settings.phoneLabel,
    phoneHref: settings.phoneHref,
    vasectomyAustralia: settings.vasectomyAustralia,
  };
  return (text) =>
    text.replace(/\{([^}]*)\}/g, (_, token: string) => {
      if (!(token in values)) throw new Error(`Sanity: unknown token {${token}} in "${text}"`);
      return String(values[token]);
    });
}
