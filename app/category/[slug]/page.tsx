import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import CategoryPageView from '../../../components/category/CategoryPageView';
import { getCategoryBySlug, getAllCategories, getCategoryProducts } from '../../../lib/categories';
import { getStoreDataAsync } from '../../../lib/store';

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nooreflames.com';

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = getCategoryBySlug(params.slug);
  if (!category) {
    return {
      title: 'Collection Not Found — NOOR-E-FLAMES',
    };
  }

  const title = `${category.title} | NOOR-E-FLAMES — Handcrafted Perfumes, Candles, Ouds & Attars`;
  const description = `${category.subtitle}. ${category.description} Handcrafted luxury collections in New Delhi, India.`;
  const canonicalUrl = `${siteUrl}/category/${category.slug}`;
  const imageUrl = category.heroImage.startsWith('http')
    ? category.heroImage
    : `${siteUrl}${category.heroImage}`;

  return {
    title,
    description,
    keywords: [
      'noor-e-flames',
      'noor e flames',
      'nooreflames',
      'perfumes',
      'candles',
      'ouds',
      'attars',
      category.title.toLowerCase(),
      category.slug,
      'luxury fragrance india',
      'artisanal candles',
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'NOOR-E-FLAMES',
      locale: 'en_IN',
      type: 'website',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 800,
          alt: category.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}

export async function generateStaticParams() {
  const categories = getAllCategories();
  const paramsList: { slug: string }[] = [];

  categories.forEach((cat) => {
    paramsList.push({ slug: cat.slug });
  });

  // Target aliases for SEO keyword indexing
  const aliases = [
    'perfumes',
    'perfume',
    'edps',
    'candles',
    'candle',
    'scented-candles',
    'soy-candles',
    'ouds',
    'oud',
    'royal-ouds',
    'agarwood',
    'attars',
    'attar',
    'pure-attars',
    'gift',
    'gift-shop',
    'him',
    'her',
    'discovery',
    'oceanic',
    'rose',
  ];

  aliases.forEach((alias) => {
    if (!paramsList.some((p) => p.slug === alias)) {
      paramsList.push({ slug: alias });
    }
  });

  return paramsList;
}

export const dynamic = 'force-dynamic';

export default async function CategoryPage({ params }: CategoryPageProps) {
  const category = getCategoryBySlug(params.slug);

  if (!category) {
    notFound();
  }

  const store = await getStoreDataAsync();
  const categoryProducts = getCategoryProducts(category, store.products);
  const categoryUrl = `${siteUrl}/category/${category.slug}`;

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${category.title} — NOOR-E-FLAMES`,
    description: `${category.subtitle}. ${category.description}`,
    url: categoryUrl,
    mainEntity: {
      '@type': 'ItemList',
      name: category.title,
      numberOfItems: categoryProducts.length,
      itemListElement: categoryProducts.map((p, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${siteUrl}/product/${p.slug || p.id}`,
        name: p.title,
        image: p.image.startsWith('http') ? p.image : `${siteUrl}${p.image}`,
      })),
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Collections',
        item: `${siteUrl}/collections`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: category.title,
        item: categoryUrl,
      },
    ],
  };

  return (
    <div className="category-page-wrapper">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Navbar
        announcements={store.siteSettings.announcements}
        brandName={store.siteSettings.brandName}
      />
      <main>
        <CategoryPageView category={category} initialProducts={categoryProducts} />
      </main>
      <Footer />
    </div>
  );
}

