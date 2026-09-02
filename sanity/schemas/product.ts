import { defineType, defineField } from 'sanity';

export const product = defineType({
  name: 'product',
  title: 'Products',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Product Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle / Fragrance Notes',
      type: 'string',
    }),
    defineField({
      name: 'price',
      title: 'Price (INR)',
      type: 'number',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'originalPrice',
      title: 'Original Price (INR)',
      type: 'number',
    }),
    defineField({
      name: 'rating',
      title: 'Rating (e.g. 4.9)',
      type: 'number',
      initialValue: 4.9,
    }),
    defineField({
      name: 'reviewsCount',
      title: 'Reviews Count (e.g. 142)',
      type: 'number',
      initialValue: 120,
    }),
    defineField({
      name: 'badge',
      title: 'Badge (e.g. BESTSELLER, NEW, LIMITED)',
      type: 'string',
    }),
    defineField({
      name: 'image',
      title: 'Product Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'category',
      title: 'Category / Collection Section',
      type: 'string',
      options: {
        list: [
          { title: 'Oceanic & Fresh Blends (Section 1)', value: 'ocean-fresh' },
          { title: 'Rose & Floral Perfumes (Section 2)', value: 'floral-rose' },
          { title: 'Royal Oud & Amber (Section 3)', value: 'royal-oud' },
          { title: 'Artisanal Attars', value: 'attars' },
          { title: 'Soy Wax Candles', value: 'candles' },
          { title: 'Discovery Sets', value: 'discovery' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
});
