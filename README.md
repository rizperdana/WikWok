# Wikwok

A mobile-first Wikipedia discovery engine that brings random Wikipedia articles to users in an engaging, swipeable feed format.

## Features

- **Swipeable Article Feed** — Browse random Wikipedia articles in an infinite-scroll, mobile-friendly feed
- **Multi-Language Support** — Access Wikipedia in 10+ languages with automatic location-based detection
- **Search** — Find articles on any topic across Wikipedia
- **Trending Topics** — Discover what's currently trending on Wikipedia
- **PWA-Ready** — Install as a standalone app on mobile or desktop
- **Dark Theme** — Easy on the eyes with a sleek dark interface
- **Smooth Animations** — Fluid transitions powered by Framer Motion

## Tech Stack

- **Framework**: Next.js 16
- **UI**: React 19, Tailwind CSS 4
- **Animations**: Framer Motion
- **State**: TanStack React Query
- **PWA**: next-pwa
- **Icons**: Lucide React

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Building for Production

```bash
npm run build
npm run start
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes (feed, search, wiki)
│   ├── about/             # Static pages
│   ├── page.tsx           # Main feed page
│   └── layout.tsx        # Root layout
├── components/           # React components
│   └── feed/             # Feed-related components
├── lib/                  # Utilities & services
│   ├── api/              # API utilities
│   ├── constants/       # Language configs
│   ├── hooks/           # Custom React hooks
│   ├── services/        # Wikipedia API service
│   └── utils/           # Helper functions
└── types/               # TypeScript type definitions
```

## Environment Variables

Create a `.env.local` file with any required configuration (optional).

## License

MIT
