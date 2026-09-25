# drmattvalentine

Astro site, deployed on Vercel. Design system inherited from
`OnlineMarketingForDoctors/drgeoffcashion` — the two are sibling sites and
should stay visually consistent.

## Search engine indexing: OFF (temporary)

This site must not be indexed by search engines **for now**. It is expected to
become indexable at launch, so the noindex is built as a single switch, not
sprinkled across the codebase.

### The switch

One constant, `NOINDEX` in `src/site.config.ts`, drives both controls:

| Control | Comes from | Covers |
| --- | --- | --- |
| `X-Robots-Tag: noindex, nofollow` | `vercel.json` headers block | every route and file type |
| `<meta name="robots" content="noindex, nofollow">` | `src/layouts/Base.astro` | HTML only, backstop |

`vercel.json` is a **generated, committed** file. After changing `NOINDEX`, run:

    npm run sync:noindex

and commit the result. `npm run build` runs `sync-noindex --check` and fails if
the two disagree, so they cannot silently drift. The check does not rewrite the
file during a Vercel build on purpose — Vercel reads `vercel.json` to configure
the build before `prebuild` runs, so a rewrite there would be too late to change
the headers actually served.

### Standing rules while the switch is on

- `robots.txt` must **not** blanket-`Disallow: /`. Crawlers have to fetch a page
  to see its noindex directive; blocking them in robots.txt hides the noindex
  and can leave URLs indexed from inbound links, with no description and no
  clean way to remove them. Use robots.txt for crawl hints only.
- No `sitemap.xml`, and no submission to Google Search Console, Bing Webmaster
  Tools, or any other index-submission surface.
- Do not add Search Console site verification while the switch is on.

### Verify before sharing any URL

Check the deployed URL, not the source. Vercel noindexes preview deployments
automatically but does **not** noindex production, so production is the case
that actually matters here:

    curl -sSI https://<production-domain>/ | grep -i x-robots-tag
    curl -sS  https://<production-domain>/ | grep -i 'name="robots"'

Both must be present. If either is missing, the site is not safe to share.

### At launch, when the switch flips off

1. Set `NOINDEX = false` and deploy.
2. Verify the header and meta tag are **gone** from production, using the same
   two commands above.
3. Only then add `sitemap.xml`, Search Console verification, and submit.

Nothing gets indexed automatically on flip — indexing requires submission.

## URLs

`trailingSlash: 'always'`. Every internal link ends in a slash, including
anchors (`/vasectomy/#clinics`). Two places define links as object arrays
rather than `href` attributes — the header and footer links in Site Settings
(Sanity) and the route list in `routes.ts` — so a find-and-replace over
`href="` will miss them. The Studio rejects header/footer links without the
trailing slash; `RichText.astro` adds it to site paths in rich-text links.

`Nav.astro`'s `isCurrent` normalises both sides before comparing and ignores
links containing a hash. Without the hash rule, `/vasectomy/` marks both "The
procedure" and "Clinics" as `aria-current`.

## Pages, sitemap and llms.txt

Pages are a **fixed set**, one document per route with ID `page-*`, listed in
`studio-drmattvalentine/schemaTypes/lib/routes.ts` (shared by the Studio and
`src/sanity/loaders.ts`). Home, About, The procedure, Refer and Contact each
have their own document type (`homePage`, `aboutPage`…), with a Studio tab per
section; Sitemap and the thank-you pages share the simple `page` type. Studio
cannot create, duplicate, unpublish or delete them.

Each page's **SEO & sitemap** tab holds its browser title, meta description,
page name and sitemap blurb. `/sitemap/` and `/llms.txt` list pages in
`routes.ts` order.

**To add a page:** create the `.astro` file, add the route to `routes.ts`, add
a schema type (or reuse `page`) in `schemaTypes/pages.ts`, add its seed to
`src/data/pages.ts`, import it (see *Seed files* below), add its type to the
rebuild webhook's filter, and redeploy the schema and Studio.

The thank-you pages are in the fixed set but are never listed on `/sitemap/`
or in `/llms.txt`; Studio hides their sitemap blurb.

## Thank-you pages are noindex forever

