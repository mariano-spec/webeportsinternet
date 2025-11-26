

import { Translation, MobileRate, FiberRate, Pack, CustomSection, Promotion, AppContent, MeteoConfig, VisitStats } from './types';

export const TRANSLATIONS: Record<string, Translation> = {
  "ca": {
    "nav": {
      "home": "Inici",
      "packages": "Paquets",
      "fiber": "Fibra",
      "mobile": "Mòbil",
      "radio": "Ràdio",
      "contact": "Contacte",
      "configure": "Configurador",
      "features": "Avantatges",
      "faq": "Preguntes"
    },
    "hero": {
      "title": "Tenim una connexió especial",
      "subtitle": "Fibra òptica a màxima velocitat des de les Terres de l'Ebre per a tot el territori. Proximitat, confiança i la millor tecnologia.",
      "cta": "Configura la teva tarifa",
      "secondary": "Veure ofertes"
    },
    "features": {
      "title": "Per què triar eportsinternet?",
      "subtitle": "Som la teva operadora local de confiança, sense lletra petita.",
      "items": [
        {
          "title": "Proximitat",
          "description": "Atenció personalitzada i suport local. Som més que un proveïdor: som el vostre soci en connectivitat, sempre a prop quan ens necessiteu.",
          "icon": "map"
        },
        {
          "title": "Màxima Velocitat",
          "description": "Fibra òptica d'última generació per navegar sense límits i treballar sense talls.",
          "icon": "zap"
        },
        {
          "title": "Preus Transparents",
          "description": "El preu que veus és el preu que pagues. Sense sorpreses a la factura.",
          "icon": "check"
        }
      ]
    },
    "testimonials": {
      "title": "El que diuen els nostres clients",
      "subtitle": "Veïns de les Terres de l'Ebre que ja gaudeixen de la millor connexió.",
      "items": [
        {
          "name": "Marc P.",
          "location": "Tortosa",
          "text": "Per fi una companyia on m'atenen ràpid i en el meu idioma. La fibra vola!",
          "rating": 5
        },
        {
          "name": "Anna M.",
          "location": "L'Aldea",
          "text": "Vaig configurar el meu paquet amb 3 mòbils i estalvio 20€ al mes respecte a l'anterior companyia.",
          "rating": 5
        },
        {
          "name": "Joan R.",
          "location": "Roquetes",
          "text": "Servei tècnic excel·lent. Van venir a instal·lar-ho l'endemà de trucar.",
          "rating": 4
        }
      ]
    },
    "faq": {
      "title": "Preguntes Freqüents",
      "items": [
        {
          "question": "Teniu permanència?",
          "answer": "Les nostres tarifes estàndard tenen una permanència mínima de 12 mesos per cobrir la instal·lació gratuïta."
        },
        {
          "question": "Puc conservar el meu número?",
          "answer": "I tant! Gestionem la portabilitat del teu fix i mòbil gratuïtament."
        },
        {
          "question": "Fins a on arriba la vostra cobertura?",
          "answer": "Tenim xarxa pròpia de fibra i acords nacionals per a mòbil, garantint cobertura a tot el territori."
        }
      ]
    },
    "configurator": {
      "title": "Assistent de Tarifes",
      "subtitle": "Explica'ns què necessites i l'IA trobarà la millor combinació per a tu.",
      "step1": "1. Tria la teva connexió a casa",
      "step2": "2. Afegeix línies mòbils",
      "step3": "3. Resultat recomanat",
      "addMobile": "Afegir línia mòbil",
      "remove": "Eliminar",
      "calculating": "Calculant la millor opció...",
      "bestDeal": "La millor opció per a tu",
      "monthly": "al mes",
      "saving": "Estàs estalviant amb aquest paquet!",
      "noMobile": "Sense línies mòbils addicionals",
      "selectSpeed": "Selecciona velocitat",
      "unlimited": "Il·limitades",
      "summary": "Resum de la teva configuració",
      "contactToHire": "Contractar ara"
    },
    "assistant": {
      "title": "Assistent Virtual eportsinternet",
      "placeholder": "Pregunta'm: Quina fibra em recomanes per jugar?",
      "send": "Enviar",
      "typing": "Escrivint...",
      "intro": "Hola! Sóc l'assistent d'eportsinternet. Com puc ajudar-te avui a millorar la teva connexió?"
    },
    "contact": {
      "title": "Contacta amb nosaltres",
      "text": "Estem aquí per ajudar-te. Truca'ns o visita'ns.",
      "brandDescription": "Connectant les Terres de l'Ebre amb el món. Tecnología de proximitat amb el millor servei tècnic.",
      "phone": "977353735",
      "email": "hola@eportsinternet.com",
      "address": "Ctra Tortosa l'Aldea, km 2,4"
    }
  },
  "es": {
    "nav": {
      "home": "Inicio",
      "packages": "Paquetes",
      "fiber": "Fibra",
      "mobile": "Móvil",
      "radio": "Radio",
      "contact": "Contacto",
      "configure": "Configurador",
      "features": "Ventajas",
      "faq": "Preguntas"
    },
    "hero": {
      "title": "Tenemos una conexión especial",
      "subtitle": "Fibra óptica a máxima velocidad desde Terres de l'Ebre para todo el territorio. Cercanía, confianza y la mejor tecnología.",
      "cta": "Configura tu tarifa",
      "secondary": "Ver ofertas"
    },
    "features": {
      "title": "¿Por qué elegir eportsinternet?",
      "subtitle": "Somos tu operadora local de confianza, sin letra pequeña.",
      "items": [
        {
          "title": "Proximidad",
          "description": "Atención personalizada y soporte local. Somos más que un proveedor: somos vuestro socio en conectividad, siempre cerca cuando nos necesitéis.",
          "icon": "map"
        },
        {
          "title": "Máxima Velocidad",
          "description": "Fibra óptica de última generación para navegar sin límites y trabajar sin cortes.",
          "icon": "zap"
        },
        {
          "title": "Precios Transparentes",
          "description": "El precio que ves es el precio que pagas. Sin sorpresas en la factura.",
          "icon": "check"
        }
      ]
    },
    "testimonials": {
      "title": "Lo que dicen nuestros clientes",
      "subtitle": "Vecinos de las Terres de l'Ebre que ya disfrutan de la mejor conexión.",
      "items": [
        {
          "name": "Marc P.",
          "location": "Tortosa",
          "text": "Por fin una compañía donde me atienden rápido. ¡La fibra vuela!",
          "rating": 5
        },
        {
          "name": "Anna M.",
          "location": "L'Aldea",
          "text": "Configuré mi pack con 3 móviles y ahorro 20€ al mes respecto a la anterior compañía.",
          "rating": 5
        },
        {
          "name": "Joan R.",
          "location": "Roquetes",
          "text": "Servicio técnico excelente. Vinieron a instalarlo al día siguiente de llamar.",
          "rating": 4
        }
      ]
    },
    "faq": {
      "title": "Preguntas Frecuentes",
      "items": [
        {
          "question": "¿Tenéis permanencia?",
          "answer": "Nuestras tarifas estándar tienen una permanencia mínima de 12 meses para cubrir la instalación gratuita."
        },
        {
          "question": "¿Puedo conservar mi número?",
          "answer": "¡Claro! Gestionamos la portabilidad de tu fijo y móvil gratuitamente."
        },
        {
          "question": "¿Hasta dónde llega vuestra cobertura?",
          "answer": "Tenemos red propia de fibra y acuerdos nacionales para móvil, garantizando cobertura en todo el territorio."
        }
      ]
    },
    "configurator": {
      "title": "Asistente de Tarifas",
      "subtitle": "Dinos qué necesitas y la IA encontrará la mejor combinación para ti.",
      "step1": "1. Elige tu conexión en casa",
      "step2": "2. Añade líneas móviles",
      "step3": "3. Resultado recomendado",
      "addMobile": "Añadir línea móvil",
      "remove": "Eliminar",
      "calculating": "Calculando la mejor opción...",
      "bestDeal": "La mejor opción para ti",
      "monthly": "al mes",
      "saving": "¡Estás ahorrando con este paquete!",
      "noMobile": "Sin líneas móviles adicionales",
      "selectSpeed": "Selecciona velocidad",
      "unlimited": "Ilimitadas",
      "summary": "Resumen de tu configuración",
      "contactToHire": "Contratar ahora"
    },
    "assistant": {
      "title": "Asistente Virtual eportsinternet",
      "placeholder": "Pregúntame: ¿Qué fibra me recomiendas para jugar?",
      "send": "Enviar",
      "typing": "Escribiendo...",
      "intro": "¡Hola! Soy el asistente de eportsinternet. ¿Cómo puedo ayudarte hoy a mejorar tu conexión?"
    },
    "contact": {
      "title": "Contacta con nosotros",
      "text": "Estamos aquí para ayudarte. Llámanos o visítanos.",
      "brandDescription": "Conectando Terres de l'Ebre con el mundo. Tecnología de proximidad con el mejor servicio técnico.",
      "phone": "977353735",
      "email": "hola@eportsinternet.com",
      "address": "Ctra Tortosa l'Aldea, km 2,4"
    }
  }
};

