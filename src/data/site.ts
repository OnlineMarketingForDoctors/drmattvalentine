/**
 * SEED SOURCE ONLY. THE LIVE CONTENT IS IN SANITY STUDIO:
 * https://drmattvalentine.sanity.studio. Edit it there.
 *
 * Nothing on the site imports this file, so editing it changes nothing.
 * `npm run sanity:seed` reads it to write dist-sanity/seed.ndjson for a
 * one-time import (see scripts/export-sanity-ndjson.mjs).
 */

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

/** Shared chrome: header, footer and the refer band. */
export const CHROME = {
  header: {
    brandName: 'Matt Valentine',
    brandTagline: 'No-scalpel vasectomy',
    links: [
      { label: 'About', href: '/about/' },
      { label: 'The procedure', href: '/vasectomy/' },
      { label: 'Clinics', href: '/vasectomy/#clinics' },
      { label: 'Contact', href: '/contact/' },
    ],
    cta: 'Refer a patient',
  },
  footer: {
    tagline: 'Specialist GP · No-scalpel vasectomy',
    links: [
      { label: 'About', href: '/about/' },
      { label: 'The procedure', href: '/vasectomy/' },
      { label: 'Clinic locations', href: '/vasectomy/#clinics' },
      { label: 'Contact', href: '/contact/' },
    ],
    phoneTag: 'Rooms',
    copyrightHolder: 'Vasectomy Australia',
  },
  referBand: {
    eyebrow: 'Refer a patient',
    heading: 'Send him our way.',
    lede:
      'Are you a GP with a patient who has finished having children? ' +
      'Dr Valentine has performed {career} vasectomies and holds room ' +
      'for urgent referrals within {urgentWeeks} weeks.',
    cta: 'Send a referral',
    noteBefore: 'Not a GP? Patients book directly through',
    noteLink: 'Vasectomy Australia',
    noteAfter: 'rather than through these rooms.',
    orchidometer: {
      eyebrow: 'For referrers',
      heading: 'Order an orchidometer.',
      body:
        'A Prader orchidometer, free to referring practices, along with some ' +
        'other Vasectomy Australia oddments. Useful in the room, and a fair ' +
        'bit more use than a pen.',
      linkLabel: 'Request one',
      emailSubject: 'Orchidometer request',
      imageAlt:
        'A Prader orchidometer — a graduated chain of ellipsoid beads used to measure testicular volume',
    },
  },
};
