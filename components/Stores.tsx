import React from 'react';
import { Language } from '../types';
import { useContent } from '../contexts/ContentContext';
import { MapPin, ExternalLink } from 'lucide-react';

interface StoresProps {
  lang: Language;
}

export const Stores: React.FC<StoresProps> = ({ lang }) => {
  const { stores } = useContent();

  const title = lang === 'ca' ? 'On som?' : '¿Dónde estamos?';
  const subtitle = lang === 'ca' 
    ? "Visita les nostres botigues i punts d'atenció repartits pel territori." 
    : "Visita nuestras tiendas y puntos de atención repartidos por el territorio.";

  return (
    <section id="stores" className="py-20 bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-purple mb-4">{title}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {stores.map((store) => (
            <div key={store.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow hover:border-brand-pink/30 group">
              <div className="flex items-start gap-3">
                <div className="bg-brand-light p-3 rounded-full text-brand-pink group-hover:bg-brand-pink group-hover:text-white transition-colors">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-800 mb-1">{store.name}</h3>
                  <p className="text-sm text-gray-600 mb-3 leading-relaxed">{store.address}</p>
                  
                  {store.url && (
                    <a 
                      href={store.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-brand-purple hover:underline"
                    >
                      {lang === 'ca' ? 'Veure al mapa' : 'Ver en el mapa'} <ExternalLink size={10} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
