import type { Metadata } from "next";
import "./globals.css";
import Layout from '@/components/layout/Layout';

export const metadata: Metadata = {
  title: "Student Achievement Partners",
  description: "Observation session management system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Layout>{children}</Layout>
      </body>
    </html>
  );  
}
