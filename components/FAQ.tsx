import React, { useState } from 'react';
import { Language } from '../types';
import { useContent } from '../contexts/ContentContext';
import { Plus, Minus } from 'lucide-react';

export const FAQ: React.FC<{ lang: Language }> = ({ lang }) => {
  const { translations } = useContent();
  const t = translations[lang].faq;
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        <h2 className="text-3xl md:text-4xl font-bold text-brand-purple mb-12 text-center">{t.title}</h2>
        
        <div className="space-y-4">
          {t.items.map((item, idx) => (
            <div key={idx} className="border border-gray-200 rounded-xl overflow-hidden">
              <button 
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full flex items-center justify-between p-6 text-left bg-white hover:bg-gray-50 transition-colors"
              >
                <span className="font-bold text-lg text-brand-purple">{item.question}</span>
                {openIndex === idx ? <Minus className="text-brand-pink" /> : <Plus className="text-gray-400" />}
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === idx ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="p-6 pt-0 text-gray-600 leading-relaxed">
                  {item.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
