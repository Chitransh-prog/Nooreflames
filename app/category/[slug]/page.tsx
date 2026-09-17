import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import CategoryPageView from '../../../components/category/CategoryPageView';
import { getCategoryBySlug, getAllCategories, getCategoryProducts } from '../../../lib/categories';
import { getStoreData } from '../../../lib/store';

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = getCategoryBySlug(params.slug);
  if (!category) {
    return {
      title: 'Collection Not Found — NOOR-E-FLAMES',
    };
  }

  return {
    title: `${category.title} — NOOR-E-FLAMES`,
    description: `${category.subtitle}. ${category.description}`,
    openGraph: {
      title: `${category.title} | NOOR-E-FLAMES Atelier`,
      description: category.subtitle,
      images: [{ url: category.heroImage }],
    },
  };
}

export async function generateStaticParams() {
  const categories = getAllCategories();
  const paramsList: { slug: string }[] = [];

  categories.forEach((cat) => {
    paramsList.push({ slug: cat.slug });
  });

  // Also include standard aliases
  paramsList.push({ slug: 'him' });
  paramsList.push({ slug: 'her' });
  paramsList.push({ slug: 'gift' });
  paramsList.push({ slug: 'discovery' });

  return paramsList;
}

export const dynamic = 'force-dynamic';

export default function CategoryPage({ params }: CategoryPageProps) {
  const category = getCategoryBySlug(params.slug);

  if (!category) {
    notFound();
  }

  const store = getStoreData();
  const categoryProducts = getCategoryProducts(category, store.products);

  return (
    <div className="category-page-wrapper">
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
