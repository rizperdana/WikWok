import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { GoogleAdSense } from "@/components/GoogleAdSense";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Wikwok - Discover Knowledge",
  description: "TikTok-style discovery engine for Wikipedia",
  manifest: "/manifest.json",
  other: {
    "google-adsense-account": "ca-pub-2762935447490628",
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <head>
        <GoogleAdSense />
      </head>
      <body className={`${inter.className} bg-black text-white antialiased overflow-hidden`}>
        <Providers>
            {children}
        </Providers>
      </body>
    </html>
  );
}
