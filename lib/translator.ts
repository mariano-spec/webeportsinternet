/**
 * Servei de traducció automàtica de Català a Espanyol
 * Utilitza l'API de Google Translate
 */

const GOOGLE_TRANSLATE_API = 'https://translate.googleapis.com/translate_a/element.js';

export async function translateCatToEs(text: string): Promise<string> {
  try {
    if (!text || text.trim().length === 0) {
      return text;
    }

    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=ca|es`
    );

    if (!response.ok) {
      console.warn('Translation API unavailable, using fallback');
      return text;
    }

    const data = await response.json();
    
    if (data.responseStatus === 200 && data.responseData?.translatedText) {
      return data.responseData.translatedText;
    }

    return text;
  } catch (error) {
    console.error('Translation error:', error);
    return text;
  }
}

export async function translateMultiple(texts: string[]): Promise<string[]> {
  try {
    const translations = await Promise.all(
      texts.map(text => translateCatToEs(text))
    );
    return translations;
  } catch (error) {
    console.error('Batch translation error:', error);
    return texts;
  }
}

const MANUAL_TRANSLATIONS: Record<string, string> = {
  'nova promoció': 'nueva promoción',
  'oferta especial': 'oferta especial',
  'descompte': 'descuento',
  'descuentos': 'descuentos',
  'promoció': 'promoción',
  'promociones': 'promociones',
  'aprovecha': 'aprovecha',
  'ara': 'ahora',
  'ahora': 'ahora',
  'limitat': 'limitado',
  'limitado': 'limitado',
  'temps limitat': 'tiempo limitado',
  'tiempo limitado': 'tiempo limitado',
  'fibra': 'fibra',
  'fibre': 'fibra',
  'internet': 'internet',
  'mòbil': 'móvil',
  'movil': 'móvil',
  'más velocidad': 'más velocidad',
  'més velocitat': 'más velocidad',
  'mes dades': 'más datos',
  'més dades': 'más datos',
  'more data': 'más datos',
  'gratis': 'gratis',
  'gratuit': 'gratis',
  'free': 'gratis',
  'sense cost': 'sin costo',
  'sin costo': 'sin costo',
  'primer mes': 'primer mes',
  'primer month': 'primer mes',
  'first month': 'primer mes',
  'igualmente': 'igualmente',
  'contacta': 'contacta',
  'contact': 'contacta',
  'crida': 'llamada',
  'llamada': 'llamada',
  'call': 'llamada',
  'telèfon': 'teléfono',
  'telefono': 'teléfono',
  'phone': 'teléfono',
  'gaudeix': 'disfruta',
  'disfruta': 'disfruta',
  'enjoy': 'disfruta',
  'velocitat': 'velocidad',
  'velocidad': 'velocidad',
  'speed': 'velocidad',
  'dades': 'datos',
  'datos': 'datos',
  'data': 'datos',
  'pack': 'pack',
  'packs': 'packs',
  'familia': 'familia',
  'família': 'familia',
  'family': 'familia',
  'sms': 'sms',
  'calls': 'llamadas',
  'whatsapp': 'whatsapp',
  'unlimited': 'ilimitado',
  'ilimitat': 'ilimitado',
  'mes': 'mes',
  'months': 'meses',
  'mesos': 'meses',
  'black friday': 'black friday',
  'cyber monday': 'cyber monday',
  'oferta': 'oferta',
  'offer': 'oferta',
  'especial': 'especial',
  'special': 'especial',
  'limited': 'limitado',
  'limited time': 'tiempo limitado',
  'valid': 'válido',
  'valid until': 'válido hasta',
  'visit': 'visita',
  'visita': 'visita',
  'store': 'tienda',
  'botiga': 'tienda',
  'now': 'ahora',
  'dont miss': 'no te pierdas',
  'no perdis': 'no te pierdas',
};

export function quickTranslateCatToEs(text: string): string {
  if (!text) return '';
  
  let result = text;
  
  const sortedTranslations = Object.entries(MANUAL_TRANSLATIONS).sort(
    (a, b) => b[0].length - a[0].length
  );
  
  for (const [cat, es] of sortedTranslations) {
    const regex = new RegExp(`${cat}`, 'gi');
    result = result.replace(regex, es);
  }
  
  return result;
}