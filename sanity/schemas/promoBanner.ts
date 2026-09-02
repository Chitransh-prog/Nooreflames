import { defineType, defineField } from 'sanity';

export const promoBanner = defineType({
  name: 'promoBanner',
  title: 'Promotional Banner (Section 5)',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Banner Headline',
      type: 'string',
      initialValue: 'Scented Leaves Pure Blends — Discovery Set',
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtext / Description',
      type: 'string',
      initialValue: 'Explore 5 handcrafted miniature EDPs in our signature velvet luxury box.',
    }),
    defineField({
      name: 'buttonText',
      title: 'Button Label',
      type: 'string',
      initialValue: 'EXPLORE DISCOVERY SET — ₹999',
    }),
    defineField({
      name: 'buttonLink',
      title: 'Button Link',
      type: 'string',
      initialValue: '#discovery',
    }),
    defineField({
      name: 'backgroundImage',
      title: 'Banner Background Image',
      type: 'image',
      options: { hotspot: true },
    }),
  ],
});
