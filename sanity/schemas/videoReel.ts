import { defineType, defineField } from 'sanity';

export const videoReel = defineType({
  name: 'videoReel',
  title: 'Video Reels (Section 2)',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Reel Caption / Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'thumbnail',
      title: 'Cover Thumbnail Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'videoUrl',
      title: 'Video File URL / MP4 Link',
      type: 'url',
      description: 'Direct link to hosted MP4 video or video reel asset',
    }),
    defineField({
      name: 'videoFile',
      title: 'Video File Upload',
      type: 'file',
      options: {
        accept: 'video/*',
      },
    }),
    defineField({
      name: 'views',
      title: 'View Count / Social Tag (e.g. 45.2K views)',
      type: 'string',
    }),
    defineField({
      name: 'productLink',
      title: 'Featured Product Link / URL',
      type: 'string',
    }),
  ],
});
