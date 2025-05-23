import "./globals.css";
import type { Metadata } from "next";
import LayoutWrapper from "@/components/layout/LayoutWrapper";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // Adjust weights as needed
  variable: "--font-montserrat", // Optional if using with Tailwind
});

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
    <html lang="en" className={montserrat.className}>
      <body>
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
