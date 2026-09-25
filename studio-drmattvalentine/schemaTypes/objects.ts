import {defineArrayMember, defineField, defineType} from 'sanity'
import {knownTokens} from './lib/tokens'

/** An image with required alt text and a focal point (hotspot). */
export const imageWithAlt = defineType({
  name: 'imageWithAlt',
  title: 'Image',
  type: 'image',
  options: {hotspot: true},
  fields: [
    defineField({
      name: 'alt',
      title: 'Alt text',
      type: 'string',
      description: 'Describe what the image shows, for screen readers and search engines.',
      validation: (rule) => rule.required(),
    }),
  ],
})

/** A purely decorative image, e.g. a background texture: no alt text, hidden from screen readers. */
export const decorativeImage = defineType({
  name: 'decorativeImage',
  title: 'Background image',
  type: 'image',
  options: {hotspot: true},
})

/**
 * Paragraphs with italic, bold and links. No headings or lists: the page
 * layout supplies those, so they stay consistent.
 */
export const richText = defineType({
  name: 'richText',
  title: 'Text',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [{title: 'Paragraph', value: 'normal'}],
      lists: [],
      marks: {
        decorators: [
          {title: 'Italic', value: 'em'},
          {title: 'Bold', value: 'strong'},
        ],
        annotations: [
          defineArrayMember({
            name: 'link',
            title: 'Link',
            type: 'object',
            fields: [
              defineField({
                name: 'href',
                title: 'Link to',
                type: 'string',
                description:
                  'A path on this site ("/about/"), a full URL, or a token such as {phoneHref} or {vasectomyAustralia}. External links open in a new tab.',
                validation: (rule) =>
                  rule
                    .required()
                    .custom((v?: string) =>
                      !v || /^(\/|#|https?:\/\/|mailto:|tel:|\{)/.test(v)
                        ? true
                        : 'Start with "/", "#", "https://", "mailto:", "tel:" or a {token}',
                    ),
              }),
            ],
          }),
        ],
      },
    }),
  ],
  validation: (rule) => rule.custom(knownTokens),
})

/** A figure and its label, e.g. "{career}" / "Vasectomies performed". */
export const figure = defineType({
  name: 'figure',
  title: 'Figure',
  type: 'object',
  fields: [
    defineField({
      name: 'value',
      title: 'Figure',
      type: 'string',
      description: 'Usually a token, e.g. {career} or {clinicCount}.',
      validation: (r) => r.required().custom(knownTokens),
    }),
    defineField({name: 'label', title: 'Label', type: 'string', validation: (r) => r.required()}),
  ],
  preview: {select: {title: 'value', subtitle: 'label'}},
})
