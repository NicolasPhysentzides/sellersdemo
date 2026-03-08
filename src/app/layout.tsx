import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://sellerdemo.theauraservices.com";
const metaTitle = "Seller Dashboard Demo | Aura Services";
const metaDescription =
  "Interactive seller dashboard demo with sales transactions, KPI insights, admin overview, and PDF export by Aura Services.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
  },
  title: metaTitle,
  description: metaDescription,
  openGraph: {
    url: "/",
    siteName: "Seller Dashboard Demo",
    title: metaTitle,
    description: metaDescription,
    images: [
      {
        url: "/image.png",
        width: 1024,
        height: 576,
        alt: "Seller Dashboard Demo preview by Aura Services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: metaTitle,
    description: metaDescription,
    images: ["/image.png"],
  },
  icons: {
    icon: { url: "/icon", type: "image/png" },
    apple: { url: "/logo.svg", sizes: "180x180", type: "image/svg+xml" },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="el" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
