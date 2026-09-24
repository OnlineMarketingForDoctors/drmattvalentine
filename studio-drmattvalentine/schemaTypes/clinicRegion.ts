import {PinIcon} from '@sanity/icons/Pin'
import {defineField, defineType} from 'sanity'
import {byOrder, orderField} from './lib/order'

export const DOCTORS = [
  {title: 'Dr Matt Valentine', value: 'valentine'},
  {title: 'Dr Geoff Cashion', value: 'cashion'},
]

const STATES = ['QLD', 'NSW', 'VIC', 'TAS', 'SA', 'WA', 'NT', 'ACT']

/**
 * A heading in the clinic lists. Usually a state, but not always: Dr Cashion's
 * NSW clinics are split into Sydney and Regional New South Wales, both NSW.
 */
export const clinicRegion = defineType({
  name: 'clinicRegion',
  title: 'Clinic region',
  type: 'document',
  icon: PinIcon,
  fields: [
    defineField({
      name: 'doctor',
      title: 'Doctor',
      type: 'string',
      description: 'Who sees patients at the clinics in this region.',
      options: {list: DOCTORS, layout: 'radio'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      description:
        'As shown in the list heading, e.g. Queensland, Sydney, Regional New South Wales.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'code',
      title: 'State code',
      type: 'string',
      options: {list: STATES},
      validation: (rule) => rule.required(),
    }),
    {
      ...orderField,
      description:
        "Order within this doctor's list. Dr Valentine's is the order he covers the states, not alphabetical.",
    },
  ],
  orderings: [
    {
      title: 'Doctor, then curated order',
      name: 'doctorOrder',
      by: [
        {field: 'doctor', direction: 'desc'},
        {field: 'order', direction: 'asc'},
      ],
    },
    byOrder,
  ],
  preview: {
    select: {name: 'name', code: 'code', doctor: 'doctor', order: 'order'},
    prepare: ({name, code, doctor, order}) => ({
      title: name,
      subtitle: [order, code, DOCTORS.find((d) => d.value === doctor)?.title]
        .filter((v) => v != null)
        .join(' · '),
    }),
  },
})