export const PACKS: Pack[] = [
  {
    "id": "p1",
    "name": { ca: "Paquet Express", es: "Paquete Express" },
    "speedMb": 100,
    "mobileLines": 1,
    "mobileGbPerLine": 25,
    "hasLandline": false,
    "price": 29.90,
    "description": { ca: "Fibra 100Mb + 25GB", es: "Fibra 100Mb + 25GB" }
  },
  {
    "id": "p2",
    "name": { ca: "Paquet Econòmic", es: "Paquete Económico" },
    "speedMb": 300,
    "mobileLines": 1,
    "mobileGbPerLine": 50,
    "hasLandline": true,
    "price": 35.90,
    "description": { ca: "Fibra 300Mb + Fix + 50GB", es: "Fibra 300Mb + Fijo + 50GB" }
  },
  {
    "id": "p3",
    "name": { ca: "Paquet Extraordinària", es: "Paquete Extraordinario" },
    "speedMb": 300,
    "mobileLines": 1,
    "mobileGbPerLine": -1,
    "hasLandline": false,
    "price": 32.90,
    "description": { ca: "Fibra 300Mb + GB Il·limitats", es: "Fibra 300Mb + GB Ilimitados" }
  },
  {
    "id": "p4",
    "name": { ca: "Paquet Eficient", es: "Paquete Eficiente" },
    "speedMb": 1000,
    "mobileLines": 1,
    "mobileGbPerLine": 100,
    "hasLandline": false,
    "price": 39.90,
    "description": { ca: "Fibra 1000Mb + 100GB", es: "Fibra 1000Mb + 100GB" }
  },
  {
    "id": "p5",
    "name": { ca: "Paquet Evolutiu", es: "Paquete Evolutivo" },
    "speedMb": 1000,
    "mobileLines": 2,
    "mobileGbPerLine": 100,
    "hasLandline": false,
    "price": 46.90,
    "description": { ca: "Fibra 1000Mb + 2x 100GB", es: "Fibra 1000Mb + 2x 100GB" }
  },
  {
    "id": "p6",
    "name": { ca: "Paquet Emprenedor", es: "Paquete Emprendedor" },
    "speedMb": 600,
    "mobileLines": 1,
    "mobileGbPerLine": 150,
    "hasLandline": true,
    "price": 44.90,
    "description": { ca: "Fibra 600Mb + Centraleta + 150GB", es: "Fibra 600Mb + Centralita + 150GB" }
  }
];

