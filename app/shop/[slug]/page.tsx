import { redirect } from 'next/navigation';

export default function ShopSlugRedirect({ params }: { params: { slug: string } }) {
  redirect(`/category/${params.slug}`);
}
