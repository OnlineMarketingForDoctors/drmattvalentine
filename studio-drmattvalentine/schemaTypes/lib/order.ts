import {defineField} from 'sanity'

/**
 * Curated position. The site renders these lists in a deliberate order
 * (chronology, the order he covers the states, the patient's day), never
 * alphabetically, so the order is stored rather than inferred.
 */
export const orderField = defineField({
  name: 'order',
  title: 'Order',
  type: 'number',
  description:
    'Lower numbers come first (1, 2, 3…). To slot an item in, renumber the ones after it.',
  validation: (rule) => rule.required().integer().min(0),
})

export const byOrder = {
  title: 'Curated order',
  name: 'orderAsc',
  by: [{field: 'order', direction: 'asc' as const}],
}
