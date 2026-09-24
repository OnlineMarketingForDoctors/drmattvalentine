import {DocumentsIcon} from '@sanity/icons/Documents'
import {defineField, defineType, type ConditionalPropertyCallbackContext} from 'sanity'
import {byOrder, orderField} from './lib/order'
import {isThankYou, routeFor, type HeroField} from './lib/routes'
import {knownTokens, tokenHelp} from './lib/tokens'

type Ctx = Partial<Pick<ConditionalPropertyCallbackContext, 'document'>>
const pathOf = ({document}: Ctx) => (document as {path?: string} | undefined)?.path
const rendersHero = (field: HeroField, document?: {_id?: string}) =>
  Boolean(routeFor(document?._id)?.hero.includes(field))

/** A hero field that is shown, and required, only on routes that render it. */
const heroField = (
  name: HeroField,
  title: string,
  extra: {description?: string; rows?: number; max: number},
) =>
  defineField({
    name,
    title,
    type: extra.rows ? 'text' : 'string',
    ...(extra.rows ? {rows: extra.rows} : {}),
    description: [extra.description, tokenHelp].filter(Boolean).join(' '),
    hidden: ({document}) => !rendersHero(name, document),
    validation: (rule) =>
      rule.custom((value: string | undefined, ctx) => {
        if (!rendersHero(name, ctx.document)) return true
        if (!value?.trim()) return 'This page shows this field, so it cannot be empty'
        if (value.length > extra.max) return `Keep it under ${extra.max} characters`
        return knownTokens(value, ctx)
      }),
  })

/**
 * One document per route: its meta tags, hero, and entry on /sitemap/ and in
 * llms.txt. Body copy beyond the hero stays in the page's .astro file.
 */
export const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  icon: DocumentsIcon,
  groups: [
    {name: 'meta', title: 'Meta', default: true},
    {name: 'hero', title: 'Hero'},
    {name: 'sitemap', title: 'Sitemap'},
  ],
  fields: [
    defineField({
      name: 'path',
      title: 'Route',
      type: 'string',
      readOnly: true,
      description: 'Fixed. A page exists only where the site has a template for it.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Page name',
      type: 'string',
      description:
        'Short name used on /sitemap/, in llms.txt and in structured data, e.g. "The procedure".',
      validation: (rule) => rule.required().max(60),
    }),
    defineField({
      name: 'metaTitle',
      title: 'Meta title',
      type: 'string',
      group: 'meta',
      description: `The <title> shown in browser tabs and search results. ${tokenHelp}`,
      validation: (rule) => [
        rule.required().custom(knownTokens),
        rule.max(70).warning('Search results usually cut titles after about 60–70 characters'),
      ],
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta description',
      type: 'text',
      rows: 3,
      group: 'meta',
      description: `Must say only what the page itself says. ${tokenHelp}`,
      validation: (rule) => [
        rule.required().custom(knownTokens),
        rule
          .max(170)
          .warning('Search results usually cut descriptions after about 155–160 characters'),
      ],
    }),
    defineField({
      name: 'hero',
      title: 'Hero',
      type: 'object',
      group: 'hero',
      options: {collapsible: false},
      fields: [
        heroField('eyebrow', 'Eyebrow', {description: 'Small label above the heading.', max: 60}),
        heroField('heading', 'Heading', {description: 'The page’s one <h1>.', max: 90}),
        heroField('lede', 'Lede', {rows: 3, max: 300}),
        heroField('imageAlt', 'Image alt text', {
          description: 'Describe what the photograph shows. The image itself is set in code.',
          max: 160,
        }),
        heroField('crumb', 'Breadcrumb label', {
          description: 'Also used in the BreadcrumbList structured data.',
          max: 30,
        }),
        heroField('primaryCta', 'Primary button label', {max: 40}),
        heroField('secondaryCta', 'Secondary button label', {max: 40}),
      ],
    }),
    defineField({
      name: 'blurb',
      title: 'Sitemap blurb',
      type: 'text',
      rows: 2,
      group: 'sitemap',
      description: 'One line, shown on /sitemap/ and used as the llms.txt annotation.',
      hidden: (ctx) => isThankYou(pathOf(ctx)),
      validation: (rule) =>
        rule.custom((value: string | undefined, ctx) =>
          isThankYou(pathOf(ctx)) || value?.trim()
            ? true
            : 'Required for pages listed on the sitemap',
        ),
    }),
    {
      ...orderField,
      group: 'sitemap',
      description: 'Position on /sitemap/ and in llms.txt. Lower numbers come first.',
      hidden: (ctx: Ctx) => isThankYou(pathOf(ctx)),
      validation: (rule) =>
        rule.custom((value: number | undefined, ctx) => {
          if (isThankYou(pathOf(ctx))) return true
          if (value === undefined) return 'Required for pages listed on the sitemap'
          return Number.isInteger(value) && value >= 0 ? true : 'Use a whole number'
        }),
    },
  ],
  orderings: [byOrder],
  preview: {
    select: {title: 'title', path: 'path', order: 'order'},
    prepare: ({title, path, order}) => ({
      title,
      subtitle: isThankYou(path)
        ? `${path} · not on sitemap`
        : [order, path].filter((v) => v != null).join(' · '),
    }),
  },
})
