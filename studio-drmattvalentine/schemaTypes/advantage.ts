import {StarIcon} from '@sanity/icons/Star'
import {defineField, defineType} from 'sanity'
import {byOrder, orderField} from './lib/order'
import {knownTokens, tokenHelp} from './lib/tokens'

/** The list of advantages on /vasectomy/, written for a referring GP. */
export const advantage = defineType({
  name: 'advantage',
  title: 'Procedure advantage',
  type: 'document',
  icon: StarIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      description: `e.g. Local anaesthetic, or {cost} out of pocket. ${tokenHelp}`,
      validation: (rule) => rule.required().max(40).custom(knownTokens),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'text',
      rows: 3,
      description: tokenHelp,
      validation: (rule) => [
        rule.required().custom(knownTokens),
        rule.max(300).warning('Keep it to two sentences'),
      ],
    }),
    orderField,
  ],
  orderings: [byOrder],
  preview: {
    select: {title: 'heading', subtitle: 'body', order: 'order'},
    prepare: ({title, subtitle, order}) => ({
      title: order != null ? `${order}. ${title}` : title,
      subtitle,
    }),
  },
})
