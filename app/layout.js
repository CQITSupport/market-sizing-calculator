import './globals.css';

export const metadata = {
  title: 'TAM SAM SOM Calculator | Market Sizing Tool',
  description: 'Calculate your Total Addressable Market (TAM), Serviceable Available Market (SAM), and Serviceable Obtainable Market (SOM) for fundraising and strategic planning.',
  keywords: 'TAM, SAM, SOM, market sizing, startup, fundraising, market research, business planning',
  openGraph: {
    title: 'TAM SAM SOM Calculator',
    description: 'Free market sizing calculator for startups and investors',
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
