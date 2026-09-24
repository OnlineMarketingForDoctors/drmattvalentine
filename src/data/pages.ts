/**
 * SEED SOURCE ONLY. THE LIVE CONTENT IS IN SANITY STUDIO:
 * https://drmattvalentine.sanity.studio. Edit it there.
 *
 * Nothing on the site imports this file, so editing it changes nothing.
 * `npm run sanity:seed` reads it to write dist-sanity/seed.ndjson for a
 * one-time import (see scripts/export-sanity-ndjson.mjs).
 */

/**
 * One entry per route, in the order a reader would sensibly meet them.
 * Figures are {tokens}, filled in at build time.
 *
 * The thank-you pages have no blurb: they are noindex permanently and never
 * listed on /sitemap/ or in llms.txt.
 */
export interface SeedPage {
  /** Always with the trailing slash, matching trailingSlash: 'always'. */
  path: string;
  /** Short name: /sitemap/, llms.txt and structured data. */
  title: string;
  /** One line, used on /sitemap/ and as the llms.txt annotation. */
  blurb?: string;
  metaTitle: string;
  metaDescription: string;
  hero: {
    eyebrow: string;
    heading: string;
    lede: string;
    imageAlt?: string;
    crumb?: string;
    primaryCta?: string;
    secondaryCta?: string;
  };
}

export const pages: SeedPage[] = [
  {
    path: "/",
    title: "Home",
    blurb:
      "Dr Matt Valentine, specialist GP performing no-scalpel vasectomy across Queensland, Victoria and Western Australia.",
    metaTitle: "Dr Matt Valentine — No-scalpel vasectomy across QLD, VIC and WA",
    metaDescription:
      "Dr Matt Valentine has performed over {careerNumber} vasectomies and operates {clinicCount} clinics across Queensland, Victoria and Western Australia. Referral information for Australian GPs.",
    hero: {
      eyebrow: "Vasectomy Australia · QLD · VIC · WA",
      heading: "One procedure, done properly.",
      lede:
        "Dr Matt Valentine has performed {career} no-scalpel vasectomies and does around {annual} a year, across {clinicCount} clinics in Queensland, Victoria and Western Australia.",
      imageAlt: "Dr Matt Valentine, standing, in navy surgical scrubs",
      primaryCta: "Refer a patient",
      secondaryCta: "Find the nearest clinic",
    },
  },
  {
    path: "/about/",
    title: "About Dr Matt Valentine",
    blurb:
      "Training and career: Adelaide, five years as an RAAF Aviation Medical Officer, and the move to vasectomy as a sole focus.",
    metaTitle: "About Dr Matt Valentine — vasectomist, Brisbane",
    metaDescription:
      "Dr Matt Valentine trained in Adelaide, spent five years as an RAAF Aviation Medical Officer, and has performed over {careerNumber} no-scalpel vasectomies. Background, training and qualifications.",
    hero: {
      eyebrow: "About",
      heading: "He has always practised where the patient is.",
      lede: "Adelaide, then the Air Force, then Brisbane — and now a run of {clinicCount} clinics across three states.",
      imageAlt: "Dr Matt Valentine in navy scrubs in the corridor of a regional medical centre",
      crumb: "About",
    },
  },
  {
    path: "/vasectomy/",
    title: "The procedure",
    blurb:
      "No-scalpel vasectomy explained for referring GPs: technique, the appointment, recovery, clearance testing, cost, and every clinic location.",
    metaTitle: "No-scalpel vasectomy — technique, recovery, cost and clinic locations",
    metaDescription:
      "No-scalpel vasectomy with Dr Matt Valentine: the technique, the appointment, recovery, clearance testing, cost, and every clinic across Queensland, Victoria and Western Australia.",
    hero: {
      eyebrow: "The procedure",
      heading: "No scalpel, one opening, no stitches.",
      lede: "Under local anaesthetic, in under {minutes} minutes, at whichever of the {clinicCount} clinics is nearest your patient.",
      imageAlt: "An empty, prepared day-procedure room with a surgical green drape and instrument trolley",
      crumb: "Vasectomy",
    },
  },
  {
    path: "/refer/",
    title: "Refer a patient",
    blurb: "Referral form for GPs: the patient's details and your practice details.",
    metaTitle: "Refer a patient — Dr Matt Valentine",
    metaDescription:
      "Refer a patient to Dr Matt Valentine for no-scalpel vasectomy. Send the patient's details and your practice details, across {clinicCount} clinics in Queensland, Victoria and Western Australia.",
    hero: {
      eyebrow: "Refer a patient",
      heading: "Send him our way.",
      lede: "Patient details, your details, and he takes it from there.",
      imageAlt: "A no-scalpel vasectomy instrument set laid out on a surgical green drape",
      crumb: "Refer a patient",
    },
  },
  {
    path: "/contact/",
    title: "Contact",
    blurb:
      "Ask a question about a patient before referring. Phone, email, and a direct enquiry form.",
    metaTitle: "Contact Dr Matt Valentine — questions about a patient",
    metaDescription:
      "Contact Dr Matt Valentine's rooms about a patient referral for no-scalpel vasectomy. Phone {phoneLabel}, email, or send a question directly.",
    hero: {
      eyebrow: "Contact",
      heading: "Ask about a patient.",
      lede: "An open invitation to referring doctors: if there is a question worth asking before the referral, ask it.",
      imageAlt: "Dr Matt Valentine reading a referral letter at his desk",
      crumb: "Contact",
    },
  },
  {
    path: "/sitemap/",
    title: "Sitemap",
    blurb: "Every page on this site.",
    metaTitle: "Sitemap — Dr Matt Valentine",
    metaDescription: "Every page on drmattvalentine.com.au.",
    hero: {
      eyebrow: "Sitemap",
      heading: "Every page, in one list.",
      lede: "Six pages. If you are looking for a clinic, the full list sits on the procedure page and filters by state.",
    },
  },
  {
    path: "/thank-you-refer/",
    title: "Thank you — referral",
    metaTitle: "Thank you — referral received — Dr Matt Valentine",
    metaDescription: "Confirmation page.",
    hero: {
      eyebrow: "Referral received",
      heading: "Your referral is with Dr Valentine's rooms.",
      lede: "He will be in touch with your patient directly. If the referral is urgent and you have not heard back within two working days, please phone the rooms rather than wait.",
      primaryCta: "Back to the home page",
      secondaryCta: "Refer another patient",
    },
  },
  {
    path: "/thank-you-contact/",
    title: "Thank you — question",
    metaTitle: "Thank you — question received — Dr Matt Valentine",
    metaDescription: "Confirmation page.",
    hero: {
      eyebrow: "Question received",
      heading: "Your question is with Dr Valentine's rooms.",
      lede: "He answers these himself, so a reply may take a day or two if he is on the road. If it is time-critical, phone the rooms and ask for him directly.",
      primaryCta: "Back to the home page",
      secondaryCta: "Back to contact",
    },
  },
];
