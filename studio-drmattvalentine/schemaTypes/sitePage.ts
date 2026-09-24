import {DocumentsIcon} from '@sanity/icons/Documents'
import {defineField, defineType} from 'sanity'
import {byOrder, orderField} from './lib/order'

/**
 * An entry on /sitemap/ and in /llms.txt. Thank-you pages are noindex forever
 * and must never be listed.
 */
export const sitePage = defineType({
  name: 'sitePage',
  title: 'Sitemap entry',
  type: 'document',
  icon: DocumentsIcon,
  fields: [
    defineField({
      name: 'path',
      title: 'Path',
      type: 'string',
      description:
        'Starts and ends with a slash, e.g. /about/. The site uses trailing slashes everywhere.',
      validation: (rule) =>
        rule
          .required()
          .regex(/^\/([a-z0-9-]+\/)*$/, {name: 'path with leading and trailing slash'})
          .custom((path) =>
            path?.startsWith('/thank-you-')
              ? 'Thank-you pages are noindex permanently and are kept off the sitemap'
              : true,
          )
          .custom(async (path, ctx) => {
            if (!path) return true
            const id = ctx.document?._id.replace(/^drafts\./, '')
            const clash = await ctx
              .getClient({apiVersion: '2025-01-01'})
              .fetch<number>(
                'count(*[_type == "sitePage" && path == $path && !(_id in [$id, "drafts." + $id])])',
                {path, id},
              )
            return clash ? 'Another sitemap entry already uses this path' : true
          }),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required().max(60),
    }),
    defineField({
      name: 'blurb',
      title: 'Blurb',
      type: 'text',
      rows: 2,
      description: 'One line, shown on /sitemap/ and used as the llms.txt annotation.',
      validation: (rule) => [rule.required(), rule.max(200).warning('Keep it to one line')],
    }),
    orderField,
  ],
  orderings: [byOrder],
  preview: {
    select: {title: 'title', path: 'path', order: 'order'},
    prepare: ({title, path, order}) => ({
      title,
      subtitle: [order, path].filter((v) => v != null).join(' · '),
    }),
  },
})
