# TAM / SAM / SOM Market Sizing Calculator

A free, investor-ready market sizing calculator for startups. Calculate your Total Addressable Market (TAM), Serviceable Available Market (SAM), and Serviceable Obtainable Market (SOM).

## Features

- **Two TAM calculation methods**: Bottom-Up (customer × revenue) and Top-Down (market research)
- **SAM filters**: Geographic reach, target segment fit, regulatory/technical accessibility
- **SOM projections**: Market share targets with timeline
- **5-year growth projections** with configurable CAGR
- **Industry benchmarks** for B2B SaaS, B2C, Marketplace, Healthcare, and Fintech
- **Fundraising guide** with expectations by stage (Pre-Seed to Series B)
- **Copy results** to clipboard for easy sharing

## Quick Deploy

### Option 1: Vercel (Recommended)

1. Push this folder to a GitHub repository
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project" → Import your repo
4. Click "Deploy"

That's it! Vercel auto-detects Next.js and deploys in ~60 seconds.

### Option 2: Netlify

1. Push to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Click "Add new site" → "Import an existing project"
4. Select your repo
5. Build settings will be auto-detected
6. Click "Deploy"

### Option 3: Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

### Option 4: Static Export

```bash
# Build static files
npm run build

# Files are in the 'out' folder
# Upload to any static host (GitHub Pages, S3, etc.)
```

## Project Structure

```
market-sizing-app/
├── app/
│   ├── globals.css      # Tailwind styles
│   ├── layout.js        # Root layout with metadata
│   └── page.js          # Main calculator component
├── public/              # Static assets
├── next.config.js       # Next.js config (static export enabled)
├── tailwind.config.js   # Tailwind configuration
├── postcss.config.js    # PostCSS configuration
├── package.json         # Dependencies
└── README.md            # This file
```

## Customization

### Change Colors
Edit the Tailwind classes in `app/page.js`. The color scheme uses:
- Blue (`blue-*`) for TAM
- Emerald (`emerald-*`) for SAM
- Amber (`amber-*`) for SOM
- Purple (`purple-*`) for projections

### Add Your Branding
1. Update `app/layout.js` metadata for SEO
2. Add your logo to the `public/` folder
3. Modify the header section in `app/page.js`

### Add Analytics
Add your analytics script to `app/layout.js`:

```jsx
<head>
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXX"></script>
</head>
```

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Deployment**: Static export (works anywhere)

## License

MIT — use it however you'd like!
