import {clinic} from './clinic'
import {decorativeImage, figure, imageWithAlt, richText} from './objects'
import {pageTypes} from './pages'
import {siteSettings} from './siteSettings'
import {PAGE_TYPES} from './lib/routes'

export const schemaTypes = [
  siteSettings,
  ...pageTypes,
  clinic,
  imageWithAlt,
  decorativeImage,
  richText,
  figure,
]

/**
 * Types whose documents are a fixed set with fixed IDs: Site Settings, and
 * one page per route (lib/routes.ts). Studio cannot create, duplicate,
 * unpublish or delete them. See structure.ts.
 */
export const FIXED_TYPES = new Set<string>(['siteSettings', ...PAGE_TYPES])
