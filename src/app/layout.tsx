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
  "https://www.sellerdemo.theauraservices.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
  },
  title: "Aura Services Demo — Πίνακας Πωλήσεων",
  description:
    "Διαδραστική demo πίνακα πωλήσεων από την Aura Services. Εξερευνήστε αναλυτικά Πωλητών, γραμμές πωλήσεων και εξαγωγές PDF.",
  openGraph: {
    url: "/",
    siteName: "Aura Services Demo",
    title: "Aura Services Demo — Πίνακας Πωλήσεων",
    description:
      "Διαδραστική demo πίνακα πωλήσεων από την Aura Services. Εξερευνήστε αναλυτικά Πωλητών, γραμμές πωλήσεων και εξαγωγές PDF.",
    images: [
      {
        url: "/image.png",
        width: 1024,
        height: 576,
        alt: "Aura Services seller dashboard preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aura Services Demo — Πίνακας Πωλήσεων",
    description:
      "Διαδραστική demo πίνακα πωλήσεων από την Aura Services. Εξερευνήστε αναλυτικά Πωλητών, γραμμές πωλήσεων και εξαγωγές PDF.",
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
