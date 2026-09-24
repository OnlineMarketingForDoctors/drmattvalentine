/**
 * Content loaders. Each returns the shape the page used when the content was
 * hard-coded, so the markup did not have to change.
 *
 * They fail loudly: a query error, a missing document, an empty list or an
 * empty required field throws, which fails the build and leaves the previous
 * deploy live. There is deliberately no hard-coded fallback — a fallback would
 * silently publish stale regulated-health claims.
 *
 * Only published documents are read (the client has no token), and each query
 * runs once per build however many pages ask for it.
 */
import { sanityClient } from "sanity:client";
import {
  advantagesQuery,
  appointmentStepsQuery,
  careerQuery,
  commitmentsQuery,
  pagesQuery,
  regionsQuery,
  settingsQuery,
  statsQuery,
} from "./queries";

export interface Settings {
  name: string;
  phoneLabel: string;
  phoneDigits: string;
  phoneHref: string;
  email: string;
  facebook: string;
  vasectomyAustralia: string;
  ahpra: string;
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

export interface SitePage {
  path: string;
  title: string;
  blurb: string;
}

const cache = new Map<string, Promise<unknown>>();

async function fetchOnce<T>(label: string, query: string): Promise<T> {
  if (!cache.has(query)) {
    cache.set(
      query,
      sanityClient.fetch<T>(query, {}, { perspective: "published" }).catch((err: unknown) => {
        throw new Error(`Sanity: ${label} query failed: ${err instanceof Error ? err.message : err}`);
      }),
    );
  }
  return cache.get(query) as Promise<T>;
}

/** Throws unless every listed field is present and non-empty. */
function required<T extends object>(label: string, value: T | null | undefined, fields: (keyof T)[]): T {
  if (!value) throw new Error(`Sanity: ${label} is missing — publish it in Studio`);
  const missing = fields.filter((f) => value[f] === null || value[f] === undefined || value[f] === "");
  if (missing.length) throw new Error(`Sanity: ${label} is missing ${missing.join(", ")}`);
  return value;
}

function nonEmpty<T extends object>(label: string, list: T[] | null, fields: (keyof T)[]): T[] {
  if (!list?.length) throw new Error(`Sanity: no published ${label} — publish at least one in Studio`);
  list.forEach((item, i) => required(`${label} #${i + 1}`, item, fields));
  return list;
}

export async function getSettings(): Promise<Settings> {
  const s = required(
    "Site settings",
    await fetchOnce<Omit<Settings, "phoneHref">>("settings", settingsQuery),
    ["name", "phoneLabel", "phoneDigits", "email", "facebook", "vasectomyAustralia", "ahpra"],
  );
  return { ...s, phoneHref: `tel:${s.phoneDigits.replace(/\s/g, "")}` };
}

export async function getStats(): Promise<Stats> {
  return required("Stats", await fetchOnce<Stats>("stats", statsQuery), [
    "career", "annual", "cost", "urgentWeeks", "minutes", "nsvYear", "startYear",
  ]);
}

export async function getLocations(): Promise<Locations> {
  type Row = StateGroup & { _id: string; doctor: string };
  const rows = nonEmpty("clinic regions", await fetchOnce<Row[]>("regions", regionsQuery), [
    "doctor", "code", "name",
  ]);
  const group = (doctor: string): StateGroup[] => {
    const groups = rows
      .filter((r) => r.doctor === doctor)
      .map(({ code, name, clinics }) => ({
        code,
        name,
        clinics: nonEmpty(`clinics in ${name}`, clinics, ["area", "clinic"]).map(({ area, clinic, base }) =>
          base ? { area, clinic, base } : { area, clinic },
        ),
      }));
    if (!groups.length) throw new Error(`Sanity: no clinic regions for ${doctor}`);
    return groups;
  };
  const valentineStates = group("valentine");
  const cashionStates = group("cashion");
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

export async function getPages(): Promise<SitePage[]> {
  return nonEmpty("sitemap entries", await fetchOnce<SitePage[]>("pages", pagesQuery), ["path", "title", "blurb"]);
}

/**
 * Copy in Studio writes figures as {tokens} so they cannot disagree with
 * Stats or the clinic list. Unknown tokens throw rather than print braces.
 */
async function tokenFiller(): Promise<(text: string) => string> {
  const [stats, locations] = await Promise.all([getStats(), getLocations()]);
  const values: Record<string, string | number> = {
    ...stats,
    clinicCount: locations.valentineCount,
    stateCount: locations.valentineStates.length,
  };
  return (text) =>
    text.replace(/\{([^}]*)\}/g, (_, token: string) => {
      if (!(token in values)) throw new Error(`Sanity: unknown token {${token}} in "${text}"`);
      return String(values[token]);
    });
}

export async function getCareer(): Promise<{ year: string; title: string; body: string }[]> {
  const fill = await tokenFiller();
  const rows = nonEmpty("career milestones", await fetchOnce<{ year: string; title: string; body: string }[]>("career", careerQuery), [
    "year", "title", "body",
  ]);
  return rows.map((r) => ({ year: r.year, title: fill(r.title), body: fill(r.body) }));
}

export async function getPillars(): Promise<{ label: string; body: string }[]> {
  const fill = await tokenFiller();
  const rows = nonEmpty("commitments", await fetchOnce<{ label: string; body: string }[]>("commitments", commitmentsQuery), [
    "label", "body",
  ]);
  return rows.map((r) => ({ label: fill(r.label), body: fill(r.body) }));
}

export async function getDay(): Promise<{ t: string; d: string }[]> {
  const fill = await tokenFiller();
  const rows = nonEmpty("appointment steps", await fetchOnce<{ title: string; detail: string }[]>("steps", appointmentStepsQuery), [
    "title", "detail",
  ]);
  return rows.map((r) => ({ t: fill(r.title), d: fill(r.detail) }));
}

export async function getAdvantages(): Promise<{ k: string; v: string }[]> {
  const fill = await tokenFiller();
  const rows = nonEmpty("procedure advantages", await fetchOnce<{ heading: string; body: string }[]>("advantages", advantagesQuery), [
    "heading", "body",
  ]);
  return rows.map((r) => ({ k: fill(r.heading), v: fill(r.body) }));
}
