# drmattvalentine

## Search indexing: OFF until launch

This site must not appear in search results. Every build, deploy, and new
route inherits this until the client explicitly approves launch.

Three layers, all required:

1. `<meta name="robots" content="noindex, nofollow">` in the head of every page.
2. `X-Robots-Tag: noindex, nofollow` response header on **all** routes, so
   non-HTML assets (PDFs, images) are covered too.
3. `robots.txt` that **allows** crawling.

Layer 3 is not a mistake. `Disallow: /` blocks crawling, not indexing — a URL
can still be listed from an inbound link, and a blocked crawler can never read
the `noindex` in layers 1 and 2. Allowing the crawl is what makes the directives
effective. Do not "harden" this by adding a disallow.

Note: Vercel sends `X-Robots-Tag: noindex` on preview deployments automatically,
but **not** on production. Layer 2 must be configured explicitly for production.

This is a directive that well-behaved crawlers honor voluntarily. It is not
access control — the site is publicly reachable to anyone with the URL. If the
content ever needs to be genuinely private, that requires deployment protection,
which is a separate decision.

### At launch

Removing indexing blocks is an explicit, client-approved step — never a
side effect of other work. Remove all three layers together.
