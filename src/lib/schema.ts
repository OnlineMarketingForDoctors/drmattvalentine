/**
 * JSON-LD builders. Everything here must be traceable to copy that is
 * actually on the page — structured data is a claim to search engines in the
 * same way body text is a claim to a reader, and for a regulated health
 * service the two must not disagree.
 */
import { SITE, STATS } from "../site.config";
import { valentineStates } from "../data/locations";

const abs = (path: string, site: URL | undefined) =>
  new URL(path, site ?? "https://drmattvalentine.com.au").href;

/** The practitioner, including the AHPRA number required on advertising. */
export function physician(site: URL | undefined) {
  return {
    "@type": "Physician",
    "@id": abs("/#physician", site),
    name: SITE.name,
    medicalSpecialty: "https://schema.org/PrimaryCare",
    description:
      "Specialist GP performing no-scalpel vasectomy with Vasectomy Australia.",
    identifier: {
      "@type": "PropertyValue",
      name: "AHPRA registration",
      value: SITE.ahpra,
    },
    telephone: SITE.phoneDigits,
    email: SITE.email,
    url: abs("/", site),
    areaServed: valentineStates.map((s) => ({
      "@type": "State",
      name: s.name,
    })),
  };
}

/** A plain content page. */
export function webPage(
  { name, description, path }: { name: string; description: string; path: string },
  site: URL | undefined
) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": abs(path, site),
    url: abs(path, site),
    name,
    description,
    inLanguage: "en-AU",
    isPartOf: {
      "@type": "WebSite",
      name: SITE.name,
      url: abs("/", site),
    },
    about: physician(site),
  };
}

/**
 * The procedure page. Every field below restates something the page says in
 * prose — nothing here is a new clinical claim.
 */
export function medicalProcedure(site: URL | undefined) {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    "@id": abs("/vasectomy/#procedure", site),
    name: "No-scalpel vasectomy",
    procedureType: "https://schema.org/SurgicalProcedure",
    bodyLocation: "Scrotum",
    howPerformed:
      "Performed under local anaesthetic in under " +
      `${STATS.minutes} minutes. A ringed clamp and a sharp dissecting forceps ` +
      "reach the vas through a single small opening that is spread rather than " +
      "cut, and the opening is closed with a dressing rather than sutures.",
    preparation:
      "No fasting and no hospital admission. Consultation and procedure happen " +
      "in the same appointment, and the patient can drive themselves to and from it.",
    followup:
      "A vasectomy is not effective on the day it is performed. The patient " +
      "requires a post-vasectomy semen analysis and must continue other " +
      "contraception until that result confirms clearance.",
    performer: physician(site),
  };
}
