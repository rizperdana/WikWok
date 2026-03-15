# Spec: pwa-install-spec

Scope: feature

# PWA Install Feature - Specification

## Overview
Add PWA (Progressive Web App) install functionality to allow users to install Wikwok on their Android devices. Features a dismissible top banner on mobile, install option in mobile menu, and install button on desktop.

---

## UI/UX Specification

### 1. Mobile Install Banner

**Position:** Fixed at top, below any system status bars
- `top: 0`
- `left: 0`
- `right: 0`
- `z-index: 998` (below region selector which is 999)

**Appearance:**
- Background: `#111111` (slightly lighter than app background)
- Border-bottom: `1px solid rgba(255,255,255,0.1)`
- Padding: `12px 16px`
- Display: `flex`, `align-items: center`, `justify-content: space-between`
- Gap: `12px`

**Content:**
- App icon: `24x24px` from `/wikwok-icon.svg`
- Text: "Install Wikwok for a better experience"
- Font: `14px`, weight `500`, color `white`

**Buttons:**
- Install CTA button:
  - Background: `#2563eb` (cerulean-600)
  - Text: "Install", `12px`, weight `700`, color `white`
  - Padding: `8px 16px`
  - Border-radius: `9999px` (full rounded)
  - Hover: `scale(0.98)`, background `#1d4ed8`
  
- Close (X) button:
  - Background: `transparent`
  - Icon: `X`, `20px`, color `white/40`
  - Hover: color `white/80`
  - Padding: `4px`

**Behavior:**
- Only shows on mobile viewport (`max-width: 1023px`)
- Hidden if user has previously dismissed (localStorage key: `pwa_install_dismissed`)
- Hidden if app is already installed
- Hidden if browser doesn't support PWA or install prompt not available

### 2. Desktop Install Button

**Position:** In desktop sidebar, below navigation links, above the copyright footer

**Appearance:**
- Container: Same styling as `SidebarItem`
- Background: `rgba(37, 99, 235, 0.1)` (cerulean with opacity)
- Border: `1px solid rgba(37, 99, 235, 0.3)`
- Icon: Download icon from lucide-react, `20px`, color `#2563eb`
- Text: "Install App", `14px`, weight `600`, color `white`
- Padding: `12px 16px`
- Border-radius: `12px`

**States:**
- Default: As described above
- Hover: Background `rgba(37, 99, 235, 0.2)`, scale `0.98`
- Hidden: If app already installed or install not available
- Loading: Show spinner while processing

### 3. Mobile Menu Install Option

**Position:** In the "More" menu sheet (MobileMenuLink style)

**Appearance:**
- Same as `MobileMenuLink` component styling
- Icon: Download icon from lucide-react, `20px`
- Icon container: `p-3 bg-cerulean-500/20 rounded-full text-cerulean-400`
- Label: "Install App"
- Grid position: Add as first item in the menu grid (before "About")

---

## Functionality Specification

### usePWAInstall Hook

**Location:** `src/lib/hooks/usePWAInstall.ts`

**Exports:**
```typescript
interface PWAInstallState {
  isInstallable: boolean;      // Browser supports and can install
  isInstalled: boolean;        // App is currently installed
  canShowBanner: boolean;      // Can show mobile banner
  canShowButton: boolean;      // Can show desktop button
  isInstalling: boolean;       // Currently processing install
  install: () => Promise<void>; // Trigger install prompt
  dismissBanner: () => void;   // Mark banner as dismissed
}
```

**Behavior:**
1. On mount, check `display-mode` in navigator or `window.matchMedia('(display-mode: standalone)')` to detect if already installed
2. Listen for `beforeinstallprompt` event on `window` - this fires when browser can install
3. Check localStorage for `pwa_install_dismissed` - if true, don't show banner
4. Provide `install()` function that:
   - Calls `event.preventDefault()` on the stored beforeinstallprompt event
   - Shows the install dialog via `event.prompt()`
   - Waits for user response
   - On success (user accepted), sets `isInstalled` to true
5. Provide `dismissBanner()` that sets localStorage key

### localStorage Keys
- `pwa_install_dismissed`: Set to `true` when user closes the banner

---

## Configuration Updates

### next.config.ts

Update `withPWAConfig` to include proper manifest fields:

```typescript
const withPWAConfig = withPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
  manifest: {
    name: 'Wikwok',
    short_name: 'Wikwok',
    description: 'TikTok-style discovery engine for Wikipedia',
    theme_color: '#000000',
    background_color: '#000000',
    display: 'standalone',
    orientation: 'portrait',
    scope: '/',
    start_url: '/',
    icons: [
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png'
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png'
      }
    ]
  }
});
```

---

## Component Files to Create

1. **`src/lib/hooks/usePWAInstall.ts`** - Custom hook (80-100 lines)
2. **`src/components/PWAInstallBanner.tsx`** - Mobile banner component (~60 lines)
3. **`src/components/PWAInstallButton.tsx`** - Desktop button component (~40 lines)

---

## Integration Points

### Feed.tsx Modifications

1. Import the hook and components:
```typescript
import { usePWAInstall } from '@/lib/hooks/usePWAInstall';
import { PWAInstallBanner } from '@/components/PWAInstallBanner';
import { PWAInstallButton } from '@/components/PWAInstallButton';
import { Download } from 'lucide-react';
```

2. Initialize hook:
```typescript
const { canShowBanner, canShowButton, install, dismissBanner, isInstalling } = usePWAInstall();
```

3. Add banner after the motion.div top controls (line ~180):
```tsx
{canShowBanner && (
  <PWAInstallBanner onInstall={install} onDismiss={dismissBanner} isInstalling={isInstalling} />
)}
```

4. Add button in desktop sidebar (around line 290, after nav links):
```tsx
{canShowButton && (
  <div className="mt-4">
    <PWAInstallButton onInstall={install} isLoading={isInstalling} />
  </div>
)}
```

5. Add install option to mobile menu (around line 400):
```tsx
<button
  onClick={async () => { setIsMobileMenuOpen(false); await install(); }}
  className="flex flex-col items-center gap-3 p-4 bg-cerulean-500/10 rounded-2xl text-cerulean-400 hover:bg-cerulean-500/20 transition-colors"
>
  <div className="p-3 bg-cerulean-500/20 rounded-full">
    <Download size={20} />
  </div>
  <span className="text-sm font-bold">Install App</span>
</button>
```

---

## Edge Cases

1. **iOS Safari:** Does not support beforeinstallprompt. Banner/button will not show (isInstallable = false)
2. **Already installed:** Check on mount and on focus event
3. **User dismisses banner:** Remember in localStorage, don't show again
4. **Install fails:** Show error state, allow retry
5. **Multiple tabs:** Each tab gets own install event, handle appropriately
6. **SSR/hydration:** Ensure hook only runs on client

---

## Acceptance Criteria

- [ ] Mobile banner appears on first visit (if supported)
- [ ] Banner can be dismissed with X button
- [ ] Dismissal is remembered in localStorage
- [ ] Banner does NOT appear after dismiss or install
- [ ] Desktop install button appears in sidebar
- [ ] Mobile "More" menu has install option
- [ ] Tapping install opens native PWA install dialog
- [ ] After successful install, all prompts are hidden
- [ ] Works on Chrome/Edge Android (supports beforeinstallprompt)
- [ ] Gracefully hidden on iOS (no support) and desktop Chrome if already installed