import React from 'react';
import { Language } from '../types';
import { useContent } from '../contexts/ContentContext';
import { Smartphone, Check } from 'lucide-react';

interface MobileRatesGridProps {
  lang: Language;
}

export const MobileRatesGrid: React.FC<MobileRatesGridProps> = ({ lang }) => {
  const { mobileRates } = useContent();

  const title = lang === 'ca' ? 'Tarifes de Mòbil' : 'Tarifas de Móvil';
  const subtitle = lang === 'ca' ? 'Només necessites una línia? Tenim el que busques.' : '¿Solo necesitas una línea? Tenemos lo que buscas.';
  const unlimitedText = lang === 'ca' ? 'Il·limitades' : 'Ilimitadas';
  const contractText = lang === 'ca' ? 'Contractar' : 'Contratar';

  return (
    <section id="mobile-rates" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-purple mb-4">
            {title}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {mobileRates.map((rate) => (
            <div key={rate.id} className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-xl transition-all hover:border-brand-pink group flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-brand-pink/10 text-brand-pink rounded-full flex items-center justify-center mb-4 group-hover:bg-brand-pink group-hover:text-white transition-colors">
                <Smartphone size={24} />
              </div>
              
              <h3 className="text-lg font-bold text-gray-800 mb-1">{rate.name}</h3>
              
              <div className="text-3xl font-extrabold text-brand-purple mb-1">
                 {rate.gb === -1 ? '∞' : rate.gb} <span className="text-sm font-medium">GB</span>
              </div>

              <div className="text-xl font-bold text-gray-900 mb-6">
                 {rate.price.toFixed(2)}€ <span className="text-xs font-normal text-gray-500">/mes</span>
              </div>

              <ul className="text-sm text-gray-500 space-y-2 mb-6 w-full text-left px-2">
                 <li className="flex items-center gap-2">
                    <Check size={14} className="text-green-500" />
                    <span>{lang === 'ca' ? 'Trucades il·limitades' : 'Llamadas ilimitadas'}</span>
                 </li>
                 <li className="flex items-center gap-2">
                    <Check size={14} className="text-green-500" />
                    <span>{lang === 'ca' ? 'Sense permanència' : 'Sin permanencia'}</span>
                 </li>
              </ul>

              <button 
                  onClick={() => document.getElementById('configurator')?.scrollIntoView({ behavior: 'smooth' })}
                  className="w-full mt-auto py-2 rounded-lg border border-brand-purple text-brand-purple font-bold text-sm hover:bg-brand-purple hover:text-white transition-all"
              >
                  {contractText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};