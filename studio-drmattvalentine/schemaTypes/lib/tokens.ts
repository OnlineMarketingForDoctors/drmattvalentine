import type {CustomValidator} from 'sanity'

/**
 * Figures that must not disagree between sections live in Site Settings →
 * Figures, or are counted from the clinic list. Copy refers to them by token
 * instead of restating the number, and the site fills in the current value.
 */
export const TOKENS = {
  career: 'Figures → career total, e.g. 25,000+',
  careerNumber: 'Figures → career total without the +, e.g. 25,000',
  annual: 'Figures → per year',
  cost: 'Figures → out-of-pocket cost',
  minutes: 'Figures → minutes on the table',
  urgentWeeks: 'Figures → urgent referral wait, in weeks',
  nsvYear: 'Figures → year of no-scalpel training',
  startYear: 'Figures → year he started vasectomies',
  clinicCount: "Number of Dr Valentine's clinics",
  stateCount: 'Number of states Dr Valentine covers',
  cashionCount: "Number of Dr Cashion's clinics",
  phoneLabel: 'Contact → phone as written, e.g. 1800 SNIPME',
  phoneHref: 'Contact → phone as a tel: link, for link targets',
  vasectomyAustralia: 'Contact → Vasectomy Australia URL, for link targets',
} as const

export const tokenHelp =
  'Write figures as tokens, never as numbers: ' +
  Object.keys(TOKENS)
    .map((t) => `{${t}}`)
    .join(', ') +
  '.'

const unknownIn = (text: string) =>
  [...text.matchAll(/\{([^}]*)\}/g)].map((m) => m[1]).filter((t) => !(t in TOKENS))

/** Rejects {tokens} the site does not know how to fill, in a string or anywhere inside rich text. */
export const knownTokens: CustomValidator<unknown> = (value) => {
  const texts: string[] = []
  const walk = (v: unknown) => {
    if (typeof v === 'string') texts.push(v)
    else if (Array.isArray(v)) v.forEach(walk)
    else if (v && typeof v === 'object')
      for (const [k, x] of Object.entries(v)) if (!k.startsWith('_') && k !== 'asset') walk(x)
  }
  walk(value)
  const unknown = [...new Set(texts.flatMap(unknownIn))]
  return unknown.length ? `Unknown token: ${unknown.map((t) => `{${t}}`).join(', ')}` : true
}
