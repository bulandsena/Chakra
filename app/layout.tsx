import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CHAKRA — Create • Sell • Earn | Multi-Vendor Sovereign Marketplace',
  description:
    'CHAKRA is India’s sovereign multi-vendor marketplace for digital products, eBooks, educational notes, design templates, and artisan crafts with 90% creator payouts and instant Razorpay UPI.',
  openGraph: {
    title: 'CHAKRA — Create • Sell • Earn | Multi-Vendor Sovereign Marketplace',
    description:
      'India’s sovereign marketplace for eBooks, PDF notes, courses, templates, and handcrafted heritage arts. 90% creator earnings, 3% affiliate commission, transparent 10% platform split.',
    type: 'website',
    siteName: 'CHAKRA',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CHAKRA — Create • Sell • Earn',
    description:
      'India’s sovereign multi-vendor marketplace for eBooks, digital goods, and artisan crafts.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'CHAKRA Multi-Vendor Marketplace',
    url: 'https://chakra-marketplace.in',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'All',
    description:
      'Multi-vendor marketplace for digital products, eBooks, courses, templates, and handcrafted physical goods with instant UPI payouts.',
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'INR',
      lowPrice: '49',
      highPrice: '99999',
    },
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body suppressHydrationWarning className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
