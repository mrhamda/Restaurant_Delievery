// app/404.js
'use client'; // Ensure this is a client component

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the home page
    router.replace('/'); // Use replace to avoid adding to the browser history
  }, [router]);

  return null; // You can return null since this is just for redirection
}
