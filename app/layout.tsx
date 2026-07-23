import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: {
    default: "PNG Tenders & Jobs",
    template: "%s | PNG Tenders & Jobs",
  },
  description:
    "Browse government tenders and job vacancies across Papua New Guinea. Centralised listings updated daily.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://png-tenders.vercel.app"
  ),
  openGraph: {
    type: "website",
    siteName: "PNG Tenders & Jobs",
    title: "PNG Tenders & Jobs",
    description:
      "Browse government tenders and job vacancies across Papua New Guinea.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PNG Tenders & Jobs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PNG Tenders & Jobs",
    description:
      "Browse government tenders and job vacancies across Papua New Guinea.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
