---
plan name: static-wiki-optimization
plan description: Remove Supabase auth and create optimized static Wikipedia app
plan status: active
---

## Idea
Transform Wikwok into a blazing-fast static Wikipedia article app without Supabase authentication, optimized for TikTok-level performance on Vercel and Cloudflare Pages with aggressive caching, image optimization, and minimal bundle size.

## Implementation
- Phase 1: Remove Supabase Dependencies - Remove @supabase/supabase-js, supabase CLI, pg from package.json and update scripts
- Phase 2: Delete Authentication System - Remove AuthButton, AuthModal, ProfileModal, AuthContext components and all auth-related imports
- Phase 3: Remove Auth API Routes - Delete /api/auth/login, /api/auth/signup, /api/auth/logout route files
- Phase 4: Remove Comments System - Delete CommentSheet component, /api/comments route, and all comment-related functionality
- Phase 5: Simplify WikiCard - Remove like, comment, bookmark, share buttons and all interaction logic from WikiCard component
- Phase 6: Update Feed Component - Remove AuthButton, ProfileOverlay references, and simplify navigation to remove user profile features
- Phase 7: Remove Supabase Configuration - Delete lib/supabase/client.ts, lib/supabase/server.ts files
- Phase 8: Clean Environment Variables - Remove NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, and Supabase-related env vars from .env files
- Phase 9: Delete Database Migrations - Remove supabase/ directory and all migration files
- Phase 10: Optimize Image Loading - Implement progressive image loading with blur placeholders, WebP format, and aggressive preloading strategy
- Phase 11: Add Response Caching - Implement Redis/memory caching for Wikipedia API responses with intelligent cache invalidation
- Phase 12: Optimize Bundle Size - Enable code splitting, tree shaking, and dynamic imports for heavy components
- Phase 13: Configure Vercel Deployment - Add vercel.json with optimal caching headers, image optimization, and function timeouts
- Phase 14: Configure Cloudflare Pages - Add _headers file for caching rules and optimize for Cloudflare Images
- Phase 15: Implement PWA Features - Add service worker for offline article caching and app shell caching
- Phase 16: Add Performance Monitoring - Implement Core Web Vitals tracking and error monitoring
- Phase 17: Security Hardening - Configure CSP headers, input validation, and API rate limiting
- Phase 18: Testing and Validation - Test performance metrics, Lighthouse scores, and cross-platform deployment

## Required Specs
<!-- SPECS_START -->
- static-wiki-app
<!-- SPECS_END -->