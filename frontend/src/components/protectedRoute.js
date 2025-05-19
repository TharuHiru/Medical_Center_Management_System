"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProtectedRoute({ children }) {
  const [authChecked, setAuthChecked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Only run on client side
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      
      if (!token) {
        router.push('/whoAreYou');
      } else {
        setAuthChecked(true);
      }
    }
  }, [router]);

  // Render nothing during initial render or if auth fails
  if (typeof window === 'undefined' || !authChecked) {
    return null; // or <LoadingSpinner />
  }

  return children;
}