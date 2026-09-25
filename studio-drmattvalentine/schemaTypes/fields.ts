import {defineArrayMember, defineField, type FieldDefinition} from 'sanity'
import {knownTokens, tokenHelp} from './lib/tokens'

/*
 * Field builders shared by the page types, so every page edits the same way.
 * `g` is the Studio tab (group) the field sits in; inside a section() it is
 * ignored. Text fields accept {tokens} and reject unknown ones.
 */
type Opts = {
  description?: string
  required?: boolean
  rows?: number
  tokens?: boolean
  hidden?: boolean
}

const describe = (o: Opts) =>
  [o.description, o.tokens && tokenHelp].filter(Boolean).join(' ') || undefined

const textRule = (o: Opts) => (rule: any) => {
  const r = rule.custom(knownTokens)
  return o.required === false ? r : r.required()
}

export const str = (name: string, title: string, g: string, o: Opts = {}) =>
  defineField({
    name,
    title,
    type: 'string',
    group: g,
    description: describe(o),
    hidden: o.hidden,
    validation: textRule(o),
  })

export const txt = (name: string, title: string, g: string, o: Opts = {}) =>
  defineField({
    name,
    title,
    type: 'text',
    rows: o.rows ?? 3,
    group: g,
    description: describe(o),
    hidden: o.hidden,
    validation: textRule(o),
  })

export const rich = (name: string, title: string, g: string, o: Opts = {}) =>
  defineField({
    name,
    title,
    type: 'richText',
    group: g,
    description: describe(o),
    validation: (r: any) => (o.required === false ? r : r.required().min(1)),
  })

export const img = (name: string, title: string, g: string, o: Opts = {}) =>
  defineField({
    name,
    title,
    type: 'imageWithAlt',
    group: g,
    description: [
      o.description,
      'Drag the focal point onto the subject so it stays in frame when the image is cropped.',
    ]
      .filter(Boolean)
      .join(' '),
    validation: (r: any) => r.required().assetRequired(),
  })

export const bg = (name: string, title: string, g: string, o: Opts = {}) =>
  defineField({
    name,
    title,
    type: 'decorativeImage',
    group: g,
    description: [
      o.description,
      'Decorative only: hidden from screen readers, so it needs no alt text.',
    ]
      .filter(Boolean)
      .join(' '),
    validation: (r: any) => r.required().assetRequired(),
  })

export const figures = (name: string, title: string, g: string, o: Opts = {}) =>
  defineField({
    name,
    title,
    type: 'array',
    group: g,
    description: o.description,
    of: [defineArrayMember({type: 'figure'})],
    validation: (r: any) => r.required().min(1),
  })

/** A drag-to-reorder list of small objects; the list order is the order on the site. */
export const list = (
  name: string,
  title: string,
  g: string,
  item: {name: string; title: string; type?: 'string' | 'text'; tokens?: boolean}[],
  o: Opts & {preview?: [string, string?]; min?: number; max?: number} = {},
) =>
  defineField({
    name,
    title,
    type: 'array',
    group: g,
    description: [o.description, 'Drag to reorder.'].filter(Boolean).join(' '),
    of: [
      defineArrayMember({
        type: 'object',
        name: `${name}Item`,
        fields: item.map((f) =>
          defineField({
            name: f.name,
            title: f.title,
            type: f.type ?? 'string',
            ...(f.type === 'text' ? {rows: 3} : {}),
            description: f.tokens ? tokenHelp : undefined,
            validation: (r: any) => r.required().custom(knownTokens),
          }),
        ),
        preview: {
          select: {
            title: o.preview?.[0] ?? item[0].name,
            subtitle: o.preview?.[1] ?? item[1]?.name,
          },
        },
      }),
    ],
    validation: (r: any) => {
      let v = r.required().min(o.min ?? 1)
      if (o.max) v = v.max(o.max)
      return v
    },
  })

/** A section of a page: its fields render together in one tab. */
export const section = (
  name: string,
  title: string,
  fields: FieldDefinition[],
  description?: string,
) =>
  defineField({
    name,
    title,
    type: 'object',
    group: name,
    description,
    options: {collapsible: false},
    fields: fields.map((f) => ({...f, group: undefined})),
  })

/** Studio tabs: Hero first, then the page's sections, then SEO. */
export const tabs = (...sections: [string, string][]) => [
  {name: 'hero', title: 'Hero', default: true},
  ...sections.map(([name, title]) => ({name, title})),
  {name: 'seo', title: 'SEO & sitemap'},
]

/** Route and page name: fixed, shown for orientation. */
export const identity = () => [
  defineField({name: 'route', title: 'Route', type: 'string', readOnly: true, group: 'seo'}),
]

/** Browser title, meta description, and the page's line on /sitemap/ and in llms.txt. */
export const seoFields = (o: {sitemap?: boolean} = {}) => [
  defineField({
    name: 'metaTitle',
    title: 'Browser title',
    type: 'string',
    group: 'seo',
    description: `Shown in browser tabs and search results. ${tokenHelp}`,
    validation: (rule) => [
      rule.required().custom(knownTokens),
      rule.max(70).warning('Search results cut titles off around 60–70 characters'),
    ],
  }),
  defineField({
    name: 'metaDescription',
    title: 'Meta description',
    type: 'text',
    rows: 3,
    group: 'seo',
    description: `Must say only what the page itself says. ${tokenHelp}`,
    validation: (rule) => [
      rule.required().custom(knownTokens),
      rule.max(170).warning('Search results cut descriptions off around 155–160 characters'),
    ],
  }),
  defineField({
    name: 'title',
    title: 'Page name',
    type: 'string',
    group: 'seo',
    description:
      'Short name used on /sitemap/, in llms.txt and in structured data, e.g. "The procedure".',
    validation: (rule) => rule.required().max(60),
  }),
  ...(o.sitemap === false
    ? []
    : [
        defineField({
          name: 'blurb',
          title: 'Sitemap blurb',
          type: 'text',
          rows: 2,
          group: 'seo',
          description: 'One line, shown on /sitemap/ and used as the llms.txt annotation.',
          validation: (rule) => [rule.required(), rule.max(200).warning('Keep it to one line')],
        }),
      ]),
]

/** Eyebrow, heading and intro, with the image and breadcrumb most heroes have. */
export const heroFields = (o: {image?: boolean; crumb?: boolean; lede?: boolean} = {}) => [
  str('eyebrow', 'Eyebrow', 'hero', {description: 'Small label above the heading.'}),
  str('heading', 'Heading', 'hero', {description: 'The page’s one main heading.', tokens: true}),
  ...(o.lede === false ? [] : [txt('lede', 'Intro', 'hero', {tokens: true})]),
  ...(o.image === false ? [] : [img('heroImage', 'Hero image', 'hero')]),
  ...(o.crumb === false
    ? []
    : [
        str('breadcrumb', 'Breadcrumb label', 'hero', {
          description: 'Also used in the breadcrumb structured data.',
        }),
      ]),
]

export const AHPRA_NOTE = 'The AHPRA number from Site Settings is added after this automatically.'
