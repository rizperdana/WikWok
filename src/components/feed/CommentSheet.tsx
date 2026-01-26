'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/components/auth/AuthContext';
import { X, Send, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles: {
    username: string;
    avatar_url: string | null;
  } | null;
}

interface CommentSheetProps {
  isOpen: boolean;
  onClose: () => void;
  articleUrl: string;
}

export function CommentSheet({ isOpen, onClose, articleUrl }: CommentSheetProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchComments();
    }
  }, [isOpen, articleUrl]);

  const fetchComments = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('comments')
      .select('*, profiles(username, avatar_url)')
      .eq('article_url', articleUrl)
      .order('created_at', { ascending: false });

    if (data) {
      setComments(data as any);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('comments')
        .insert({
          user_id: user.id,
          article_url: articleUrl,
          content: newComment.trim()
        });

      if (!error) {
        setNewComment('');
        fetchComments();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: '0%' }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 z-[1001] h-[70vh] bg-oxford-navy-100 rounded-t-3xl border-t border-white/10 shadow-2xl flex flex-col overflow-hidden max-w-lg mx-auto"
          >
            <div className="flex items-center justify-between p-4 border-b border-white/5">
              <h3 className="text-white font-bold text-lg">Comments</h3>
              <button
                onClick={onClose}
                className="text-white/50 hover:text-white p-2"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {loading ? (
                <div className="flex justify-center p-8">
                  <Loader2 className="animate-spin text-cerulean-500" />
                </div>
              ) : comments.length === 0 ? (
                <p className="text-white/30 text-center py-10">No comments yet. Be the first!</p>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-cerulean-500 flex items-center justify-center text-xs font-bold text-white shrink-0">
                      {comment.profiles?.username?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm font-bold text-white/90">
                          {comment.profiles?.username || 'Unknown'}
                        </span>
                        <span className="text-[10px] text-white/40">
                          {new Date(comment.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-white/80 text-sm mt-1">{comment.content}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 border-t border-white/5 bg-oxford-navy-200">
              {user ? (
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 bg-black/20 border border-white/10 rounded-full px-4 py-2 text-white focus:outline-none focus:border-cerulean-500"
                  />
                  <button
                    type="submit"
                    disabled={submitting || !newComment.trim()}
                    className="p-2 bg-cerulean-600 rounded-full text-white disabled:opacity-50 disabled:grayscale"
                  >
                    {submitting ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                  </button>
                </form>
              ) : (
                <p className="text-center text-sm text-white/50">
                  Please login to leave a comment.
                </p>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