export const FIBER_RATES: FiberRate[] = [
  {
    "id": "f0",
    "speedMb": 0,
    "technology": "FIBER",
    "price": 0.00,
    "name": "Sense Fibra / Sin Fibra"
  },
  {
    "id": "f1",
    "speedMb": 100,
    "technology": "FIBER",
    "price": 24.90,
    "name": "Fibra 100Mb"
  },
  {
    "id": "f2",
    "speedMb": 300,
    "technology": "FIBER",
    "price": 25.90,
    "name": "Fibra 300Mb"
  },
  {
    "id": "f4",
    "speedMb": 600,
    "technology": "FIBER",
    "price": 29.90,
    "name": "Fibra 600Mb"
  },
  {
    "id": "f3",
    "speedMb": 1000,
    "technology": "FIBER",
    "price": 32.90,
    "name": "Fibra 1000Mb"
  },
  {
    "id": "r1",
    "speedMb": 30,
    "technology": "RADIO",
    "price": 24.90,
    "name": "Radio 30Mb (Opció 1 - S.P.)",
    "description": { ca: "+ Instal·lació", es: "+ Instalación" }
  },
  {
    "id": "r2",
    "speedMb": 30,
    "technology": "RADIO",
    "price": 34.90,
    "name": "Radio 30Mb (Opció 2)",
    "description": { ca: "Instal·lació inclosa", es: "Instalación incluida" }
  }
];

