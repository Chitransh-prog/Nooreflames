import { defineType, defineField } from 'sanity';

export const heroSlide = defineType({
  name: 'heroSlide',
  title: 'Hero Slideshow',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Slide Title',
      type: 'string',
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline / Subheading',
      type: 'string',
    }),
    defineField({
      name: 'buttonText',
      title: 'Button Label',
      type: 'string',
    }),
    defineField({
      name: 'buttonLink',
      title: 'Button URL',
      type: 'string',
    }),
    defineField({
      name: 'desktopImage',
      title: 'Desktop Banner Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'mobileImage',
      title: 'Mobile Banner Image',
      type: 'image',
      options: { hotspot: true },
    }),
  ],
});
