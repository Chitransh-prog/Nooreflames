import { redirect } from 'next/navigation';

export default function CollectionsRedirect({ params }: { params: { slug: string } }) {
  redirect(`/category/${params.slug}`);
}
