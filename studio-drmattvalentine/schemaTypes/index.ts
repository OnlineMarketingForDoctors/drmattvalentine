import {advantage} from './advantage'
import {appointmentStep} from './appointmentStep'
import {careerMilestone} from './careerMilestone'
import {clinic} from './clinic'
import {clinicRegion} from './clinicRegion'
import {commitment} from './commitment'
import {page} from './page'
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
  page,
]

/**
 * Types whose documents are a fixed set with fixed IDs: the two singletons,
 * and one Page per route (see lib/routes.ts). Studio cannot create, duplicate
 * or delete them. See structure.ts.
 */
export const FIXED_TYPES = ['siteSettings', 'stats', 'page']
