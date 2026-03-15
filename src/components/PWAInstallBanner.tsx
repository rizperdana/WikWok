'use client';

import { X, Download } from 'lucide-react';

interface PWAInstallBannerProps {
  onInstall: () => Promise<void>;
  onDismiss: () => void;
  isInstalling: boolean;
}

export function PWAInstallBanner({ onInstall, onDismiss, isInstalling }: PWAInstallBannerProps) {
  return (
    <div className="fixed top-0 left-0 right-0 z-[998] bg-[#111111] border-b border-white/10 px-4 py-3 md:hidden">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-6 h-6 flex-shrink-0">
            <img 
              src="/wikwok-icon.svg" 
              alt="Wikwok" 
              className="w-full h-full"
            />
          </div>
          <p className="text-sm text-white font-medium truncate">
            Install Wikwok for a better experience
          </p>
        </div>
        
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={onInstall}
            disabled={isInstalling}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-cerulean-600 hover:bg-cerulean-700 disabled:opacity-50 text-white text-xs font-bold rounded-full transition-all active:scale-95"
          >
            {isInstalling ? (
              <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Download size={12} />
                <span>Install</span>
              </>
            )}
          </button>
          
          <button
            onClick={onDismiss}
            disabled={isInstalling}
            className="p-1 text-white/40 hover:text-white/80 transition-colors"
            aria-label="Dismiss"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
