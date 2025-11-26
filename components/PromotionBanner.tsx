import React from 'react';
import { useContent } from '../contexts/ContentContext';
import { Language } from '../types';

interface PromotionBannerProps {
  lang: Language;
}

export const PromotionBanner: React.FC<PromotionBannerProps> = ({ lang }) => {
  const { promotions } = useContent();

  // Find the first active promotion that matches the current date
  const activePromo = promotions.find(p => {
    if (!p.isActive) return false;
    const now = new Date();
    const start = new Date(p.startDate);
    const end = new Date(p.endDate);
    return now >= start && now <= end;
  });

  if (!activePromo) return null;

  return (
    <div 
        className="w-full text-center py-2 px-4 text-sm font-bold md:text-base sticky top-20 md:top-24 z-40 shadow-sm animate-fade-in"
        style={{ backgroundColor: activePromo.backgroundColor, color: activePromo.textColor }}
    >
      <div className="container mx-auto flex justify-center items-center gap-2">
        <span className="uppercase tracking-wider opacity-90">{activePromo.title[lang]}</span>
        <span className="hidden sm:inline mx-1">|</span>
        <span>{activePromo.text[lang]}</span>
      </div>
    </div>
  );
};