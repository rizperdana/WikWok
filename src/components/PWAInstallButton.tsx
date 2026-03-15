'use client';

import { Download } from 'lucide-react';

interface PWAInstallButtonProps {
  onInstall: () => Promise<void>;
  isLoading: boolean;
}

export function PWAInstallButton({ onInstall, isLoading }: PWAInstallButtonProps) {
  return (
    <button
      onClick={onInstall}
      disabled={isLoading}
      className="w-full flex items-center gap-3 px-4 py-3 bg-cerulean-500/10 border border-cerulean-500/30 hover:bg-cerulean-500/20 rounded-xl transition-all active:scale-[0.98] disabled:opacity-50"
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-cerulean-500/30 border-t-cerulean-500 rounded-full animate-spin" />
      ) : (
        <Download size={20} className="text-cerulean-500" />
      )}
      <span className="text-sm font-semibold text-white">
        {isLoading ? 'Installing...' : 'Install App'}
      </span>
    </button>
  );
}
