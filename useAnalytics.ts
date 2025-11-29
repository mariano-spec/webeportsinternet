import { useEffect } from 'react';
import { supabase } from './lib/supabase';

export const useAnalytics = () => {
  useEffect(() => {
    const trackVisit = async () => {
      try {
        // 1. Detectar origen (referrer)
        const referrer = document.referrer;
        let source: 'direct' | 'social' | 'organic' | 'ads' = 'direct';

        if (referrer.includes('facebook') || referrer.includes('instagram') || referrer.includes('twitter') || referrer.includes('linkedin')) {
          source = 'social';
        } else if (referrer.includes('google') || referrer.includes('bing') || referrer.includes('duckduckgo')) {
          source = 'organic';
        } else if (referrer.includes('facebook.com/ads') || referrer.includes('google.com/ads')) {
          source = 'ads';
        }

        // 2. Calcular setmana actual (format: 2025-W01)
        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 1);
        const diff = now.getTime() - start.getTime();
        const oneDay = 1000 * 60 * 60 * 24;
        const dayOfYear = Math.floor(diff / oneDay);
        const weekNum = Math.ceil((dayOfYear + start.getDay() + 1) / 7);
        const week = `${now.getFullYear()}-W${String(weekNum).padStart(2, '0')}`;

        // 3. Comprovar si ja existe una entrada per aquesta setmana i origen
        const { data: existingData, error: fetchError } = await supabase
          .from('visits')
          .select('id, count')
          .eq('week', week)
          .eq('source', source)
          .single();

        if (fetchError && fetchError.code !== 'PGRST116') {
          // PGRST116 = no rows found (és normal)
          console.error('Error fetching visit data:', fetchError);
          return;
        }

        // 4. Si existeix, incrementar count. Si no, crear nova entrada
        if (existingData) {
          const { error: updateError } = await supabase
            .from('visits')
            .update({ count: existingData.count + 1, updated_at: new Date().toISOString() })
            .eq('id', existingData.id);

          if (updateError) {
            console.error('Error updating visit count:', updateError);
          }
        } else {
          const { error: insertError } = await supabase
            .from('visits')
            .insert([{ week, source, count: 1 }]);

          if (insertError) {
            console.error('Error inserting visit:', insertError);
          }
        }
      } catch (error) {
        console.error('Error tracking visit:', error);
      }
    };

    // Rastrejar visita quan el component es munta
    trackVisit();

    // Opcionalment, rastrejar cada 5 minuts (per a sessions llargues)
    const interval = setInterval(trackVisit, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);
};