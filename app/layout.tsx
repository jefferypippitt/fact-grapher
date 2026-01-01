import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Providers from "@/components/providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Fact Grapher - AI-Powered Infographics in Seconds",
    template: "%s | Fact Grapher",
  },
  description:
    "Create beautiful, professional infographics in seconds with AI. Generate timeline visualizations, statistical charts, and data-driven graphics instantly.",
  keywords: [
    "infographics",
    "AI",
    "data visualization",
    "timeline",
    "charts",
    "graphics",
    "visual content",
  ],
  authors: [{ name: "Fact Grapher" }],
  creator: "Fact Grapher",
  publisher: "Fact Grapher",
  metadataBase: new URL("https://factgrapher.xyz"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Fact Grapher",
    title: "Fact Grapher - AI-Powered Infographics in Seconds",
    description:
      "Create beautiful, professional infographics in seconds with AI. Generate timeline visualizations, statistical charts, and data-driven graphics instantly.",
    images: [
      {
        url: "/FG-logo.png",
        width: 1200,
        height: 630,
        alt: "Fact Grapher Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fact Grapher - AI-Powered Infographics in Seconds",
    description:
      "Create beautiful, professional infographics in seconds with AI.",
    images: ["/FG-logo.png"],
    creator: "@factgrapher",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon1.png", type: "image/png" },
      { url: "/icon0.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/manifest.json",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add verification codes here when available
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
