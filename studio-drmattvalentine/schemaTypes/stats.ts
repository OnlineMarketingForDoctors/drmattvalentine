import {NumberIcon} from '@sanity/icons/Number'
import {defineField, defineType} from 'sanity'

const thisYear = new Date().getFullYear()

/**
 * Figures quoted to referring GPs. One document so they cannot disagree
 * between sections; copy elsewhere refers to them by {token}.
 */
export const stats = defineType({
  name: 'stats',
  title: 'Stats',
  type: 'document',
  icon: NumberIcon,
  fields: [
    defineField({
      name: 'career',
      title: 'Career total vasectomies',
      type: 'string',
      description: 'As displayed, e.g. 25,000+. Token: {career}. Supplied by the practice.',
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
      description: 'Longest wait he aims to hold for an urgent referral. Token: {urgentWeeks}.',
      validation: (rule) => rule.required().integer().min(1).max(12),
    }),
    defineField({
      name: 'minutes',
      title: 'Procedure time (minutes)',
      type: 'number',
      description: 'Time on the table. Token: {minutes}.',
      validation: (rule) => rule.required().integer().min(5).max(120),
    }),
    defineField({
      name: 'nsvYear',
      title: 'Year of no-scalpel training',
      type: 'number',
      description: 'Trained in the no-scalpel technique in the USA. Token: {nsvYear}.',
      validation: (rule) => rule.required().integer().min(1990).max(thisYear),
    }),
    defineField({
      name: 'startYear',
      title: 'Year he started performing vasectomies',
      type: 'number',
      description: 'Under Dr Greg Silver. Token: {startYear}.',
      validation: (rule) =>
        rule
          .required()
          .integer()
          .min(1990)
          .max(thisYear)
          .custom((start, ctx) => {
            const nsv = (ctx.document as {nsvYear?: number} | undefined)?.nsvYear
            return !start || !nsv || start <= nsv || 'Cannot be after the no-scalpel training year'
          }),
    }),
  ],
  preview: {
    select: {career: 'career', cost: 'cost'},
    prepare: ({career, cost}) => ({
      title: 'Stats',
      subtitle: [career && `${career} career`, cost].filter(Boolean).join(' · '),
    }),
  },
})
