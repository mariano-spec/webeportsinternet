
import React from 'react';
import { Logo } from './Logo';
import { Language } from '../types';
import { useContent } from '../contexts/ContentContext';
import { MapPin, Phone, Mail, Lock, Instagram, Facebook, Linkedin } from 'lucide-react';

export const Footer: React.FC<{ lang: Language; onOpenAdmin?: () => void }> = ({ lang, onOpenAdmin }) => {
  const { translations, images } = useContent();
  const t = translations[lang].contact;
  
  return (
    <footer id="contact" className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="mb-8 pl-2">
               {/* Comprovem si hi ha un logo específic per al footer */}
               {images.footerLogo && images.footerLogo !== "" ? (
                 <img 
                   src={images.footerLogo} 
                   alt="eportsinternet" 
                   className="h-auto w-auto max-h-12 object-contain"
                 />
               ) : (
                 /* Si no, fem servir el component Logo genèric (que usa el logo principal o text) */
                 <Logo darkBackground={true} />
               )}
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              {t.brandDescription}
            </p>
          </div>

          {/* Contact Info */}
          <div className="md:pl-8">
            <h4 className="text-lg font-bold mb-6 text-brand-pink">{t.title}</h4>
            <ul className="space-y-4 text-gray-300">
              <li className="flex items-start gap-3">
                <MapPin size={20} className="text-white mt-1 min-w-[20px]" />
                <span className="whitespace-pre-line">{t.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={20} className="text-white min-w-[20px]" />
                <span>{t.phone}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={20} className="text-white min-w-[20px]" />
                <span>{t.email}</span>
              </li>
            </ul>
          </div>

          {/* Links */}
          <div className="md:pl-8">
             <h4 className="text-lg font-bold mb-6 text-brand-pink">Legal</h4>
             <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Avís Legal</a></li>
                <li><a href="#" className="hover:text-white">Privacitat</a></li>
                <li><a href="#" className="hover:text-white">Cookies</a></li>
             </ul>
          </div>
        </div>
        
        <div className="max-w-5xl mx-auto border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 gap-4">
          <span>&copy; {new Date().getFullYear()} eportsinternet. All rights reserved.</span>
          
          <div className="flex items-center gap-6">
             <a href="https://instagram.com/eportsinternet" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="Instagram">
                <Instagram size={24} strokeWidth={1.5} />
             </a>
             <a href="https://facebook.com/eportsinternet" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="Facebook">
                <Facebook size={24} fill="currentColor" strokeWidth={0} />
             </a>
             <a href="https://linkedin.com/company/eportsinternet" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="LinkedIn">
                <Linkedin size={24} fill="currentColor" strokeWidth={0} />
             </a>
          </div>

          <button 
            onClick={onOpenAdmin} 
            className="text-gray-600 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-800" 
            title="Accés Admin"
          >
            <Lock size={14} />
          </button>
        </div>
      </div>
    </footer>
  );
};
