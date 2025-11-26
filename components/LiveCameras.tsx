

import React from 'react';
import { Language } from '../types';
import { Camera, ExternalLink, MapPin } from 'lucide-react';
import { useContent } from '../contexts/ContentContext';

interface LiveCamerasProps {
  lang: Language;
}

export const LiveCameras: React.FC<LiveCamerasProps> = ({ lang }) => {
  const { meteo } = useContent();

  const t = {
    title: meteo.title[lang],
    subtitle: meteo.subtitle[lang],
    viewAll: lang === 'ca' ? 'Veure totes les càmeres' : 'Ver todas las cámaras',
    live: lang === 'ca' ? 'EN DIRECTE' : 'EN DIRECTO',
    view: lang === 'ca' ? 'Veure Càmera' : 'Ver Cámara'
  };

  // Filter only visible cameras
  const visibleCameras = meteo.items.filter(item => item.visible !== false);

  if (visibleCameras.length === 0) return null;

  return (
    <section className="py-16 bg-gray-900 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-pink rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-purple rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-white font-bold uppercase tracking-wider text-sm mb-2">
              <Camera size={16} /> e-ports Meteo
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">{t.title}</h2>
            <p className="text-gray-400 mt-2 max-w-xl">{t.subtitle}</p>
          </div>
          <a 
            href="https://meteo.eportsinternet.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm font-bold border border-white/20 hover:bg-white/10 px-4 py-2 rounded-full transition-colors"
          >
            {t.viewAll} <ExternalLink size={14} />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleCameras.map((cam, idx) => (
            <a 
              key={cam.id || idx}
              href={cam.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative rounded-xl overflow-hidden aspect-video bg-gray-800 border border-gray-700 hover:border-brand-pink transition-all shadow-lg hover:shadow-brand-pink/20 block"
            >
              {/* Background Image */}
              <img 
                src={cam.image} 
                alt={cam.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-60 group-hover:opacity-80"
              />
              
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

              {/* Live Indicator */}
              <div className="absolute top-3 right-3 flex items-center gap-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md border border-white/10">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                </span>
                <span className="text-[10px] font-bold tracking-widest text-white">{t.live}</span>
              </div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 w-full p-5">
                <div className="flex items-center gap-1 text-brand-pink mb-1">
                  <MapPin size={14} />
                  <span className="text-xs font-bold uppercase tracking-wide">Meteo</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-brand-pink transition-colors">{cam.name}</h3>
                <span className="text-xs text-gray-300 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 duration-300">
                  {t.view} <ExternalLink size={12} />
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};