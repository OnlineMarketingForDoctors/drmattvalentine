/**
 * SEED SOURCE ONLY. THE LIVE CONTENT IS IN SANITY STUDIO:
 * https://drmattvalentine.sanity.studio. Edit it there.
 *
 * Nothing on the site imports this file, so editing it changes nothing.
 * `npm run sanity:seed` reads it to write dist-sanity/seed.ndjson for a
 * one-time import (see scripts/export-sanity-ndjson.mjs).
 */

import { advantages, appointmentSteps, career, commitments } from "./lists.ts";

/**
 * Everything each page says and shows, one entry per route, keyed by the
 * page's fixed ID (studio-drmattvalentine/schemaTypes/lib/routes.ts).
 * Field names match the Studio schema for that page's type.
 *
 * Conventions the export script understands:
 * - Figures are {tokens}, filled in at build time.
 * - `para(...)` fields are rich text: one string per paragraph, with links
 *   written as [text](href). hrefs may be tokens, e.g. {phoneHref}.
 * - `image(path, alt)` and `bg(path)` point at files in this repo; the
 *   import uploads them to Sanity.
 */
export const para = (...paragraphs: string[]) => ({ __rich: paragraphs });
export const image = (path: string, alt: string) => ({ __image: path, alt });
export const bg = (path: string) => ({ __image: path, decorative: true });

const G = "src/assets/generated";
const P = "src/assets/photos";

