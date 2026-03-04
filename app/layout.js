import './globals.css';

export const metadata = {
  title: 'Market Sizing Tool | TAM SAM SOM Calculator',
  description: 'Calculate your Total Addressable Market (TAM), Serviceable Available Market (SAM), and Serviceable Obtainable Market (SOM) for fundraising and strategic planning. Build your market sizing, segment by segment, with geographic reach and growth projections.',
  keywords: 'TAM, SAM, SOM, market sizing, startup, fundraising, market research, business planning, CQuence Health',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta property="og:title" content="Market Sizing Tool | TAM SAM SOM Calculator" />
        <meta property="og:description" content="Calculate your Total Addressable Market (TAM), Serviceable Available Market (SAM), and Serviceable Obtainable Market (SOM) for fundraising and strategic planning. Build your market sizing, segment by segment, with geographic reach and growth projections." />
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
        <meta name="twitter:title" content="Market Sizing Tool | TAM SAM SOM Calculator" />
        <meta name="twitter:description" content="Calculate your Total Addressable Market (TAM), Serviceable Available Market (SAM), and Serviceable Obtainable Market (SOM) for fundraising and strategic planning." />
        <meta name="twitter:image" content="https://tam.cquencehealth.com/opengraph-image.png" />
      </head>
      <body>{children}</body>
    </html>
  );
}
