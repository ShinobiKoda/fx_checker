import type { Metadata } from "next";
import { JetBrains_Mono, Geist } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { cn } from "@/lib/utils";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "sonner";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains_mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://fx-checker-pied.vercel.app/"),
  title: {
    default: "FX Checker - Live Exchange Rates & Currency Converter",
    template: "%s | FX Checker",
  },
  description: "Check live exchange rates, compare currencies, track historical data, and monitor your conversion logs seamlessly with FX Checker.",
  keywords: [
    "currency converter", 
    "exchange rates", 
    "fx checker", 
    "foreign exchange", 
    "live rates", 
    "forex", 
    "money transfer", 
    "currency exchange",
    "historical exchange rates"
  ],
  authors: [{ name: "FX Checker" }],
  creator: "FX Checker",
  publisher: "FX Checker",
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
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://fxchecker.com",
    title: "FX Checker - Live Exchange Rates & Currency Converter",
    description: "Check live exchange rates, compare currencies, track historical data, and monitor your conversion logs seamlessly.",
    siteName: "FX Checker",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "FX Checker - Live Exchange Rates",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FX Checker - Live Exchange Rates & Currency Converter",
    description: "Check live exchange rates, compare currencies, track historical data, and monitor your conversion logs seamlessly.",
    images: ["/images/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "FX Checker",
  "description": "Live exchange rates, currency conversion, and historical data tracking.",
  "url": "https://fx-checker-pied.vercel.app",
  "applicationCategory": "FinanceApplication",
  "operatingSystem": "All",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "h-full",
        "antialiased",
        jetBrainsMono.variable,
        geist.variable,
      )}
    >
      <body className="h-full bg-neutral-900 text-neutral-50">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Providers>{children}</Providers>
        <Analytics />
        <Toaster position="top-right" theme="system" />
      </body>
    </html>
  );
}