export const pages: Record<string, Record<string, unknown>> = {
  "page-home": {
    eyebrow: "Vasectomy Australia · QLD · VIC · WA",
    heading: "One procedure, done properly.",
    lede: "Dr Matt Valentine has performed {career} no-scalpel vasectomies and does around {annual} a year, across {clinicCount} clinics in Queensland, Victoria and Western Australia.",
    heroImage: image(`${G}/hero.webp`, "Dr Matt Valentine, standing, in navy surgical scrubs"),
    primaryCta: "Refer a patient",
    secondaryCta: "Find the nearest clinic",
    figures: {
      eyebrow: "By the numbers",
      items: [
        { value: "{career}", label: "Vasectomies performed" },
        { value: "{annual}", label: "Each year" },
        { value: "{clinicCount}", label: "Clinics" },
        { value: "{stateCount}", label: "States" },
      ],
    },
    about: {
      image: image(`${P}/valentine-polo.jpg`, "Dr Matt Valentine in a navy Vasectomy Australia polo shirt"),
      eyebrow: "The short version",
      heading: "Twenty-five years of medicine, narrowed to one procedure.",
      body: para(
        "He graduated from Adelaide in 2000, then spent five years in the Royal Australian Air Force as an Aviation Medical Officer — aeromedical evacuation and humanitarian work in East Timor, Bali and the Middle East. He is still a Designated Aviation Medical Examiner.",
        "He began performing vasectomies in {startYear} under Dr Greg Silver, then trained in the United States in {nsvYear} in the no-scalpel technique. It has been the centre of his practice ever since.",
      ),
      registration: "Dr Matt Valentine · FRACGP",
      linkLabel: "Read the long version",
    },
    why: {
      background: bg(`${G}/drape.webp`),
      eyebrow: "Why refer here",
      heading: "Three things he will hold himself to.",
      items: commitments,
    },
    coverage: {
      eyebrow: "Coverage",
      heading: "{clinicCount} clinics, {stateCount} states.",
      lede: "Brisbane is the base. Everything else is a trip — and the list below is the whole run, not a catchment area drawn on a map.",
      ctaLabel: "See every clinic",
    },
    day: {
      eyebrow: "Your patient's day",
      heading: "In and out on the same visit.",
      lede: "Consultation and procedure happen in one appointment. There is no separate consult, no hospital admission, and nothing for your patient to organise beyond getting there.",
      steps: appointmentSteps,
    },
    cost: {
      eyebrow: "Cost",
      heading: "{cost} out of pocket.",
      lede: "That is the figure after the Medicare rebate, and it is the figure at every clinic on the list. The same procedure performed by a urologist can run to $5,000.",
      note: "Quoted so you can answer the question in the room, before your patient has to ring anyone.",
      image: image(`${G}/leaving.webp`, "A patient walking out of a suburban medical centre to the car park"),
    },
    metaTitle: "Dr Matt Valentine — No-scalpel vasectomy across QLD, VIC and WA",
    metaDescription:
      "Dr Matt Valentine has performed over {careerNumber} vasectomies and operates {clinicCount} clinics across Queensland, Victoria and Western Australia. Referral information for Australian GPs.",
    title: "Home",
    blurb:
      "Dr Matt Valentine, specialist GP performing no-scalpel vasectomy across Queensland, Victoria and Western Australia.",
  },

  "page-about": {
    eyebrow: "About",
    heading: "He has always practised where the patient is.",
    lede: "Adelaide, then the Air Force, then Brisbane — and now a run of {clinicCount} clinics across three states.",
    heroImage: image(`${G}/corridor.webp`, "Dr Matt Valentine in navy scrubs in the corridor of a regional medical centre"),
    breadcrumb: "About",
    intro: {
      eyebrow: "The short version",
      heading: "{career} vasectomies, and about {annual} a year.",
      lede: "Dr Matt Valentine is a Specialist GP with Vasectomy Australia. He has narrowed a broad medical career — military aviation medicine, general practice, day surgery — down to one procedure performed very often, in a lot of places.",
      body: para(
        "The travelling is the part that surprises people. Most vasectomists work from one or two rooms in a capital city. He runs a circuit instead, which means a patient in Townsville or Bendigo sees the same doctor, using the same technique, as a patient in Brisbane.",
      ),
      portrait: image(`${P}/valentine-headshot.jpeg`, "Dr Matt Valentine in navy surgical scrubs"),
      captionName: "Dr Matt Valentine",
      captionCredentials: "FRACGP · Designated Aviation Medical Examiner",
    },
    career: {
      eyebrow: "The long version",
      heading: "Twenty-five years, in order.",
      milestones: career,
    },
    offDuty: {
      image: image(`${P}/valentine-consult.jpg`, "Dr Matt Valentine in conversation with a colleague across a desk"),
      eyebrow: "Away from the list",
      heading: "Brisbane, a spaniel, and a piano.",
      body: para(
        "He lives in Brisbane with his wife and daughter. He runs trails with Lilly, a springer spaniel who is not especially interested in pacing, and rides a mountain bike. He plays the piano properly and the guitar less so.",
        "The family travels as much as it can, on the theory that there is a lot of world and a finite number of school holidays.",
      ),
    },
    metaTitle: "About Dr Matt Valentine — vasectomist, Brisbane",
    metaDescription:
      "Dr Matt Valentine trained in Adelaide, spent five years as an RAAF Aviation Medical Officer, and has performed over {careerNumber} no-scalpel vasectomies. Background, training and qualifications.",
    title: "About Dr Matt Valentine",
    blurb:
      "Training and career: Adelaide, five years as an RAAF Aviation Medical Officer, and the move to vasectomy as a sole focus.",
  },

  "page-vasectomy": {
    eyebrow: "The procedure",
    heading: "No scalpel, one opening, no stitches.",
    lede: "Under local anaesthetic, in under {minutes} minutes, at whichever of the {clinicCount} clinics is nearest your patient.",
    heroImage: image(`${G}/procedure-room.webp`, "An empty, prepared day-procedure room with a surgical green drape and instrument trolley"),
    breadcrumb: "Vasectomy",
    technique: {
      eyebrow: "The technique",
      heading: "Two techniques, folded together.",
      lede: "Dr Valentine has been performing vasectomies in Brisbane since {startYear}, initially trained in the traditional technique by Dr Greg Silver. In {nsvYear} he trained in the United States in the no-scalpel technique.",
      body: para(
        "Holding both matters more than it sounds. The no-scalpel approach uses a ringed clamp and a sharp dissecting forceps to reach the vas through a single small opening that is spread rather than cut — but when anatomy does not cooperate, the traditional training is what there is to fall back on.",
        "The opening is small enough that it is closed with a dressing rather than sutures.",
      ),
      image: image(`${G}/instruments.webp`, "A no-scalpel vasectomy instrument set laid out on a surgical green drape"),
      caption: "The ringed clamp and dissecting forceps that give the technique its name — no blade among them.",
    },
    advantages: {
      eyebrow: "What to tell your patient",
      heading: "Four things that decide it for most men.",
      items: advantages,
    },
    clearance: {
      image: image(`${G}/leaving.webp`, "A patient walking out of a suburban medical centre to the car park"),
      eyebrow: "Afterwards",
      heading: "It is not contraception until it is cleared.",
      body: para(
        "The single most important thing to say in the room: a vasectomy is not effective on the day it is performed. Your patient needs a post-vasectomy semen analysis, and must keep using other contraception until that result confirms clearance.",
        "The practice organises the test and the result. If anything about it is unclear when it reaches you, ring — that is exactly the sort of call Dr Valentine would rather take than not.",
      ),
    },
    locations: {
      eyebrow: "Where he operates",
      heading: "{clinicCount} clinics, three states.",
      lede: "He flies to all of them. Brisbane is the base; everything else is a trip. If your patient can get to one of these towns, they do not need to travel to a capital city for the procedure.",
      allLabel: "All",
      emptyText: "No clinics in that state.",
      networkEyebrow: "The rest of the network",
      networkHeading: "Dr Geoff Cashion covers another {cashionCount}.",
      networkText:
        "If your patient is outside Queensland, Victoria or Western Australia, they will most likely see Dr Cashion rather than Dr Valentine. Same technique, same organisation.",
    },
    guide: {
      eyebrow: "For your patient",
      heading: "The vasectomy information guide.",
      lede: "A plain-language booklet covering the procedure, the recovery and the clearance test — written to be handed over at the end of a consultation and read at home.",
      ctaLabel: "Request the guide",
      emailSubject: "Vasectomy information guide",
    },
    metaTitle: "No-scalpel vasectomy — technique, recovery, cost and clinic locations",
    metaDescription:
      "No-scalpel vasectomy with Dr Matt Valentine: the technique, the appointment, recovery, clearance testing, cost, and every clinic across Queensland, Victoria and Western Australia.",
    title: "The procedure",
    blurb:
      "No-scalpel vasectomy explained for referring GPs: technique, the appointment, recovery, clearance testing, cost, and every clinic location.",
  },

  "page-refer": {
    eyebrow: "Refer a patient",
    heading: "Send him our way.",
    lede: "Patient details, your details, and he takes it from there.",
    heroImage: image(`${G}/instruments.webp`, "A no-scalpel vasectomy instrument set laid out on a surgical green drape"),
    breadcrumb: "Refer a patient",
    intro: {
      eyebrow: "For referring doctors",
      heading: "Are you a GP with a patient for vasectomy?",
      lede: "Dr Valentine has performed {career} no-scalpel vasectomies across {clinicCount} clinics, and aims to give your patient the highest standard of clinical care.",
      note: para(
        "Urgent cases are accommodated within {urgentWeeks} weeks wherever possible. If you would rather talk it through first, the rooms are on [{phoneLabel}]({phoneHref}).",
      ),
    },
    metaTitle: "Refer a patient — Dr Matt Valentine",
    metaDescription:
      "Refer a patient to Dr Matt Valentine for no-scalpel vasectomy. Send the patient's details and your practice details, across {clinicCount} clinics in Queensland, Victoria and Western Australia.",
    title: "Refer a patient",
    blurb: "Referral form for GPs: the patient's details and your practice details.",
  },

  "page-contact": {
    eyebrow: "Contact",
    heading: "Ask about a patient.",
    lede: "An open invitation to referring doctors: if there is a question worth asking before the referral, ask it.",
    heroImage: image(`${G}/desk.webp`, "Dr Matt Valentine reading a referral letter at his desk"),
    breadcrumb: "Contact",
    ask: {
      eyebrow: "Send a question",
      heading: "He will come back to you.",
      note: "Fill this out and Dr Valentine will contact you as soon as he can — bearing in mind he may be in a room in Rockhampton when it arrives. Please keep patient identifiers out of the message; a description of the clinical question is enough to get a useful answer.",
      aside: para(
        "Not a GP? Patients book directly through [Vasectomy Australia]({vasectomyAustralia}) rather than through these rooms.",
      ),
      phoneLabel: "Phone",
      emailLabel: "Email",
      facebookLabel: "Facebook",
      facebookLinkText: "Vasectomy Australia",
      fieldName: "Your name",
      fieldPractice: "Practice",
      fieldEmail: "Email",
      fieldPhone: "Phone",
      fieldOptional: "optional",
      fieldMessage: "Your question",
      submitLabel: "Send question",
    },
    where: {
      eyebrow: "Clinics",
      heading: "{clinicCount} clinics, three states.",
      lede: 'If the question is simply "where is the nearest one", the full list is on the procedure page, filterable by state.',
      ctaLabel: "Find a clinic",
    },
    metaTitle: "Contact Dr Matt Valentine — questions about a patient",
    metaDescription:
      "Contact Dr Matt Valentine's rooms about a patient referral for no-scalpel vasectomy. Phone {phoneLabel}, email, or send a question directly.",
    title: "Contact",
    blurb:
      "Ask a question about a patient before referring. Phone, email, and a direct enquiry form.",
  },

  "page-sitemap": {
    eyebrow: "Sitemap",
    heading: "Every page, in one list.",
    lede: "Six pages. If you are looking for a clinic, the full list sits on the procedure page and filters by state.",
    metaTitle: "Sitemap — Dr Matt Valentine",
    metaDescription: "Every page on drmattvalentine.com.au.",
    title: "Sitemap",
    blurb: "Every page on this site.",
  },

  "page-thank-you-refer": {
    eyebrow: "Referral received",
    heading: "Your referral is with Dr Valentine's rooms.",
    lede: "He will be in touch with your patient directly. If the referral is urgent and you have not heard back within two working days, please phone the rooms rather than wait.",
    primaryCta: "Back to the home page",
    secondaryCta: "Refer another patient",
    metaTitle: "Thank you — referral received — Dr Matt Valentine",
    metaDescription: "Confirmation page.",
    title: "Thank you — referral",
  },

  "page-thank-you-contact": {
    eyebrow: "Question received",
    heading: "Your question is with Dr Valentine's rooms.",
    lede: "He answers these himself, so a reply may take a day or two if he is on the road. If it is time-critical, phone the rooms and ask for him directly.",
    primaryCta: "Back to the home page",
    secondaryCta: "Back to contact",
    metaTitle: "Thank you — question received — Dr Matt Valentine",
    metaDescription: "Confirmation page.",
    title: "Thank you — question",
  },
};
