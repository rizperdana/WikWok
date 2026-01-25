import { motion } from 'framer-motion';
import Script from 'next/script';
import { memo } from 'react';

export const AdCard = memo(function AdCard() {
  const pId = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID;

  return (
    <div className="relative h-[100dvh] w-full snap-start flex items-center justify-center bg-[#0d0d0d] text-white overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full" />

      <div className="relative z-10 flex flex-col items-center p-12 text-center w-full max-w-lg bg-[#111111] backdrop-blur-3xl rounded-[2rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)] mx-4">
            <span className="mb-8 rounded-full bg-blue-500/10 px-4 py-1.5 text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">
                PROMOTED DISCOVERY
            </span>

            {pId ? (
                <div className="w-full min-h-[300px] bg-black/40 rounded-2xl flex items-center justify-center overflow-hidden">
                    {/* Responsive Ad Unit */}
                    <ins className="adsbygoogle"
                        style={{ display: 'block', width: '100%' }}
                        data-ad-client={`ca-pub-${pId.replace('pub-', '')}`}
                        data-ad-slot="1234567890" // Placeholder slot
                        data-ad-format="auto"
                        data-full-width-responsive="true" />
                    <Script id="ad-push">
                        {`(adsbygoogle = window.adsbygoogle || []).push({});`}
                    </Script>
                </div>
            ) : (
                <>
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-black mb-6 leading-tight tracking-tighter"
                    >
                        LEARN <span className="text-blue-500 italic">WITHOUT</span> LIMITS
                    </motion.h2>

                    <p className="max-w-xs text-white/40 mb-12 text-lg font-medium leading-relaxed">
                        Stay curious. Help keep the world&apos;s knowledge accessible to everyone.
                    </p>

                    <button className="w-full py-6 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-500 transition-all active:scale-[0.98] shadow-[0_10px_30px_-10px_rgba(37,99,235,0.4)] uppercase tracking-widest text-xs relative overflow-hidden group">
                        <span className="relative z-10">BECOME A SUPPORTER</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
                    </button>
                </>
            )}
      </div>

       <div className="absolute bottom-6 left-0 right-0 text-center">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Advertisement</p>
       </div>
    </div>
  );
});
