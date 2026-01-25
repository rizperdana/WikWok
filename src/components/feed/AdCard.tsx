import { motion } from 'framer-motion';
import Script from 'next/script';

export function AdCard() {
  const pId = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID;

  return (
    <div className="relative h-[100dvh] w-full snap-start flex items-center justify-center bg-gray-900 text-white">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 to-purple-900 opacity-50" />

      <div className="relative z-10 flex flex-col items-center p-8 text-center w-full max-w-lg">
            <span className="mb-4 rounded-full bg-yellow-400/20 px-3 py-1 text-xs font-bold text-yellow-400 uppercase tracking-wider border border-yellow-400/30">
                Sponsored Knowledge
            </span>

            {pId ? (
                <div className="w-full min-h-[300px] bg-white/5 rounded-lg flex items-center justify-center overflow-hidden">
                    {/* Responsive Ad Unit */}
                    <ins className="adsbygoogle"
                        style={{ display: 'block', width: '100%' }}
                        data-ad-client={`ca-pub-${pId}`}
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
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="text-4xl font-black mb-4"
                    >
                        Support Wikwok
                    </motion.h2>

                    <p className="max-w-md text-gray-300 mb-8">
                        Keep scrolling for more fascinating discoveries. This space helps keep our servers running and knowledge free.
                    </p>

                    <button className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-100 transition-transform active:scale-95">
                        Learn More
                    </button>
                </>
            )}
      </div>

       <div className="absolute bottom-6 left-0 right-0 text-center">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Advertisement</p>
       </div>
    </div>
  );
}
