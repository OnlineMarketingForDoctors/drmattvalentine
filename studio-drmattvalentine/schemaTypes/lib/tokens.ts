import type {CustomValidator} from 'sanity'

/**
 * Figures that must not disagree between sections live in the Stats document
 * or are counted from the clinic list. Copy refers to them by token instead of
 * restating the number, and the site substitutes the current value.
 */
export const TOKENS = {
  minutes: 'Stats → minutes on the table',
  urgentWeeks: 'Stats → urgent referral wait, in weeks',
  cost: 'Stats → out-of-pocket cost',
  career: 'Stats → career total, e.g. 25,000+',
  careerNumber: 'Stats → career total without the +, e.g. 25,000',
  annual: 'Stats → annual total',
  nsvYear: 'Stats → year of no-scalpel training',
  startYear: 'Stats → year he started vasectomies',
  clinicCount: "Count of Dr Valentine's clinics",
  stateCount: 'Count of states Dr Valentine covers',
  phoneLabel: 'Site settings → phone as written, e.g. 1800 SNIPME',
} as const

export const tokenHelp =
  'Write figures as tokens, e.g. {minutes} or {clinicCount}, never as numbers. Available: ' +
  Object.keys(TOKENS)
    .map((t) => `{${t}}`)
    .join(', ')

/** Rejects {tokens} the site does not know how to fill. */
export const knownTokens: CustomValidator<string | undefined> = (value) => {
  if (!value) return true
  const unknown = [...value.matchAll(/\{([^}]*)\}/g)].map((m) => m[1]).filter((t) => !(t in TOKENS))
  return unknown.length ? `Unknown token: ${unknown.map((t) => `{${t}}`).join(', ')}` : true
}
