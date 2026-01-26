'use client';

import { useAuth } from './AuthContext';
import { X, LogOut, User as UserIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-sm bg-oxford-navy-200 border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>

            <div className="flex flex-col items-center mb-8">
              <div className="w-20 h-20 rounded-full bg-cerulean-500 flex items-center justify-center mb-4 text-white shadow-xl shadow-cerulean-500/20">
                <UserIcon size={40} />
              </div>
              <h2 className="text-xl font-bold text-white mb-1">
                {user?.email?.split('@')[0]}
              </h2>
              <p className="text-white/40 text-sm">{user?.email}</p>
            </div>

            <div className="space-y-2">
                {/* Future User Stats/Links could go here */}
            </div>

            <button
              onClick={handleSignOut}
              className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10 font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 mt-4"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
