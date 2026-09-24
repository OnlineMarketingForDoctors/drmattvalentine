import {advantage} from './advantage'
import {appointmentStep} from './appointmentStep'
import {careerMilestone} from './careerMilestone'
import {clinic} from './clinic'
import {clinicRegion} from './clinicRegion'
import {commitment} from './commitment'
import {sitePage} from './sitePage'
import {siteSettings} from './siteSettings'
import {stats} from './stats'

export const schemaTypes = [
  siteSettings,
  stats,
  clinicRegion,
  clinic,
  careerMilestone,
  commitment,
  appointmentStep,
  advantage,
  sitePage,
]

/** One document each, with fixed IDs. See structure.ts. */
export const SINGLETONS = ['siteSettings', 'stats']
