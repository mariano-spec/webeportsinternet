

import React from 'react';
import { Language } from '../types';
import { useContent } from '../contexts/ContentContext';
import { ArrowRight, Wifi } from 'lucide-react';

interface HeroProps {
  lang: Language;
}

export const Hero: React.FC<HeroProps> = ({ lang }) => {
  const { translations, images, heroOverlayOpacity, heroAlignment } = useContent();
  const t = translations[lang].hero;

  // Fallback image if custom one is not set
  const bgImage = images.heroBg || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80';
  
  // Use config value or default to 0.4 (40%)
  const overlayOpacity = heroOverlayOpacity !== undefined ? heroOverlayOpacity : 0.4;

  // Use config value or default to 'center'
  const objectPosition = heroAlignment || 'center';

  return (
    <div id="hero" className="relative text-white overflow-hidden bg-brand-purple">
      
      {/* Layer 1: Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
            src={bgImage} 
            alt="Hero Background" 
            className="w-full h-full object-cover"
            style={{ objectPosition: objectPosition }}
            referrerPolicy="no-referrer"
            onError={(e) => {
                console.error("Hero image failed to load:", bgImage);
                (e.target as HTMLImageElement).style.display = 'none';
            }}
        />
      </div>

      {/* Layer 2: Brand Gradient Overlay (Dynamic Opacity) */}
      <div 
        className="absolute inset-0 z-[1] bg-gradient-to-br from-brand-purple via-[#4a2c8a] to-brand-pink"
        style={{ opacity: overlayOpacity }}
      ></div>
      
      {/* Layer 3: Content - Increased padding for more height (approx 10% more than previous 32/44) */}
      <div className="container mx-auto px-4 md:px-6 py-36 md:py-52 relative z-10">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-medium mb-6 border border-white/20 shadow-sm animate-fade-in">
            <Wifi size={16} />
            <span>Fibra òptica a màxima velocitat</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight drop-shadow-lg">
            {t.title}
          </h1>
          <p className="text-lg md:text-xl text-gray-100 mb-10 leading-relaxed opacity-95 whitespace-pre-line drop-shadow-md font-medium">
            {t.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => document.getElementById('configurator')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-brand-pink hover:bg-[#a00065] text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-brand-pink/30 flex items-center justify-center gap-2 group"
            >
              {t.cta}
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center shadow-sm"
            >
              {t.secondary}
            </button>
          </div>
        </div>
      </div>
      
      {/* Decorative Curve */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <svg viewBox="0 0 1440 120" className="w-full h-auto fill-white">
           <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
        </svg>
      </div>
    </div>
  );
};
