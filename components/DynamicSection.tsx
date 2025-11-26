import React from 'react';
import { CustomSection, Language } from '../types';

interface DynamicSectionProps {
  section: CustomSection;
  lang: Language;
}

export const DynamicSection: React.FC<DynamicSectionProps> = ({ section, lang }) => {
  return (
    <section className="py-20 bg-white odd:bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className={`flex-1 ${section.imageUrl ? 'md:w-1/2' : 'w-full text-center'}`}>
            <h2 className="text-3xl md:text-4xl font-bold text-brand-purple mb-6">
              {section.title[lang]}
            </h2>
            <div className="prose prose-lg text-gray-600 leading-relaxed whitespace-pre-wrap">
              {section.content[lang]}
            </div>
          </div>
          
          {section.imageUrl && (
            <div className="flex-1 md:w-1/2">
              <img 
                src={section.imageUrl} 
                alt={section.title[lang]} 
                className="w-full rounded-2xl shadow-xl"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
