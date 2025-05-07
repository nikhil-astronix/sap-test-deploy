'use client';

import { usePathname } from 'next/navigation';
import Layout from './Layout';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthRoute = pathname?.startsWith('/auth');

  if (isAuthRoute) {
    return <>{children}</>; // No layout
  }

  return <Layout>{children}</Layout>;
}
