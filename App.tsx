
import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { PackageGrid } from './components/PackageGrid';
import { MobileRatesGrid } from './components/MobileRatesGrid';
import { Configurator } from './components/Configurator';
import { Testimonials } from './components/Testimonials';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';
import { ChatAssistant } from './components/ChatAssistant';
import { AdminDashboard } from './components/AdminDashboard';
import { DynamicSection } from './components/DynamicSection';
import { PromotionBanner } from './components/PromotionBanner';
import { LiveCameras } from './components/LiveCameras';
import { FloatingCallButton } from './components/FloatingCallButton';
import { Stores } from './components/Stores';
import { ContentProvider, useContent } from './contexts/ContentContext';
import { Language } from './types';
import { Loader2 } from 'lucide-react';
import { Logo } from './components/Logo';
import { useAnalytics } from './useAnalytics';

const AppContent: React.FC = () => {
  const [lang, setLang] = useState<Language>('ca');
  const [showAdmin, setShowAdmin] = useState(false);
  const { customSections, isLoading } = useContent();

  // 🆕 Rastrejar visites automàticament
  useAnalytics();

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-white z-[9999] flex flex-col items-center justify-center animate-fade-in">
         <div className="text-4xl md:text-5xl font-black tracking-tighter mb-8 animate-pulse flex items-center justify-center">
            <span className="text-brand-pink">Eports</span>
            <span className="text-brand-purple">Internet</span>
         </div>
         <Loader2 className="w-10 h-10 text-brand-pink animate-spin" />
         <p className="mt-4 text-gray-400 font-medium text-sm tracking-widest uppercase">Carregant...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans antialiased text-gray-900 bg-white relative animate-fade-in">
      {showAdmin && <AdminDashboard onClose={() => setShowAdmin(false)} />}
      
      <Navbar lang={lang} setLang={setLang} onOpenAdmin={() => setShowAdmin(true)} />
      <PromotionBanner lang={lang} />
      
      <main className="flex-grow">
        <Hero lang={lang} />
        <Features lang={lang} />
        <PackageGrid lang={lang} />
        <MobileRatesGrid lang={lang} />
        <Configurator lang={lang} />
        
        {/* Dynamic Sections */}
        {customSections.map(section => (
            <DynamicSection key={section.id} section={section} lang={lang} />
        ))}

        <Testimonials lang={lang} />
        <FAQ lang={lang} />
        <Stores lang={lang} />
        <LiveCameras lang={lang} />
      </main>
      
      <Footer lang={lang} onOpenAdmin={() => setShowAdmin(true)} />
      <FloatingCallButton lang={lang} />
      <ChatAssistant lang={lang} />
    </div>
  );
};

function App() {
  return (
    <ContentProvider>
      <AppContent />
    </ContentProvider>
  );
}

export default App;
