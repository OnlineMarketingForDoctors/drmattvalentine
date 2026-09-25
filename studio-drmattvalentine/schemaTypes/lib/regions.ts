/**
 * Doctors and clinic regions. Fixed in code: they never change, and the site
 * groups clinics under these headings in this order. Shared by the Studio and
 * the site (src/sanity/loaders.ts).
 *
 * A region is usually a state, but not always: Dr Cashion's NSW clinics are
 * split into Sydney and Regional New South Wales.
 */
export const DOCTORS = [
  {value: 'Dr Matt Valentine', key: 'valentine'},
  {value: 'Dr Geoff Cashion', key: 'cashion'},
] as const

export type DoctorName = (typeof DOCTORS)[number]['value']

export interface Region {
  value: string
  title: string
  code: string
  doctor: DoctorName
}

/** In display order within each doctor's list. */
export const REGIONS: Region[] = [
  {value: 'valentine-qld', title: 'Queensland', code: 'QLD', doctor: 'Dr Matt Valentine'},
  {value: 'valentine-vic', title: 'Victoria', code: 'VIC', doctor: 'Dr Matt Valentine'},
  {value: 'valentine-wa', title: 'Western Australia', code: 'WA', doctor: 'Dr Matt Valentine'},
  {value: 'cashion-sydney', title: 'Sydney', code: 'NSW', doctor: 'Dr Geoff Cashion'},
  {
    value: 'cashion-nsw',
    title: 'Regional New South Wales',
    code: 'NSW',
    doctor: 'Dr Geoff Cashion',
  },
  {value: 'cashion-vic', title: 'Victoria', code: 'VIC', doctor: 'Dr Geoff Cashion'},
  {value: 'cashion-sa', title: 'South Australia', code: 'SA', doctor: 'Dr Geoff Cashion'},
  {value: 'cashion-tas', title: 'Tasmania', code: 'TAS', doctor: 'Dr Geoff Cashion'},
]