export const MOBILE_RATES: MobileRate[] = [
  {
    "id": "m1",
    "gb": 3,
    "price": 5.90,
    "name": "3GB"
  },
  {
    "id": "m2",
    "gb": 50,
    "price": 7.90,
    "name": "50GB"
  },
  {
    "id": "m3",
    "gb": 100,
    "price": 9.90,
    "name": "100GB"
  },
  {
    "id": "m4",
    "gb": 200,
    "price": 15.90,
    "name": "200GB"
  },
  {
    "id": "m5",
    "gb": 350,
    "price": 23.90,
    "name": "350GB"
  }
];

export const PROMOTIONS: Promotion[] = [
  {
    id: 'promo_default',
    isActive: true,
    title: { ca: '🔥 Black Friday', es: '🔥 Black Friday' },
    text: { 
      ca: 'Contracta ara qualsevol paquet de fibra i no pagaràs fins el mes de febrer.', 
      es: 'Contrata ahora cualquier paquete de fibra y no pagarás hasta el mes de febrero.' 
    },
    startDate: new Date().toISOString(),
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString(),
    backgroundColor: '#000000',
    textColor: '#FFFFFF'
  }
];

export const IMAGES = {
  "logo": "",
  "heroBg": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
  "footerLogo": "",
};

export const METEO_DEFAULT: MeteoConfig = {
  title: {
    ca: 'El Territori en directe',
    es: 'El Territorio en directo'
  },
  subtitle: {
    ca: "Connecta't a la nostra xarxa de càmeres en directe arreu del territori.",
    es: "Conéctate a nuestra red de cámaras en directo por todo el territorio."
  },
  items: [
    {
      id: 'c1',
      name: 'Tortosa (Riu Ebre)',
      url: 'https://meteo.eportsinternet.com/cameres/riu-tortosa/',
      image: 'https://images.unsplash.com/photo-1558444654-20412808c1d3?q=80&w=800&auto=format&fit=crop',
      visible: true
    },
    {
      id: 'c2',
      name: 'Pratdip',
      url: 'https://meteo.eportsinternet.com/cameres/pratdip/',
      image: 'https://images.unsplash.com/photo-1598462791838-8959f654b049?q=80&w=800&auto=format&fit=crop',
      visible: true
    },
    {
      id: 'c3',
      name: 'Cim Mont Caro',
      url: 'https://meteo.eportsinternet.com/cameres/cim-mont-caro/',
      image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop',
      visible: true
    }
  ]
};

export const INITIAL_VISITS: VisitStats[] = [
  { week: 'S 40', source: 'direct', count: 120 },
  { week: 'S 40', source: 'social', count: 45 },
  { week: 'S 40', source: 'organic', count: 80 },
  { week: 'S 40', source: 'ads', count: 30 },
  
  { week: 'S 41', source: 'direct', count: 150 },
  { week: 'S 41', source: 'social', count: 60 },
  { week: 'S 41', source: 'organic', count: 95 },
  { week: 'S 41', source: 'ads', count: 50 },

  { week: 'S 42', source: 'direct', count: 180 },
  { week: 'S 42', source: 'social', count: 90 },
  { week: 'S 42', source: 'organic', count: 110 },
  { week: 'S 42', source: 'ads', count: 40 },

  { week: 'S 43', source: 'direct', count: 160 },
  { week: 'S 43', source: 'social', count: 120 },
  { week: 'S 43', source: 'organic', count: 130 },
  { week: 'S 43', source: 'ads', count: 80 },
];

export const CUSTOM_SECTIONS: CustomSection[] = [];

export const getBestMobileRate = (gbNeeded: number): MobileRate => {
  if (gbNeeded === -1) return { id: 'custom_unlimited', gb: -1, price: 23.90, name: 'Il·limitat' };
  
  const sorted = [...MOBILE_RATES].sort((a, b) => a.price - b.price);
  const found = sorted.find(r => r.gb >= gbNeeded);
  return found || sorted[sorted.length - 1];
};