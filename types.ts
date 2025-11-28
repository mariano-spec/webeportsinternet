
export type Language = 'ca' | 'es';

export interface Translation {
    nav: any;
    hero: any;
    features: any;
    testimonials: any;
    faq: any;
    configurator: any;
    assistant: any;
    contact: any;
}

export interface Pack {
    id: string;
    name: { ca: string; es: string };
    speedMb: number;
    mobileLines: number;
    mobileGbPerLine: number;
    hasLandline: boolean;
    price: number;
    description: { ca: string; es: string };
}

export interface MobileRate {
    id: string;
    gb: number;
    price: number;
    name: string;
}

export interface FiberRate {
    id: string;
    speedMb: number;
    technology: 'FIBER' | 'RADIO';
    price: number;
    name: string;
    description?: { ca: string; es: string };
}

export interface StoreItem {
    id: string;
    name: string;
    address: string;
    url?: string; // Google Maps link
}

export interface Promotion {
    id: string;
    isActive: boolean;
    title: { ca: string; es: string };
    text: { ca: string; es: string };
    startDate: string;
    endDate: string;
    backgroundColor: string;
    textColor: string;
}

export interface CameraItem {
    id: string;
    name: string;
    url: string;
    image: string;
    visible: boolean;
}

export interface MeteoConfig {
    title: { ca: string; es: string };
    subtitle: { ca: string; es: string };
    items: CameraItem[];
}

export interface CustomSection {
    id: string;
    title: { ca: string; es: string };
    content: { ca: string; es: string };
    imageUrl?: string;
    order: number;
}

export interface Lead {
    id: string;
    createdAt: string;
    name: string;
    phone: string;
    email: string;
    address: string;
    comments?: string;
    summary: string[];
    totalPrice: number;
    status: 'NEW' | 'CONTACTED' | 'CLOSED';
}

export interface VisitStats {
    week: string;
    source: 'direct' | 'social' | 'organic' | 'ads';
    count: number;
}

export interface CallButtonConfig {
    side: 'left' | 'right';
    desktopTop: number;
    mobileTop: number;
    text?: { ca: string; es: string };
}

export interface AppContent {
    translations: Record<Language, Translation>;
    packs: Pack[];
    fiberRates: FiberRate[];
    mobileRates: MobileRate[];
    stores: StoreItem[];
    promotions: Promotion[];
    meteo: MeteoConfig;
    images: { logo: string; heroBg: string; footerLogo: string; };
    heroOverlayOpacity: number;
    heroAlignment: string;
    customSections: CustomSection[];
    leads: Lead[];
    visits: VisitStats[];
    notificationEmail: string;
    adminPassword?: string;
    callButtonConfig: CallButtonConfig;
}

export interface ContentContextType extends AppContent {
    isLoading: boolean;
    saveContent: () => Promise<void>;
    updateTranslation: (lang: Language, section: keyof Translation, key: string, value: any) => void;
    
    // Packs
    updatePack: (pack: Pack) => void;
    addPack: (pack: Pack) => void;
    deletePack: (id: string) => void;
    
    // Mobile Rates
    updateMobileRate: (rate: MobileRate) => void;
    addMobileRate: (rate: MobileRate) => void;
    deleteMobileRate: (id: string) => void;

    // Fiber Rates
    updateFiberRate: (rate: FiberRate) => void;
    addFiberRate: (rate: FiberRate) => void;
    deleteFiberRate: (id: string) => void;

    // Stores
    updateStore: (store: StoreItem) => void;
    addStore: (store: StoreItem) => void;
    deleteStore: (id: string) => void;

    updatePromotion: (promotion: Promotion) => void;
    addPromotion: (promotion: Promotion) => void;
    deletePromotion: (id: string) => void;

    updateMeteo: (config: MeteoConfig) => void;
    updateImage: (key: 'logo' | 'heroBg' | 'footerLogo', base64: string) => void;
    updateHeroOpacity: (opacity: number) => void;
    updateHeroAlignment: (alignment: string) => void;
    addCustomSection: (section: CustomSection) => void;
    deleteCustomSection: (id: string) => void;
    addLead: (lead: any) => void;
    updateLeadStatus: (id: string, status: any) => void;
    deleteLead: (id: string) => void;
    updateNotificationEmail: (email: string) => void;
    updateAdminPassword: (password: string) => void;
    updateCallButtonConfig: (config: CallButtonConfig) => void;
    resetToDefaults: () => void;
    importData: (data: AppContent) => void;
}

export interface Feature {
    title: string;
    description: string;
    icon: string;
}

export interface Testimonial {
    name: string;
    location: string;
    text: string;
    rating: number;
}

export interface FAQItem {
    question: string;
    answer: string;
}
