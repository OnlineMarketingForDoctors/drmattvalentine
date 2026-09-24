/**
 * The site's routes. Pages are a fixed set: each route has exactly one Page
 * document with this ID, created by the seed. Studio cannot add or delete
 * them, because a page only exists once there is an .astro file for it.
 *
 * `hero` lists the hero fields that route actually renders. Only those are
 * shown in Studio, and each is required.
 */
export type HeroField =
  'eyebrow' | 'heading' | 'lede' | 'imageAlt' | 'crumb' | 'primaryCta' | 'secondaryCta'

export interface Route {
  id: string
  path: string
  hero: HeroField[]
}

const PAGE_HERO: HeroField[] = ['eyebrow', 'heading', 'lede', 'imageAlt', 'crumb']
const THANK_YOU_HERO: HeroField[] = ['eyebrow', 'heading', 'lede', 'primaryCta', 'secondaryCta']

export const ROUTES: Route[] = [
  {
    id: 'page-home',
    path: '/',
    hero: ['eyebrow', 'heading', 'lede', 'imageAlt', 'primaryCta', 'secondaryCta'],
  },
  {id: 'page-about', path: '/about/', hero: PAGE_HERO},
  {id: 'page-vasectomy', path: '/vasectomy/', hero: PAGE_HERO},
  {id: 'page-refer', path: '/refer/', hero: PAGE_HERO},
  {id: 'page-contact', path: '/contact/', hero: PAGE_HERO},
  {id: 'page-sitemap', path: '/sitemap/', hero: ['eyebrow', 'heading', 'lede']},
  {id: 'page-thank-you-refer', path: '/thank-you-refer/', hero: THANK_YOU_HERO},
  {id: 'page-thank-you-contact', path: '/thank-you-contact/', hero: THANK_YOU_HERO},
]

/** Thank-you pages are noindex forever and never listed on /sitemap/ or in llms.txt. */
export const isThankYou = (path?: string) => Boolean(path?.startsWith('/thank-you-'))

export const routeFor = (id?: string) => ROUTES.find((r) => r.id === id?.replace(/^drafts\./, ''))
