'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthContext';
import { supabase } from '@/lib/supabase/client';
import { X, Bookmark, Heart, MessageCircle, ExternalLink, Loader2, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { WikiArticle } from '@/types';

interface ProfileOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    onReadArticle: (article: WikiArticle) => void;
}

type Tab = 'saved' | 'likes' | 'comments';

export function ProfileOverlay({ isOpen, onClose, onReadArticle }: ProfileOverlayProps) {
    const { user, signOut } = useAuth();
    const [activeTab, setActiveTab] = useState<Tab>('saved');
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && user) {
            fetchItems();
        }
    }, [isOpen, user, activeTab]);

    const fetchItems = async () => {
        if (!user) return;
        setLoading(true);
        let data: any[] | null = null;
        let error = null;

        try {
            if (activeTab === 'saved') {
                const res = await supabase
                    .from('bookmarks')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });
                data = res.data;
            } else if (activeTab === 'likes') {
                const res = await supabase
                    .from('likes')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });
                data = res.data;
            } else if (activeTab === 'comments') {
                const res = await supabase
                    .from('comments')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });
                data = res.data;
            }

            if (data) {
                setItems(data);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleItemClick = (item: any) => {
        if (item.article_url) {
            // Construct a partial WikiArticle object to open the reader
            // We might lack some data like 'extract' if not saved, but Reader fetches by title/url usually?
            // Actually ArticleReader takes `url` (via iframe) or content?
            // The `ArticleReader` in Feed.tsx takes `article` (WikiArticle).
            // `WikiArticle` needs: title, extract, originalimage, content_urls.
            // Our DB stores title, image, url.
            // We can reconstruct enough to open it.

            const article: WikiArticle = {
                title: item.article_title || 'Unknown Article',
                extract: item.article_summary || '', // Bookmarks have summary, others might not
                originalimage: item.article_image ? { source: item.article_image, width: 0, height: 0 } : undefined,
                content_urls: {
                    desktop: { page: item.article_url },
                    mobile: { page: item.article_url }
                }
            };
            onReadArticle(article);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: '0%' }}
                    exit={{ x: '100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="fixed inset-0 z-[2000] bg-[#0a0a0a] md:max-w-md md:right-0 md:left-auto md:border-l md:border-white/10 flex flex-col"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-white/5 flex items-center justify-between bg-[#111]">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cerulean-500 to-cerulean-700 flex items-center justify-center text-xl font-bold text-white shadow-lg ring-2 ring-white/10">
                                {user?.user_metadata?.full_name?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
                            </div>
                            <div>
                                <h2 className="text-white font-bold text-lg leading-tight">
                                    {user?.user_metadata?.full_name || 'User'}
                                </h2>
                                <p className="text-white/40 text-xs">@{user?.email?.split('@')[0]}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => signOut()}
                                className="p-2 text-white/40 hover:text-red-400 transition-colors"
                                title="Sign Out"
                            >
                                <LogOut size={20} />
                            </button>
                            <button
                                onClick={onClose}
                                className="p-2 text-white/40 hover:text-white transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b border-white/5 bg-[#0a0a0a]">
                        <TabButton
                            active={activeTab === 'saved'}
                            onClick={() => setActiveTab('saved')}
                            icon={<Bookmark size={18} />}
                            label="Saved"
                        />
                        <TabButton
                            active={activeTab === 'likes'}
                            onClick={() => setActiveTab('likes')}
                            icon={<Heart size={18} />}
                            label="Likes"
                        />
                        <TabButton
                            active={activeTab === 'comments'}
                            onClick={() => setActiveTab('comments')}
                            icon={<MessageCircle size={18} />}
                            label="Comments"
                        />
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {loading ? (
                            <div className="flex justify-center p-12">
                                <Loader2 className="animate-spin text-cerulean-500" />
                            </div>
                        ) : items.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-white/20 gap-4">
                                {activeTab === 'saved' && <Bookmark size={48} strokeWidth={1} />}
                                {activeTab === 'likes' && <Heart size={48} strokeWidth={1} />}
                                {activeTab === 'comments' && <MessageCircle size={48} strokeWidth={1} />}
                                <p>No {activeTab} yet</p>
                            </div>
                        ) : (
                            items.map((item) => (
                                <div
                                    key={item.id}
                                    onClick={() => handleItemClick(item)}
                                    className="flex gap-4 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer group border border-white/5 active:scale-[0.98]"
                                >
                                    {/* Image Thumbnail */}
                                    <div className="w-20 h-20 shrink-0 bg-black/40 rounded-lg overflow-hidden relative border border-white/5">
                                        {item.article_image ? (
                                            <Image
                                                src={item.article_image}
                                                alt={item.article_title || ""}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-white/20">
                                                <ExternalLink size={20} />
                                            </div>
                                        )}
                                    </div>

                                    {/* Text Info */}
                                    <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                                        <div>
                                            <h3 className="text-white font-bold text-sm leading-tight line-clamp-2 mb-1 group-hover:text-cerulean-400 transition-colors">
                                                {item.article_title || 'Untitled Article'}
                                            </h3>
                                            {activeTab === 'comments' && (
                                                <p className="text-white/60 text-xs line-clamp-2 italic">
                                                    "{item.content}"
                                                </p>
                                            )}
                                             {activeTab === 'saved' && item.article_summary && (
                                                <p className="text-white/50 text-[10px] line-clamp-2">
                                                    {item.article_summary}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex items-center justify-between text-[10px] text-white/30">
                                            <span>{new Date(item.created_at).toLocaleDateString()}</span>
                                            <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
    return (
        <button
            onClick={onClick}
            className={`flex-1 py-4 flex items-center justify-center gap-2 text-sm font-semibold transition-all relative ${active ? 'text-white' : 'text-white/40 hover:text-white/70'}`}
        >
            {icon}
            {label}
            {active && (
                <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-cerulean-500 shadow-[0_-2px_10px_rgba(14,165,233,0.5)]"
                />
            )}
        </button>
    );
}
