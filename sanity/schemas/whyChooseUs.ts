import { defineType, defineField } from 'sanity';

export const whyChooseUs = defineType({
  name: 'whyChooseUs',
  title: 'Why Choose Us (Section 8)',
  type: 'document',
  fields: [
    defineField({
      name: 'heading',
      title: 'Section Heading',
      type: 'string',
      initialValue: 'Why Choose Noor-E-Flames',
    }),
    defineField({
      name: 'subtitle',
      title: 'Subheading',
      type: 'string',
      initialValue: 'Uncompromising artisanal quality in every drop.',
    }),
    defineField({
      name: 'features',
      title: 'Feature List',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'icon', title: 'Icon (Emoji or SVG text)', type: 'string' }),
            defineField({ name: 'title', title: 'Feature Title', type: 'string' }),
            defineField({ name: 'description', title: 'Feature Description', type: 'string' }),
          ],
        },
      ],
    }),
  ],
});
