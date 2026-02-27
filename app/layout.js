import './globals.css';

export const metadata = {
  title: 'Market Sizing Tool | TAM SAM SOM Calculator',
  description: 'Calculate your Total Addressable Market (TAM), Serviceable Available Market (SAM), and Serviceable Obtainable Market (SOM) for fundraising and strategic planning.',
  keywords: 'TAM, SAM, SOM, market sizing, startup, fundraising, market research, business planning, CQuence Health',
  openGraph: {
    title: 'CQuence Market Sizing Tool',
    description: 'Market sizing calculator for startups and investors',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
