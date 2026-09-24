/**
 * /llms.txt — a plain-text map of the site for language models.
 *
 * Built from src/data/pages.ts so it cannot drift from /sitemap/, and from
 * site.config so the figures match what the pages actually say. The
 * thank-you pages are excluded along with everything else not in that list.
 */
import type { APIRoute } from "astro";
import { SITE, STATS } from "../site.config";
import { pages } from "../data/pages";
import { valentineStates, valentineCount } from "../data/locations";

export const GET: APIRoute = ({ site }) => {
  const base = (site ?? new URL("https://drmattvalentine.com.au")).origin;
  const url = (p: string) => `${base}${p}`;
  const states = valentineStates.map((s) => s.name).join(", ");

  const body = `# ${SITE.name}

> Specialist GP performing no-scalpel vasectomy with Vasectomy Australia, across ${valentineCount} clinics in ${states}. This site is written for referring Australian GPs rather than for patients.

- AHPRA registration: ${SITE.ahpra}
- Vasectomies performed: ${STATS.career}, around ${STATS.annual} a year
- Out-of-pocket cost after the Medicare rebate: ${STATS.cost}
- Procedure time: under ${STATS.minutes} minutes, under local anaesthetic
- Urgent referrals: usually accommodated within ${STATS.urgentWeeks} weeks
- Phone: ${SITE.phoneLabel} (${SITE.phoneDigits})
- Email: ${SITE.email}

## Pages

${pages.map((p) => `- [${p.title}](${url(p.path)}): ${p.blurb}`).join("\n")}

## Notes

- Patients book through Vasectomy Australia (${SITE.vasectomyAustralia}) rather than through these rooms; this site handles GP referrals.
- A vasectomy is not effective on the day it is performed. A post-vasectomy semen analysis is required, and other contraception must continue until that result confirms clearance.
- Dr Geoff Cashion covers the states Dr Valentine does not; both work within Vasectomy Australia.
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
