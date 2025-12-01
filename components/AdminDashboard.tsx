import React, { useState } from 'react';
import { useContent } from '../contexts/ContentContext';
import { Language, Pack, CustomSection, Lead, Feature, Testimonial, FAQItem, AppContent, CameraItem, MobileRate, CallButtonConfig, StoreItem, FiberRate, Promotion } from '../types';
import { X, Upload, Save, Trash2, Plus, Layout, Smartphone, Wifi, Image as ImageIcon, RefreshCw, Users, Lock, Star, HelpCircle, Zap, Database, Download, AlertTriangle, Grid, Megaphone, Camera, ExternalLink, Eye, EyeOff, BarChart2, MapPin, Phone, Mail, Bell, Check, Move, LogOut, Store, Wand2 } from 'lucide-react';
import { IMAGES, CALL_BUTTON_DEFAULT } from '../constants';
import { AdminLogin } from './AdminLogin';
import { logoutAdmin } from '../supabaseAuth';
import { supabase } from '../lib/supabase';
import { translateCatToEs, quickTranslateCatToEs } from '../lib/translator';

interface AdminDashboardProps {
  onClose: () => void;
}

// Helper To compress images before saving to avoid DB/localStorage limits
const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;
                const MAX_WIDTH = 1200;
                const MAX_HEIGHT = 1200;

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }
                
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    resolve(event.target?.result as string);
                    return;
                }
                
                ctx.drawImage(img, 0, 0, width, height);
                
                const fileType = file.type;
                const outputFormat = (fileType === 'image/jpeg' || fileType === 'image/jpg') ? 'image/jpeg' : 'image/png';
                resolve(canvas.toDataURL(outputFormat, 0.8));
            };
            img.onerror = (error) => reject(error);
        };
        reader.onerror = (error) => reject(error);
    });
};

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
  const { 
    translations, packs, mobileRates, fiberRates, stores, promotions, meteo, images, heroOverlayOpacity, heroAlignment, customSections, leads, visits, notificationEmail, adminPassword, callButtonConfig,
    updateTranslation, updatePack, addPack, deletePack, updateMobileRate, addMobileRate, deleteMobileRate, updateFiberRate, addFiberRate, deleteFiberRate, updateStore, addStore, deleteStore, updatePromotion, addPromotion, deletePromotion, updateMeteo, updateImage, updateHeroOpacity, updateHeroAlignment, addCustomSection, deleteCustomSection, updateLeadStatus, deleteLead, updateNotificationEmail, updateAdminPassword, updateCallButtonConfig, resetToDefaults, importData, saveContent
  } = useContent();

  // --- AUTH STATE ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [visitsData, setVisitsData] = useState<any[]>([]);

  // --- DASHBOARD STATE ---
  const [activeTab, setActiveTab] = useState<'general' | 'hero' | 'products' | 'mobile' | 'stores' | 'promotions' | 'features' | 'testimonials' | 'faq' | 'configurator' | 'footer' | 'sections' | 'leads' | 'data' | 'meteo' | 'analytics'>('general');
  const [editingLang, setEditingLang] = useState<Language>('ca');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const currentCallButtonConfig = callButtonConfig || CALL_BUTTON_DEFAULT;

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    loadVisits(); // Carregar visits quan es fa login
  };

  // 🆕 Funció per carregar visits de Supabase
  const loadVisits = async () => {
    try {
      console.log('📊 Carregant visits de Supabase...');
      const { data, error } = await supabase
        .from('visits')
        .select('*')
        .order('week', { ascending: true });

      if (error) {
        console.error('❌ Error loading visits:', error);
        return;
      }

      console.log('✅ Visits carregades:', data?.length, 'files');
      setVisitsData(data || []);
    } catch (error) {
      console.error('❌ Error:', error);
    }
  };

  // Carregar visits quan el component es munta
  React.useEffect(() => {
    if (isAuthenticated) {
      loadVisits();
      // Recarregar cada 30 segons
      const interval = setInterval(loadVisits, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const handleLogout = async () => {
    await logoutAdmin();
    setIsAuthenticated(false);
    onClose();
  };

  const handleSave = async () => {
    setSaveStatus('saving');
    try {
        await saveContent();
        setSaveStatus('saved');
        setTimeout(() => {
            setSaveStatus('idle');
        }, 2000);
    } catch (e) {
        setSaveStatus('error');
        setTimeout(() => {
            setSaveStatus('idle');
        }, 3000);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, key: 'logo' | 'heroBg' | 'footerLogo') => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
          alert("L'arxiu és massa gran (>10MB). Si us plau, utilitza una imatge més petita.");
          return;
      }
      try {
        const compressedBase64 = await compressImage(file);
        updateImage(key, compressedBase64);
      } catch (err) {
        console.error("Image compression failed", err);
        alert("Error processant la imatge.");
      }
    }
    e.target.value = '';
  };

  const handleRemoveImage = (key: 'logo' | 'heroBg' | 'footerLogo') => {
      updateImage(key, ''); 
  };

  // Meteo Specific handlers
  const handleMeteoTextChange = (key: 'title' | 'subtitle', value: string) => {
      updateMeteo({
          ...meteo,
          [key]: { ...meteo[key], [editingLang]: value }
      });
  };

  const handleAddCamera = () => {
      const newCam: CameraItem = {
          id: `c_${Date.now()}`,
          name: 'Nova Càmera',
          url: 'https://meteo.eportsinternet.com',
          image: 'https://images.unsplash.com/photo-1558444654-20412808c1d3?q=80&w=800&auto=format&fit=crop',
          visible: true
      };
      updateMeteo({
          ...meteo,
          items: [...meteo.items, newCam]
      });
  };

  const handleRemoveCamera = (id: string) => {
      updateMeteo({
          ...meteo,
          items: meteo.items.filter(c => c.id !== id)
      });
  };

  const updateCameraField = (id: string, field: keyof CameraItem, value: any) => {
      updateMeteo({
          ...meteo,
          items: meteo.items.map(c => c.id === id ? { ...c, [field]: value } : c)
      });
  };

  const handleCameraImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
      const file = e.target.files?.[0];
      if (file) {
        try {
            const compressedBase64 = await compressImage(file);
            updateCameraField(id, 'image', compressedBase64);
        } catch (err) {
            alert("Error processant imatge");
        }
      }
      e.target.value = '';
  };

  const handleNewPack = () => {
    const newPack: Pack = {
      id: `p${Date.now()}`,
      name: { ca: 'Nou Paquet', es: 'Nuevo Paquete' },
      speedMb: 300,
      mobileLines: 1,
      mobileGbPerLine: 25,
      hasLandline: false,
      price: 0,
      description: { ca: 'Descripció del paquet', es: 'Descripción del paquete' }
    };
    addPack(newPack);
  };
  
  const handleNewMobileRate = () => {
    addMobileRate({
        id: `m_${Date.now()}`,
        name: 'Nova Tarifa',
        gb: 10,
        price: 9.90
    });
  };

  const handleNewFiberRate = () => {
      addFiberRate({
          id: `f_${Date.now()}`,
          name: 'Nova Fibra',
          speedMb: 100,
          technology: 'FIBER',
          price: 24.90
      });
  };

  const handleNewStore = () => {
      addStore({
          id: `s_${Date.now()}`,
          name: 'Nova Botiga',
          address: 'Adreça...',
          url: ''
      });
  };
  
  const handleNewPromotion = async () => {
      const newPromo: Promotion = {
          id: `pr_${Date.now()}`,
          isActive: false,
          title: { ca: 'Nova Promoció', es: 'Nueva Promoción' },
          text: { ca: 'Text de la promoció...', es: 'Texto de la promoción...' },
          startDate: new Date().toISOString(),
          endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
          backgroundColor: '#000000',
          textColor: '#FFFFFF'
      };
      addPromotion(newPromo);
      
      // Auto-translate de manera ràpida
      const esTitle = await quickTranslateCatToEs(newPromo.title.ca);
      const esText = await quickTranslateCatToEs(newPromo.text.ca);
      
      // Actualitzar amb les traduccions
      updatePromotion({
          ...newPromo,
          title: { ca: newPromo.title.ca, es: esTitle },
          text: { ca: newPromo.text.ca, es: esText }
      });
  };

  const handleNewSection = () => {
    const newSection: CustomSection = {
        id: `sec${Date.now()}`,
        title: { ca: 'Nova Secció', es: 'Nueva Sección' },
        content: { ca: 'Contingut de la secció...', es: 'Contenido de la sección...' },
        order: customSections.length + 1
    };
    addCustomSection(newSection);
  };

  // Helper Wrappers for deep updates
  const updateFeatureItem = (index: number, field: keyof Feature, value: string) => {
      const currentItems = [...translations[editingLang].features.items];
      currentItems[index] = { ...currentItems[index], [field]: value };
      updateTranslation(editingLang, 'features', 'items', currentItems);
  };

  const addTestimonial = () => {
      const newItem: Testimonial = { name: 'Nom Client', location: 'Població', text: 'Opinió...', rating: 5 };
      const currentItems = [...translations[editingLang].testimonials.items];
      updateTranslation(editingLang, 'testimonials', 'items', [...currentItems, newItem]);
  };
  const removeTestimonial = (index: number) => {
      const currentItems = [...translations[editingLang].testimonials.items];
      const newItems = currentItems.filter((_, i) => i !== index);
      updateTranslation(editingLang, 'testimonials', 'items', newItems);
  };
  const updateTestimonial = (index: number, field: keyof Testimonial, value: any) => {
      const currentItems = [...translations[editingLang].testimonials.items];
      currentItems[index] = { ...currentItems[index], [field]: value };
      updateTranslation(editingLang, 'testimonials', 'items', currentItems);
  };

  const addFAQ = () => {
      const newItem: FAQItem = { question: 'Nova Pregunta?', answer: 'Resposta...' };
      const currentItems = [...translations[editingLang].faq.items];
      updateTranslation(editingLang, 'faq', 'items', [...currentItems, newItem]);
  };
  const removeFAQ = (index: number) => {
      const currentItems = [...translations[editingLang].faq.items];
      const newItems = currentItems.filter((_, i) => i !== index);
      updateTranslation(editingLang, 'faq', 'items', newItems);
  };
  const updateFAQ = (index: number, field: keyof FAQItem, value: string) => {
      const currentItems = [...translations[editingLang].faq.items];
      currentItems[index] = { ...currentItems[index], [field]: value };
      updateTranslation(editingLang, 'faq', 'items', currentItems);
  };
  
  const handleExport = () => {
      const dataToExport: AppContent = {
          translations, packs, fiberRates, mobileRates, stores, promotions, meteo, images, heroOverlayOpacity, heroAlignment, customSections, leads, visits, notificationEmail, adminPassword, callButtonConfig
      };
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dataToExport, null, 2));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", "eports_backup_" + new Date().toISOString().slice(0,10) + ".json");
      document.body.appendChild(downloadAnchorNode); 
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (event) => {
          try {
              const json = JSON.parse(event.target?.result as string);
              if(window.confirm("Això sobreescriurà totes les dades. Estàs segur?")) {
                  importData(json);
                  alert("Dades importades. Recorda 'Desar Canvis'.");
              }
          } catch(error) {
              alert("Error al llegir el fitxer JSON.");
          }
      };
      reader.readAsText(file);
  };

  const newLeadsCount = leads.filter(l => l.status === 'NEW').length;
  const previewHeroBg = images.heroBg && images.heroBg !== '' ? images.heroBg : IMAGES.heroBg;

  const AlignmentButton = ({ value, label }: { value: string, label?: string }) => {
      const isSelected = (heroAlignment || 'center') === value;
      return (
          <button 
             onClick={() => updateHeroAlignment(value)}
             className={`
                w-full aspect-square flex items-center justify-center rounded-md border transition-all text-xs font-bold
                ${isSelected ? 'bg-brand-pink text-white border-brand-pink ring-2 ring-brand-pink/30' : 'bg-white border-gray-200 text-gray-400 hover:bg-gray-50'}
             `}
             title={`Alinear: ${value}`}
          >
             {label || ""}
             {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
          </button>
      );
  };

  const getChartData = () => {
    const grouped: Record<string, { direct: number, social: number, organic: number, ads: number, total: number }> = {};
    const weeks: string[] = [];
    const dataToUse = (visitsData && visitsData.length > 0) ? visitsData : [];

    dataToUse.forEach((v: any) => {
        if (!grouped[v.week]) {
            grouped[v.week] = { direct: 0, social: 0, organic: 0, ads: 0, total: 0 };
            weeks.push(v.week);
        }
        grouped[v.week][v.source] += v.count;
        grouped[v.week].total += v.count;
    });

    let maxTotal = 0;
    Object.values(grouped).forEach(g => {
        if (g.total > maxTotal) maxTotal = g.total;
    });
    if (maxTotal === 0) maxTotal = 100;

    return { grouped, weeks: weeks.sort(), maxTotal };
  };

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="fixed inset-0 z-[100] bg-gray-100 flex flex-col animate-fade-in">
      {/* Header */}
      <div className="bg-brand-purple text-white px-6 py-4 flex justify-between items-center shadow-lg shrink-0">
        <div className="flex items-center gap-3">
            <Layout size={24} className="text-brand-pink" />
            <h1 className="text-xl font-bold hidden sm:block">Dashboard e-ports (Cloud)</h1>
        </div>
        <div className="flex items-center gap-4">
            <button 
                onClick={handleSave} 
                disabled={saveStatus === 'saving'}
                className={`
                    px-5 py-2 rounded-lg font-bold flex items-center gap-2 shadow-lg transition-all transform 
                    ${saveStatus === 'saved' ? 'bg-green-500 text-white' : 
                      saveStatus === 'error' ? 'bg-red-500 text-white' : 
                      'bg-brand-pink text-white hover:bg-[#a00065] hover:scale-105'}
                    disabled:opacity-70 disabled:scale-100
                `}
            >
                {saveStatus === 'saving' && <RefreshCw size={18} className="animate-spin" />}
                {saveStatus === 'saved' && <Check size={18} />}
                {saveStatus === 'error' && <AlertTriangle size={18} />}
                {saveStatus === 'idle' && <Save size={18} />}
                
                {saveStatus === 'saving' && 'Desant al Núvol...'}
                {saveStatus === 'saved' && 'Desat!'}
                {saveStatus === 'error' && 'Error al desar'}
                {saveStatus === 'idle' && 'Desar Canvis'}
            </button>
            <div className="w-px h-6 bg-white/20 mx-2"></div>
            <button 
              onClick={handleLogout}
              className="bg-white/10 hover:bg-red-500 p-2 rounded-full transition-colors" 
              title="Logout"
            >
              <LogOut size={20} />
            </button>
            <button onClick={onClose} className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors ml-2">
                <X size={20} />
            </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col hidden md:flex overflow-y-auto">
            <nav className="p-4 space-y-2">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 mt-2 pl-2">Configuració</div>
                <button onClick={() => setActiveTab('general')} className={`w-full text-left px-4 py-3 rounded-lg font-medium flex items-center gap-3 ${activeTab === 'general' ? 'bg-brand-pink text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
                    <ImageIcon size={18} /> General & Logo
                </button>
                <button onClick={() => setActiveTab('hero')} className={`w-full text-left px-4 py-3 rounded-lg font-medium flex items-center gap-3 ${activeTab === 'hero' ? 'bg-brand-pink text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
                    <Layout size={18} /> Portada (Hero)
                </button>
                <button onClick={() => setActiveTab('stores')} className={`w-full text-left px-4 py-3 rounded-lg font-medium flex items-center gap-3 ${activeTab === 'stores' ? 'bg-brand-pink text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
                    <Store size={18} /> Botigues
                </button>
                <button onClick={() => setActiveTab('promotions')} className={`w-full text-left px-4 py-3 rounded-lg font-medium flex items-center gap-3 ${activeTab === 'promotions' ? 'bg-brand-pink text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
                    <Megaphone size={18} /> Promocions
                </button>
                <button onClick={() => setActiveTab('footer')} className={`w-full text-left px-4 py-3 rounded-lg font-medium flex items-center gap-3 ${activeTab === 'footer' ? 'bg-brand-pink text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
                    <Phone size={18} /> Peu de Pàgina
                </button>
                
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 mt-4 pl-2">Contingut</div>
                <button onClick={() => setActiveTab('products')} className={`w-full text-left px-4 py-3 rounded-lg font-medium flex items-center gap-3 ${activeTab === 'products' ? 'bg-brand-pink text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
                    <Wifi size={18} /> Fibra i Paquets
                </button>
                <button onClick={() => setActiveTab('mobile')} className={`w-full text-left px-4 py-3 rounded-lg font-medium flex items-center gap-3 ${activeTab === 'mobile' ? 'bg-brand-pink text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
                    <Smartphone size={18} /> Tarifes Mòbil
                </button>
                <button onClick={() => setActiveTab('features')} className={`w-full text-left px-4 py-3 rounded-lg font-medium flex items-center gap-3 ${activeTab === 'features' ? 'bg-brand-pink text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
                    <Zap size={18} /> Avantatges
                </button>
                <button onClick={() => setActiveTab('testimonials')} className={`w-full text-left px-4 py-3 rounded-lg font-medium flex items-center gap-3 ${activeTab === 'testimonials' ? 'bg-brand-pink text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
                    <Star size={18} /> Testimonis
                </button>
                <button onClick={() => setActiveTab('faq')} className={`w-full text-left px-4 py-3 rounded-lg font-medium flex items-center gap-3 ${activeTab === 'faq' ? 'bg-brand-pink text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
                    <HelpCircle size={18} /> FAQ
                </button>
                <button onClick={() => setActiveTab('sections')} className={`w-full text-left px-4 py-3 rounded-lg font-medium flex items-center gap-3 ${activeTab === 'sections' ? 'bg-brand-pink text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
                    <Plus size={18} /> Seccions Extra
                </button>
                <button onClick={() => setActiveTab('meteo')} className={`w-full text-left px-4 py-3 rounded-lg font-medium flex items-center gap-3 ${activeTab === 'meteo' ? 'bg-brand-pink text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
                    <Camera size={18} /> Meteo / Càmeres
                </button>

                <div className="h-px bg-gray-200 my-2"></div>
                <button onClick={() => setActiveTab('leads')} className={`w-full text-left px-4 py-3 rounded-lg font-medium flex items-center gap-3 ${activeTab === 'leads' ? 'bg-brand-pink text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
                    <Users size={18} /> Clients / Leads
                    {newLeadsCount > 0 && (
                      <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        {newLeadsCount}
                      </span>
                    )}
                </button>
                 <button onClick={() => setActiveTab('analytics')} className={`w-full text-left px-4 py-3 rounded-lg font-medium flex items-center gap-3 ${activeTab === 'analytics' ? 'bg-brand-pink text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
                    <BarChart2 size={18} /> Analítica
                </button>

                <div className="h-px bg-gray-200 my-2"></div>
                <button onClick={() => setActiveTab('data')} className={`w-full text-left px-4 py-3 rounded-lg font-medium flex items-center gap-3 ${activeTab === 'data' ? 'bg-brand-pink text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
                    <Database size={18} /> Avançat / Dades
                </button>
            </nav>
        </div>

        {/* Mobile Tab Selector */}
        <div className="md:hidden bg-white border-b border-gray-200 p-2 flex overflow-x-auto gap-2 absolute w-full z-10 scrollbar-hide top-16">
             <button onClick={() => setActiveTab('general')} className={`whitespace-nowrap px-3 py-2 rounded-lg text-sm font-bold ${activeTab === 'general' ? 'bg-brand-pink text-white' : 'bg-gray-100'}`}>Logo</button>
             <button onClick={() => setActiveTab('hero')} className={`whitespace-nowrap px-3 py-2 rounded-lg text-sm font-bold ${activeTab === 'hero' ? 'bg-brand-pink text-white' : 'bg-gray-100'}`}>Portada</button>
             <button onClick={() => setActiveTab('products')} className={`whitespace-nowrap px-3 py-2 rounded-lg text-sm font-bold ${activeTab === 'products' ? 'bg-brand-pink text-white' : 'bg-gray-100'}`}>Paquets</button>
             <button onClick={() => setActiveTab('stores')} className={`whitespace-nowrap px-3 py-2 rounded-lg text-sm font-bold ${activeTab === 'stores' ? 'bg-brand-pink text-white' : 'bg-gray-100'}`}>Botigues</button>
             <button onClick={() => setActiveTab('leads')} className={`whitespace-nowrap px-3 py-2 rounded-lg text-sm font-bold ${activeTab === 'leads' ? 'bg-brand-pink text-white' : 'bg-gray-100'}`}>Leads</button>
             <button onClick={() => setActiveTab('meteo')} className={`whitespace-nowrap px-3 py-2 rounded-lg text-sm font-bold ${activeTab === 'meteo' ? 'bg-brand-pink text-white' : 'bg-gray-100'}`}>Meteo</button>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 mt-12 md:mt-0 pb-24">
            
            {/* Language Switcher */}
            {['hero', 'features', 'testimonials', 'faq', 'sections', 'configurator', 'footer', 'promotions', 'meteo', 'products', 'stores'].includes(activeTab) && (
                <div className="flex gap-4 mb-6 bg-white p-2 rounded-xl w-fit shadow-sm border border-gray-100">
                    <button onClick={() => setEditingLang('ca')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${editingLang === 'ca' ? 'bg-brand-pink text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'}`}>Català</button>
                    <button onClick={() => setEditingLang('es')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${editingLang === 'es' ? 'bg-brand-pink text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'}`}>Español</button>
                </div>
            )}

            {/* --- ANALYTICS TAB --- */}
            {activeTab === 'analytics' && (
                <div className="space-y-8 max-w-5xl">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                 <BarChart2 size={24} className="text-brand-purple" /> Visites Web Setmanals
                            </h2>
                            <button 
                                onClick={loadVisits}
                                className="px-3 py-2 bg-brand-pink text-white rounded-lg hover:bg-[#a00065] transition-colors flex items-center gap-2 text-sm font-bold"
                            >
                                <RefreshCw size={16} /> Recarregar
                            </button>
                        </div>
                        
                        {visitsData && visitsData.length > 0 ? (
                            <div className="h-[500px] flex items-end gap-2 sm:gap-4 justify-center">
                                 {getChartData().weeks.map((week, idx) => {
                                     const data = getChartData().grouped[week];
                                     const height = (data.total / getChartData().maxTotal) * 100;
                                     return (
                                         <div key={week} className="flex flex-col items-center group relative h-full">
                                              <div className="absolute bottom-full mb-2 bg-gray-800 text-white text-xs p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity w-40 text-center z-10">
                                                  <b>Setmana {week.split('-W')[1]}</b><br/>
                                                  Total: {data.total}<br/>
                                                  Directe: {data.direct}<br/>
                                                  Social: {data.social}<br/>
                                                  Orgànic: {data.organic}<br/>
                                                  Ads: {data.ads}
                                              </div>
                                              <div className="w-12 sm:w-16 bg-gray-100 rounded-t-lg relative overflow-hidden flex flex-col justify-end hover:brightness-95 transition-all border border-gray-300" style={{ height: `${Math.max(height, 5)}%`, minHeight: '20px' }}>
                                                  {data.direct > 0 && <div className="bg-brand-pink w-full" style={{ height: `${(data.direct / data.total) * 100}%` }}></div>}
                                                  {data.social > 0 && <div className="bg-brand-purple w-full" style={{ height: `${(data.social / data.total) * 100}%` }}></div>}
                                                  {data.organic > 0 && <div className="bg-blue-400 w-full" style={{ height: `${(data.organic / data.total) * 100}%` }}></div>}
                                                  {data.ads > 0 && <div className="bg-yellow-400 w-full" style={{ height: `${(data.ads / data.total) * 100}%` }}></div>}
                                              </div>
                                              <span className="text-xs text-gray-400 mt-2 font-medium">Setm {week.split('-W')[1]}</span>
                                         </div>
                                     )
                                 })}
                            </div>
                        ) : (
                            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200">
                                <p className="text-gray-500 font-medium">No hi ha dades de visites encara. Les estadístiques apareixeran quan els visitants accedeixin a la web.</p>
                            </div>
                        )}
                        
                        <div className="flex gap-4 justify-center mt-6 text-xs text-gray-500 flex-wrap">
                             <div className="flex items-center gap-1"><div className="w-3 h-3 bg-brand-pink rounded-sm"></div> Directe</div>
                             <div className="flex items-center gap-1"><div className="w-3 h-3 bg-brand-purple rounded-sm"></div> Social</div>
                             <div className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-400 rounded-sm"></div> Orgànic</div>
                             <div className="flex items-center gap-1"><div className="w-3 h-3 bg-yellow-400 rounded-sm"></div> Ads</div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- GENERAL TAB --- */}
            {activeTab === 'general' && (
                <div className="space-y-8 max-w-4xl">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <ImageIcon size={20} className="text-brand-purple" /> Logotip Principal
                        </h2>
                        <div className="flex flex-col items-center gap-6">
                            <div className="w-full h-32 bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden border border-gray-200 p-4 shrink-0 relative group">
                                {images.logo ? (
                                    <img src={images.logo} alt="Logo" className="w-full h-full object-contain" />
                                ) : (
                                    <div className="text-center">
                                        <span className="text-brand-pink text-2xl font-black tracking-tighter block mb-1">e-ports</span>
                                        <span className="text-gray-400 text-xs">(Vista per defecte: Text)</span>
                                    </div>
                                )}
                            </div>
                            <div className="w-full space-y-3">
                                <label className="cursor-pointer bg-brand-purple text-white px-4 py-3 rounded-xl hover:bg-brand-pink transition-colors flex items-center justify-center gap-2 w-full font-bold shadow-md hover:shadow-lg">
                                    <Upload size={18} /> Pujar Nou Logo (SVG/PNG)
                                    <input type="file" className="hidden" accept=".svg,.png,.jpg,.jpeg,image/*" onChange={(e) => handleImageUpload(e, 'logo')} />
                                </label>
                                {images.logo && (
                                    <button onClick={() => handleRemoveImage('logo')} className="text-red-500 hover:text-red-700 text-sm flex items-center justify-center gap-1 w-full font-medium py-2 border border-red-100 rounded-lg hover:bg-red-50">
                                        <Trash2 size={14} /> Eliminar i tornar al Text
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <Move size={20} className="text-brand-purple" /> Botó Flotant de Trucada
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Posició (Costat)</label>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => updateCallButtonConfig({ ...currentCallButtonConfig, side: 'left' })}
                                        className={`flex-1 py-2 px-3 rounded-lg font-bold border ${currentCallButtonConfig.side === 'left' ? 'bg-brand-purple text-white border-brand-purple' : 'bg-gray-50 text-gray-600'}`}
                                    >
                                        Esquerra
                                    </button>
                                    <button 
                                        onClick={() => updateCallButtonConfig({ ...currentCallButtonConfig, side: 'right' })}
                                        className={`flex-1 py-2 px-3 rounded-lg font-bold border ${currentCallButtonConfig.side === 'right' ? 'bg-brand-purple text-white border-brand-purple' : 'bg-gray-50 text-gray-600'}`}
                                    >
                                        Dreta
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Altura Desktop (px des de dalt)</label>
                                <input 
                                    type="number" 
                                    value={currentCallButtonConfig.desktopTop}
                                    onChange={(e) => updateCallButtonConfig({ ...currentCallButtonConfig, desktopTop: parseInt(e.target.value) })}
                                    className="w-full p-2 border rounded-lg"
                                />
                                <span className="text-xs text-gray-400">Ex: 160</span>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Altura Mòbil (px des de dalt)</label>
                                <input 
                                    type="number" 
                                    value={currentCallButtonConfig.mobileTop}
                                    onChange={(e) => updateCallButtonConfig({ ...currentCallButtonConfig, mobileTop: parseInt(e.target.value) })}
                                    className="w-full p-2 border rounded-lg"
                                />
                                <span className="text-xs text-gray-400">Ex: 128</span>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Text del Botó (Català)</label>
                                <input 
                                    type="text"
                                    value={currentCallButtonConfig.text?.ca || "Truca ara i canvia't a e-ports"}
                                    onChange={(e) => updateCallButtonConfig({ 
                                        ...currentCallButtonConfig, 
                                        text: { 
                                            ...(currentCallButtonConfig.text || { ca: "", es: "" }), 
                                            ca: e.target.value 
                                        } 
                                    })}
                                    className="w-full p-2 border rounded-lg mb-2"
                                />
                                <label className="block text-sm font-medium text-gray-700 mb-2">Text del Botó (Castellà)</label>
                                <input 
                                    type="text"
                                    value={currentCallButtonConfig.text?.es || "Llama y cámbiate a e-ports"}
                                    onChange={(e) => updateCallButtonConfig({ 
                                        ...currentCallButtonConfig, 
                                        text: { 
                                            ...(currentCallButtonConfig.text || { ca: "", es: "" }), 
                                            es: e.target.value 
                                        } 
                                    })}
                                    className="w-full p-2 border rounded-lg"
                                />
                            </div>
                        </div>
                    </div>

                </div>
            )}
            
            {/* --- HERO TAB --- */}
            {activeTab === 'hero' && (
                <div className="space-y-8 max-w-4xl">
                     <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Textos Principals</h2>
                        <div className="space-y-4">
                             <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Títol Principal</label>
                                <input 
                                    type="text" 
                                    value={translations[editingLang].hero.title} 
                                    onChange={(e) => updateTranslation(editingLang, 'hero', 'title', e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:border-brand-pink outline-none"
                                />
                             </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Subtítol</label>
                                <textarea 
                                    value={translations[editingLang].hero.subtitle} 
                                    onChange={(e) => updateTranslation(editingLang, 'hero', 'subtitle', e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-lg h-24 focus:border-brand-pink outline-none"
                                />
                             </div>
                        </div>
                    </div>
                    
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                         <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                             <ImageIcon size={20} className="text-brand-purple" /> Imatge de Fons (Portada)
                         </h2>
                         <div className="w-full h-64 bg-gray-900 rounded-lg overflow-hidden border border-gray-300 relative group mb-4">
                                <img 
                                    src={previewHeroBg} 
                                    alt="Hero Bg" 
                                    className="absolute inset-0 w-full h-full object-cover transition-all duration-300"
                                    style={{ objectPosition: heroAlignment || 'center' }}
                                />
                                <div 
                                    className="absolute inset-0 bg-gradient-to-br from-brand-purple via-[#4a2c8a] to-brand-pink transition-all duration-300"
                                    style={{ opacity: heroOverlayOpacity ?? 0.4 }}
                                ></div>
                         </div>
                         
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div>
                                <label className="cursor-pointer bg-white text-brand-purple border-2 border-brand-purple px-4 py-3 rounded-xl hover:bg-brand-purple hover:text-white transition-colors flex items-center justify-center gap-2 w-full font-bold">
                                    <Upload size={18} /> Canviar Imatge
                                    <input type="file" className="hidden" accept=".jpg,.jpeg,.png,.webp" onChange={(e) => handleImageUpload(e, 'heroBg')} />
                                </label>
                             </div>
                             <div>
                                 <label className="text-sm font-bold text-gray-700 mb-2 block">Opacitat del Color ({Math.round((heroOverlayOpacity || 0.4) * 100)}%)</label>
                                 <input 
                                    type="range" 
                                    min="0" 
                                    max="0.9" 
                                    step="0.1" 
                                    value={heroOverlayOpacity} 
                                    onChange={(e) => updateHeroOpacity(parseFloat(e.target.value))}
                                    className="w-full accent-brand-pink"
                                 />
                             </div>
                         </div>

                         <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mt-6">
                                <label className="text-sm font-bold text-gray-700 flex items-center gap-2 mb-3">
                                    <Grid size={16} className="text-brand-pink" /> Enquadrament de la Imatge
                                </label>
                                <div className="flex gap-4">
                                    <div className="grid grid-cols-3 gap-2 w-32 shrink-0">
                                        <AlignmentButton value="top left" />
                                        <AlignmentButton value="top" />
                                        <AlignmentButton value="top right" />
                                        <AlignmentButton value="left" />
                                        <AlignmentButton value="center" />
                                        <AlignmentButton value="right" />
                                        <AlignmentButton value="bottom left" />
                                        <AlignmentButton value="bottom" />
                                        <AlignmentButton value="bottom right" />
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        Selecciona el punt d'interès per assegurar que es vegi el més important de la foto.
                                    </p>
                                </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- STORES TAB --- */}
            {activeTab === 'stores' && (
                <div className="space-y-8 max-w-4xl">
                     <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <div className="flex justify-between items-center mb-6">
                             <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2"><Store className="text-brand-purple"/> Botigues Físiques</h2>
                             <button onClick={handleNewStore} className="bg-brand-pink text-white px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-brand-purple"><Plus size={16}/> Nova Botiga</button>
                        </div>
                        
                        <div className="space-y-4">
                             {stores.map((store) => (
                                 <div key={store.id} className="bg-gray-50 border border-gray-200 p-4 rounded-xl flex items-center gap-4 relative">
                                    <div className="bg-brand-light p-3 rounded-full text-brand-pink shrink-0">
                                        <Store size={20} />
                                    </div>
                                    <div className="flex-grow space-y-2">
                                        <input 
                                            value={store.name} 
                                            onChange={(e) => updateStore({ ...store, name: e.target.value })} 
                                            className="w-full font-bold bg-white border border-gray-200 p-2 rounded focus:border-brand-pink outline-none" 
                                            placeholder="Nom de la botiga"
                                        />
                                        <input 
                                            value={store.address} 
                                            onChange={(e) => updateStore({ ...store, address: e.target.value })} 
                                            className="w-full text-sm bg-white border border-gray-200 p-2 rounded focus:border-brand-pink outline-none" 
                                            placeholder="Adreça completa"
                                        />
                                        <div className="flex items-center gap-2">
                                            <MapPin size={14} className="text-gray-400" />
                                            <input 
                                                value={store.url || ''} 
                                                onChange={(e) => updateStore({ ...store, url: e.target.value })} 
                                                className="w-full text-xs text-gray-500 bg-transparent border-b border-gray-200 focus:border-brand-pink outline-none" 
                                                placeholder="URL Google Maps (Opcional)"
                                            />
                                        </div>
                                    </div>
                                    <button onClick={() => deleteStore(store.id)} className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-full">
                                        <Trash2 size={18}/>
                                    </button>
                                 </div>
                             ))}
                         </div>
                     </div>
                </div>
            )}

            {/* --- PRODUCTS TAB (PACKS) --- */}
            {activeTab === 'products' && (
                <div className="space-y-8 max-w-5xl">
                    
                    {/* FIBER RATES (CONFIGURATOR STEP 1) */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                         <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2"><Zap className="text-brand-purple"/> Tarifes Fibra (Pas 1 Configurador)</h2>
                            <button onClick={handleNewFiberRate} className="bg-brand-pink text-white px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-brand-purple"><Plus size={16}/> Afegir Opció</button>
                         </div>
                         <div className="space-y-4">
                             {fiberRates.map((fiber) => (
                                 <div key={fiber.id} className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
                                     <div className="bg-white p-2 rounded-lg font-bold w-16 text-center shadow-sm">
                                         {fiber.speedMb} Mb
                                     </div>
                                     <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-4">
                                         <div>
                                             <label className="text-xs text-gray-500 block">Nom</label>
                                             <input value={fiber.name} onChange={(e) => updateFiberRate({ ...fiber, name: e.target.value })} className="w-full font-medium bg-transparent border-b border-gray-300 focus:border-brand-pink outline-none" />
                                         </div>
                                         <div>
                                             <label className="text-xs text-gray-500 block">Preu (€)</label>
                                             <input type="number" value={fiber.price} onChange={(e) => updateFiberRate({ ...fiber, price: parseFloat(e.target.value) })} className="w-full font-bold text-brand-purple bg-transparent border-b border-gray-300 focus:border-brand-pink outline-none" />
                                         </div>
                                         <div className="hidden md:block">
                                             <label className="text-xs text-gray-500 block">Velocitat (Mb)</label>
                                             <input type="number" value={fiber.speedMb} onChange={(e) => updateFiberRate({ ...fiber, speedMb: parseInt(e.target.value) })} className="w-full font-medium bg-transparent border-b border-gray-300 focus:border-brand-pink outline-none" />
                                         </div>
                                     </div>
                                     <button onClick={() => deleteFiberRate(fiber.id)} className="text-red-400 hover:text-red-600 p-2"><Trash2 size={18}/></button>
                                 </div>
                             ))}
                         </div>
                    </div>

                    {/* PACKS EDITOR */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                         <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2"><Wifi className="text-brand-purple"/> Paquets Predefinits</h2>
                            <button onClick={handleNewPack} className="bg-brand-pink text-white px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-brand-purple"><Plus size={16}/> Afegir Paquet</button>
                         </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             {packs.map((pack) => (
                                 <div key={pack.id} className="border border-gray-200 rounded-xl p-4 bg-gray-50 relative group">
                                     <button onClick={() => deletePack(pack.id)} className="absolute top-2 right-2 text-red-400 hover:text-red-600 p-1"><Trash2 size={16}/></button>
                                     <div className="space-y-3 pr-6">
                                         <input 
                                            value={pack.name[editingLang]}
                                            onChange={(e) => updatePack({ ...pack, name: { ...pack.name, [editingLang]: e.target.value }})}
                                            className="w-full font-bold text-gray-800 bg-transparent border-b border-gray-300 focus:border-brand-pink outline-none"
                                            placeholder="Nom del paquet"
                                         />
                                         <div className="flex gap-2">
                                            <div className="flex-1">
                                                <label className="text-xs text-gray-500">Preu (€)</label>
                                                <input type="number" value={pack.price} onChange={(e) => updatePack({ ...pack, price: parseFloat(e.target.value) })} className="w-full p-1 border rounded" />
                                            </div>
                                            <div className="flex-1">
                                                <label className="text-xs text-gray-500">Velocitat (Mb)</label>
                                                <input type="number" value={pack.speedMb} onChange={(e) => updatePack({ ...pack, speedMb: parseInt(e.target.value) })} className="w-full p-1 border rounded" />
                                            </div>
                                         </div>
                                         <div className="flex gap-2">
                                            <div className="flex-1">
                                                <label className="text-xs text-gray-500">Línies Mòbil</label>
                                                <input type="number" value={pack.mobileLines} onChange={(e) => updatePack({ ...pack, mobileLines: parseInt(e.target.value) })} className="w-full p-1 border rounded" />
                                            </div>
                                            <div className="flex-1">
                                                <label className="text-xs text-gray-500">GB per Línia (-1 = Inf)</label>
                                                <input type="number" value={pack.mobileGbPerLine} onChange={(e) => updatePack({ ...pack, mobileGbPerLine: parseInt(e.target.value) })} className="w-full p-1 border rounded" />
                                            </div>
                                         </div>
                                         <div className="flex items-center gap-2 mt-2">
                                             <input type="checkbox" checked={pack.hasLandline} onChange={(e) => updatePack({ ...pack, hasLandline: e.target.checked })} id={`landline-${pack.id}`} />
                                             <label htmlFor={`landline-${pack.id}`} className="text-sm text-gray-600">Inclou Fix?</label>
                                         </div>
                                         <div>
                                            <label className="text-xs text-gray-500">Descripció (Subtítol)</label>
                                            <input 
                                                value={pack.description[editingLang]}
                                                onChange={(e) => updatePack({ ...pack, description: { ...pack.description, [editingLang]: e.target.value }})}
                                                className="w-full p-2 border rounded text-sm"
                                            />
                                         </div>
                                     </div>
                                 </div>
                             ))}
                         </div>
                    </div>
                </div>
            )}

            {/* --- MOBILE RATES TAB --- */}
            {activeTab === 'mobile' && (
                <div className="space-y-8 max-w-4xl">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                         <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2"><Smartphone className="text-brand-purple"/> Tarifes de Mòbil</h2>
                            <button onClick={handleNewMobileRate} className="bg-brand-pink text-white px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-brand-purple"><Plus size={16}/> Nova Tarifa</button>
                         </div>
                         <div className="space-y-4">
                             {mobileRates.map((rate) => (
                                 <div key={rate.id} className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
                                     <div className="bg-white p-2 rounded-lg font-bold w-16 text-center shadow-sm">
                                         {rate.gb === -1 ? '∞' : rate.gb} GB
                                     </div>
                                     <div className="flex-1 grid grid-cols-3 gap-4">
                                         <div>
                                             <label className="text-xs text-gray-500 block">Nom</label>
                                             <input value={rate.name} onChange={(e) => updateMobileRate({ ...rate, name: e.target.value })} className="w-full font-medium bg-transparent border-b border-gray-300 focus:border-brand-pink outline-none" />
                                         </div>
                                         <div>
                                             <label className="text-xs text-gray-500 block">GB (-1 = Inf)</label>
                                             <input type="number" value={rate.gb} onChange={(e) => updateMobileRate({ ...rate, gb: parseInt(e.target.value) })} className="w-full font-medium bg-transparent border-b border-gray-300 focus:border-brand-pink outline-none" />
                                         </div>
                                         <div>
                                             <label className="text-xs text-gray-500 block">Preu (€)</label>
                                             <input type="number" value={rate.price} onChange={(e) => updateMobileRate({ ...rate, price: parseFloat(e.target.value) })} className="w-full font-bold text-brand-purple bg-transparent border-b border-gray-300 focus:border-brand-pink outline-none" />
                                         </div>
                                     </div>
                                     <button onClick={() => deleteMobileRate(rate.id)} className="text-red-400 hover:text-red-600 p-2"><Trash2 size={18}/></button>
                                 </div>
                             ))}
                         </div>
                    </div>
                </div>
            )}
            
            {/* --- PROMOTIONS TAB --- */}
            {activeTab === 'promotions' && (
                <div className="space-y-8 max-w-4xl">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2"><Megaphone className="text-brand-purple" /> Banner Superior</h2>
                            <button onClick={handleNewPromotion} className="bg-brand-pink text-white px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-brand-purple"><Plus size={16}/> Nova Promoció</button>
                        </div>
                        {promotions.map((promo, idx) => (
                            <div key={promo.id} className="space-y-6 border-b border-gray-200 pb-8 mb-8 last:border-0 last:pb-0 last:mb-0">
                                <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                                    <label className="flex items-center gap-2 font-bold cursor-pointer">
                                        <input type="checkbox" checked={promo.isActive} onChange={(e) => updatePromotion({ ...promo, isActive: e.target.checked })} className="w-5 h-5 accent-brand-pink" />
                                        Activar Promoció
                                    </label>
                                    <button onClick={() => deletePromotion(promo.id)} className="text-red-400 hover:text-red-600 text-sm flex items-center gap-1 hover:bg-red-50 p-2 rounded">
                                        <Trash2 size={16} /> Eliminar
                                    </button>
                                </div>

                                {/* CATALAN TAB */}
                                <div className="border rounded-lg">
                                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 border-b">
                                        <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                            <span className="text-lg">🇪🇸</span> Versió Catalana
                                        </h3>
                                    </div>
                                    <div className="p-4 space-y-4">
                                        <div>
                                            <label className="text-sm font-medium text-gray-700">Títol (Negreta)</label>
                                            <input 
                                                value={promo.title.ca} 
                                                onChange={(e) => updatePromotion({ ...promo, title: { ...promo.title, ca: e.target.value } })} 
                                                className="w-full p-2 border rounded-lg" 
                                                placeholder="Ex: Fibra gratis"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-700">Text de la Promoció</label>
                                            <input 
                                                value={promo.text.ca} 
                                                onChange={(e) => updatePromotion({ ...promo, text: { ...promo.text, ca: e.target.value } })} 
                                                className="w-full p-2 border rounded-lg" 
                                                placeholder="Ex: Gaudeix de 600 Mb de manera gratuïta aquest mes"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* SPANISH TAB */}
                                <div className="border rounded-lg">
                                    <div className="bg-gradient-to-r from-red-50 to-yellow-50 p-4 border-b flex justify-between items-center">
                                        <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                            <span className="text-lg">🇪🇸</span> Versió Espanyola
                                        </h3>
                                        <button 
                                            onClick={async () => {
                                                const esTitle = quickTranslateCatToEs(promo.title.ca);
                                                const esText = quickTranslateCatToEs(promo.text.ca);
                                                updatePromotion({
                                                    ...promo,
                                                    title: { ...promo.title, es: esTitle },
                                                    text: { ...promo.text, es: esText }
                                                });
                                            }}
                                            className="text-xs bg-brand-purple text-white px-2 py-1 rounded flex items-center gap-1 hover:bg-brand-pink transition"
                                            title="Traduir automàticament del català"
                                        >
                                            <Wand2 size={14} /> Auto-traduir
                                        </button>
                                    </div>
                                    <div className="p-4 space-y-4">
                                        <div>
                                            <label className="text-sm font-medium text-gray-700">Títol (Negreta)</label>
                                            <input 
                                                value={promo.title.es} 
                                                onChange={(e) => updatePromotion({ ...promo, title: { ...promo.title, es: e.target.value } })} 
                                                className="w-full p-2 border rounded-lg" 
                                                placeholder="Ex: Fibra gratis"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-700">Text de la Promoció</label>
                                            <input 
                                                value={promo.text.es} 
                                                onChange={(e) => updatePromotion({ ...promo, text: { ...promo.text, es: e.target.value } })} 
                                                className="w-full p-2 border rounded-lg" 
                                                placeholder="Ex: Disfruta de 600 Mb de manera gratuita este mes"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* DATES & COLORS */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg border">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Data Inici</label>
                                        <input type="date" value={promo.startDate.split('T')[0]} onChange={(e) => updatePromotion({ ...promo, startDate: new Date(e.target.value).toISOString() })} className="w-full p-2 border rounded-lg" />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Data Fi</label>
                                        <input type="date" value={promo.endDate.split('T')[0]} onChange={(e) => updatePromotion({ ...promo, endDate: new Date(e.target.value).toISOString() })} className="w-full p-2 border rounded-lg" />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Color de Fons</label>
                                        <div className="flex gap-2">
                                            <input type="color" value={promo.backgroundColor} onChange={(e) => updatePromotion({ ...promo, backgroundColor: e.target.value })} className="h-10 w-20 p-1 rounded border" />
                                            <input type="text" value={promo.backgroundColor} onChange={(e) => updatePromotion({ ...promo, backgroundColor: e.target.value })} className="flex-1 p-2 border rounded-lg text-xs" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Color de Text</label>
                                        <div className="flex gap-2">
                                            <input type="color" value={promo.textColor} onChange={(e) => updatePromotion({ ...promo, textColor: e.target.value })} className="h-10 w-20 p-1 rounded border" />
                                            <input type="text" value={promo.textColor} onChange={(e) => updatePromotion({ ...promo, textColor: e.target.value })} className="flex-1 p-2 border rounded-lg text-xs" />
                                        </div>
                                    </div>
                                </div>

                                {/* PREVIEW */}
                                <div className="p-4 rounded-lg border-2 border-gray-300" style={{ backgroundColor: promo.backgroundColor, color: promo.textColor }}>
                                    <div className="flex gap-2 items-center">
                                        <span className="uppercase tracking-wider opacity-90 font-bold">{promo.title.ca}</span>
                                        <span className="hidden sm:inline">|</span>
                                        <span className="hidden sm:inline">{promo.text.ca}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
            {/* --- FEATURES TAB --- */}
            {activeTab === 'features' && (
                <div className="space-y-8 max-w-4xl">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Secció Avantatges</h2>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Títol Secció</label>
                            <input value={translations[editingLang].features.title} onChange={(e) => updateTranslation(editingLang, 'features', 'title', e.target.value)} className="w-full p-2 border rounded-lg mb-2" />
                            <label className="block text-sm font-medium text-gray-700 mb-1">Subtítol</label>
                            <input value={translations[editingLang].features.subtitle} onChange={(e) => updateTranslation(editingLang, 'features', 'subtitle', e.target.value)} className="w-full p-2 border rounded-lg" />
                        </div>
                        <div className="space-y-6">
                            {translations[editingLang].features.items.map((item, idx) => (
                                <div key={idx} className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                    <div className="font-bold text-gray-400 text-xs mb-2 uppercase">Ítem {idx + 1}</div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs text-gray-500">Títol</label>
                                            <input value={item.title} onChange={(e) => updateFeatureItem(idx, 'title', e.target.value)} className="w-full p-2 border rounded" />
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-500">Icona (map, zap, check)</label>
                                            <select value={item.icon} onChange={(e) => updateFeatureItem(idx, 'icon', e.target.value)} className="w-full p-2 border rounded bg-white">
                                                <option value="map">Mapa / Proximitat</option>
                                                <option value="zap">Raig / Velocitat</option>
                                                <option value="check">Check / Transparència</option>
                                            </select>
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="text-xs text-gray-500">Descripció</label>
                                            <textarea value={item.description} onChange={(e) => updateFeatureItem(idx, 'description', e.target.value)} className="w-full p-2 border rounded h-20" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
            
            {/* --- TESTIMONIALS TAB --- */}
            {activeTab === 'testimonials' && (
                <div className="space-y-8 max-w-4xl">
                     <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <div className="flex justify-between items-center mb-6">
                             <h2 className="text-xl font-bold text-gray-800">Testimonis</h2>
                             <button onClick={addTestimonial} className="bg-brand-pink text-white px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2"><Plus size={16}/> Afegir</button>
                        </div>
                        <div className="mb-6">
                             <input value={translations[editingLang].testimonials.title} onChange={(e) => updateTranslation(editingLang, 'testimonials', 'title', e.target.value)} className="w-full p-2 border rounded-lg mb-2 font-bold" placeholder="Títol secció" />
                             <input value={translations[editingLang].testimonials.subtitle} onChange={(e) => updateTranslation(editingLang, 'testimonials', 'subtitle', e.target.value)} className="w-full p-2 border rounded-lg" placeholder="Subtítol secció" />
                        </div>
                        <div className="space-y-4">
                            {translations[editingLang].testimonials.items.map((item, idx) => (
                                <div key={idx} className="bg-gray-50 p-4 rounded-xl border border-gray-200 relative group">
                                     <button onClick={() => removeTestimonial(idx)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500"><Trash2 size={16}/></button>
                                     <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                          <div className="md:col-span-1">
                                              <input value={item.name} onChange={(e) => updateTestimonial(idx, 'name', e.target.value)} className="w-full p-2 border rounded mb-2" placeholder="Nom" />
                                              <input value={item.location} onChange={(e) => updateTestimonial(idx, 'location', e.target.value)} className="w-full p-2 border rounded" placeholder="Població" />
                                          </div>
                                          <div className="md:col-span-3">
                                              <textarea value={item.text} onChange={(e) => updateTestimonial(idx, 'text', e.target.value)} className="w-full p-2 border rounded h-24" placeholder="Opinió..." />
                                              <div className="flex items-center gap-2 mt-2">
                                                  <span className="text-sm text-gray-500">Puntuació:</span>
                                                  <input type="number" min="1" max="5" value={item.rating} onChange={(e) => updateTestimonial(idx, 'rating', parseInt(e.target.value))} className="w-16 p-1 border rounded" />
                                              </div>
                                          </div>
                                     </div>
                                </div>
                            ))}
                        </div>
                     </div>
                </div>
            )}
            
            {/* --- FAQ TAB --- */}
            {activeTab === 'faq' && (
                <div className="space-y-8 max-w-4xl">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <div className="flex justify-between items-center mb-6">
                             <h2 className="text-xl font-bold text-gray-800">Preguntes Freqüents</h2>
                             <button onClick={addFAQ} className="bg-brand-pink text-white px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2"><Plus size={16}/> Afegir</button>
                        </div>
                        <input value={translations[editingLang].faq.title} onChange={(e) => updateTranslation(editingLang, 'faq', 'title', e.target.value)} className="w-full p-2 border rounded-lg mb-6 font-bold" />
                        <div className="space-y-4">
                            {translations[editingLang].faq.items.map((item, idx) => (
                                <div key={idx} className="bg-gray-50 p-4 rounded-xl border border-gray-200 relative">
                                    <button onClick={() => removeFAQ(idx)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500"><Trash2 size={16}/></button>
                                    <input value={item.question} onChange={(e) => updateFAQ(idx, 'question', e.target.value)} className="w-full font-bold mb-2 p-2 border-b border-gray-200 bg-transparent outline-none focus:border-brand-pink" placeholder="Pregunta" />
                                    <textarea value={item.answer} onChange={(e) => updateFAQ(idx, 'answer', e.target.value)} className="w-full p-2 bg-transparent border border-gray-200 rounded outline-none h-24 focus:border-brand-pink" placeholder="Resposta" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
            
            {/* --- CONFIGURATOR TAB --- */}
            {activeTab === 'configurator' && (
                <div className="space-y-8 max-w-4xl">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h2 className="text-xl font-bold text-gray-800 mb-6">Textos Configurador</h2>
                        <div className="grid grid-cols-1 gap-4">
                            <div><label className="text-xs font-bold text-gray-500">Títol Petit</label><input value={translations[editingLang].configurator.title} onChange={(e) => updateTranslation(editingLang, 'configurator', 'title', e.target.value)} className="w-full p-2 border rounded" /></div>
                            <div><label className="text-xs font-bold text-gray-500">Títol Gran</label><input value={translations[editingLang].configurator.subtitle} onChange={(e) => updateTranslation(editingLang, 'configurator', 'subtitle', e.target.value)} className="w-full p-2 border rounded" /></div>
                            <div><label className="text-xs font-bold text-gray-500">Pas 1</label><input value={translations[editingLang].configurator.step1} onChange={(e) => updateTranslation(editingLang, 'configurator', 'step1', e.target.value)} className="w-full p-2 border rounded" /></div>
                            <div><label className="text-xs font-bold text-gray-500">Pas 2</label><input value={translations[editingLang].configurator.step2} onChange={(e) => updateTranslation(editingLang, 'configurator', 'step2', e.target.value)} className="w-full p-2 border rounded" /></div>
                            <div><label className="text-xs font-bold text-gray-500">Pas 3</label><input value={translations[editingLang].configurator.step3} onChange={(e) => updateTranslation(editingLang, 'configurator', 'step3', e.target.value)} className="w-full p-2 border rounded" /></div>
                        </div>
                    </div>
                </div>
            )}
            
            {/* --- FOOTER TAB --- */}
            {activeTab === 'footer' && (
                <div className="space-y-8 max-w-4xl">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h2 className="text-xl font-bold text-gray-800 mb-6">Peu de Pàgina i Contacte</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Telèfon</label>
                                <input value={translations[editingLang].contact.phone} onChange={(e) => updateTranslation(editingLang, 'contact', 'phone', e.target.value)} className="w-full p-2 border rounded" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input value={translations[editingLang].contact.email} onChange={(e) => updateTranslation(editingLang, 'contact', 'email', e.target.value)} className="w-full p-2 border rounded" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Adreça</label>
                                <input value={translations[editingLang].contact.address} onChange={(e) => updateTranslation(editingLang, 'contact', 'address', e.target.value)} className="w-full p-2 border rounded" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Descripció Marca (Footer)</label>
                                <textarea value={translations[editingLang].contact.brandDescription} onChange={(e) => updateTranslation(editingLang, 'contact', 'brandDescription', e.target.value)} className="w-full p-2 border rounded h-20" />
                            </div>
                        </div>
                        
                        <div className="mt-8 border-t pt-6">
                            <h3 className="font-bold text-gray-800 mb-4">Logo Footer (Opcional)</h3>
                            <div className="flex items-center gap-4">
                                <div className="w-32 h-16 bg-gray-900 rounded flex items-center justify-center border border-gray-300">
                                    {images.footerLogo ? <img src={images.footerLogo} className="max-h-12 max-w-full" alt="Footer Logo" /> : <span className="text-white text-xs">Cap (Usa el ppal)</span>}
                                </div>
                                <div>
                                    <label className="cursor-pointer bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded text-sm font-bold block mb-2 text-center">
                                        Pujar
                                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'footerLogo')} />
                                    </label>
                                    <button onClick={() => handleRemoveImage('footerLogo')} className="text-xs text-red-500 hover:underline">Eliminar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            {/* --- SECTIONS TAB (DYNAMIC) --- */}
            {activeTab === 'sections' && (
                <div className="space-y-8 max-w-4xl">
                     <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <div className="flex justify-between items-center mb-6">
                             <div>
                                 <h2 className="text-xl font-bold text-gray-800">Seccions Personalitzades</h2>
                                 <p className="text-sm text-gray-500">Afegeix blocs de text i imatge extra a la pàgina principal.</p>
                             </div>
                             <button onClick={handleNewSection} className="bg-brand-pink text-white px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2"><Plus size={16}/> Nova Secció</button>
                        </div>
                        
                        <div className="space-y-8">
                            {customSections.map((section, idx) => (
                                <div key={section.id} className="border border-gray-200 rounded-xl p-6 bg-gray-50 relative">
                                    <button onClick={() => deleteCustomSection(section.id)} className="absolute top-4 right-4 text-red-400 hover:text-red-600 bg-white p-2 rounded-full shadow-sm"><Trash2 size={18}/></button>
                                    
                                    <div className="mb-4">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Títol de la Secció</label>
                                        <input 
                                            value={section.title[editingLang]} 
                                            // Simple in-place update simulation for demo (real should update context)
                                            onChange={(e) => alert("Per editar, elimina la secció i crea-la de nou.")}
                                            className="w-full text-lg font-bold p-2 border rounded"
                                            title="Funcionalitat d'edició en construcció. Esborra i crea de nou."
                                        />
                                        <p className="text-xs text-red-400 mt-1">* Per editar, elimina i crea de nou.</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 uppercase">Contingut</label>
                                            <textarea 
                                                value={section.content[editingLang]} 
                                                className="w-full h-40 p-2 border rounded"
                                                disabled
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Imatge</label>
                                            <div className="w-full h-40 bg-gray-200 rounded flex items-center justify-center overflow-hidden mb-2">
                                                {section.imageUrl ? <img src={section.imageUrl} className="w-full h-full object-cover" /> : <span className="text-gray-400">Cap imatge</span>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                     </div>
                </div>
            )}

            {/* --- LEADS TAB --- */}
            {activeTab === 'leads' && (
                <div className="space-y-8 max-w-6xl">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <div className="flex justify-between items-center mb-6">
                             <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2"><Users className="text-brand-purple"/> Gestió de Clients Potencials (Leads)</h2>
                             <div className="flex gap-2 text-sm">
                                 <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-100 border border-red-500"></span> Nou</div>
                                 <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-yellow-100 border border-yellow-500"></span> Contactat</div>
                                 <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-green-100 border border-green-500"></span> Tancat</div>
                             </div>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3">Data</th>
                                        <th className="px-6 py-3">Client</th>
                                        <th className="px-6 py-3">Contacte</th>
                                        <th className="px-6 py-3">Interès</th>
                                        <th className="px-6 py-3">Estat</th>
                                        <th className="px-6 py-3">Accions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {leads.length === 0 && (
                                        <tr><td colSpan={6} className="text-center py-8">No hi ha leads encara.</td></tr>
                                    )}
                                    {[...leads].sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((lead) => (
                                        <tr key={lead.id} className="bg-white border-b hover:bg-gray-50">
                                            <td className="px-6 py-4 font-medium whitespace-nowrap">
                                                {new Date(lead.createdAt).toLocaleDateString()} <br/>
                                                <span className="text-xs text-gray-400">{new Date(lead.createdAt).toLocaleTimeString()}</span>
                                            </td>
                                            <td className="px-6 py-4 font-bold text-gray-900">{lead.name}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <a href={`tel:${lead.phone}`} className="hover:text-brand-pink flex items-center gap-1"><Phone size={12}/> {lead.phone}</a>
                                                    <a href={`mailto:${lead.email}`} className="hover:text-brand-pink flex items-center gap-1"><Mail size={12}/> {lead.email}</a>
                                                    <span className="text-xs text-gray-400 mt-1 flex items-center gap-1"><MapPin size={10}/> {lead.address}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-xs bg-gray-100 p-2 rounded max-w-[200px]">
                                                    {lead.summary.join(', ')}
                                                    <div className="font-bold mt-1 text-brand-purple">Total: {lead.totalPrice}€</div>
                                                </div>
                                                {lead.comments && <div className="text-xs italic text-gray-500 mt-1">"{lead.comments}"</div>}
                                            </td>
                                            <td className="px-6 py-4">
                                                <select 
                                                    value={lead.status} 
                                                    onChange={(e) => updateLeadStatus(lead.id, e.target.value as any)}
                                                    className={`p-1 rounded text-xs font-bold border ${
                                                        lead.status === 'NEW' ? 'bg-red-50 text-red-600 border-red-200' :
                                                        lead.status === 'CONTACTED' ? 'bg-yellow-50 text-yellow-600 border-yellow-200' :
                                                        'bg-green-50 text-green-600 border-green-200'
                                                    }`}
                                                >
                                                    <option value="NEW">NOU</option>
                                                    <option value="CONTACTED">CONTACTAT</option>
                                                    <option value="CLOSED">TANCAT</option>
                                                </select>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button onClick={() => deleteLead(lead.id)} className="text-red-400 hover:text-red-600"><Trash2 size={16}/></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><Bell size={18}/> Notificacions per Email</h3>
                        <div className="flex gap-4 items-center">
                            <input 
                                type="email" 
                                value={notificationEmail || ''} 
                                onChange={(e) => updateNotificationEmail(e.target.value)} 
                                placeholder="el-teu-email@empresa.com"
                                className="flex-1 p-2 border rounded-lg"
                            />
                            <p className="text-sm text-gray-500">Rebràs un correu cada vegada que entri un nou lead.</p>
                        </div>
                    </div>
                </div>
            )}

            {/* --- METEO TAB --- */}
            {activeTab === 'meteo' && (
                <div className="space-y-8 max-w-4xl">
                     <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2"><Camera className="text-brand-purple"/> Secció Càmeres (Meteo)</h2>
                        
                        <div className="mb-8">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Títol</label>
                            <input value={meteo.title[editingLang]} onChange={(e) => handleMeteoTextChange('title', e.target.value)} className="w-full p-2 border rounded-lg mb-2" />
                            <label className="block text-sm font-medium text-gray-700 mb-1">Descripció</label>
                            <input value={meteo.subtitle[editingLang]} onChange={(e) => handleMeteoTextChange('subtitle', e.target.value)} className="w-full p-2 border rounded-lg" />
                        </div>

                        <div className="flex justify-between items-center mb-4">
                             <h3 className="font-bold text-gray-700">Càmeres Actives</h3>
                             <button onClick={handleAddCamera} className="bg-brand-pink text-white px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2"><Plus size={16}/> Afegir Càmera</button>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            {meteo.items.map((cam) => (
                                <div key={cam.id} className="bg-gray-50 border border-gray-200 p-4 rounded-xl flex flex-col md:flex-row gap-6 relative">
                                    <button onClick={() => handleRemoveCamera(cam.id)} className="absolute top-2 right-2 text-red-400 hover:text-red-600"><Trash2 size={16}/></button>
                                    
                                    <div className="w-full md:w-1/3 aspect-video bg-gray-200 rounded-lg overflow-hidden relative group">
                                         <img src={cam.image} className="w-full h-full object-cover" />
                                         <label className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white font-bold">
                                             <Upload size={20} className="mr-2"/> Canviar Imatge
                                             <input type="file" className="hidden" accept="image/*" onChange={(e) => handleCameraImageUpload(e, cam.id)} />
                                         </label>
                                    </div>
                                    
                                    <div className="flex-1 space-y-3">
                                        <div>
                                            <label className="text-xs text-gray-500">Nom</label>
                                            <input value={cam.name} onChange={(e) => updateCameraField(cam.id, 'name', e.target.value)} className="w-full p-2 border rounded bg-white" />
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-500">Enllaç (URL destí)</label>
                                            <div className="flex gap-2">
                                                <input value={cam.url} onChange={(e) => updateCameraField(cam.id, 'url', e.target.value)} className="w-full p-2 border rounded bg-white text-sm" />
                                                <a href={cam.url} target="_blank" className="p-2 bg-gray-200 rounded hover:bg-gray-300"><ExternalLink size={16}/></a>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button 
                                                onClick={() => updateCameraField(cam.id, 'visible', !cam.visible)}
                                                className={`flex items-center gap-2 px-3 py-1 rounded text-xs font-bold ${cam.visible ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}
                                            >
                                                {cam.visible ? <Eye size={14}/> : <EyeOff size={14}/>} {cam.visible ? 'Visible' : 'Oculta'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                     </div>
                </div>
            )}

             {/* --- DATA TAB (ADVANCED) --- */}
             {activeTab === 'data' && (
                <div className="space-y-8 max-w-4xl">
                     <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                             <Database size={20} className="text-brand-purple" /> Dades i Còpies
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                             <button onClick={handleExport} className="flex items-center justify-center gap-2 p-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                                 <Download size={20} className="text-brand-pink" />
                                 <div className="text-left">
                                     <div className="font-bold text-gray-700">Descarregar JSON</div>
                                     <div className="text-xs text-gray-500">Còpia de seguretat local</div>
                                 </div>
                             </button>
                             <label className="flex items-center justify-center gap-2 p-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
                                 <Upload size={20} className="text-brand-purple" />
                                 <div className="text-left">
                                     <div className="font-bold text-gray-700">Restaurar JSON</div>
                                     <div className="text-xs text-gray-500">Recuperar dades d'arxiu</div>
                                 </div>
                                 <input type="file" className="hidden" accept=".json" onChange={handleImport} />
                             </label>
                        </div>
                         
                         <hr className="my-8" />
                        
                        <div className="bg-red-50 border border-red-200 p-4 rounded-xl">
                            <h3 className="text-red-600 font-bold flex items-center gap-2 mb-2">
                                <AlertTriangle size={18} /> Zona de Perill
                            </h3>
                            <p className="text-sm text-red-500 mb-4">Esborrarà tot el contingut de la base de dades i tornarà a l'estat original.</p>
                            <button 
                                onClick={resetToDefaults}
                                className="bg-red-100 text-red-600 border border-red-200 px-4 py-2 rounded-lg font-bold text-sm hover:bg-red-200 transition-colors"
                            >
                                Restablir Web de Fàbrica
                            </button>
                        </div>
                     </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};<span className="text-lg">⭐</span> Versió Catalana