`/thank-you-refer/` and `/thank-you-contact/` pass `noindex` to `Base.astro`,
which ORs it with the site-wide `NOINDEX`. They stay out of the index after
launch — a confirmation page ranking for the practice is worse than useless.

Two things protect this and both matter:

1. The `noindex` prop on each page (meta tag).
2. A permanent `/thank-you-(.*)` rule in `vercel.json` (header).

`scripts/sync-noindex.mjs` only manages the **site-wide** `/(.*)` rule — it
filters on `rule.source === ROUTE` as well as the header key. An earlier
version stripped every rule carrying an `X-Robots-Tag`, which would have
deleted the thank-you rule the moment `NOINDEX` flipped. Do not loosen that
filter.

## Forms

`/refer/` embeds a Wufoo-hosted form (`z1funy0c0agqy7q`). The snippet is
third-party and carries `is:inline` so Astro does not bundle or rewrite it.

**The post-submission redirect is configured inside Wufoo, not in this
repo.** The thank-you pages exist, but nothing sends a user to them until
someone sets the redirect in the Wufoo form settings.

`/contact/` still uses the hand-built form with the interim mailto path.

## Content: Sanity

Everything the pages say and show comes from Sanity project `p6evl32l`,
dataset `production`, at build time: every heading, paragraph, button label
and image (backgrounds included), plus the header, footer, refer band,
contact details and figures. Studio: `studio-drmattvalentine/`, hosted at
drmattvalentine.sanity.studio. Layout, CSS, the Wufoo embed, the contact
form's script, the JSON-LD procedure text in `src/lib/schema.ts` and the
footer's agency credit stay in code.

The Studio is laid out like the Dr Geoff Cashion Studio:

| Sidebar | Holds |
| --- | --- |
| Site Settings | Contact details and AHPRA number; Header; Footer; Refer band (with its image); **Figures** (career total, cost, minutes…) |
| Pages | One document per route. Lists that appear on one page only live inside it as drag-to-reorder arrays: career (About), commitments and the patient's day (Home), advantages (The procedure) |
| Clinics | One list for both doctors. **Doctor** field; **Region** picked from a fixed list in `schemaTypes/lib/regions.ts` (not editable in Studio); order within region |

Clinics stay a separate list because several pages use them (Home, The
procedure, and every clinic count). A region with no clinics is not shown.

- Every GROQ query is in `src/sanity/queries.ts`; pages call loaders in
  `src/sanity/loaders.ts`.
- Loaders **fail loudly**: a query error, a missing document, or reading any
  field that is missing or empty throws ("Sanity: page-home → about.heading
  is missing or empty"), the build fails, and the previous deploy stays live.
  Only fields a page actually reads are required. Never add a hard-coded
  fallback.
- Images are served by Sanity's image CDN as WebP srcsets
  (`src/sanity/image.ts`, `SanityImage.astro`, ported from drgeoffcashion).
  An editor's hotspot becomes `object-position`. Images with alt text use
  `imageWithAlt`; decorative backgrounds use `decorativeImage` and render
  with `alt=""`.
- Rich text (`RichText.astro`) is paragraphs with italic, bold and links.
- `SanityImage` and `RichText` pass the parent's `data-astro-cid-*` through,
  so the page's scoped CSS still reaches the `<img>`, `<p>` and `<a>` they
  render. Keep that when editing them.
- `useCdn: false` — a static build must not bake in stale CDN content. Only
  published documents are read; the dataset is public so no token is needed.
- Project ID and dataset default in `astro.config.mjs` (Vercel reads no `.env`
  from the repo); `PUBLIC_SANITY_PROJECT_ID` / `PUBLIC_SANITY_DATASET` override.
- Publishing in Studio rebuilds production. A Sanity webhook, "Rebuild site
  on Vercel" (project p6evl32l, dataset `production`, published documents
  only), calls a Vercel deploy hook on create, update or delete. Its filter
  names every type the site reads: `siteSettings`, `homePage`, `aboutPage`,
  `vasectomyPage`, `referPage`, `contactPage`, `page`, `clinic`. **When you
  add a schema type the site reads, add it to that filter too**, or edits to
  it will not go live. Manage it at sanity.io/manage → project → API →
  Webhooks. The CLI token cannot disable a webhook; to pause it during a
  migration, point its filter at a type that does not exist, then restore it.
