import React from 'react';
import { Logo } from './Logo';
import { Language } from '../types';
import { Menu, X, Globe } from 'lucide-react';
import { useContent } from '../contexts/ContentContext';

interface NavbarProps {
  lang: Language;
  setLang: (l: Language) => void;
  onOpenAdmin?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ lang, setLang, onOpenAdmin }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { translations } = useContent();
  const t = translations[lang].nav;

  const scrollTo = (id: string) => {
    setIsOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all duration-300 h-20 md:h-24 flex items-center">
      <div className="container mx-auto px-4 md:px-6 w-full">
        <div className="flex items-center justify-between w-full">
          {/* Logo Container - Restricted height to prevent SVG from being too large */}
          <div onClick={() => scrollTo('hero')} className="cursor-pointer hover:opacity-90 transition-opacity flex-shrink-0">
             {/* Reduced height further by 15% (h-9 mobile, h-12 desktop) */}
             <div className="h-9 md:h-12">
                <Logo className="h-full w-auto" />
             </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollTo('packages')} className="text-gray-600 hover:text-brand-purple font-medium transition-colors text-lg">{t.packages}</button>
            <button onClick={() => scrollTo('configurator')} className="text-gray-600 hover:text-brand-purple font-medium transition-colors text-lg">{t.configure}</button>
            <button onClick={() => scrollTo('contact')} className="text-gray-600 hover:text-brand-purple font-medium transition-colors text-lg">{t.contact}</button>
            
            <div className="h-8 w-px bg-gray-200 mx-2"></div>

            <button 
              onClick={() => setLang(lang === 'ca' ? 'es' : 'ca')}
              className="flex items-center gap-2 text-sm font-semibold text-brand-purple border border-brand-purple/20 px-3 py-1.5 rounded-full hover:bg-brand-purple/5 transition-colors"
            >
              <Globe size={18} />
              {lang === 'ca' ? 'ES' : 'CA'}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
             <button 
              onClick={() => setLang(lang === 'ca' ? 'es' : 'ca')}
              className="text-sm font-bold text-brand-purple"
            >
              {lang.toUpperCase()}
            </button>
            <button onClick={() => setIsOpen(!isOpen)} className="text-brand-purple p-2">
              {isOpen ? <X size={32} /> : <Menu size={32} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 absolute w-full left-0 top-full py-6 px-6 shadow-lg flex flex-col gap-6">
            <button onClick={() => scrollTo('packages')} className="text-left text-xl font-medium text-gray-700 py-2">{t.packages}</button>
            <button onClick={() => scrollTo('configurator')} className="text-left text-xl font-medium text-brand-pink py-2">{t.configure}</button>
            <button onClick={() => scrollTo('contact')} className="text-left text-xl font-medium text-gray-700 py-2">{t.contact}</button>
        </div>
      )}
    </nav>
  );
};
