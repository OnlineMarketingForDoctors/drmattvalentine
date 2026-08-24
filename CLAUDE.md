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

## Facts and figures

Numbers quoted to referring GPs live in `STATS` in `src/site.config.ts` so they
cannot disagree between sections. Do not hard-code them into a page.

Claims on this site must be traceable to something the practice has supplied.
Credentials in particular: the source material supports FRACGP and Designated
Aviation Medical Examiner. Do not add letters beyond those without asking.

## Images

`src/assets/photos/` holds real photographs of Dr Valentine, supplied by the
client. `src/assets/generated/` holds AI-generated images of **rooms,
instruments and landscape only**.

Do not generate images depicting Dr Valentine. Generated likenesses came out
close but not exact, which on a real doctor's professional site is a
misrepresentation. Anywhere he appears, use a real photograph.
