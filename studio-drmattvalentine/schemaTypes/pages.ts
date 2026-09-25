import {DocumentsIcon} from '@sanity/icons/Documents'
import {HomeIcon} from '@sanity/icons/Home'
import {defineField, defineType} from 'sanity'
import {
  AHPRA_NOTE,
  bg,
  figures,
  heroFields,
  identity,
  img,
  list,
  rich,
  section,
  seoFields,
  str,
  tabs,
  txt,
} from './fields'
import {isThankYou} from './lib/routes'

/*
 * One document type per page, because each page has its own sections. The
 * route and layout live in the Astro app; these hold everything the page
 * says and shows. Each is a fixed document (ID `page-<slug>`, see
 * lib/routes.ts), listed under Pages, with no create or delete.
 *
 * Each section is a tab. Hero comes first; SEO & sitemap last.
 */
const preview = {select: {title: 'title', subtitle: 'route'}}
const T = {tokens: true}

// ------------------------------------------------------------------ home
export const homePage = defineType({
  name: 'homePage',
  title: 'Home page',
  type: 'document',
  icon: HomeIcon,
  groups: tabs(
    ['figures', 'Figures'],
    ['about', 'About'],
    ['why', 'Why refer'],
    ['coverage', 'Coverage'],
    ['day', "Patient's day"],
    ['cost', 'Cost'],
  ),
  fields: [
    ...heroFields({crumb: false}),
    str('primaryCta', 'Main button label', 'hero', {description: 'Goes to /refer/.'}),
    str('secondaryCta', 'Second button label', 'hero', {description: 'Goes to the clinic list.'}),
    section('figures', 'Figures', [str('eyebrow', 'Eyebrow', ''), figures('items', 'Figures', '')]),
    section('about', 'About', [
      img('image', 'Portrait', ''),
      str('eyebrow', 'Eyebrow', ''),
      str('heading', 'Heading', '', T),
      rich('body', 'Body', '', T),
      str('registration', 'Registration line', '', {
        description: `Name and credentials, e.g. "Dr Matt Valentine · FRACGP". ${AHPRA_NOTE}`,
      }),
      str('linkLabel', 'Link label', '', {description: 'Goes to /about/.'}),
    ]),
    section('why', 'Why refer', [
      bg('background', 'Background texture', ''),
      str('eyebrow', 'Eyebrow', ''),
      str('heading', 'Heading', '', T),
      list('items', 'Commitments', '', [
        {name: 'label', title: 'Label'},
        {name: 'body', title: 'Body', type: 'text', tokens: true},
      ]),
    ]),
    section('coverage', 'Coverage', [
      str('eyebrow', 'Eyebrow', ''),
      str('heading', 'Heading', '', T),
      txt('lede', 'Intro', '', T),
      str('ctaLabel', 'Button label', '', {
        description: 'Goes to the clinic list. The states and areas come from Clinics.',
      }),
    ]),
    section('day', "Patient's day", [
      str('eyebrow', 'Eyebrow', ''),
      str('heading', 'Heading', '', T),
      txt('lede', 'Intro', '', T),
      list(
        'steps',
        'Steps',
        '',
        [
          {name: 'title', title: 'Title', tokens: true},
          {name: 'detail', title: 'Detail', type: 'text', tokens: true},
        ],
        {description: 'Numbered 01, 02… in this order.'},
      ),
    ]),
    section('cost', 'Cost', [
      str('eyebrow', 'Eyebrow', ''),
      str('heading', 'Heading', '', T),
      txt('lede', 'Intro', '', T),
      txt('note', 'Note', '', T),
      img('image', 'Image', ''),
    ]),
    ...seoFields(),
    ...identity(),
  ],
  preview,
})

// ----------------------------------------------------------------- about
export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'About page',
  type: 'document',
  icon: DocumentsIcon,
  groups: tabs(['intro', 'Introduction'], ['career', 'Career'], ['offDuty', 'Away from the list']),
  fields: [
    ...heroFields(),
    section('intro', 'Introduction', [
      str('eyebrow', 'Eyebrow', ''),
      str('heading', 'Heading', '', T),
      txt('lede', 'Intro', '', T),
      rich('body', 'Body', '', T),
      img('portrait', 'Portrait', ''),
      str('captionName', 'Caption name', ''),
      str('captionCredentials', 'Caption credentials', '', {
        description: `Only FRACGP and Designated Aviation Medical Examiner are supported by the practice's material. Ask before adding others. ${AHPRA_NOTE}`,
      }),
    ]),
    section('career', 'Career', [
      str('eyebrow', 'Eyebrow', ''),
      str('heading', 'Heading', '', T),
      list(
        'milestones',
        'Milestones',
        '',
        [
          {name: 'year', title: 'Year', tokens: false},
          {name: 'title', title: 'Title'},
          {name: 'body', title: 'Body', type: 'text', tokens: true},
        ],
        {
          preview: ['title', 'year'],
          description: 'Chronological. A year, a range such as 2001–06, or "Now".',
        },
      ),
    ]),
    section('offDuty', 'Away from the list', [
      img('image', 'Image', ''),
      str('eyebrow', 'Eyebrow', ''),
      str('heading', 'Heading', '', T),
      rich('body', 'Body', '', T),
    ]),
    ...seoFields(),
    ...identity(),
  ],
  preview,
})

