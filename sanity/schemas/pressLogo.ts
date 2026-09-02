import { defineType, defineField } from 'sanity';

export const pressLogo = defineType({
  name: 'pressLogo',
  title: 'Press & Media Partner Logos (Section 10)',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Publication / Brand Name (e.g. Nykaa, GQ, Vogue)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'logo',
      title: 'Logo Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      initialValue: 1,
    }),
  ],
});
