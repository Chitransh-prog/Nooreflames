import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import ProductDetailView from '../../../components/product/ProductDetailView';
import {
  getProductById,
  getProductByIdAsync,
  getRelatedProducts,
  getRelatedProductsAsync,
  getStoreData,
  getStoreDataAsync,
} from '../../../lib/store';

interface ProductPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const store = await getStoreDataAsync();
  const product = (await getProductByIdAsync(params.id)) || store.products[0];
  if (!product) {
    return { title: 'Product Not Found — NOOR-E-FLAMES' };
  }

  const title = product.metaTitle || `${product.title} — NOOR-E-FLAMES`;
  const description =
    product.metaDescription || product.subtitle || product.description || 'Luxury fragrance and artisanal candles handcrafted in New Delhi.';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: product.image,
          alt: product.imageAlt || product.title,
        },
      ],
    },
  };
}

export async function generateStaticParams() {
  const store = getStoreData();
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

export default async function ProductPage({ params }: ProductPageProps) {
  const store = await getStoreDataAsync();
  const product = await getProductByIdAsync(params.id);

  if (!product) {
    notFound();
  }

  const related = await getRelatedProductsAsync(product.id, 8);

  return (
    <div className="pdp-page-root" style={{ width: '100%', maxWidth: '100vw', overflowX: 'hidden' }}>
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
