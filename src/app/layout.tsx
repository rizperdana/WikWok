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
  const pId = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID;
  const adUrl = pId ? `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-${pId.replace('pub-', '')}` : '';

  return (
    <html lang="en">
      <head>
        {adUrl && (
          <script
            async
            src={adUrl}
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body className={`${inter.className} bg-black text-white antialiased overflow-hidden`}>
        <Providers>
            {children}
        </Providers>
      </body>
    </html>
  );
}
