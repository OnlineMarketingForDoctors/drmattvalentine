import {PinIcon} from '@sanity/icons/Pin'
import {defineField, defineType} from 'sanity'
import {DOCTORS, REGIONS} from './lib/regions'

/**
 * One clinic, for either doctor. Clinics are their own list, not part of a
 * page, because several pages show them: the home page groups Dr Valentine's
 * by state, the procedure page lists both doctors', and the clinic count
 * appears across the site. Counts are always worked out from this list.
 */
export const clinic = defineType({
  name: 'clinic',
  title: 'Clinic',
  type: 'document',
  icon: PinIcon,
  fields: [
    defineField({
      name: 'doctor',
      title: 'Doctor',
      type: 'string',
      description: 'Who sees patients at this clinic.',
      options: {list: DOCTORS.map((d) => d.value), layout: 'radio'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'region',
      title: 'Region',
      type: 'string',
      description: 'The heading this clinic is listed under. The regions are fixed.',
      options: {list: REGIONS.map((r) => ({title: `${r.title} — ${r.doctor}`, value: r.value}))},
      validation: (rule) =>
        rule.required().custom((value, ctx) => {
          const region = REGIONS.find((r) => r.value === value)
          const doctor = (ctx.document as {doctor?: string} | undefined)?.doctor
          return !region || !doctor || region.doctor === doctor
            ? true
            : `That region is in ${region.doctor}'s list`
        }),
    }),
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
      name: 'order',
      title: 'Order within its region',
      type: 'number',
      description: 'Lower numbers come first (1, 2, 3…).',
      validation: (rule) => rule.required().integer().min(0),
    }),
    defineField({
      name: 'base',
      title: 'Home base',
      type: 'boolean',
      description: 'Where Dr Valentine practises between trips. Only one clinic can be his base.',
      initialValue: false,
      hidden: ({document}) =>
        (document as {doctor?: string} | undefined)?.doctor !== 'Dr Matt Valentine',
      validation: (rule) =>
        rule.custom(async (base, ctx) => {
          if (!base) return true
          const id = ctx.document?._id.replace(/^drafts\./, '')
          const others = await ctx
            .getClient({apiVersion: '2025-01-01'})
            .fetch<number>(
              'count(*[_type == "clinic" && base == true && !(_id in [$id, "drafts." + $id]) && !(_id in path("drafts.**"))])',
              {id},
            )
          return others ? 'Another clinic is already marked as the home base' : true
        }),
    }),
  ],
  orderings: [
    {
      title: 'Doctor, region, order',
      name: 'doctorRegionOrder',
      by: [
        {field: 'doctor', direction: 'desc'},
        {field: 'region', direction: 'asc'},
        {field: 'order', direction: 'asc'},
      ],
    },
  ],
  preview: {
    select: {area: 'area', clinic: 'clinic', doctor: 'doctor', region: 'region', base: 'base'},
    prepare: ({area, clinic, doctor, region, base}) => ({
      title: base ? `${area} (home base)` : area,
      subtitle: [doctor, REGIONS.find((r) => r.value === region)?.title, clinic]
        .filter(Boolean)
        .join(' · '),
    }),
  },
})
