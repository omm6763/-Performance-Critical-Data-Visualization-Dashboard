import { redirect } from 'next/navigation';

export default function HomePage() {
  // This will automatically redirect anyone visiting the root
  // to the /dashboard page.
  redirect('/dashboard');
}