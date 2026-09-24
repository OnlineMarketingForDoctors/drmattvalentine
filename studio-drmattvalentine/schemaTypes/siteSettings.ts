import {CogIcon} from '@sanity/icons/Cog'
import {defineArrayMember, defineField, defineType} from 'sanity'

/**
 * Contact details and registration, used in the nav, footer, refer band and
 * contact page. The noindex switch is deliberately NOT here: it drives a
 * generated vercel.json and must stay in src/site.config.ts.
 */
export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  icon: CogIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Practitioner name',
      type: 'string',
      initialValue: 'Dr Matt Valentine',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'credentials',
      title: 'Post-nominals and designations',
      type: 'array',
      description:
        'Only what the practice has supplied evidence for. Ask before adding anything new.',
      of: [defineArrayMember({type: 'string'})],
      options: {
        list: [
          {title: 'FRACGP', value: 'FRACGP'},
          {
            title: 'Designated Aviation Medical Examiner',
            value: 'Designated Aviation Medical Examiner',
          },
        ],
      },
      validation: (rule) => rule.required().min(1).unique(),
    }),
    defineField({
      name: 'ahpra',
      title: 'AHPRA registration number',
      type: 'string',
      description:
        'Required by AHPRA advertising guidelines wherever his services are advertised. Shown in the footer, the home bio and the About portrait caption.',
      validation: (rule) =>
        rule
          .required()
          .regex(/^MED\d{10}$/, {name: 'AHPRA medical practitioner number (MED + 10 digits)'}),
    }),
    defineField({
      name: 'phoneLabel',
      title: 'Phone (as written)',
      type: 'string',
      description: 'The memorable form, e.g. 1800 SNIPME.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'phoneDigits',
      title: 'Phone (digits)',
      type: 'string',
      description: 'The same number as digits, spaced for reading, e.g. 1800 764 763.',
      validation: (rule) => rule.required().regex(/^[\d ]+$/, {name: 'digits and spaces'}),
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: 'facebook',
      title: 'Facebook URL',
      type: 'url',
      validation: (rule) => rule.uri({scheme: ['https']}),
    }),
    defineField({
      name: 'vasectomyAustralia',
      title: 'Vasectomy Australia URL',
      type: 'url',
      description: 'Patient-facing network site, where non-GPs are sent to book.',
      validation: (rule) => rule.required().uri({scheme: ['https']}),
    }),
  ],
  preview: {
    select: {name: 'name', ahpra: 'ahpra'},
    prepare: ({name, ahpra}) => ({
      title: 'Site settings',
      subtitle: [name, ahpra].filter(Boolean).join(' · '),
    }),
  },
})
