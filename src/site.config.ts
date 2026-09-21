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

export const SITE = {
  name: 'Dr Matt Valentine',
  phoneLabel: '1800 SNIPME',
  phoneDigits: '1800 764 763',
  phoneHref: 'tel:1800764763',
  email: 'info@vasectomyaustralia.com.au',
  facebook: 'https://www.facebook.com/vasectomyaustralia',
  /** Patient-facing network site — where non-GPs are sent to book. */
  vasectomyAustralia: 'https://vasectomyaustralia.com.au/',
  /**
   * AHPRA registration number. Its advertising guidelines expect a
   * registered practitioner's number to appear wherever their regulated
   * health services are advertised, so this sits in the site-wide footer
   * and beside his credentials. Do not remove it.
   */
  ahpra: 'MED0000972761',
} as const;

/**
 * Figures quoted to referring GPs. Kept in one place because they appear in
 * several sections and must never disagree between them.
 */
export const STATS = {
  /** Career total, supplied by the practice. */
  career: '25,000+',
  /** Current annual throughput. */
  annual: '1,000',
  /** Out-of-pocket after the Medicare rebate. */
  cost: '$597',
  /** Longest wait he aims to hold for an urgent referral. */
  urgentWeeks: 2,
  /** Time on the table. */
  minutes: 20,
  /** Year he trained in the no-scalpel technique in the USA. */
  nsvYear: 2016,
  /** Year he started performing vasectomies, under Dr Greg Silver. */
  startYear: 2008,
} as const;
