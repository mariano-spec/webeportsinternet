import React from 'react';
import { Language } from '../types';
import { useContent } from '../contexts/ContentContext';
import { MapPin, Zap, BadgeCheck } from 'lucide-react';

export const Features: React.FC<{ lang: Language }> = ({ lang }) => {
  const { translations } = useContent();
  const t = translations[lang].features;

  const getIcon = (name: string) => {
    switch(name) {
      case 'map': return <MapPin size={32} />;
      case 'zap': return <Zap size={32} />;
      case 'check': return <BadgeCheck size={32} />;
      default: return <BadgeCheck size={32} />;
    }
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-purple mb-4">{t.title}</h2>
          <p className="text-xl text-gray-600">{t.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {t.items.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center text-center group hover:translate-y-[-5px] transition-transform duration-300">
              <div className="w-20 h-20 bg-brand-pink/10 text-brand-pink rounded-full flex items-center justify-center mb-6 group-hover:bg-brand-pink group-hover:text-white transition-colors">
                {getIcon(item.icon)}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
              <p className="text-gray-600 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
