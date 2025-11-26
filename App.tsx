
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
import { ContentProvider, useContent } from './contexts/ContentContext';
import { Language } from './types';

const AppContent: React.FC = () => {
  const [lang, setLang] = useState<Language>('ca');
  const [showAdmin, setShowAdmin] = useState(false);
  const { customSections } = useContent();

  return (
    <div className="min-h-screen flex flex-col font-sans antialiased text-gray-900 bg-white relative">
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