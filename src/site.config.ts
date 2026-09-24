/**
 * Search engine indexing switch. See CLAUDE.md.
 *
 * true  -> X-Robots-Tag header (vercel.json) + <meta name="robots"> on every page
 * false -> both removed
 *
 * Flipping this is the entire launch change. `npm run build` regenerates
 * vercel.json from this value via scripts/sync-noindex.mjs.
 */
export const NOINDEX = true;

/*
 * Contact details, AHPRA number, figures quoted to GPs and every list on the
 * site now come from Sanity (studio-drmattvalentine/), read at build time by
 * src/sanity/loaders.ts. The noindex switch stays here because it also
 * generates vercel.json, which Vercel reads before the build runs.
 */
