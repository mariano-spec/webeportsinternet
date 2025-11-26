import React from 'react';
import { Language } from '../types';
import { useContent } from '../contexts/ContentContext';
import { CheckCircle, Zap } from 'lucide-react';

interface PackageGridProps {
  lang: Language;
}

export const PackageGrid: React.FC<PackageGridProps> = ({ lang }) => {
  const { packs, translations } = useContent();
  // const t = translations[lang].nav; // Not used directly here, using custom text below

  return (
    <section id="packages" className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-purple mb-4">
            {lang === 'ca' ? 'Els nostres Paquets' : 'Nuestros Paquetes'}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {lang === 'ca' 
              ? 'Solucions completes per a la teva llar i segones residències' 
              : 'Soluciones completas para tu hogar y segundas residencias'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packs.map((pack) => (
            <div key={pack.id} className="relative group h-full">
              <div className="absolute inset-0 bg-gradient-to-r from-brand-pink to-brand-purple rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <div className="relative bg-white rounded-2xl p-8 border border-gray-100 shadow-xl h-full flex flex-col">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-brand-purple mb-2">{pack.name[lang]}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-brand-pink">{pack.price.toFixed(2)}€</span>
                    <span className="text-gray-500 text-sm">/mes</span>
                  </div>
                </div>

                <div className="space-y-4 mb-8 flex-grow">
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-100 p-1.5 rounded-full text-brand-purple">
                        <Zap size={18} />
                    </div>
                    <span className="font-semibold text-gray-700">{pack.speedMb} Mb Fibra</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle size={18} className="text-green-500" />
                    <span className="text-gray-600">
                        {pack.mobileLines}x {lang === 'ca' ? 'Mòbil' : 'Móvil'} {pack.mobileGbPerLine === -1 ? (lang === 'ca' ? 'Il·limitat' : 'Ilimitados') : `${pack.mobileGbPerLine}GB`}
                    </span>
                  </div>
                  {pack.hasLandline && (
                    <div className="flex items-center gap-3">
                       <CheckCircle size={18} className="text-green-500" />
                       <span className="text-gray-600">
                          {pack.description[lang].includes('Centraleta') || pack.description[lang].includes('Centralita') 
                            ? (lang === 'ca' ? 'Centraleta Fix' : 'Centralita Fijo')
                            : (lang === 'ca' ? 'Fix inclòs (1500 min)' : 'Fijo incluido (1500 min)')}
                       </span>
                    </div>
                  )}
                </div>

                <button 
                  onClick={() => document.getElementById('configurator')?.scrollIntoView({ behavior: 'smooth' })}
                  className="w-full py-3 rounded-xl border-2 border-brand-purple text-brand-purple font-bold hover:bg-brand-purple hover:text-white transition-all"
                >
                  {lang === 'ca' ? 'Personalitzar' : 'Personalizar'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};