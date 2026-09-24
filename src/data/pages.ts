/**
 * SEED SOURCE ONLY. THE LIVE CONTENT IS IN SANITY STUDIO:
 * https://drmattvalentine.sanity.studio. Edit it there.
 *
 * Nothing on the site imports this file, so editing it changes nothing.
 * `npm run sanity:seed` reads it to write dist-sanity/seed.ndjson for a
 * one-time import (see scripts/export-sanity-ndjson.mjs).
 */

/**
 * The site's public pages, in the order a reader would sensibly meet them.
 *
 * The thank-you pages are deliberately absent: they are noindex permanently.
 */
export interface SitePage {
  /** Always with the trailing slash, matching trailingSlash: 'always'. */
  path: string;
  title: string;
  /** One line, used on /sitemap/ and as the llms.txt annotation. */
  blurb: string;
}

export const pages: SitePage[] = [
  {
    path: "/",
    title: "Home",
    blurb:
      "Dr Matt Valentine, specialist GP performing no-scalpel vasectomy across Queensland, Victoria and Western Australia.",
  },
  {
    path: "/about/",
    title: "About Dr Matt Valentine",
    blurb:
      "Training and career: Adelaide, five years as an RAAF Aviation Medical Officer, and the move to vasectomy as a sole focus.",
  },
  {
    path: "/vasectomy/",
    title: "The procedure",
    blurb:
      "No-scalpel vasectomy explained for referring GPs: technique, the appointment, recovery, clearance testing, cost, and every clinic location.",
  },
  {
    path: "/refer/",
    title: "Refer a patient",
    blurb: "Referral form for GPs: the patient's details and your practice details.",
  },
  {
    path: "/contact/",
    title: "Contact",
    blurb:
      "Ask a question about a patient before referring. Phone, email, and a direct enquiry form.",
  },
  {
    path: "/sitemap/",
    title: "Sitemap",
    blurb: "Every page on this site.",
  },
];
