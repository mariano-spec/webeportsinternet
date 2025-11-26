
import React from 'react';
import { Phone } from 'lucide-react';
import { Language } from '../types';

export const FloatingCallButton: React.FC<{ lang: Language }> = ({ lang }) => {
  return (
    <a 
      href="tel:977090505"
      className="fixed top-32 md:top-40 left-4 md:left-6 z-40 flex items-center gap-3 bg-brand-pink/80 backdrop-blur-md hover:bg-brand-pink text-white pl-2 pr-5 py-2 rounded-full shadow-xl transition-all transform hover:scale-105 border border-white/20 group animate-fade-in"
      aria-label="Truca ara"
    >
      <div className="bg-white text-brand-pink p-2.5 rounded-full shadow-inner">
        <Phone size={20} className="fill-current animate-pulse" />
      </div>
      <div className="flex flex-col">
         <span className="text-[10px] font-bold text-pink-50 uppercase tracking-wider leading-tight shadow-sm">
            {lang === 'ca' ? "Truca ara i canvia't a e-ports" : "Llama y cámbiate a e-ports"}
         </span>
         <span className="font-black text-lg leading-none tracking-tight drop-shadow-sm">977 09 05 05</span>
      </div>
    </a>
  );
};