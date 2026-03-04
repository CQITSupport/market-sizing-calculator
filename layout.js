import './globals.css';

export const metadata = {
  title: 'Market Sizing Tool | TAM SAM SOM Calculator',
  description: 'Calculate your Total Addressable Market (TAM), Serviceable Available Market (SAM), and Serviceable Obtainable Market (SOM) for fundraising and strategic planning.',
  keywords: 'TAM, SAM, SOM, market sizing, startup, fundraising, market research, business planning, CQuence Health',
  openGraph: {
    title: 'Market Sizing Tool',
    description: 'Build your market, segment by segment.',
    type: 'website',
    url: 'https://tam.cquencehealth.com',
    siteName: 'CQuence Health',
    images: [
      {
        url: 'https://tam.cquencehealth.com/opengraph-image.png',
        secureUrl: 'https://tam.cquencehealth.com/opengraph-image.png',
        width: 1200,
        height: 630,
        type: 'image/png',
        alt: 'CQuence Health Market Sizing Tool',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Market Sizing Tool',
    description: 'Build your market, segment by segment.',
    images: ['https://tam.cquencehealth.com/opengraph-image.png'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta property="og:title" content="Market Sizing Tool" />
        <meta property="og:description" content="Build your market, segment by segment." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://tam.cquencehealth.com" />
        <meta property="og:site_name" content="CQuence Health" />
        <meta property="og:image" content="https://tam.cquencehealth.com/opengraph-image.png" />
        <meta property="og:image:secure_url" content="https://tam.cquencehealth.com/opengraph-image.png" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="CQuence Health Market Sizing Tool" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Market Sizing Tool" />
        <meta name="twitter:description" content="Build your market, segment by segment." />
        <meta name="twitter:image" content="https://tam.cquencehealth.com/opengraph-image.png" />
      </head>
      <body>{children}</body>
    </html>
  );
}
