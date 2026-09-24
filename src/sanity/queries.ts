/**
 * Every GROQ query the site runs. Loaders in ./loaders.ts turn the results
 * into the shapes the pages already use.
 *
 * Lists are ordered by the curated `order` field set in Studio, never
 * alphabetically.
 */
import groq from "groq";

export const settingsQuery = groq`*[_id == "siteSettings"][0]{
  name, ahpra, phoneLabel, phoneDigits, email, facebook, vasectomyAustralia,
  header{ brandName, brandTagline, cta, links[]{ label, href } },
  footer{ tagline, phoneTag, copyrightHolder, links[]{ label, href } },
  referBand{
    eyebrow, heading, lede, cta, noteBefore, noteLink, noteAfter,
    orchidometer{ eyebrow, heading, body, linkLabel, emailSubject, imageAlt }
  }
}`;

export const statsQuery = groq`*[_id == "stats"][0]{
  career, annual, cost, urgentWeeks, minutes, nsvYear, startYear
}`;

export const regionsQuery = groq`*[_type == "clinicRegion"] | order(order asc){
  _id, doctor, code, name,
  "clinics": *[_type == "clinic" && references(^._id)] | order(order asc){ area, clinic, base }
}`;

/** Every route's page. The loader picks one, or the sitemap entries. */
export const pagesQuery = groq`*[_type == "page"] | order(order asc){
  _id, path, title, blurb, metaTitle, metaDescription,
  hero{ eyebrow, heading, lede, imageAlt, crumb, primaryCta, secondaryCta }
}`;

export const careerQuery = groq`*[_type == "careerMilestone"] | order(order asc){ year, title, body }`;

export const commitmentsQuery = groq`*[_type == "commitment"] | order(order asc){ label, body }`;

export const appointmentStepsQuery = groq`*[_type == "appointmentStep"] | order(order asc){ title, detail }`;

export const advantagesQuery = groq`*[_type == "advantage"] | order(order asc){ heading, body }`;
