'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/components/auth/AuthContext';
import { X, Send, Loader2, Heart, MessageCircle, CornerDownRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Profile {
    username: string;
    avatar_url: string | null;
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  parent_id: string | null;
  depth: number;
  profiles: Profile | null;
  likes_count?: number;
  user_has_liked?: boolean;
}

interface CommentSheetProps {
  isOpen: boolean;
  onClose: () => void;
  articleUrl: string;
  articleTitle?: string;
  articleImage?: string;
}

export function CommentSheet({ isOpen, onClose, articleUrl, articleTitle, articleImage }: CommentSheetProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Replying state
  const [replyingTo, setReplyingTo] = useState<Comment | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchComments();
    }
  }, [isOpen, articleUrl, user]);

  const fetchComments = async () => {
    setLoading(true);
    // 1. Fetch Comments
    const { data: commentsData, error } = await supabase
      .from('comments')
      .select('*, profiles(username, avatar_url)')
      .eq('article_url', articleUrl)
      .order('created_at', { ascending: true }); // We sort strictly by time for nested logic usually, or sort parents then children

    if (error || !commentsData) {
        setLoading(false);
        return;
    }

    // 2. Fetch Likes for these comments (if user is logged in, check if they liked)
    // For simplicity, we'll fetch all comment_likes for this article's comments if efficient,
    // OR just fetch counts. Supabase requires a separate query or a view for counts usually.
    // For now, let's just get the raw comments and handling counts requires client side or a SQL function.
    // We will do a client-side simple fetch for "my likes"

    let myLikes: Set<string> = new Set();
    if (user) {
        const { data: likesData } = await supabase
            .from('comment_likes')
            .select('comment_id')
            .eq('user_id', user.id)
            .in('comment_id', commentsData.map(c => c.id));

        if (likesData) {
            likesData.forEach(l => myLikes.add(l.comment_id));
        }
    }

    // 3. Transform and Structure
    // A simple approach for threading:
    // - Separate Parents and Children
    // - Re-order array: Parent -> Children -> Next Parent

    // Simplification: Just getting counts is hard without a view.
    // Valid strategy: iterate and count manually if scale is small, or just show simple UI.
    // We will implement `user_has_liked` correctly.

    const formatted: Comment[] = commentsData.map((c: any) => ({
        ...c,
        user_has_liked: myLikes.has(c.id),
        likes_count: 0 // Placeholder until we have a count view or rigorous query
    }));

    // Build Thread
    // 1. Get roots
    const roots = formatted.filter(c => !c.parent_id);
    const children = formatted.filter(c => c.parent_id);
    const thread: Comment[] = [];

    roots.forEach(root => {
        thread.push(root);
        // Find direct children
        const myChildren = children.filter(c => c.parent_id === root.id);
        thread.push(...myChildren);
    });

    setComments(thread);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    setSubmitting(true);
    try {
        // Send to API route to handle secure insert (or keep using client for now if RLS allows?)
        // The original code used direct supabase.from('comments').insert().
        // Does 'comments' table allow insert with 'article_title' which is not in RLS?
        // Actually earlier 'route.ts' (comments) POST handler was shown.
        // Wait, the client code existing used `supabase.from('comments').insert(...)`.
        // BUT there is a route `src/app/api/comments/route.ts` which handles POST too?
        // Line 127 in existing CommentSheet used `supabase.from('comments').insert`.
        // I should probably switch to using the API route I just modified OR update the client call if I want to stay client-side.
        // Usually safer to use API for complex metadata if we want server validation, but client is faster.
        // However, I updated the API route to handle metadata. I should use it.
        // BUT refactoring to use `fetch('/api/comments', ...)` implies changing this logic.
        // AND the user context (auth) might be handled via session token.
        // The existing code uses `supabase` client directly.
        // If RLS allows direct insert, I can just add fields here.
        // I added columns to the table.
        // Let's try adding fields here first. If RLS blocks, I'll switch to API.

      const payload = {
          user_id: user.id,
          article_url: articleUrl,
          content: newComment.trim(),
          parent_id: replyingTo?.id || null,
          depth: replyingTo ? (replyingTo.depth || 0) + 1 : 0,
          article_title: articleTitle,
          article_image: articleImage
      };

      const { error } = await supabase
        .from('comments')
        .insert(payload);

      if (!error) {
        setNewComment('');
        setReplyingTo(null);
        fetchComments();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (commentId: string, currentLiked: boolean) => {
      if (!user) return; // Flash auth modal?

      // Optimistic update
      setComments(prev => prev.map(c => {
          if (c.id === commentId) {
              return { ...c, user_has_liked: !currentLiked };
          }
          return c;
      }));

      if (currentLiked) {
          await supabase.from('comment_likes').delete().eq('user_id', user.id).eq('comment_id', commentId);
      } else {
          await supabase.from('comment_likes').insert({ user_id: user.id, comment_id: commentId });
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
            className="fixed bottom-0 left-0 right-0 z-[1001] h-[75vh] bg-[#1a1a1a] rounded-t-3xl border-t border-white/10 shadow-2xl flex flex-col overflow-hidden max-w-lg mx-auto"
          >
            <div className="flex items-center justify-between p-4 border-b border-white/5 bg-[#1a1a1a]">
              <h3 className="text-white font-bold text-lg">
                  {comments.length} comments
              </h3>
              <button
                onClick={onClose}
                className="text-white/50 hover:text-white p-2"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {loading ? (
                <div className="flex justify-center p-8">
                  <Loader2 className="animate-spin text-cerulean-500" />
                </div>
              ) : comments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-white/30 gap-4">
                    <MessageCircle size={48} strokeWidth={1} />
                    <p>No comments yet. Be the first to say something!</p>
                </div>
              ) : (
                comments.map((comment) => (
                  <div
                    key={comment.id}
                    className={`flex gap-3 ${comment.parent_id ? 'pl-10' : ''}`}
                  >
                    <div className="w-8 h-8 rounded-full bg-cerulean-500 flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-lg">
                      {comment.profiles?.avatar_url ? (
                          <img src={comment.profiles.avatar_url} className="w-full h-full rounded-full object-cover" />
                      ) : (
                          comment.profiles?.username?.[0]?.toUpperCase() || 'U'
                      )}
                    </div>
                    <div className="flex-1 gap-1 flex flex-col">
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm font-bold text-white/90">
                          {comment.profiles?.username || 'Unknown'}
                        </span>
                        <span className="text-[10px] text-white/40">
                          {new Date(comment.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-white/80 text-sm leading-relaxed">{comment.content}</p>

                      <div className="flex items-center gap-4 mt-1">
                          <button
                            onClick={() => setReplyingTo(comment)}
                            className="text-xs text-white/40 font-semibold hover:text-white transition-colors"
                          >
                              Reply
                          </button>
                           {/* Like Button */}
                           <button
                             onClick={() => handleLike(comment.id, !!comment.user_has_liked)}
                             className={`flex items-center gap-1 text-xs font-semibold transition-colors ${comment.user_has_liked ? 'text-punch-red-500' : 'text-white/40 hover:text-white'}`}
                           >
                               <Heart size={12} fill={comment.user_has_liked ? "currentColor" : "none"} />
                               {comment.user_has_liked ? 'Liked' : 'Like'}
                           </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-white/5 bg-[#111] pb-8 md:pb-4">
              {replyingTo && (
                  <div className="flex items-center justify-between text-xs text-white/60 mb-2 px-2">
                      <span className="flex items-center gap-1">
                          <CornerDownRight size={12} />
                          Replying to <span className="text-white font-bold">@{replyingTo.profiles?.username}</span>
                      </span>
                      <button onClick={() => setReplyingTo(null)}>
                          <X size={12} />
                      </button>
                  </div>
              )}

              {user ? (
                <form onSubmit={handleSubmit} className="flex gap-3 items-end">
                  <div className="w-8 h-8 rounded-full bg-cerulean-600 flex items-center justify-center text-xs font-bold text-white shrink-0 mt-1">
                      {user.user_metadata?.full_name?.[0] || 'U'}
                  </div>
                  <div className="flex-1 bg-white/10 rounded-2xl p-1 flex items-center pl-4 pr-1 focus-within:bg-white/15 transition-colors">
                    <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder={replyingTo ? "Write a reply..." : "Add a comment..."}
                        className="flex-1 bg-transparent border-none text-white focus:outline-none placeholder:text-white/30 text-sm py-2"
                    />
                    <button
                        type="submit"
                        disabled={submitting || !newComment.trim()}
                        className="p-2 btn-primary rounded-xl disabled:opacity-50 disabled:grayscale transition-all hover:scale-105 active:scale-95"
                    >
                        {submitting ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                    </button>
                  </div>
                </form>
              ) : (
                <div onClick={() => alert("Please Sign In")} className="p-3 text-center text-sm text-cerulean-400 font-bold bg-cerulean-400/10 rounded-xl cursor-pointer hover:bg-cerulean-400/20 active:scale-95 transition-all">
                  Log in to join the conversation
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
