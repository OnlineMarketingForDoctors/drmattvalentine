import {HomeIcon} from '@sanity/icons/Home'
import {defineField, defineType} from 'sanity'
import {orderField} from './lib/order'

/**
 * One clinic. Counts shown on the site ("18 clinics", "3 states") are derived
 * from these documents, so never write a count into copy by hand.
 */
export const clinic = defineType({
  name: 'clinic',
  title: 'Clinic',
  type: 'document',
  icon: HomeIcon,
  fields: [
    defineField({
      name: 'area',
      title: 'Area',
      type: 'string',
      description: 'What a referring GP searches for, e.g. Gold Coast, Perth — Kiara.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'clinic',
      title: 'Clinic name',
      type: 'string',
      description: 'Include the street address only where the name alone is ambiguous.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'region',
      title: 'Region',
      type: 'reference',
      to: [{type: 'clinicRegion'}],
      description: 'Also decides which doctor sees patients here.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'base',
      title: 'Home base',
      type: 'boolean',
      description: 'Where Dr Valentine practises between trips. Only one clinic can be his base.',
      initialValue: false,
      validation: (rule) =>
        rule.custom(async (base, ctx) => {
          if (!base) return true
          const doc = ctx.document as {_id: string; region?: {_ref: string}} | undefined
          const id = doc?._id.replace(/^drafts\./, '')
          const {doctor, others} = await ctx.getClient({apiVersion: '2025-01-01'}).fetch<{
            doctor?: string
            others: number
          }>(
            `{
              "doctor": *[_id == $region][0].doctor,
              "others": count(*[_type == "clinic" && base == true && !(_id in [$id, "drafts." + $id]) && !(_id in path("drafts.**"))])
            }`,
            {region: doc?.region?._ref ?? '', id},
          )
          if (doctor && doctor !== 'valentine')
            return "Only Dr Valentine's clinics have a home base"
          if (others) return 'Another clinic is already marked as the home base'
          return true
        }),
    }),
    {...orderField, description: 'Order within its region.'},
  ],
  orderings: [
    {
      title: 'Region, then curated order',
      name: 'regionOrder',
      by: [
        {field: 'region.doctor', direction: 'desc'},
        {field: 'region.order', direction: 'asc'},
        {field: 'order', direction: 'asc'},
      ],
    },
  ],
  preview: {
    select: {
      area: 'area',
      clinic: 'clinic',
      region: 'region.name',
      code: 'region.code',
      base: 'base',
      order: 'order',
    },
    prepare: ({area, clinic, region, code, base, order}) => ({
      title: base ? `${area} (home base)` : area,
      subtitle: [order, clinic, region && `${region}${code && code !== region ? ` (${code})` : ''}`]
        .filter((v) => v != null)
        .join(' · '),
    }),
  },
})
