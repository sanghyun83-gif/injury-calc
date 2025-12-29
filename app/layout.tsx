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
  title: `${SITE.name} | Free Settlement Calculator 2025`,
  description: SITE.description,
  keywords: [
    "personal injury calculator",
    "settlement calculator",
    "injury settlement",
    "car accident settlement",
    "pain and suffering calculator",
    "injury compensation",
    "insurance claim calculator",
  ],
  openGraph: {
    title: "Free Personal Injury Settlement Calculator 2025",
    description: "Calculate the value of your injury claim. Free calculator for car accidents, slip and fall, and more.",
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
