import { MetadataRoute } from 'next';
import { getStoreDataAsync } from '@/lib/store';
import { getAllCategories } from '@/lib/categories';
import { BLOG_POSTS } from '@/data/blogs';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nooreflames.com';
  const now = new Date();

  // 1. Core Static Landing Pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${siteUrl}/shop`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${siteUrl}/collections`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${siteUrl}/candle-care`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/blogs`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${siteUrl}/faq`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${siteUrl}/shipping-policy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${siteUrl}/refund-policy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${siteUrl}/terms-of-service`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${siteUrl}/privacy-policy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // 2. Target Keyword Category Hubs
  const categoryHubSlugs = [
    'perfumes',
    'candles',
    'ouds',
    'attars',
    'royal-oud',
    'gift-shop',
    'discovery-sets',
    'ocean-fresh',
    'floral-rose',
    'men',
    'women',
  ];

  const categoryRoutes: MetadataRoute.Sitemap = categoryHubSlugs.map((slug) => ({
    url: `${siteUrl}/category/${slug}`,
    lastModified: now,
    changeFrequency: 'daily',
    priority: 0.9,
  }));

  // 3. Dynamic Products
  const store = await getStoreDataAsync().catch(() => null);
  const products = store?.products || [];

  const seenProductUrls = new Set<string>();
  const productRoutes: MetadataRoute.Sitemap = [];

  products.forEach((p) => {
    const slugUrl = `${siteUrl}/product/${p.slug || p.id}`;
    if (!seenProductUrls.has(slugUrl)) {
      seenProductUrls.add(slugUrl);
      productRoutes.push({
        url: slugUrl,
        lastModified: now,
        changeFrequency: 'daily',
        priority: 0.85,
      });
    }

    if (p.slug && p.id && !seenProductUrls.has(`${siteUrl}/product/${p.id}`)) {
      seenProductUrls.add(`${siteUrl}/product/${p.id}`);
      productRoutes.push({
        url: `${siteUrl}/product/${p.id}`,
        lastModified: now,
        changeFrequency: 'daily',
        priority: 0.8,
      });
    }
  });

  // 4. Blog Posts
  const blogRoutes: MetadataRoute.Sitemap = BLOG_POSTS.map((post) => ({
    url: `${siteUrl}/blogs/${post.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.75,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes, ...blogRoutes];
}