- The deploy hook URL triggers production deploys, so treat it as a secret:
  it lives only in the Sanity webhook, never in the repo.
- A rebuild runs the same fail-loudly loaders, so publishing an empty
  required field makes that deploy fail and production stays on the last good
  build. Check the Vercel deployment after publishing if a change does not
  appear.
- `NOINDEX` stays in `src/site.config.ts`: it generates `vercel.json`.

### Seed files, not live content

`src/data/` (`site.ts`, `locations.ts`, `pages.ts`, `lists.ts`) and the image
files in `src/assets/` are the **seed source only**. Nothing on the site
imports them; the live content is in Studio. `npm run sanity:seed` writes
`dist-sanity/seed.ndjson` (gitignored), imported from
`studio-drmattvalentine/` with
`npx sanity dataset import ../dist-sanity/seed.ndjson --dataset production`.
The import uploads the images.

- Fixed `_id`: `siteSettings` and `page-*`. `--replace` overwrites them;
  `--missing` skips them.
- `npm run sanity:seed -- --only=siteSettings,homePage` exports just those
  types, so fixed-ID types can be re-seeded without touching clinics.
- A document's `_type` cannot change in place: delete it before importing a
  document of a different type under the same `_id`.
- No `_id`: clinics. Importing again **duplicates** them, so delete them
  before re-seeding.
- Re-seeding overwrites Studio edits. Check `_updatedAt` against the last
  import, and drafts, first.

## Structured data

`src/lib/schema.ts` builds the JSON-LD. Every field must restate something
the page says in prose — structured data is a claim to a search engine the
same way body copy is a claim to a reader, and for a regulated health service
the two must not disagree.

`BreadcrumbList` is emitted by `PageHero.astro` from the same `crumb` value
the visible trail renders, so the two cannot drift.

There is no `FAQPage` markup because there is no FAQ content. Do not invent
questions and answers to earn the markup.

## Facts and figures

Numbers quoted to referring GPs live in **Site Settings → Figures** in Sanity
so they cannot disagree between sections. Do not hard-code them into a page. Copy
stored in Sanity refers to them as `{tokens}` (`{minutes}`, `{clinicCount}`…),
which the loaders fill in; an unknown token fails the build.

Claims on this site must be traceable to something the practice has supplied.
Credentials in particular: the source material supports FRACGP and Designated
Aviation Medical Examiner. Do not add letters beyond those without asking.

### AHPRA registration number

The AHPRA number (Site Settings → Contact details in Sanity) is **MED0000972761**. AHPRA's advertising guidelines expect a
registered practitioner's number to appear wherever their regulated health
services are advertised, so it is not optional decoration. It currently
appears in three places:

| Where | Selector | Covers |
| --- | --- | --- |
| Site-wide footer | `.foot__ahpra` | every page, including `/vasectomy`, `/contact`, `/refer` |
| Home bio block | `.about__reg` | the section that describes him on the landing page |
| About portrait caption | `.open__ahpra` | beside his credentials |

In all three the page appends `AHPRA registration {SITE.ahpra}` in code after
the editable name/credentials text, so an editor cannot remove it. Do not
remove any of the three, and add it to any new page or section that
describes him or his services. Keep it at normal body contrast — it is
regulatory text, not fine print, and must pass WCAG AA (all three currently
measure 7.7:1 or better).

## Images

Every image on the site is uploaded to Sanity and chosen in Studio; the
files in `src/assets/` are the originals the seed uploaded.
`src/assets/photos/` holds real photographs of Dr Valentine, supplied by the
client. `src/assets/generated/` holds AI-generated images — rooms, instruments
and landscape, plus three that depict Dr Valentine himself (`hero`, `desk`,
`corridor`), generated from his real photographs as reference and approved by
the client for use.

The generated likeness is close but not an exact match to his real photographs
— the glasses in particular differ. That was raised and the client accepted it,
so treat the three as approved. Re-check with the client before adding more,
and keep real photographs as the default where one exists for the job.
