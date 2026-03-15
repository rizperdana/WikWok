'use client';

import { useState, useEffect, useCallback } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface PWAInstallState {
  isInstallable: boolean;
  isInstalled: boolean;
  canShowBanner: boolean;
  canShowButton: boolean;
  isInstalling: boolean;
  install: () => Promise<void>;
  dismissBanner: () => void;
}

const STORAGE_KEY = 'pwa_install_dismissed';

export function usePWAInstall(): PWAInstallState {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [hasDismissed, setHasDismissed] = useState(false);

  // Check if app is already installed
  const checkIsInstalled = useCallback(() => {
    if (typeof window === 'undefined') return false;
    
    // Check display-mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isStandaloneIOS = (navigator as unknown as { standalone?: boolean }).standalone === true;
    
    return isStandalone || isStandaloneIOS;
  }, []);

  // Check localStorage for dismissed state
  const checkDismissed = useCallback(() => {
    if (typeof window === 'undefined') return false;
    try {
      return localStorage.getItem(STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Initial checks
    setIsInstalled(checkIsInstalled());
    setHasDismissed(checkDismissed());

    // Listen for beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    // Listen for app installed
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    // Check on focus (user might install from another tab)
    const handleFocus = () => {
      setIsInstalled(checkIsInstalled());
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('focus', handleFocus);
    };
  }, [checkIsInstalled, checkDismissed]);

  const install = useCallback(async () => {
    if (!deferredPrompt) return;

    setIsInstalling(true);
    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true);
      }
    } catch (error) {
      console.error('Failed to install PWA:', error);
    } finally {
      setIsInstalling(false);
      setDeferredPrompt(null);
    }
  }, [deferredPrompt]);

  const dismissBanner = useCallback(() => {
    setHasDismissed(true);
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
    } catch {
      // localStorage not available
    }
  }, []);

  const isInstallable = !!deferredPrompt && !isInstalled;
  
  // Show banner on mobile (not desktop) when installable and not dismissed
  const canShowBanner = isInstallable && !hasDismissed;
  
  // Show button on desktop when installable
  const canShowButton = isInstallable;

  return {
    isInstallable,
    isInstalled,
    canShowBanner,
    canShowButton,
    isInstalling,
    install,
    dismissBanner,
  };
}
