

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { AppContent, ContentContextType, Language, Translation, Pack, CustomSection, Lead, MobileRate, Promotion, MeteoConfig, CallButtonConfig } from '../types';
import { TRANSLATIONS, PACKS, FIBER_RATES, MOBILE_RATES, IMAGES, CUSTOM_SECTIONS, PROMOTIONS, METEO_DEFAULT, INITIAL_VISITS, CALL_BUTTON_DEFAULT } from '../constants';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const INITIAL_CONTENT: AppContent = {
  translations: TRANSLATIONS,
  packs: PACKS,
  fiberRates: FIBER_RATES,
  mobileRates: MOBILE_RATES,
  promotions: PROMOTIONS,
  meteo: METEO_DEFAULT,
  images: IMAGES,
  heroOverlayOpacity: 0.4,
  heroAlignment: 'center',
  customSections: CUSTOM_SECTIONS,
  leads: [],
  visits: INITIAL_VISITS,
  notificationEmail: "",
  // Use env var if available, otherwise default to 'admin123'
  adminPassword: process.env.VITE_ADMIN_PASSWORD || "admin123",
  callButtonConfig: CALL_BUTTON_DEFAULT
};

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<AppContent>(INITIAL_CONTENT);
  const [isLoading, setIsLoading] = useState(true);
  
  // Track initial load to prevent double analytics
  const analyticsTracked = useRef(false);

  // --- 1. LOAD FROM SUPABASE ON MOUNT ---
  useEffect(() => {
    const fetchContent = async () => {
      // Guard: If credentials aren't set, don't try to fetch
      if (!isSupabaseConfigured) {
          console.log("Supabase not configured: Using local default content.");
          setIsLoading(false);
          return;
      }

      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('site_content')
          .select('content')
          .single();

        if (error) {
            console.warn("Supabase load error (using defaults):", error.message);
        } else if (data && data.content) {
            // Merge defaults ensuring critical sections exist
            const dbContent = data.content;
            const merged: AppContent = {
                ...INITIAL_CONTENT,
                ...dbContent,
                // Specific merges for arrays to ensure we don't lose structure
                meteo: dbContent.meteo || INITIAL_CONTENT.meteo,
                promotions: dbContent.promotions || INITIAL_CONTENT.promotions,
                callButtonConfig: dbContent.callButtonConfig || INITIAL_CONTENT.callButtonConfig,
                // Respect DB password if set, otherwise fallback to env/default
                adminPassword: dbContent.adminPassword || INITIAL_CONTENT.adminPassword
            };
            setContent(merged);
        }
      } catch (err) {
        console.error("Unexpected error loading content:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, []);

  // --- 2. AUTOMATIC ANALYTICS TRACKING ---
  useEffect(() => {
    if (isLoading || !isSupabaseConfigured || analyticsTracked.current) return;

    const trackVisit = async () => {
      analyticsTracked.current = true;
      const today = new Date().toISOString().split('T')[0];
      const sessionKey = `eports_visit_${today}`;
      
      // Check session storage to avoid counting reloads as new visits
      if (sessionStorage.getItem(sessionKey)) return;

      try {
        // Calculate Week Number (ISO 8601)
        const d = new Date();
        d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
        const currentWeek = `${d.getUTCFullYear()}-W${weekNo}`;

        // Determine Source
        let source: 'direct' | 'social' | 'organic' | 'ads' = 'direct';
        const ref = document.referrer.toLowerCase();
        if (ref.includes('google') || ref.includes('bing') || ref.includes('yahoo')) source = 'organic';
        else if (ref.includes('facebook') || ref.includes('instagram') || ref.includes('twitter') || ref.includes('linkedin')) source = 'social';
        else if (window.location.search.includes('gclid') || window.location.search.includes('utm_source')) source = 'ads';

        // FETCH LATEST DATA TO AVOID RACE CONDITIONS
        const { data } = await supabase.from('site_content').select('content').single();
        if (!data?.content) return;

        const currentContent = data.content as AppContent;
        const currentVisits = currentContent.visits || [];
        
        // Find existing entry for this week/source
        const existingIndex = currentVisits.findIndex(v => v.week === currentWeek && v.source === source);
        let newVisits = [...currentVisits];

        if (existingIndex >= 0) {
          newVisits[existingIndex].count += 1;
        } else {
          newVisits.push({ week: currentWeek, source, count: 1 });
        }

        // Limit visits array size (keep last 52 weeks approx)
        if (newVisits.length > 200) {
            newVisits = newVisits.slice(-200);
        }

        // SAVE TO DB
        await supabase
          .from('site_content')
          .upsert({ id: 1, content: { ...currentContent, visits: newVisits } });
        
        // Update local state smoothly
        setContent(prev => ({ ...prev, visits: newVisits }));
        sessionStorage.setItem(sessionKey, 'true');
        console.log(`Visit tracked: ${source} for ${currentWeek}`);

      } catch (err) {
        console.error("Error tracking visit:", err);
      }
    };

    // Small delay to ensure app is stable
    const timer = setTimeout(trackVisit, 2000);
    return () => clearTimeout(timer);
  }, [isLoading]);

  // --- 3. SAVE FUNCTION (MANUAL) ---
  const saveContent = async () => {
    if (!isSupabaseConfigured) {
        alert("Mode local: Supabase no està configurat. Els canvis no es desaran al núvol.");
        return;
    }

    try {
       const { error } = await supabase
        .from('site_content')
        .upsert({ id: 1, content: content });
       
       if (error) throw error;
       console.log("Content saved successfully to Supabase");
    } catch (err) {
        console.error("Failed to save content:", err);
        throw err;
    }
  };

  // --- 4. REAL-TIME UPDATES & NOTIFICATIONS ---
  const playNotificationSound = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.5);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) { /* silent fail */ }
  };

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'site_content', filter: 'id=eq.1' },
        (payload) => {
          const newContent = payload.new.content as AppContent;
          if (newContent) {
             setContent((prev) => {
                 // Detect new leads for notification
                 const prevLeads = prev.leads || [];
                 const newLeads = newContent.leads || [];
                 if (newLeads.length > prevLeads.length) {
                     // Check if the new lead is recent (last 10 seconds) to avoid noise on reload
                     const latestLead = newLeads[0]; // Assuming prepended
                     const leadTime = new Date(latestLead.createdAt).getTime();
                     if (Date.now() - leadTime < 10000) {
                        playNotificationSound();
                     }
                 }
                 return { ...prev, ...newContent };
             });
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  // --- HELPERS (State Updaters) ---
  
  const updateTranslation = (lang: Language, section: keyof Translation, key: string, value: any) => {
    setContent(prev => ({
      ...prev,
      translations: {
        ...prev.translations,
        [lang]: {
          ...prev.translations[lang],
          [section]: {
            ...prev.translations[lang][section],
            [key]: value
          }
        }
      }
    }));
  };

  // Generic updaters for arrays/objects
  const updatePack = (pack: Pack) => setContent(prev => ({ ...prev, packs: prev.packs.map(p => p.id === pack.id ? pack : p) }));
  const addPack = (pack: Pack) => setContent(prev => ({ ...prev, packs: [...prev.packs, pack] }));
  const deletePack = (id: string) => setContent(prev => ({ ...prev, packs: prev.packs.filter(p => p.id !== id) }));
  
  const updateMobileRate = (rate: MobileRate) => setContent(prev => ({ ...prev, mobileRates: prev.mobileRates.map(r => r.id === rate.id ? rate : r) }));
  const addMobileRate = (rate: MobileRate) => setContent(prev => ({ ...prev, mobileRates: [...prev.mobileRates, rate] }));
  const deleteMobileRate = (id: string) => setContent(prev => ({ ...prev, mobileRates: prev.mobileRates.filter(r => r.id !== id) }));

  const updatePromotion = (promotion: Promotion) => setContent(prev => ({ ...prev, promotions: prev.promotions.map(p => p.id === promotion.id ? promotion : p) }));
  const updateMeteo = (config: MeteoConfig) => setContent(prev => ({ ...prev, meteo: config }));
  
  const updateImage = (key: 'logo' | 'heroBg' | 'footerLogo', base64: string) => setContent(prev => ({ ...prev, images: { ...prev.images, [key]: base64 } }));
  const updateHeroOpacity = (opacity: number) => setContent(prev => ({ ...prev, heroOverlayOpacity: opacity }));
  const updateHeroAlignment = (alignment: string) => setContent(prev => ({ ...prev, heroAlignment: alignment }));

  const addCustomSection = (section: CustomSection) => setContent(prev => ({ ...prev, customSections: [...prev.customSections, section] }));
  const deleteCustomSection = (id: string) => setContent(prev => ({ ...prev, customSections: prev.customSections.filter(s => s.id !== id) }));

  // --- LEAD MANAGEMENT (With Direct Save) ---
  const addLead = async (leadData: Omit<Lead, 'id' | 'createdAt' | 'status'>) => {
    const newLead: Lead = {
      id: `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      status: 'NEW',
      ...leadData
    };

    // 1. Optimistic Update
    setContent(prev => {
        const nextContent = { ...prev, leads: [newLead, ...prev.leads] };
        return nextContent;
    });

    // 2. Direct DB Save (Critical Data)
    if (isSupabaseConfigured) {
        try {
            // Fetch current state to avoid overwriting updates from other users
            const { data } = await supabase.from('site_content').select('content').single();
            const currentDBContent = data?.content || content;
            const nextContent = { 
                ...currentDBContent, 
                leads: [newLead, ...(currentDBContent.leads || [])] 
            };
            await supabase.from('site_content').upsert({ id: 1, content: nextContent });
        } catch (e) {
            console.error("Error saving lead to DB", e);
        }
    }
  };

  const updateLeadStatus = (id: string, status: Lead['status']) => {
      setContent(prev => ({ ...prev, leads: prev.leads.map(lead => lead.id === id ? { ...lead, status } : lead) }));
  };

  const deleteLead = (id: string) => {
      setContent(prev => ({ ...prev, leads: prev.leads.filter(lead => lead.id !== id) }));
  };

  const updateNotificationEmail = (email: string) => setContent(prev => ({ ...prev, notificationEmail: email }));
  const updateAdminPassword = (password: string) => setContent(prev => ({ ...prev, adminPassword: password }));
  const updateCallButtonConfig = (config: CallButtonConfig) => setContent(prev => ({ ...prev, callButtonConfig: config }));

  const resetToDefaults = () => {
    if(window.confirm("ATENCIÓ: Això esborrarà TOTA la base de dades i restaurarà la web original. Continuar?")) {
        setContent(INITIAL_CONTENT);
        if (isSupabaseConfigured) {
            supabase.from('site_content').upsert({ id: 1, content: INITIAL_CONTENT }).then(() => {
                alert("Web restaurada als valors de fàbrica.");
            });
        }
    }
  };

  const importData = (data: AppContent) => {
      if (!data || !data.translations) {
          alert("L'arxiu JSON no és vàlid.");
          return;
      }
      setContent({ ...INITIAL_CONTENT, ...data });
  };

  return (
    <ContentContext.Provider value={{
      ...content,
      isLoading,
      saveContent,
      updateTranslation,
      updatePack,
      addPack,
      deletePack,
      updateMobileRate,
      addMobileRate,
      deleteMobileRate,
      updatePromotion,
      updateMeteo,
      updateImage,
      updateHeroOpacity,
      updateHeroAlignment,
      addCustomSection,
      deleteCustomSection,
      addLead,
      updateLeadStatus,
      deleteLead,
      updateNotificationEmail,
      updateAdminPassword,
      updateCallButtonConfig,
      resetToDefaults,
      importData
    }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) throw new Error('useContent must be used within a ContentProvider');
  return context;
};