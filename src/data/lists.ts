/**
 * SEED SOURCE ONLY. THE LIVE CONTENT IS IN SANITY STUDIO:
 * https://drmattvalentine.sanity.studio. Edit it there.
 *
 * Nothing on the site imports this file, so editing it changes nothing.
 * `npm run sanity:seed` reads it to write dist-sanity/seed.ndjson for a
 * one-time import (see scripts/export-sanity-ndjson.mjs).
 */

/*
 * Lists that were written inside .astro frontmatter before the site read from
 * Sanity. Figures are {tokens}, filled in at build time from Stats and the
 * clinic counts, so they cannot disagree between sections.
 */

/** Credentials the practice has supplied evidence for. Ask before adding. */
export const credentials = ['FRACGP', 'Designated Aviation Medical Examiner'];

/** /about/ — a real chronology, so the years carry information. */
export const career = [
  {
    year: '2000',
    title: 'Adelaide',
    body:
      'Born and raised in Adelaide, and stayed for medicine at the University ' +
      'of Adelaide. Internship and residency followed at the Royal Adelaide Hospital.',
  },
  {
    year: '2001–06',
    title: 'Royal Australian Air Force',
    body:
      'Five years full time as an Aviation Medical Officer, coordinating and ' +
      'conducting aeromedical evacuations, humanitarian assistance and ' +
      'peacekeeping work — East Timor, Bali and the Middle East Area of ' +
      'Operations, plus border control operations with the Royal Australian ' +
      'Navy. He attained fellowship of the Royal Australian College of General ' +
      'Practitioners during this period.',
  },
  {
    year: '2008',
    title: 'Brisbane, and the first vasectomies',
    body:
      'He joined the partnership at Walton Bridge Medical Centre in The Gap, ' +
      'practising as a GP and, keeping the aviation thread alive, as a ' +
      'Designated Aviation Medical Examiner. It was here that he began training ' +
      'in the traditional vasectomy technique under Dr Greg Silver.',
  },
  {
    year: '2010',
    title: 'Volume',
    body:
      'Vasectomies for Family Planning Queensland, then Montserrat Private Day ' +
      'Hospitals and Marie Stopes Australia. The procedure moved from an ' +
      'interest to the centre of his week.',
  },
  {
    year: '2016',
    title: 'The United States',
    body:
      'He travelled to the USA to train in the no-scalpel technique. Already ' +
      'holding the traditional approach, he was able to fold the two together ' +
      'into the method he uses now.',
  },
  {
    year: 'Now',
    title: 'Vasectomy Australia',
    body:
      'He works alongside Dr Geoff Cashion at Vasectomy Australia, running ' +
      '{clinicCount} clinics across Queensland, Victoria and Western ' +
      'Australia. He still maintains his partnership at Walton Bridge and still ' +
      'practises aviation medicine.',
  },
];

/** Home — the three commitments, in his own words on the current site. */
export const commitments = [
  {
    label: 'Comprehensive care',
    body:
      'He has spent the years since 2008 narrowing his practice to this one procedure, ' +
      'and treats the safety and effectiveness of it as the whole job rather than ' +
      'a sideline to general practice.',
  },
  {
    label: 'Urgent referrals',
    body:
      'Urgent cases get immediate consideration. Most can be accommodated within ' +
      '{urgentWeeks} weeks of referral, wherever they sit on the run.',
  },
  {
    label: 'Available for advice',
    body:
      'An open invitation to referring doctors: call him. Access to surgical ' +
      'judgement before you refer is often worth more than the referral itself.',
  },
];

/** Home — the patient's day, in order. */
export const appointmentSteps = [
  { title: 'Arrive', detail: 'No fasting, no pre-admission, no hospital. He walks in off the street.' },
  { title: 'Consent', detail: 'The conversation happens on the day. Same visit, same room, no second trip.' },
  { title: '{minutes} minutes', detail: 'Local anaesthetic. No scalpel, one small opening, no stitches.' },
  { title: 'Drives home', detail: 'He drove himself in. He drives himself out. No sedation, no escort.' },
];

/** /vasectomy/ — advantages, written for a referring GP. */
export const advantages = [
  {
    heading: 'Local anaesthetic',
    body: 'The procedure takes under {minutes} minutes and is performed under local anaesthetic. No general, no sedation, no theatre booking.',
  },
  {
    heading: 'He drives himself',
    body: "Your patient drives to the appointment and drives home from it. No escort, no recovery bay, no day off arranged around someone else's roster.",
  },
  {
    heading: 'Quick recovery',
    body: 'Most men are back to desk work within a day or two and to physical work inside a week, with the usual advice about lifting and rest in between.',
  },
  {
    heading: '{cost} out of pocket',
    body: 'That is the figure after the Medicare rebate, and it is the same at every clinic. The equivalent procedure with a urologist can reach $5,000.',
  },
];
