import {CogIcon} from '@sanity/icons/Cog'
import {defineArrayMember, defineField, defineType} from 'sanity'
import {knownTokens, tokenHelp} from './lib/tokens'

/** Internal links end in a slash, anchors included (/vasectomy/#clinics). */
const internalHref = /^\/([a-z0-9-]+\/)*(#[a-z0-9-]+)?$/

const linkList = (name: string, title: string, description: string) =>
  defineField({
    name,
    title,
    type: 'array',
    description,
    of: [
      defineArrayMember({
        type: 'object',
        name: 'link',
        fields: [
          defineField({
            name: 'label',
            title: 'Label',
            type: 'string',
            validation: (rule) => rule.required().max(30),
          }),
          defineField({
            name: 'href',
            title: 'Link',
            type: 'string',
            description:
              'A path on this site with a trailing slash, e.g. /about/ or /vasectomy/#clinics.',
            validation: (rule) =>
              rule.required().regex(internalHref, {name: 'site path with trailing slash'}),
          }),
        ],
        preview: {select: {title: 'label', subtitle: 'href'}},
      }),
    ],
    validation: (rule) => rule.required().min(1).max(6),
  })

const text = (
  name: string,
  title: string,
  opts: {max: number; rows?: number; description?: string; tokens?: boolean},
) =>
  defineField({
    name,
    title,
    type: opts.rows ? 'text' : 'string',
    ...(opts.rows ? {rows: opts.rows} : {}),
    description:
      [opts.description, opts.tokens && tokenHelp].filter(Boolean).join(' ') || undefined,
    validation: (rule) => {
      const r = rule.required().max(opts.max)
      return opts.tokens ? r.custom(knownTokens) : r
    },
  })

/**
 * Everything shared across pages: contact details and registration, the
 * header, the footer, the refer band that closes most pages, and the figures
 * quoted to referring GPs. The noindex switch is deliberately NOT here: it drives a
 * generated vercel.json and must stay in src/site.config.ts.
 */
export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  icon: CogIcon,
  groups: [
    {name: 'contact', title: 'Contact details', default: true},
    {name: 'header', title: 'Header'},
    {name: 'footer', title: 'Footer'},
    {name: 'referBand', title: 'Refer band'},
    {name: 'figures', title: 'Figures'},
  ],
  fields: [
    defineField({
      name: 'name',
      group: 'contact',
      title: 'Practitioner name',
      type: 'string',
      initialValue: 'Dr Matt Valentine',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'ahpra',
      group: 'contact',
      title: 'AHPRA registration number',
      type: 'string',
      description:
        'Required by AHPRA advertising guidelines wherever his services are advertised. Shown in the footer, the home bio and the About portrait caption.',
      validation: (rule) =>
        rule
          .required()
          .regex(/^MED\d{10}$/, {name: 'AHPRA medical practitioner number (MED + 10 digits)'}),
    }),
    defineField({
      name: 'phoneLabel',
      group: 'contact',
      title: 'Phone (as written)',
      type: 'string',
      description: 'The memorable form, e.g. 1800 SNIPME.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'phoneDigits',
      group: 'contact',
      title: 'Phone (digits)',
      type: 'string',
      description: 'The same number as digits, spaced for reading, e.g. 1800 764 763.',
      validation: (rule) => rule.required().regex(/^[\d ]+$/, {name: 'digits and spaces'}),
    }),
    defineField({
      name: 'email',
      group: 'contact',
      title: 'Email',
      type: 'string',
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: 'facebook',
      group: 'contact',
      title: 'Facebook URL',
      type: 'url',
      validation: (rule) => rule.uri({scheme: ['https']}),
    }),
    defineField({
      name: 'vasectomyAustralia',
      group: 'contact',
      title: 'Vasectomy Australia URL',
      type: 'url',
      description: 'Patient-facing network site, where non-GPs are sent to book.',
      validation: (rule) => rule.required().uri({scheme: ['https']}),
    }),
    defineField({
      name: 'header',
      title: 'Header',
      type: 'object',
      group: 'header',
      options: {collapsible: false},
      fields: [
        text('brandName', 'Wordmark name', {
          max: 30,
          description: 'Also used at the top of the footer.',
        }),
        text('brandTagline', 'Wordmark tagline', {
          max: 30,
          description: 'Shown in capitals, stretched to the width of the name, so keep it short.',
        }),
        linkList(
          'links',
          'Navigation links',
          'In the order shown, on desktop and in the mobile menu.',
        ),
        text('cta', 'Button label', {max: 30, description: 'The button that goes to /refer/.'}),
      ],
    }),
    defineField({
      name: 'footer',
      title: 'Footer',
      type: 'object',
      group: 'footer',
      options: {collapsible: false},
      fields: [
        text('tagline', 'Tagline', {
          max: 60,
          description: 'Under the name. The AHPRA number is added after it automatically.',
        }),
        linkList('links', 'Footer links', 'In the order shown.'),
        text('phoneTag', 'Phone label', {
          max: 20,
          description: 'Small label above the phone number.',
        }),
        text('copyrightHolder', 'Copyright holder', {
          max: 60,
          description: 'Shown as “© <year> <holder>. All rights reserved.”',
        }),
      ],
    }),
    defineField({
      name: 'referBand',
      title: 'Refer band',
      type: 'object',
      group: 'referBand',
      description:
        'The dark “Refer a patient” band near the foot of the home, About, procedure and Contact pages.',
      options: {collapsible: false},
      fields: [
        text('eyebrow', 'Eyebrow', {max: 40}),
        text('heading', 'Heading', {max: 60}),
        text('lede', 'Lede', {max: 300, rows: 3, tokens: true}),
        text('cta', 'Button label', {
          max: 30,
          description: 'The button that goes to /refer/. A phone button follows it.',
        }),
        text('noteBefore', 'Note: text before the link', {max: 80}),
        text('noteLink', 'Note: link text', {
          max: 40,
          description: 'Links to the Vasectomy Australia URL in Contact details.',
        }),
        text('noteAfter', 'Note: text after the link', {max: 80}),
        defineField({
          name: 'orchidometer',
          title: 'Orchidometer offer',
          type: 'object',
          options: {collapsible: false},
          fields: [
            text('eyebrow', 'Eyebrow', {max: 40}),
            text('heading', 'Heading', {max: 60}),
            text('body', 'Body', {max: 300, rows: 3}),
            text('linkLabel', 'Link label', {
              max: 30,
              description: 'Opens an email to the address in Contact details.',
            }),
            text('emailSubject', 'Email subject', {max: 60}),
            defineField({
              name: 'image',
              title: 'Image',
              type: 'imageWithAlt',
              validation: (rule) => rule.required().assetRequired(),
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'figures',
      title: 'Figures',
      type: 'object',
      group: 'figures',
      description:
        'Quoted to referring GPs across the site. Copy elsewhere refers to them as {tokens}, so they are only ever changed here.',
      options: {collapsible: false},
      fields: [
        defineField({
          name: 'career',
          title: 'Career total vasectomies',
          type: 'string',
          description:
            'As displayed, e.g. 25,000+. Token: {career}, or {careerNumber} without the +.',
          validation: (rule) =>
            rule.required().regex(/^\d{1,3}(,\d{3})*\+?$/, {name: 'number, e.g. 25,000+'}),
        }),
        defineField({
          name: 'annual',
          title: 'Vasectomies per year',
          type: 'string',
          description: 'As displayed, e.g. 1,000. Token: {annual}.',
          validation: (rule) =>
            rule.required().regex(/^\d{1,3}(,\d{3})*\+?$/, {name: 'number, e.g. 1,000'}),
        }),
        defineField({
          name: 'cost',
          title: 'Out-of-pocket cost',
          type: 'string',
          description: 'After the Medicare rebate, same at every clinic, e.g. $597. Token: {cost}.',
          validation: (rule) =>
            rule.required().regex(/^\$\d{1,3}(,\d{3})*$/, {name: 'dollar amount, e.g. $597'}),
        }),
        defineField({
          name: 'urgentWeeks',
          title: 'Urgent referral wait (weeks)',
          type: 'number',
          description: 'Token: {urgentWeeks}.',
          validation: (rule) => rule.required().integer().min(1).max(12),
        }),
        defineField({
          name: 'minutes',
          title: 'Procedure time (minutes)',
          type: 'number',
          description: 'Token: {minutes}.',
          validation: (rule) => rule.required().integer().min(5).max(120),
        }),
        defineField({
          name: 'nsvYear',
          title: 'Year of no-scalpel training',
          type: 'number',
          description: 'Token: {nsvYear}.',
          validation: (rule) => rule.required().integer().min(1990).max(new Date().getFullYear()),
        }),
        defineField({
          name: 'startYear',
          title: 'Year he started performing vasectomies',
          type: 'number',
          description: 'Token: {startYear}.',
          validation: (rule) => rule.required().integer().min(1990).max(new Date().getFullYear()),
        }),
      ],
    }),
  ],
  preview: {
    select: {name: 'name', ahpra: 'ahpra'},
    prepare: ({name, ahpra}) => ({
      title: 'Site settings',
      subtitle: [name, ahpra].filter(Boolean).join(' · '),
    }),
  },
})
