
import React from 'react';
import { Language } from '../types';
import { Instagram, Facebook, Linkedin } from 'lucide-react';

interface SocialMediaProps {
  lang: Language;
}

export const SocialMedia: React.FC<SocialMediaProps> = ({ lang }) => {
  const text = lang === 'ca' ? 'Segueix-nos a les xarxes' : 'Síguenos en las redes';

  return (
    <section className="py-8 bg-gray-50 border-t border-b border-gray-200">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-center gap-6">
        <h3 className="text-lg font-bold text-gray-700 uppercase tracking-wider">{text}</h3>
        
        <div className="flex items-center gap-4">
          <a 
            href="https://instagram.com/eportsinternet" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white p-3 rounded-full shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center"
            title="Instagram"
          >
            <Instagram size={24} strokeWidth={2.5} />
          </a>
          <a 
            href="https://facebook.com/eportsinternet" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-[#1877F2] text-white p-3 rounded-full shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center"
            title="Facebook"
          >
            <Facebook size={24} strokeWidth={2.5} />
          </a>
          <a 
            href="https://linkedin.com/company/eportsinternet" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-[#0A66C2] text-white p-3 rounded-full shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center"
            title="LinkedIn"
          >
            <Linkedin size={24} strokeWidth={2.5} />
          </a>
        </div>
      </div>
    </section>
  );
};
