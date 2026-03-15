---
plan name: remove-supabase-auth
plan description: Remove Supabase auth and interactions
plan status: done
---

## Idea
Remove all Supabase integration, authentication, and user interaction features to create a static Wikipedia article serving app without user accounts, comments, likes, bookmarks, or shares.

## Implementation
- Remove Supabase dependencies from package.json and related config files
- Delete all authentication components (AuthButton, AuthModal, ProfileModal, AuthContext)
- Delete authentication API routes (login, signup, logout)
- Remove comments functionality (CommentSheet component, comments API)
- Remove interaction features from WikiCard (like, comment, bookmark, share buttons and logic)
- Remove ProfileOverlay and related user profile features
- Update Feed component to remove authentication and profile UI elements
- Remove Supabase client/server configuration files
- Delete Supabase database migrations
- Update environment configuration to remove Supabase variables
- Test the application to ensure articles still load and display properly

## Required Specs
<!-- SPECS_START -->
- static-wiki-app
<!-- SPECS_END -->