import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { LinkedInWebviewRedirect } from "@/components/linkedin-webview-redirect";

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
    url: "https://sellerdemo.theauraservices.com",
    siteName: "Seller Dashboard Demo",
    title: metaTitle,
    description: metaDescription,
    images: [
      {
        url: "https://sellerdemo.theauraservices.com/image.png",
        width: 1200,
        height: 630,
        alt: "Seller Dashboard Demo preview by Aura Services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: metaTitle,
    description: metaDescription,
    images: ["https://sellerdemo.theauraservices.com/image.png"],
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
        <LinkedInWebviewRedirect />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
