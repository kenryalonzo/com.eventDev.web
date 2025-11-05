# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

DevEvents is a Next.js 16 application for discovering developer events (hackathons, meetups, conferences). Built with React 19, TypeScript, Tailwind CSS 4, and MongoDB/Mongoose for data persistence. Features PostHog analytics and custom WebGL-powered visual effects.

## Development Commands

### Core Commands
- **Development server**: `npm run dev` (runs on http://localhost:3000)
- **Build**: `npm run build`
- **Production server**: `npm start`
- **Linting**: `npm run lint` (uses ESLint 9 with Next.js config)

### Component Management
- **shadcn/ui components**: Install via `npx shadcn@latest add <component-name>`
- shadcn configured with "new-york" style, CSS variables enabled, Lucide icons

## Architecture

### Application Structure
- **Next.js App Router**: Uses the `app/` directory with server components by default
- **Path Aliases**: `@/*` maps to project root (configured in tsconfig.json)
- **Font Loading**: Two Google Fonts loaded in root layout:
  - `Schibsted_Grotesk` (variable: `--font-schibsted-grotesk`) - primary UI font
  - `Martian_Mono` (variable: `--font-martian-mono`) - monospace font

### Key Directories
```
app/              # Next.js app router (layout, pages)
components/       # React components (UI building blocks)
lib/              # Utilities and shared logic
  - mongodb.ts    # Database connection with caching
  - constants.ts  # Static data (events array)
  - utils.ts      # Utility functions (cn for className merging)
public/           # Static assets
  - icons/        # SVG icons
  - images/       # Event images
```

### Data Layer
**MongoDB Connection** (`lib/mongodb.ts`):
- Global connection caching to prevent hot-reload connection leaks
- Requires `MONGODB_URI` environment variable
- Connection shared across requests in production
- Auto-reconnect logic with error handling

**Current State**: Events are hardcoded in `lib/constants.ts` (12 static events). MongoDB connection is set up but not yet integrated with database models.

### Visual Effects Architecture
**LightRays Component** (`components/LightRays.tsx`):
- Custom WebGL shader-based animated light rays using OGL library
- Implements intersection observer for performance (only renders when visible)
- Mouse interaction with smoothed tracking
- Configurable parameters: ray origin, color, speed, spread, length, distortion, noise
- Manual cleanup of WebGL contexts to prevent memory leaks
- Applied as full-screen background effect in root layout

### Analytics Integration
**PostHog** (instrumentation-client.ts):
- Client-side analytics initialized with `NEXT_PUBLIC_POSTHOG_KEY`
- API requests proxied through `/ingest/*` routes (configured in next.config.ts)
- Debug mode enabled in development
- Exception tracking enabled

### Styling System
**Tailwind CSS 4** with custom configuration:
- PostCSS-based build (`@tailwindcss/postcss`)
- CSS variables for theming (defined in `app/globals.css`)
- Custom utilities:
  - `flex-center`: Flex container with centered items
  - `text-gradient`: Blue-to-white gradient text effect
  - `glass`: Glassmorphism effect for UI elements
  - `card-shadow`: Consistent shadow for cards
- Color scheme: Dark theme with primary color `#59deca` (cyan)
- Animation library: `tw-animate-css` integrated

### Component Patterns
**EventCard**: Links to `/events/[slug]` routes (not yet implemented - returns 404)
**Layout Structure**: 
- Sticky glassmorphic navbar at top
- Full-screen LightRays background (z-index -1)
- Main content container with responsive padding

## Environment Variables

Required variables (store in `.env`):
```
MONGODB_URI=<mongodb connection string>
NEXT_PUBLIC_POSTHOG_KEY=<posthog project key>
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

**IMPORTANT**: Never commit the `.env` file. The `.gitignore` is configured to exclude it.

## TypeScript Configuration
- **Target**: ES2017
- **Strict mode**: Enabled
- **JSX**: `react-jsx` (React 19 automatic JSX runtime)
- **Module resolution**: `bundler` (optimized for Next.js)
- No custom type checking scripts - rely on IDE and build-time checking

## Known Issues & Incomplete Features
1. Event detail pages (`/events/[slug]`) not implemented - EventCard links to non-existent routes
2. NavBar links are placeholders (all point to `/`)
3. Events are hardcoded in constants.ts - MongoDB integration pending
4. No database models/schemas defined yet despite mongoose dependency
5. ExploreBtn has typo: `id="eplore-btn"` (missing 'x')
6. NavBar structure has incorrect nesting: `<ul>` inside `<Link>` instead of sibling
