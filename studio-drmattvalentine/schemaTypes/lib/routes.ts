/**
 * The fixed set of pages: one document per route, with this ID and type.
 * Studio cannot add or delete them, because a page only exists where the
 * site has a template for it. The order here is the order of the Pages list
 * in Studio, of /sitemap/ and of llms.txt.
 *
 * Shared by the Studio and the site (src/sanity/loaders.ts).
 */
export interface Route {
  id: string
  path: string
  type: 'homePage' | 'aboutPage' | 'vasectomyPage' | 'referPage' | 'contactPage' | 'page'
  /** Name in the Studio's Pages list. */
  title: string
}

export const ROUTES: Route[] = [
  {id: 'page-home', path: '/', type: 'homePage', title: 'Home'},
  {id: 'page-about', path: '/about/', type: 'aboutPage', title: 'About'},
  {id: 'page-vasectomy', path: '/vasectomy/', type: 'vasectomyPage', title: 'The procedure'},
  {id: 'page-refer', path: '/refer/', type: 'referPage', title: 'Refer a patient'},
  {id: 'page-contact', path: '/contact/', type: 'contactPage', title: 'Contact'},
  {id: 'page-sitemap', path: '/sitemap/', type: 'page', title: 'Sitemap'},
  {
    id: 'page-thank-you-refer',
    path: '/thank-you-refer/',
    type: 'page',
    title: 'Thank you — referral',
  },
  {
    id: 'page-thank-you-contact',
    path: '/thank-you-contact/',
    type: 'page',
    title: 'Thank you — contact',
  },
]

/** Thank-you pages are noindex forever and never listed on /sitemap/ or in llms.txt. */
export const isThankYou = (path?: string) => Boolean(path?.startsWith('/thank-you-'))

export const PAGE_TYPES = [...new Set(ROUTES.map((r) => r.type))]