// ------------------------------------------------------------- vasectomy
export const vasectomyPage = defineType({
  name: 'vasectomyPage',
  title: 'Procedure page',
  type: 'document',
  icon: DocumentsIcon,
  groups: tabs(
    ['technique', 'Technique'],
    ['advantages', 'Advantages'],
    ['clearance', 'Clearance'],
    ['locations', 'Locations'],
    ['guide', 'Guide'],
  ),
  fields: [
    ...heroFields(),
    section('technique', 'Technique', [
      str('eyebrow', 'Eyebrow', ''),
      str('heading', 'Heading', '', T),
      txt('lede', 'Intro', '', T),
      rich('body', 'Body', '', T),
      img('image', 'Image', ''),
      txt('caption', 'Caption', '', T),
    ]),
    section('advantages', 'Advantages', [
      str('eyebrow', 'Eyebrow', ''),
      str('heading', 'Heading', '', T),
      list('items', 'Advantages', '', [
        {name: 'heading', title: 'Heading', tokens: true},
        {name: 'body', title: 'Body', type: 'text', tokens: true},
      ]),
    ]),
    section('clearance', 'Clearance', [
      img('image', 'Image', ''),
      str('eyebrow', 'Eyebrow', ''),
      str('heading', 'Heading', '', T),
      rich('body', 'Body', '', T),
    ]),
    section(
      'locations',
      'Locations',
      [
        str('eyebrow', 'Eyebrow', ''),
        str('heading', 'Heading', '', T),
        txt('lede', 'Intro', '', T),
        str('allLabel', 'Filter: "all" button', ''),
        str('emptyText', 'Filter: no results', ''),
        str('networkEyebrow', 'Network eyebrow', ''),
        str('networkHeading', 'Network heading', '', T),
        txt('networkText', 'Network text', '', T),
      ],
      'The clinics themselves are edited under Clinics.',
    ),
    section('guide', 'Guide', [
      str('eyebrow', 'Eyebrow', ''),
      str('heading', 'Heading', '', T),
      txt('lede', 'Intro', '', T),
      str('ctaLabel', 'Button label', '', {
        description: 'Opens an email to the address in Site Settings.',
      }),
      str('emailSubject', 'Email subject', ''),
    ]),
    ...seoFields(),
    ...identity(),
  ],
  preview,
})

// ----------------------------------------------------------------- refer
export const referPage = defineType({
  name: 'referPage',
  title: 'Refer page',
  type: 'document',
  icon: DocumentsIcon,
  groups: tabs(['intro', 'Introduction']),
  fields: [
    ...heroFields(),
    section(
      'intro',
      'Introduction',
      [
        str('eyebrow', 'Eyebrow', ''),
        str('heading', 'Heading', '', T),
        txt('lede', 'Intro', '', T),
        rich('note', 'Note', '', T),
      ],
      'The referral form itself is hosted by Wufoo and edited there.',
    ),
    ...seoFields(),
    ...identity(),
  ],
  preview,
})

// --------------------------------------------------------------- contact
export const contactPage = defineType({
  name: 'contactPage',
  title: 'Contact page',
  type: 'document',
  icon: DocumentsIcon,
  groups: tabs(['ask', 'Question form'], ['where', 'Clinics']),
  fields: [
    ...heroFields(),
    section('ask', 'Question form', [
      str('eyebrow', 'Eyebrow', ''),
      str('heading', 'Heading', '', T),
      txt('note', 'Intro', '', {...T, rows: 4}),
      rich('aside', 'Note for patients', '', T),
      str('phoneLabel', 'Label: phone', ''),
      str('emailLabel', 'Label: email', ''),
      str('facebookLabel', 'Label: Facebook', ''),
      str('facebookLinkText', 'Facebook link text', ''),
      str('fieldName', 'Form: name', ''),
      str('fieldPractice', 'Form: practice', ''),
      str('fieldEmail', 'Form: email', ''),
      str('fieldPhone', 'Form: phone', ''),
      str('fieldOptional', 'Form: "optional" marker', ''),
      str('fieldMessage', 'Form: question', ''),
      str('submitLabel', 'Form: button', ''),
    ]),
    section('where', 'Clinics', [
      str('eyebrow', 'Eyebrow', ''),
      str('heading', 'Heading', '', T),
      txt('lede', 'Intro', '', T),
      str('ctaLabel', 'Button label', '', {description: 'Goes to the clinic list.'}),
    ]),
    ...seoFields(),
    ...identity(),
  ],
  preview,
})

// ------------------------------------------- sitemap and thank-you pages
const routeOf = (document: unknown) => (document as {route?: string} | undefined)?.route
const onThankYou = ({document}: {document?: unknown}) => isThankYou(routeOf(document))

export const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  icon: DocumentsIcon,
  groups: tabs(),
  fields: [
    ...heroFields({image: false, crumb: false}),
    defineField({
      ...str('primaryCta', 'Main button label', 'hero', {
        required: false,
        description: 'Goes to the home page.',
      }),
      hidden: (ctx) => !onThankYou(ctx),
      validation: (r) =>
        r.custom((v, ctx) => (!onThankYou(ctx) || v ? true : 'Required on thank-you pages')),
    }),
    defineField({
      ...str('secondaryCta', 'Second button label', 'hero', {required: false}),
      hidden: (ctx) => !onThankYou(ctx),
      validation: (r) =>
        r.custom((v, ctx) => (!onThankYou(ctx) || v ? true : 'Required on thank-you pages')),
    }),
    ...seoFields({sitemap: false}),
    defineField({
      name: 'blurb',
      title: 'Sitemap blurb',
      type: 'text',
      rows: 2,
      group: 'seo',
      description: 'One line, shown on /sitemap/ and used as the llms.txt annotation.',
      hidden: onThankYou,
      validation: (r) => r.custom((v, ctx) => (onThankYou(ctx) || v ? true : 'Required')),
    }),
    ...identity(),
  ],
  preview,
})

export const pageTypes = [homePage, aboutPage, vasectomyPage, referPage, contactPage, page]
