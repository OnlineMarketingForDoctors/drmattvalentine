import {CalendarIcon} from '@sanity/icons/Calendar'
import {defineField, defineType} from 'sanity'
import {byOrder, orderField} from './lib/order'
import {knownTokens, tokenHelp} from './lib/tokens'

/** The timeline on /about/. A real chronology, so the year label carries information. */
export const careerMilestone = defineType({
  name: 'careerMilestone',
  title: 'Career milestone',
  type: 'document',
  icon: CalendarIcon,
  fields: [
    defineField({
      name: 'year',
      title: 'Year label',
      type: 'string',
      description: 'A year, a range (2001–06, with an en dash) or "Now".',
      validation: (rule) =>
        rule.required().regex(/^(\d{4}(–\d{2,4})?|Now)$/, {name: 'year, year range, or Now'}),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required().max(60),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'text',
      rows: 5,
      description: `Every claim must trace to material the practice supplied. ${tokenHelp}`,
      validation: (rule) => [
        rule.required().custom(knownTokens),
        rule.max(600).warning('Long for a timeline entry'),
      ],
    }),
    {...orderField, description: 'Chronological. Lower numbers come first.'},
  ],
  orderings: [byOrder],
  preview: {
    select: {year: 'year', title: 'title', order: 'order'},
    prepare: ({year, title, order}) => ({
      title: `${year} — ${title}`,
      subtitle: order != null ? `#${order}` : undefined,
    }),
  },
})
