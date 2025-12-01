import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { AppContent, ContentContextType, Language, Translation, Pack, CustomSection, Lead, MobileRate, Promotion, MeteoConfig, CallButtonConfig, StoreItem, FiberRate } from '../types';
import { TRANSLATIONS, PACKS, FIBER_RATES, MOBILE_RATES, IMAGES, CUSTOM_SECTIONS, PROMOTIONS, METEO_DEFAULT, INITIAL_VISITS, CALL_BUTTON_DEFAULT, STORES } from '../constants';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const INITIAL_CONTENT: AppContent = {
  translations: TRANSLATIONS,
  packs: PACKS,
  fiberRates: FIBER_RATES,
  mobileRates: MOBILE_RATES,
  stores: STORES,
  promotions: PROMOTIONS,
  meteo: METEO_DEFAULT,
  images: IMAGES,
  heroOverlayOpacity: 0.4,
  heroAlignment: 'center',
  customSections: CUSTOM_SECTIONS,
  leads: [],
  visits: INITIAL_VISITS,
  notificationEmail: "",
  adminPassword: process.env.ADMIN_PASSWORD || "admin123",
  callButtonConfig: CALL_BUTTON_DEFAULT
};

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<AppContent>(INITIAL_CONTENT);
  const [isLoading, setIsLoading] = useState(true);
  
  // Track initial load to prevent double analytics
  const analyticsTracked = useRef(false);

  // --- 1. LOAD DATA (PARALLEL FETCH) ---
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
        
        // Fetch Config, Leads and Visits in parallel
        const [configRes, leadsRes, visitsRes] = await Promise.all([
            supabase.from('site_content').select('content').single(),
            supabase.from('leads').select('*').order('created_at', { ascending: false }),
            supabase.from('visits').select('*')
        ]);

        let loadedContent = { ...INITIAL_CONTENT };

        // 1. Merge Config
        if (configRes.data?.content) {
            const dbContent = configRes.data.content;
            loadedContent = {
                ...loadedContent,
                ...dbContent,
                // Ensure critical objects exist even if DB JSON is partial
                meteo: dbContent.meteo || INITIAL_CONTENT.meteo,
                promotions: dbContent.promotions || INITIAL_CONTENT.promotions,
                callButtonConfig: dbContent.callButtonConfig || INITIAL_CONTENT.callButtonConfig,
                adminPassword: dbContent.adminPassword || INITIAL_CONTENT.adminPassword,
                stores: dbContent.stores || INITIAL_CONTENT.stores,
                fiberRates: dbContent.fiberRates || INITIAL_CONTENT.fiberRates
            };
        }

        // 2. Merge Leads (from SQL table, ignoring JSON leads if any)
        if (leadsRes.data) {
            // Map SQL columns to TS interface if needed
            const sqlLeads: Lead[] = leadsRes.data.map((l: any) => ({
                id: l.id,
                createdAt: l.created_at,
                name: l.name,
                phone: l.phone,
                email: l.email,
                address: l.address,
                comments: l.comments,
                summary: l.summary, // JSONB comes as object/array
                totalPrice: l.total_price,
                status: l.status
            }));
            loadedContent.leads = sqlLeads;
        }

        // 3. Merge Visits (from SQL table)
        if (visitsRes.data) {
             const sqlVisits = visitsRes.data.map((v: any) => ({
                 week: v.week,
                 source: v.source,
                 count: v.count
             }));
             // If SQL visits exist, use them. Otherwise fallback to initial.
             if (sqlVisits.length > 0) {
                 loadedContent.visits = sqlVisits;
             }
        }

        setContent(loadedContent);

      } catch (err) {
        console.error("Unexpected error loading content:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, []);

  // --- 2. ANALYTICS TRACKING (SQL UPSERT) ---
  useEffect(() => {
    if (isLoading || !isSupabaseConfigured || analyticsTracked.current) return;

    const trackVisit = async () => {
      analyticsTracked.current = true;
      const today = new Date().toISOString().split('T')[0];
      const sessionKey = `eports_visit_${today}`;
      
      if (sessionStorage.getItem(sessionKey)) return;

      try {
        const d = new Date();
        d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
        const currentWeek = `${d.getUTCFullYear()}-W${weekNo}`;

        let source: string = 'direct';
        const ref = document.referrer.toLowerCase();
        if (ref.includes('google') || ref.includes('bing')) source = 'organic';
        else if (ref.includes('facebook') || ref.includes('instagram') || ref.includes('x.com')) source = 'social';
        else if (window.location.search.includes('utm_source')) source = 'ads';

        // Update Local State Optimistically
        setContent(prev => {
            const newVisits = [...(prev.visits || [])];
            const idx = newVisits.findIndex(v => v.week === currentWeek && v.source === source);
            if (idx >= 0) newVisits[idx].count++;
            else newVisits.push({ week: currentWeek, source: source as any, count: 1 });
            return { ...prev, visits: newVisits };
        });

        // UPSERT into 'visits' table
        const { data: existing } = await supabase
            .from('visits')
            .select('id, count')
            .eq('week', currentWeek)
            .eq('source', source)
            .single();

        if (existing) {
            await supabase.from('visits').update({ count: existing.count + 1 }).eq('id', existing.id);
        } else {
            await supabase.from('visits').insert({ week: currentWeek, source, count: 1 });
        }
        
        sessionStorage.setItem(sessionKey, 'true');

      } catch (err) {
        console.error("Error tracking visit:", err);
      }
    };

    const timer = setTimeout(trackVisit, 2000);
    return () => clearTimeout(timer);
  }, [isLoading]);

  // --- 3. SAVE CONTENT (CONFIG ONLY) ---
  const saveContent = async () => {
    if (!isSupabaseConfigured) {
        alert("Mode local: Supabase no està configurat.");
        return;
    }

    try {
       // Create a copy of content for the DB
       const contentToSave = { ...content };
       
       // CRITICAL: Remove Leads and Visits from the JSON blob.
       delete (contentToSave as any).leads;
       delete (contentToSave as any).visits;

       const { error } = await supabase
        .from('site_content')
        .update({ content: contentToSave })
        .eq('id', 1);
       
       if (error) throw error;
       console.log("Config saved successfully.");
    } catch (err) {
        console.error("Failed to save content:", err);
        throw err;
    }
  };

  // --- 4. REAL-TIME SUBSCRIPTION ---
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    // Listen for Config Changes
    const configSub = supabase
      .channel('config-changes')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'site_content' }, (payload) => {
          const newContent = payload.new.content;
          if (newContent) {
              setContent(prev => ({ 
                  ...prev, 
                  ...newContent,
                  leads: prev.leads, 
                  visits: prev.visits 
              }));
          }
      })
      .subscribe();

    // Listen for NEW LEADS (Notification)
    const leadsSub = supabase
      .channel('leads-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'leads' }, (payload) => {
          const newLead = payload.new;
          const mappedLead: Lead = {
              id: newLead.id,
              createdAt: newLead.created_at,
              name: newLead.name,
              phone: newLead.phone,
              email: newLead.email,
              address: newLead.address,
              comments: newLead.comments,
              summary: newLead.summary,
              totalPrice: newLead.total_price,
              status: newLead.status
          };

          try {
             const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3'); 
             audio.play().catch(e => console.log('Audio autoplay blocked'));
          } catch(e) {}

          setContent(prev => ({
              ...prev,
              leads: [mappedLead, ...prev.leads]
          }));
      })
      .subscribe();

    return () => { 
        supabase.removeChannel(configSub);
        supabase.removeChannel(leadsSub);
    };
  }, []);

  // --- HELPERS ---
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

  const updatePack = (pack: Pack) => setContent(prev => ({ ...prev, packs: prev.packs.map(p => p.id === pack.id ? pack : p) }));
  const addPack = (pack: Pack) => setContent(prev => ({ ...prev, packs: [...prev.packs, pack] }));
  const deletePack = (id: string) => setContent(prev => ({ ...prev, packs: prev.packs.filter(p => p.id !== id) }));
  
  const updateMobileRate = (rate: MobileRate) => setContent(prev => ({ ...prev, mobileRates: prev.mobileRates.map(r => r.id === rate.id ? rate : r) }));
  const addMobileRate = (rate: MobileRate) => setContent(prev => ({ ...prev, mobileRates: [...prev.mobileRates, rate] }));
  const deleteMobileRate = (id: string) => setContent(prev => ({ ...prev, mobileRates: prev.mobileRates.filter(r => r.id !== id) }));

  const updateFiberRate = (rate: FiberRate) => setContent(prev => ({ ...prev, fiberRates: prev.fiberRates.map(r => r.id === rate.id ? rate : r) }));
  const addFiberRate = (rate: FiberRate) => setContent(prev => ({ ...prev, fiberRates: [...prev.fiberRates, rate] }));
  const deleteFiberRate = (id: string) => setContent(prev => ({ ...prev, fiberRates: prev.fiberRates.filter(r => r.id !== id) }));

  const updateStore = (store: StoreItem) => setContent(prev => ({ ...prev, stores: prev.stores.map(s => s.id === store.id ? store : s) }));
  const addStore = (store: StoreItem) => setContent(prev => ({ ...prev, stores: [...prev.stores, store] }));
  const deleteStore = (id: string) => setContent(prev => ({ ...prev, stores: prev.stores.filter(s => s.id !== id) }));

  const updatePromotion = (promotion: Promotion) => setContent(prev => ({ ...prev, promotions: prev.promotions.map(p => p.id === promotion.id ? promotion : p) }));
  const addPromotion = (promotion: Promotion) => setContent(prev => ({ ...prev, promotions: [...prev.promotions, promotion] }));
  const deletePromotion = (id: string) => setContent(prev => ({ ...prev, promotions: prev.promotions.filter(p => p.id !== id) }));

  const updateMeteo = (config: MeteoConfig) => setContent(prev => ({ ...prev, meteo: config }));
  
  const updateImage = (key: 'logo' | 'heroBg' | 'footerLogo' | 'favicon', base64: string) => setContent(prev => ({ ...prev, images: { ...prev.images, [key]: base64 } }));
  const updateHeroOpacity = (opacity: number) => setContent(prev => ({ ...prev, heroOverlayOpacity: opacity }));
  const updateHeroAlignment = (alignment: string) => setContent(prev => ({ ...prev, heroAlignment: alignment }));

  const addCustomSection = (section: CustomSection) => setContent(prev => ({ ...prev, customSections: [...prev.customSections, section] }));
  const deleteCustomSection = (id: string) => setContent(prev => ({ ...prev, customSections: prev.customSections.filter(s => s.id !== id) }));

  // --- LEAD ACTIONS (SQL) ---
  const addLead = async (leadData: Omit<Lead, 'id' | 'createdAt' | 'status'>) => {
    const newLead = {
      id: `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString(),
      status: 'NEW',
      name: leadData.name,
      phone: leadData.phone,
      email: leadData.email,
      address: leadData.address,
      comments: leadData.comments,
      summary: leadData.summary,
      total_price: leadData.totalPrice
    };

    const uiLead: Lead = {
        ...leadData,
        id: newLead.id,
        createdAt: newLead.created_at,
        status: 'NEW'
    };
    setContent(prev => ({ ...prev, leads: [uiLead, ...prev.leads] }));

    if (isSupabaseConfigured) {
        await supabase.from('leads').insert(newLead);
    }
  };

  const updateLeadStatus = async (id: string, status: Lead['status']) => {
      setContent(prev => ({ ...prev, leads: prev.leads.map(lead => lead.id === id ? { ...lead, status } : lead) }));
      
      if (isSupabaseConfigured) {
          await supabase.from('leads').update({ status }).eq('id', id);
      }
  };

  const deleteLead = async (id: string) => {
      setContent(prev => ({ ...prev, leads: prev.leads.filter(lead => lead.id !== id) }));
      
      if (isSupabaseConfigured) {
          await supabase.from('leads').delete().eq('id', id);
      }
  };

  const updateNotificationEmail = (email: string) => setContent(prev => ({ ...prev, notificationEmail: email }));
  const updateAdminPassword = (password: string) => setContent(prev => ({ ...prev, adminPassword: password }));
  const updateCallButtonConfig = (config: CallButtonConfig) => setContent(prev => ({ ...prev, callButtonConfig: config }));

  const resetToDefaults = () => {
    if(window.confirm("ATENCIÓ: Això esborrarà TOTA la configuració. Continuar?")) {
        setContent(INITIAL_CONTENT);
        if (isSupabaseConfigured) {
            saveContent(); 
        }
    }
  };

  const importData = (data: AppContent) => {
      if (!data || !data.translations) {
          alert("L'arxiu JSON no és vàlid.");
          return;
      }
      setContent(prev => ({ ...prev, ...data }));
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
      updateFiberRate,
      addFiberRate,
      deleteFiberRate,
      updateStore,
      addStore,
      deleteStore,
      updatePromotion,
      addPromotion,
      deletePromotion,
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