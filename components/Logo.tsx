
import React from 'react';
import { useContent } from '../contexts/ContentContext';

export const Logo: React.FC<{ className?: string; darkBackground?: boolean }> = ({ className, darkBackground = false }) => {
  const { images } = useContent();

  // Si hi ha una imatge configurada (per defecte o pujada per l'usuari)
  if (images.logo && images.logo !== "") {
    return (
      <img 
        src={images.logo} 
        alt="eportsinternet" 
        className={`h-auto w-auto max-h-full object-contain ${className}`} 
      />
    );
  }

  // Fallback: Text simple si no hi ha imatge
  return (
    <span className={`text-2xl md:text-3xl font-black tracking-tighter ${darkBackground ? 'text-white' : 'text-brand-pink'} ${className}`}>
      e-ports
    </span>
  );
};
