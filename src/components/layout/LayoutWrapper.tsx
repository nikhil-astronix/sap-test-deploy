'use client';

import React from "react";
import { usePathname } from 'next/navigation';
import Layout from './Layout';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthRoute = pathname?.startsWith('/auth');

  if (isAuthRoute) {
    return <>{children}</>; // No layout
  }

  return <Layout>{React.isValidElement(children) ? children : <div>{children}</div>}</Layout>;
}
