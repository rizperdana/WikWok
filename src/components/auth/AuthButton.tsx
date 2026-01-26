'use client';

import { useState } from 'react';
import { useAuth } from './AuthContext';
import { AuthModal } from './AuthModal';
import { ProfileModal } from './ProfileModal';
import { User, LogIn } from 'lucide-react';

export function AuthButton() {
  const { user, loading } = useAuth();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  if (loading) return null;

  return (
    <>
      <button
        onClick={() => {
          if (user) {
            setIsProfileOpen(true);
          } else {
            setIsAuthOpen(true);
          }
        }}
        className="fixed top-6 right-6 z-[999] flex items-center justify-center w-[50px] h-[50px] rounded-full bg-black/60 backdrop-blur-2xl border border-white/20 text-white shadow-[0_20px_50px_-10px_rgba(0,0,0,0.8)] hover:bg-white/20 transition-all active:scale-95 group focus:outline-none"
      >
        {user ? <User size={20} /> : <LogIn size={20} />}
      </button>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </>
  );
}
