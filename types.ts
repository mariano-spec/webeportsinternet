

export type Language = 'ca' | 'es';

export enum ProductType {
  FIBER = 'FIBER',
  MOBILE = 'MOBILE',
  PACK = 'PACK',
  RADIO = 'RADIO'
}

export interface MobileRate {
  id: string;
  gb: number; // -1 for unlimited
  price: number;
  name: string;
}

export interface FiberRate {
  id: string;
  speedMb: number;
  technology: 'FIBER' | 'RADIO';
  price: number;
  name: string;
  description?: Record<Language, string>; // Changed to bilingual
}

export interface Pack {
  id: string;
  name: Record<Language, string>; // Changed to bilingual
  speedMb: number;
  mobileLines: number; // Number of included mobile lines
  mobileGbPerLine: number; // GB per included line (-1 for unlimited)
  hasLandline: boolean;
  price: number;
  description: Record<Language, string>; // Changed to bilingual
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

export interface CustomSection {
  id: string;
  title: Record<Language, string>;
  content: Record<Language, string>;
  imageUrl?: string;
  order: number;
}

export interface Lead {
  id: string;
  createdAt: string; // ISO Date string
  name: string;
  phone: string;
  email: string;
  address: string;
  comments?: string;
  summary: string[]; // Array of strings describing the selected package/items
  totalPrice: number;
  status: 'NEW' | 'CONTACTED' | 'CLOSED';
}

export interface Promotion {
  id: string;
  isActive: boolean;
  title: Record<Language, string>;
  text: Record<Language, string>;
  startDate: string; // ISO String
  endDate: string; // ISO String
  backgroundColor: string; // Hex or tailwind class
  textColor: string;
}

export interface CameraItem {
  id: string;
  name: string;
  url: string;
  image: string; // Base64 or URL
  visible?: boolean;
}

export interface MeteoConfig {
  title: Record<Language, string>;
  subtitle: Record<Language, string>;
  items: CameraItem[];
}

export interface VisitStats {
  week: string; // Format "YYYY-Wxx" e.g. "2023-W45"
  source: 'direct' | 'social' | 'organic' | 'ads';
  count: number;
}

export interface Translation {
  nav: {
    home: string;
    packages: string;
    fiber: string;
    mobile: string;
    radio: string;
    contact: string;
    configure: string;
    features: string;
    faq: string;
  };
  hero: {
    title: string;
    subtitle: string;
    cta: string;
    secondary: string;
  };
  features: {
    title: string;
    subtitle: string;
    items: Feature[];
  };
  testimonials: {
    title: string;
    subtitle: string;
    items: Testimonial[];
  };
  faq: {
    title: string;
    items: FAQItem[];
  };
  configurator: {
    title: string;
    subtitle: string;
    step1: string;
    step2: string;
    step3: string;
    addMobile: string;
    remove: string;
    calculating: string;
    bestDeal: string;
    monthly: string;
    saving: string;
    noMobile: string;
    selectSpeed: string;
    unlimited: string;
    summary: string;
    contactToHire: string;
  };
  assistant: {
    title: string;
    placeholder: string;
    send: string;
    typing: string;
    intro: string;
  };
  contact: {
    title: string;
    text: string;
    brandDescription: string;
    phone: string;
    email: string;
    address: string;
  };
}

export interface AppContent {
  translations: Record<Language, Translation>;
  packs: Pack[];
  fiberRates: FiberRate[];
  mobileRates: MobileRate[];
  promotions: Promotion[];
  meteo: MeteoConfig;
  images: {
    logo?: string;
    heroBg?: string;
    footerLogo?: string;
  };
  heroOverlayOpacity?: number; // 0 to 1
  heroAlignment?: string; // object-position css value (e.g. 'center', 'top', 'bottom right')
  customSections: CustomSection[];
  leads: Lead[];
  visits: VisitStats[]; // New analytics data
  notificationEmail?: string;
  adminPassword?: string;
}

export interface ContentContextType extends AppContent {
  isLoading: boolean;
  saveContent: () => Promise<void>;
  updateTranslation: (lang: Language, section: keyof Translation, key: string, value: any) => void;
  updatePack: (pack: Pack) => void;
  addPack: (pack: Pack) => void;
  deletePack: (id: string) => void;
  updateMobileRate: (rate: MobileRate) => void;
  addMobileRate: (rate: MobileRate) => void;
  deleteMobileRate: (id: string) => void;
  updatePromotion: (promotion: Promotion) => void;
  updateMeteo: (config: MeteoConfig) => void;
  updateImage: (key: 'logo' | 'heroBg' | 'footerLogo', base64: string) => void;
  updateHeroOpacity: (opacity: number) => void;
  updateHeroAlignment: (alignment: string) => void;
  addCustomSection: (section: CustomSection) => void;
  deleteCustomSection: (id: string) => void;
  addLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'status'>) => void;
  updateLeadStatus: (id: string, status: Lead['status']) => void;
  deleteLead: (id: string) => void;
  updateNotificationEmail: (email: string) => void;
  updateAdminPassword: (password: string) => void;
  resetToDefaults: () => void;
  importData: (data: AppContent) => void;
}