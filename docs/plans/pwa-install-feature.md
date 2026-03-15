---
plan name: pwa-install-feature
plan description: PWA install feature implementation
plan status: active
---

## Idea
Add PWA install functionality with: 1) Top dismissible banner on mobile, 2) Install option in mobile menu, 3) Install button on desktop sidebar, 4) Remember user's install decision using localStorage. Uses beforeinstallprompt API to detect install capability and prompt availability.

## Implementation
- 1. Update next-pwa config in next.config.ts to add proper app name ('Wikwok'), short_name, and theme colors matching the app's dark theme (#000000)
- 2. Create a new usePWAInstall custom hook in src/lib/hooks/ that: a) listens for beforeinstallprompt event, b) tracks if app is already installed using navigator.standalone or display-mode, c) checks localStorage for user's previous dismiss decision, d) provides showBanner, showDesktopButton, showMobileMenu states, e) exposes install() function to trigger the PWA install dialog
- 3. Create PWAInstallBanner component for mobile top banner with: close button, install CTA button, localStorage check to not show if previously dismissed, fixed position at top with proper z-index, dark theme styling matching app
- 4. Create PWAInstallButton component for desktop sidebar with install icon/button, conditional rendering based on viewport and install availability
- 5. Add install option to mobile menu sheet (in Feed.tsx) with download icon, styled as menu link item
- 6. Integrate components into Feed.tsx: a) Add PWAInstallBanner at top of layout (above region selector), b) Add PWAInstallButton in desktop sidebar (below navigation links), c) Add install option in mobile menu sheet (MobileMenuLink style)
- 7. Test the implementation: verify banner appears on mobile, dismiss works, install button appears on desktop, install option in mobile menu, no prompts shown after successful install

## Required Specs
<!-- SPECS_START -->
- pwa-install-spec
<!-- SPECS_END -->