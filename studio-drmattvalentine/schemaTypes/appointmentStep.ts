import {ClockIcon} from '@sanity/icons/Clock'
import {defineField, defineType} from 'sanity'
import {byOrder, orderField} from './lib/order'
import {knownTokens, tokenHelp} from './lib/tokens'

/** "The patient's day" on the home page. A real sequence, so order is the information. */
export const appointmentStep = defineType({
  name: 'appointmentStep',
  title: 'Appointment step',
  type: 'document',
  icon: ClockIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: `Short, e.g. Arrive or {minutes} minutes. ${tokenHelp}`,
      validation: (rule) => rule.required().max(30).custom(knownTokens),
    }),
    defineField({
      name: 'detail',
      title: 'Detail',
      type: 'text',
      rows: 2,
      description: tokenHelp,
      validation: (rule) => [
        rule.required().custom(knownTokens),
        rule.max(160).warning('Keep it to a line or two'),
      ],
    }),
    {...orderField, description: 'Position in the patient’s day. Lower numbers come first.'},
  ],
  orderings: [byOrder],
  preview: {
    select: {title: 'title', subtitle: 'detail', order: 'order'},
    prepare: ({title, subtitle, order}) => ({
      title: order != null ? `${order}. ${title}` : title,
      subtitle,
    }),
  },
})
