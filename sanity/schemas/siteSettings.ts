import { defineType, defineField } from 'sanity';

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings & Brand',
  type: 'document',
  fields: [
    defineField({
      name: 'brandName',
      title: 'Brand Name',
      type: 'string',
      initialValue: 'NOOR-E-FLAMES',
    }),
    defineField({
      name: 'announcementBarText',
      title: 'Top Announcement Text',
      type: 'string',
      initialValue: '✦ FREE TRAVEL SPRAY ON ORDERS ABOVE ₹1499 | COMPLIMENTARY SHIPPING NATIONWIDE ✦',
    }),
    defineField({
      name: 'heroHeaderTitle',
      title: 'Hero Heading',
      type: 'string',
      initialValue: 'Where Fragrance Meets Flames',
    }),
    defineField({
      name: 'metaDescription',
      title: 'SEO Meta Description',
      type: 'text',
      initialValue: 'Shop NOOR-E-FLAMES long-lasting luxury perfumes, artisanal attars, and handcrafted soy candles.',
    }),
  ],
});
