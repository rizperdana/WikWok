# Spec: static-wiki-app

Scope: feature

# Static Wikipedia Article Serving App

## Overview
Transform the Wikwok app from a Supabase-powered social platform into a fast, secure static app that serves Wikipedia articles without user authentication, comments, likes, bookmarks, or shares. The app should load articles and images as quickly as TikTok loads videos.

## Core Requirements

### Functional Requirements
1. **Article Discovery**: Infinite scroll feed of random Wikipedia articles
2. **Language Support**: Multi-language article support with automatic geolocation-based language detection
3. **Search Functionality**: Full-text search across Wikipedia articles
4. **Article Reading**: Full-screen article reader with optimized loading
5. **Responsive Design**: Mobile-first design optimized for touch interactions

### Performance Requirements
1. **Lightning Fast Loading**:
   - Article summaries load in <100ms
   - Images load in <200ms (cached/preloaded)
   - App startup <1 second
   - Infinite scroll seamless (no loading spinners >500ms)

2. **Resource Optimization**:
   - Aggressive image preloading and caching
   - Wikipedia API response caching
   - Lazy loading for non-visible content
   - Minimal JavaScript bundle size

3. **CDN Optimization**:
   - Deployable on Vercel and Cloudflare Pages
   - Automatic image optimization and WebP conversion
   - Global CDN distribution for instant loading worldwide

### Security Requirements
1. **Static Security**:
   - No user data storage
   - No authentication required
   - No database connections
   - HTTPS enforced
   - Content Security Policy (CSP) headers

2. **API Security**:
   - Rate limiting on Wikipedia API calls
   - Input validation and sanitization
   - CORS properly configured

### Technical Requirements
1. **Framework**: Next.js 16 with App Router
2. **Styling**: Tailwind CSS with performance optimizations
3. **Deployment**: Vercel and Cloudflare Pages compatible
4. **PWA**: Service worker for offline article caching
5. **Analytics**: Privacy-focused analytics (optional)

## Architecture Changes

### Removed Components
- All Supabase integration
- Authentication system (AuthButton, AuthModal, ProfileModal, AuthContext)
- Comments system (CommentSheet, comments API)
- User interactions (likes, bookmarks, shares)
- User profiles and achievements
- Profile overlay and user dashboard

### Retained Components
- Feed system (useWikwokFeed, Feed component)
- Article display (WikiCard - simplified without interactions)
- Language detection and selection
- Search functionality
- Article reader
- Ad system (optional, configurable)

### New Optimizations
1. **Image Loading Strategy**:
   - Progressive image loading with blur placeholders
   - WebP format with fallbacks
   - Aggressive preloading of next articles
   - Image CDN optimization

2. **API Optimization**:
   - Wikipedia API response caching (Redis/memory)
   - Batch article fetching
   - Intelligent retry logic with backoff

3. **Bundle Optimization**:
   - Code splitting for article reader
   - Tree shaking unused components
   - Dynamic imports for heavy components

## Deployment Configuration

### Vercel Deployment
- `vercel.json` with optimal caching headers
- Image optimization enabled
- Function timeout optimizations
- Global CDN distribution

### Cloudflare Pages
- `_headers` file for caching rules
- Image optimization via Cloudflare Images
- Function optimizations
- Global CDN with edge computing

## Success Metrics
1. **Performance**:
   - First Contentful Paint <1s
   - Largest Contentful Paint <2s
   - Cumulative Layout Shift <0.1
   - First Input Delay <100ms

2. **User Experience**:
   - No loading spinners >500ms
   - Smooth infinite scroll
   - Instant search results
   - Reliable offline reading (PWA)

3. **Technical**:
   - Lighthouse score >95
   - Bundle size <200KB gzipped
   - Zero runtime errors
   - 99.9% uptime