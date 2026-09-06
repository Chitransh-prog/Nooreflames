import { redirect } from 'next/navigation';

export default function ProductIndexPage() {
  // Redirect to flagship product
  redirect('/product/prod-9');
}
