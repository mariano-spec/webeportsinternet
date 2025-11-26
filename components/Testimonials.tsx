import React from 'react';
import { Language } from '../types';
import { useContent } from '../contexts/ContentContext';
import { Star } from 'lucide-react';

export const Testimonials: React.FC<{ lang: Language }> = ({ lang }) => {
  const { translations } = useContent();
  const t = translations[lang].testimonials;

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-purple mb-4">{t.title}</h2>
          <p className="text-gray-600">{t.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {t.items.map((item, idx) => (
            <div key={idx} className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 flex flex-col">
              <div className="flex gap-1 text-yellow-400 mb-4">
                {[...Array(item.rating)].map((_, i) => (
                  <Star key={i} size={20} fill="currentColor" />
                ))}
              </div>
              <p className="text-gray-700 italic mb-6 flex-grow">"{item.text}"</p>
              <div className="flex items-center gap-3 mt-auto">
                <div className="w-10 h-10 bg-brand-purple rounded-full flex items-center justify-center text-white font-bold">
                  {item.name.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-gray-900">{item.name}</div>
                  <div className="text-sm text-brand-pink font-medium">{item.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
