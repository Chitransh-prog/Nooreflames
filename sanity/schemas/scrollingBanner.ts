import { defineType, defineField } from 'sanity';

export const scrollingBanner = defineType({
  name: 'scrollingBanner',
  title: 'Scrolling Text Banner',
  type: 'document',
  fields: [
    defineField({
      name: 'bannerTextItems',
      title: 'Banner Ticker Items',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'speed',
      title: 'Scroll Duration (seconds)',
      type: 'number',
      initialValue: 20,
    }),
  ],
});
