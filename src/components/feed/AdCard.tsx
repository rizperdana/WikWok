import { motion } from 'framer-motion';
import Script from 'next/script';
import { memo, useState, useEffect } from 'react';
import { ExternalLink } from 'lucide-react';

const CAT_GIFS = [
    "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbDVtcHg5aHVxc3p5Y3VqbWg2bTh0b3VocGJqZnF1anl3b3V5Y3VjciZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/VbnUQpnihPSIgIXuZv/giphy.gif",
    "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbWJ6dG51M3B0b3VocGJqZnF1anl3b3V5Y3VjciZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Geimqs525qQ0/giphy.gif",
    "https://media.giphy.com/media/MDJ9IbxxvDUQM/giphy.gif",
    "https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif",
    "https://media.giphy.com/media/mlvseq9yvZhba/giphy.gif"
];

const DONATION_MESSAGES = [
    "Servers run on electricity... and cat treats? 🐱",
    "Ad blocked? That's cool. Maybe buy us a coffee instead? ☕",
    "Help us keep the lights on (and the cats fed)!",
    "Oops! The ad vanished. Maybe it's a sign to donate? ✨",
    "No ads? No problem! Your support means the world to us.",
    "Be the hero this app deserves! 🦸‍♂️"
];

export const AdCard = memo(function AdCard() {
  const pId = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID;
  const [adError, setAdError] = useState(false);
  const [randomGif, setRandomGif] = useState("");
  const [randomMsg, setRandomMsg] = useState("");
  const [hasScrolled, setHasScrolled] = useState(false); // To prevent flashing if ad loads slow

  useEffect(() => {
      setRandomGif(CAT_GIFS[Math.floor(Math.random() * CAT_GIFS.length)]);
      setRandomMsg(DONATION_MESSAGES[Math.floor(Math.random() * DONATION_MESSAGES.length)]);

      // Simulate ad check - in reality, if no PID or if ad script fails (detected via listeners usually, but robustly by timeout if empty height)
      // For now, if no PID, we show donation immediately.
      if (!pId) {
          setAdError(true);
      }

      // Safety timeout: if ad logic was complex, we'd wait.
      // Since we just check pId for now to toggle:
      // If we had a pId, we'd try to load. If it fails (onError on Script maybe?), show fallback.
  }, [pId]);

  return (
    <div className="relative h-[100dvh] w-full snap-start flex items-center justify-center bg-[#0d0d0d] text-white overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-punch-red-600/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cerulean-500/5 blur-[120px] rounded-full" />

      <div className="relative z-10 flex flex-col items-center p-8 text-center w-full max-w-lg bg-[#111111] backdrop-blur-3xl rounded-[2rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)] mx-4 border border-white/5">
            <span className="mb-8 rounded-full bg-white/5 px-4 py-1.5 text-[10px] font-black text-white/40 uppercase tracking-[0.2em] border border-white/5">
                {adError ? 'SUPPORT US' : 'SPONSORED'}
            </span>

            {!adError && pId ? (
                <div className="w-full min-h-[300px] bg-black/40 rounded-2xl flex items-center justify-center overflow-hidden">
                    <ins className="adsbygoogle"
                        style={{ display: 'block', width: '100%' }}
                        data-ad-client={`ca-pub-${pId.replace('pub-', '')}`}
                        data-ad-slot="1234567890"
                        data-ad-format="auto"
                        data-full-width-responsive="true" />
                    <Script
                        id="ad-push"
                        onError={() => setAdError(true)} // If script fails to load
                    >
                        {`(adsbygoogle = window.adsbygoogle || []).push({});`}
                    </Script>
                </div>
            ) : (
                <div className="flex flex-col items-center w-full">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="w-48 h-48 rounded-2xl overflow-hidden mb-8 shadow-2xl relative"
                    >
                         {/* Cat GIF */}
                        {randomGif && <img src={randomGif} alt="Cute cat" className="w-full h-full object-cover" />}
                    </motion.div>

                    <h2 className="text-2xl font-black mb-4 leading-tight tracking-tighter text-balance">
                        {randomMsg}
                    </h2>

                    <p className="text-white/40 mb-8 text-sm font-medium leading-relaxed max-w-xs">
                        {adError ? "We couldn't load the ad, but you can still support us directly!" : "Support independent development."}
                    </p>

                    <a
                        href="https://saweria.co/rizperdana"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-4 bg-[#efa02f] text-black font-black rounded-xl hover:bg-[#ffb040] transition-all active:scale-[0.98] shadow-[0_10px_30px_-10px_rgba(239,160,47,0.4)] uppercase tracking-widest text-xs flex items-center justify-center gap-2 group"
                    >
                        <span>Donate on Saweria</span>
                        <ExternalLink size={14} className="group-hover:translate-x-1 transition-transform" />
                    </a>
                </div>
            )}
      </div>

       <div className="absolute bottom-6 left-0 right-0 text-center">
          <p className="text-xs text-white/10 uppercase tracking-wide">
              {adError ? 'Community Supported' : 'Advertisement'}
          </p>
       </div>
    </div>
  );
});
