import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import ProductDetailView from '../../../components/product/ProductDetailView';
import { getProductById, getRelatedProducts, getStoreData } from '../../../lib/store';

interface ProductPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = getProductById(params.id) || getStoreData().products[0];
  if (!product) {
    return { title: 'Product Not Found — NOOR-E-FLAMES' };
  }

  return {
    title: `${product.title} — NOOR-E-FLAMES`,
    description: product.subtitle || product.description || 'Luxury fragrance and artisanal candles.',
    openGraph: {
      title: `${product.title} | NOOR-E-FLAMES`,
      description: product.subtitle,
      images: [{ url: product.image }],
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

export default function ProductPage({ params }: ProductPageProps) {
  const store = getStoreData();
  const product = getProductById(params.id);

  if (!product) {
    notFound();
  }

  const related = getRelatedProducts(product.id, 8);

  return (
    <div className="pdp-page-root">
      <Navbar
        announcements={store.siteSettings.announcements}
        brandName={store.siteSettings.brandName}
      />
      <main>
        <ProductDetailView product={product} relatedProducts={related} />
      </main>
      <Footer />
    </div>
  );
}
