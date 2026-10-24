import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import ProductDetailView from '../../../components/product/ProductDetailView';
import {
  getProductByIdAsync,
  getRelatedProductsAsync,
  getStoreDataAsync,
  type Product,
} from '../../../lib/store';

interface ProductPageProps {
  params: {
    id: string;
  };
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nooreflames.com';

function inferProductCategoryType(product: Product): {
  categoryName: string;
  categorySlug: string;
  keywords: string[];
} {
  const cat = (product.category || '').toLowerCase();
  const title = (product.title || '').toLowerCase();
  const desc = (product.description || '').toLowerCase();

  if (
    cat.includes('candle') ||
    title.includes('candle') ||
    title.includes('cupcake') ||
    title.includes('chai') ||
    title.includes('evil eye') ||
    title.includes('teddy') ||
    title.includes('berry bliss') ||
    title.includes('rose whimsy')
  ) {
    return {
      categoryName: 'Handcrafted Scented Soy Candles',
      categorySlug: 'candles',
      keywords: [
        'candles',
        'scented candles',
        'soy wax candles',
        'handcrafted candles',
        'secret message candles',
        'dessert candles',
        'luxury candles india',
        'aromatherapy candles',
        'noor-e-flames candles',
      ],
    };
  }

  if (cat.includes('oud') || title.includes('oud') || desc.includes('agarwood') || desc.includes('cambodian')) {
    return {
      categoryName: 'Royal Ouds & Agarwood Fragrances',
      categorySlug: 'ouds',
      keywords: [
        'ouds',
        'royal ouds',
        'pure oud',
        'oud perfume',
        'agarwood perfume',
        'cambodian oud',
        'oud and amber',
        'luxury oud india',
        'noor-e-flames ouds',
      ],
    };
  }

  if (cat.includes('attar') || title.includes('attar') || desc.includes('attar') || desc.includes('alcohol-free')) {
    return {
      categoryName: 'Pure Artisanal Attars',
      categorySlug: 'attars',
      keywords: [
        'attars',
        'pure attar',
        'artisanal attars',
        'alcohol-free perfume oil',
        'ittar',
        'traditional hydro-distilled attar',
        'luxury attars india',
        'noor-e-flames attars',
      ],
    };
  }

  return {
    categoryName: 'Luxury Perfumes & Extrait De Parfum',
    categorySlug: 'perfumes',
    keywords: [
      'perfumes',
      'luxury perfumes',
      'eau de parfum',
      'extrait de parfum',
      'long lasting perfumes',
      'niche fragrance india',
      'designer perfumes',
      'noor-e-flames perfumes',
    ],
  };
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const store = await getStoreDataAsync();
  const product = (await getProductByIdAsync(params.id)) || store.products[0];
  if (!product) {
    return { title: 'Product Not Found | NOOR-E-FLAMES' };
  }

  const categoryInfo = inferProductCategoryType(product);
  const title = product.metaTitle || `${product.title} — ${categoryInfo.categoryName} | NOOR-E-FLAMES`;
  const description =
    product.metaDescription ||
    product.subtitle ||
    product.description ||
    `Discover ${product.title} by NOOR-E-FLAMES Atelier. Handcrafted luxury ${categoryInfo.categorySlug} crafted with rare essences, long-lasting sillage, and master craftsmanship in New Delhi.`;

  const canonicalUrl = `${siteUrl}/product/${product.slug || product.id}`;
  const imageUrl = product.image.startsWith('http') ? product.image : `${siteUrl}${product.image}`;

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
      product.title,
      ...categoryInfo.keywords,
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
          alt: product.imageAlt || product.title,
          width: 1200,
          height: 1200,
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
  const store = await getStoreDataAsync();
  const paramsList: { id: string }[] = [];
  store.products.forEach((p) => {
    paramsList.push({ id: p.id });
    if (p.slug) {
      paramsList.push({ id: p.slug });
    }
  });
  return paramsList;
}

export const dynamic = 'force-dynamic';
export const dynamicParams = true;
export const fetchCache = 'force-no-store';
export const revalidate = 0;

export default async function ProductPage({ params }: ProductPageProps) {
  const store = await getStoreDataAsync();
  const product = await getProductByIdAsync(params.id);

  if (!product) {
    notFound();
  }

  const related = await getRelatedProductsAsync(product.id, 8);
  const categoryInfo = inferProductCategoryType(product);
  const productUrl = `${siteUrl}/product/${product.slug || product.id}`;
  const imageUrl = product.image.startsWith('http') ? product.image : `${siteUrl}${product.image}`;
  const galleryImages = (product.gallery || []).map((img) =>
    img.startsWith('http') ? img : `${siteUrl}${img}`
  );

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    image: [imageUrl, ...galleryImages],
    description: product.description || product.subtitle || `${product.title} by NOOR-E-FLAMES`,
    sku: product.sku || product.id,
    mpn: product.sku || product.id,
    brand: {
      '@type': 'Brand',
      name: 'NOOR-E-FLAMES',
    },
    category: categoryInfo.categoryName,
    offers: {
      '@type': 'Offer',
      url: productUrl,
      priceCurrency: 'INR',
      price: product.price,
      priceValidUntil: '2027-12-31',
      itemCondition: 'https://schema.org/NewCondition',
      availability: product.inStock !== false ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'NOOR-E-FLAMES',
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: String(product.rating || 4.9),
      reviewCount: String(product.reviewsCount || 28),
      bestRating: '5',
      worstRating: '1',
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
        name: categoryInfo.categoryName,
        item: `${siteUrl}/category/${categoryInfo.categorySlug}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: product.title,
        item: productUrl,
      },
    ],
  };

  return (
    <div className="pdp-page-root" style={{ width: '100%', maxWidth: '100vw', overflowX: 'hidden' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Navbar
        announcements={store.siteSettings.announcements}
        brandName={store.siteSettings.brandName}
      />
      <main style={{ width: '100%', maxWidth: '100vw', overflowX: 'hidden' }}>
        <ProductDetailView product={product} relatedProducts={related} />
      </main>
      <Footer />
    </div>
  );
}

