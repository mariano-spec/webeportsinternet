/**
 * Servei de traducció automàtica de Català a Espanyol
 * Utilitza l'API de Google Translate
 */

const GOOGLE_TRANSLATE_API = 'https://translate.googleapis.com/translate_a/element.js';

/**
 * Tradueix text de català a espanyol usant Google Translate
 * Nota: Per producció, seria millor usar l'API oficial de Google Cloud Translation
 */
export async function translateCatToEs(text: string): Promise<string> {
  try {
    // Si el text és massa curt o buit, retorna directament
    if (!text || text.trim().length === 0) {
      return text;
    }

    // Usar la API del navegador de Google Translate (simple, sense claus API)
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=ca|es`
    );

    if (!response.ok) {
      console.warn('Translation API unavailable, using fallback');
      return text; // Fallback: retorna el text original
    }

    const data = await response.json();
    
    if (data.responseStatus === 200 && data.responseData?.translatedText) {
      return data.responseData.translatedText;
    }

    return text; // Fallback
  } catch (error) {
    console.error('Translation error:', error);
    return text; // Fallback en cas d'error
  }
}

/**
 * Tradueix múltiples textos en paral·lel
 */
export async function translateMultiple(texts: string[]): Promise<string[]> {
  try {
    const translations = await Promise.all(
      texts.map(text => translateCatToEs(text))
    );
    return translations;
  } catch (error) {
    console.error('Batch translation error:', error);
    return texts; // Fallback: retorna els texts originals
  }
}

/**
 * Diccionari manual per a termes comuns (fallback ràpid)
 * Útil per a cas quan l'API no està disponible
 */
const MANUAL_TRANSLATIONS: Record<string, string> = {
  // Promocions comunes
  'nova promoció': 'nueva promoción',
  'oferta especial': 'oferta especial',
  'descompte': 'descuento',
  'promoció': 'promoción',
  'aprovecha': 'aprovecha',
  'ara': 'ahora',
  'limitat': 'limitado',
  'temps limitat': 'tiempo limitado',
  'fibra': 'fibra',
  'internet': 'internet',
  'mòbil': 'móvil',
  'més velocitat': 'más velocidad',
  'més dades': 'más datos',
  'gratis': 'gratis',
  'sense cost': 'sin costo',
  'primer mes': 'primer mes',
  'igualmente': 'igualmente',
  'contacta': 'contacta',
  'crida': 'llamada',
  'telèfon': 'teléfono',
};

/**
 * Traducció ràpida usant diccionari manual (sense API)
 * Bé per a textos curts i promocions
 */
export function quickTranslateCatToEs(text: string): string {
  if (!text) return '';
  
  let result = text;
  
  // Aplicar diccionari (case-insensitive per a frases complertes)
  for (const [cat, es] of Object.entries(MANUAL_TRANSLATIONS)) {
    const regex = new RegExp(`\\b${cat}\\b`, 'gi');
    result = result.replace(regex, es);
  }
  
  return result;
}