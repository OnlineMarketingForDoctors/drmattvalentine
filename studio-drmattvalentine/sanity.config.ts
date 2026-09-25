import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {FIXED_TYPES, schemaTypes} from './schemaTypes'
import {structure} from './structure'

export default defineConfig({
  name: 'default',
  title: 'Dr Matt Valentine',

  projectId: 'p6evl32l',
  dataset: 'production',

  plugins: [structureTool({structure}), visionTool()],

  schema: {
    types: schemaTypes,
    // Fixed documents are reached from the structure, never created from "New document".
    templates: (templates) => templates.filter(({schemaType}) => !FIXED_TYPES.has(schemaType)),
  },

  document: {
    actions: (actions, {schemaType}) =>
      FIXED_TYPES.has(schemaType)
        ? actions.filter(
            ({action}) => action && ['publish', 'discardChanges', 'restore'].includes(action),
          )
        : actions,
  },
})
