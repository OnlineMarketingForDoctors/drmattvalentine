/**
 * Every GROQ query the site runs. Loaders in ./loaders.ts turn the results
 * into the shapes the pages use.
 */
import groq from "groq";

/** Site Settings: contact details, header, footer, refer band and figures. */
export const settingsQuery = groq`*[_id == "siteSettings"][0]`;

/** One page's document, by its fixed ID (page-<slug>). */
export const pageQuery = groq`*[_id == $id][0]`;

/** Every page's sitemap line; the loader orders and filters them. */
export const sitemapQuery = groq`*[_id in $ids]{ _id, route, title, blurb }`;

/** Every clinic. The loader groups them under the fixed regions. */
export const clinicsQuery = groq`*[_type == "clinic"] | order(order asc){ doctor, region, area, clinic, base }`;
