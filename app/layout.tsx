import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { SITE } from "./site-config";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${SITE.name} | Free DUI Cost Calculator 2025`,
  description: SITE.description,
  keywords: [
    "DUI cost calculator",
    "DWI calculator",
    "drunk driving cost",
    "DUI lawyer fees",
    "DUI insurance increase",
    "DUI fines by state",
    "SR-22 insurance",
  ],
  openGraph: {
    title: "Free DUI Cost Calculator 2025 | DUI Calculator",
    description: "Calculate the true cost of a DUI in your state. Fines, lawyer fees, insurance increases, and more.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
