/**
 * Every GROQ query the site runs. Loaders in ./loaders.ts turn the results
 * into the shapes the pages already use.
 *
 * Lists are ordered by the curated `order` field set in Studio, never
 * alphabetically.
 */
import groq from "groq";

export const settingsQuery = groq`*[_id == "siteSettings"][0]{
  name, ahpra, phoneLabel, phoneDigits, email, facebook, vasectomyAustralia
}`;

export const statsQuery = groq`*[_id == "stats"][0]{
  career, annual, cost, urgentWeeks, minutes, nsvYear, startYear
}`;

export const regionsQuery = groq`*[_type == "clinicRegion"] | order(order asc){
  _id, doctor, code, name,
  "clinics": *[_type == "clinic" && references(^._id)] | order(order asc){ area, clinic, base }
}`;

export const pagesQuery = groq`*[_type == "sitePage"] | order(order asc){ path, title, blurb }`;

export const careerQuery = groq`*[_type == "careerMilestone"] | order(order asc){ year, title, body }`;

export const commitmentsQuery = groq`*[_type == "commitment"] | order(order asc){ label, body }`;

export const appointmentStepsQuery = groq`*[_type == "appointmentStep"] | order(order asc){ title, detail }`;

export const advantagesQuery = groq`*[_type == "advantage"] | order(order asc){ heading, body }`;
