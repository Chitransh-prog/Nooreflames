import { defineType, defineField } from 'sanity';

export const testimonial = defineType({
  name: 'testimonial',
  title: 'Testimonials & Customer Reviews (Section 9)',
  type: 'document',
  fields: [
    defineField({
      name: 'authorName',
      title: 'Customer / Creator Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'authorRole',
      title: 'Role / City / Handle',
      type: 'string',
      initialValue: 'Verified Buyer',
    }),
    defineField({
      name: 'quote',
      title: 'Review Quote',
      type: 'text',
    }),
    defineField({
      name: 'rating',
      title: 'Star Rating (1-5)',
      type: 'number',
      initialValue: 5,
    }),
    defineField({
      name: 'authorImage',
      title: 'Customer Photo / Video Thumbnail',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'videoUrl',
      title: 'Video Review URL (Optional)',
      type: 'url',
    }),
    defineField({
      name: 'isVideo',
      title: 'Is Video Review?',
      type: 'boolean',
      initialValue: false,
    }),
  ],
});
