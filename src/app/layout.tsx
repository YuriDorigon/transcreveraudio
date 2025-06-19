
import type { Metadata, Viewport } from 'next';
import { Toaster } from "@/components/ui/toaster";
import MetaFooter from '@/components/layout/meta-footer';
import './globals.css';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:9002'; // Fallback for local dev

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Kennedy Promotora - Soluções Financeiras',
    template: '%s | Kennedy Promotora',
  },
  description: 'Kennedy Promotora de Crédito - Especialistas em realizar seus sonhos financeiros. Empréstimos, financiamentos e consultoria personalizada para aposentados, pensionistas e servidores públicos.',
  keywords: ['empréstimo consignado', 'crédito para aposentados', 'crédito para servidores públicos', 'portabilidade de crédito', 'antecipação FGTS', 'soluções financeiras', 'Kennedy Promotora'],
  openGraph: {
    title: 'Kennedy Promotora - Soluções Financeiras',
    description: 'Kennedy Promotora de Crédito - Especialistas em realizar seus sonhos financeiros.',
    url: SITE_URL,
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Kennedy Promotora',
    images: [
      {
        url: `${SITE_URL}/og-image.png`, // Assume you'll add an og-image.png to your /public folder
        width: 1200,
        height: 630,
        alt: 'Kennedy Promotora - Soluções Financeiras',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kennedy Promotora - Soluções Financeiras',
    description: 'Kennedy Promotora de Crédito - Especialistas em realizar seus sonhos financeiros.',
    // site: '@yourtwitterhandle', // Optional: add your Twitter handle
    // creator: '@yourtwitterhandle', // Optional
    images: [`${SITE_URL}/twitter-image.png`], // Assume you'll add a twitter-image.png to /public
  },
  icons: {
    icon: '/icon.png', // Main favicon
    shortcut: '/icon.png',
    apple: '/apple-icon.png', // Assume you'll add apple-icon.png to /public
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/site.webmanifest', // Assume you'll add site.webmanifest to /public
  alternates: {
    canonical: SITE_URL,
  },
};

export const viewport: Viewport = {
  themeColor: '#0F0F0F', // Corresponds to --background HSL(0 0% 6%)
  colorScheme: 'dark',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@700&display=swap"
          rel="stylesheet"
          media="print" 
          // @ts-ignore
          onLoad="this.media='all'"
        />
        <noscript>
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@700&display=swap"
            rel="stylesheet"
          />
        </noscript>
         {/* Add other preconnect/preload links if needed */}
         {/* <link rel="preload" href="/important-image.jpg" as="image" /> */}
      </head>
      <body className="font-body antialiased bg-background text-foreground">
        {children}
        <Toaster />
        <MetaFooter />
      </body>
    </html>
  );
}
