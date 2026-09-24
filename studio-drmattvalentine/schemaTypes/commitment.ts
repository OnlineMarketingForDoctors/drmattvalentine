import {CheckmarkCircleIcon} from '@sanity/icons/CheckmarkCircle'
import {defineField, defineType} from 'sanity'
import {byOrder, orderField} from './lib/order'
import {knownTokens, tokenHelp} from './lib/tokens'

/** The three commitments on the home page, in his own words from the current site. */
export const commitment = defineType({
  name: 'commitment',
  title: 'Commitment',
  type: 'document',
  icon: CheckmarkCircleIcon,
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'text',
      rows: 4,
      description: tokenHelp,
      validation: (rule) => [
        rule.required().custom(knownTokens),
        rule.max(300).warning('Keep it to two or three sentences'),
      ],
    }),
    orderField,
  ],
  orderings: [byOrder],
  preview: {
    select: {title: 'label', subtitle: 'body', order: 'order'},
    prepare: ({title, subtitle, order}) => ({
      title: order != null ? `${order}. ${title}` : title,
      subtitle,
    }),
  },
})
