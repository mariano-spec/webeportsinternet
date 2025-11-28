

import React, { useState, useEffect, useMemo } from 'react';
import { Language, FiberRate, MobileRate, Pack } from '../types';
import { useContent } from '../contexts/ContentContext';
import { Smartphone, Check, Plus, Trash2, Wifi, Award, Calculator, ArrowRight, AlertCircle, TrendingUp, Zap } from 'lucide-react';
import { LeadFormModal } from './LeadFormModal';

interface ConfiguratorProps {
  lang: Language;
}

interface SelectionState {
  fiberId: string;
  mobileLines: { gb: number }[];
}

export const Configurator: React.FC<ConfiguratorProps> = ({ lang }) => {
  const { translations, packs, fiberRates, mobileRates } = useContent();
  const t = translations[lang].configurator;
  
  const [selection, setSelection] = useState<SelectionState>({
    fiberId: '', // Will set on effect
    mobileLines: []
  });

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!selection.fiberId && fiberRates.length > 0) {
        // Default to the 2nd option (usually 300Mb) or first
        setSelection(s => ({ ...s, fiberId: fiberRates[1]?.id || fiberRates[0].id }));
    }
  }, [fiberRates]);

  const [calculatedResult, setCalculatedResult] = useState<{
    customPrice: number;
    customName: string;
    recommendedPrice: number;
    recommendedName: string;
    recommendedDetails: string[];
    isSavings: boolean;
    savingsAmount: number;
    speedDiff: number; // Positive means upgrade
    gbDiff: number; // Positive means upgrade
  } | null>(null);

  const selectedFiber = fiberRates.find(f => f.id === selection.fiberId) || fiberRates[0];

  // Dynamic helper for mobile rates since rates are now in Context
  const findBestMobileRate = (gbNeeded: number): MobileRate => {
      if (gbNeeded === -1) {
          // Try to find an unlimited rate in the list, otherwise fallback
          const unlimited = mobileRates.find(r => r.gb === -1);
          return unlimited || { id: 'custom_unlimited', gb: -1, price: 25.00, name: 'Il·limitat (Est.)' };
      }
      const sorted = [...mobileRates].sort((a, b) => a.price - b.price);
      const found = sorted.find(r => r.gb >= gbNeeded && r.gb !== -1);
      return found || sorted[sorted.length - 1];
  };

  // Add a mobile line
  const addLine = () => {
    // Default to the first available rate or 50GB
    const defaultRate = mobileRates[1] || mobileRates[0];
    setSelection(prev => ({
      ...prev,
      mobileLines: [...prev.mobileLines, { gb: defaultRate ? defaultRate.gb : 50 }]
    }));
  };

  // Remove a mobile line
  const removeLine = (index: number) => {
    setSelection(prev => ({
      ...prev,
      mobileLines: prev.mobileLines.filter((_, i) => i !== index)
    }));
  };

  // Update mobile line GB
  const updateLineGb = (index: number, gb: number) => {
    const newLines = [...selection.mobileLines];
    newLines[index].gb = gb;
    setSelection(prev => ({ ...prev, mobileLines: newLines }));
  };

  // CALCULATION LOGIC
  useEffect(() => {
    if (!selectedFiber) return;

    // 1. CALCULATE PURE CUSTOM PRICE (A LA CARTE)
    const fiberPrice = selectedFiber.price;
    let mobileTotal = 0;
    let userTotalGb = 0;
    
    selection.mobileLines.forEach((line) => {
      const rate = findBestMobileRate(line.gb);
      mobileTotal += rate.price;
      userTotalGb += (line.gb === -1 ? 999 : line.gb);
    });

    const customTotal = fiberPrice + mobileTotal;
    const customName = lang === 'ca' ? 'La teva selecció' : 'Tu selección';
    const lineLabel = lang === 'ca' ? 'Línia' : 'Línea';
    const extraLineLabel = lang === 'ca' ? '+ Línia Extra' : '+ Línea Extra';

    // 2. FIND BEST PACK (RECOMMENDATION)
    let bestPrice = customTotal;
    let bestName = customName;
    let bestSpeed = selectedFiber.speedMb;
    let bestTotalGb = userTotalGb;

    let bestDetails: string[] = [
        `${selectedFiber.name}`,
        ...selection.mobileLines.map((l, i) => {
             const rate = findBestMobileRate(l.gb);
             return `${lineLabel} ${i+1}: ${rate.name}`;
        })
    ];
    let foundBetterPack = false;

    if (selectedFiber.technology === 'FIBER') {
      packs.forEach(pack => {
        // Pack speed must be at least equal to selected speed
        if (pack.speedMb < selectedFiber.speedMb && pack.speedMb !== 0) return; 

        let currentPackPrice = pack.price;
        let remainingLines = [...selection.mobileLines];
        
        // Sort lines descending to match biggest needs to pack slots first
        remainingLines.sort((a, b) => b.gb - a.gb);

        const packSlots = Array(pack.mobileLines).fill(pack.mobileGbPerLine);
        let currentPackTotalGb = 0;

        // Count GBs from pack slots
        packSlots.forEach(slot => {
            currentPackTotalGb += (slot === -1 ? 999 : slot);
        });
        
        // Try to fill pack slots with user lines
        remainingLines.forEach((userLine, idx) => {
            // Find best fitting slot
            const slotIndex = packSlots.findIndex(slotGb => slotGb === -1 || slotGb >= userLine.gb);
            if (slotIndex !== -1) {
                // We utilize this slot
                packSlots.splice(slotIndex, 1); 
                remainingLines[idx] = { ...userLine, gb: -999 }; // Mark as covered by pack
            }
        });

        // Calculate extras for lines not covered by pack
        const linesToPayExtra = remainingLines.filter(l => l.gb !== -999);
        
        let extraMobileCost = 0;
        const extraMobileDetails: string[] = [];

        linesToPayExtra.forEach((line) => {
             const rate = findBestMobileRate(line.gb);
             extraMobileCost += rate.price;
             currentPackTotalGb += (rate.gb === -1 ? 999 : rate.gb); // Add extra line GBs to total
             extraMobileDetails.push(`${extraLineLabel}: ${rate.name}`);
        });
        
        const totalPackScenarioPrice = currentPackPrice + extraMobileCost;

        // Check if this pack is cheaper OR same price but better stats
        // We prioritize savings first.
        const isCheaper = totalPackScenarioPrice < (bestPrice - 0.01);
        
        if (isCheaper) {
            bestPrice = totalPackScenarioPrice;
            bestName = pack.name[lang];
            bestSpeed = pack.speedMb;
            bestTotalGb = currentPackTotalGb;
            foundBetterPack = true;
            bestDetails = [
                `${pack.description[lang]}`,
                ...extraMobileDetails
            ];
        }
      });
    }

    setCalculatedResult({
        customPrice: customTotal,
        customName: customName,
        recommendedPrice: bestPrice,
        recommendedName: bestName,
        recommendedDetails: bestDetails,
        isSavings: foundBetterPack,
        savingsAmount: customTotal - bestPrice,
        speedDiff: bestSpeed - selectedFiber.speedMb,
        gbDiff: bestTotalGb - userTotalGb
    });

  }, [selection, selectedFiber, packs, mobileRates, lang]);

  if (!selectedFiber) return null;

  return (
    <section id="configurator" className="py-20 bg-brand-light/50">
      <LeadFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        lang={lang}
        summary={calculatedResult?.recommendedDetails || []}
        totalPrice={calculatedResult?.recommendedPrice || 0}
      />

      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <span className="text-brand-pink font-bold uppercase tracking-wider text-sm">{t.title}</span>
          <h2 className="text-3xl md:text-4xl font-bold text-brand-purple mt-2">{t.subtitle}</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* INPUT FORM */}
          <div className="lg:col-span-7 bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100">
            
            {/* Step 1: Internet */}
            <div className="mb-10">
              <h3 className="text-xl font-bold text-brand-purple mb-4 flex items-center gap-2">
                <Wifi className="text-brand-pink" /> {t.step1}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {fiberRates.map((fiber) => (
                  <button
                    key={fiber.id}
                    onClick={() => setSelection({ ...selection, fiberId: fiber.id })}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      selection.fiberId === fiber.id
                        ? 'border-brand-pink bg-brand-pink/5 ring-2 ring-brand-pink/20'
                        : 'border-gray-100 hover:border-brand-purple/30'
                    }`}
                  >
                    <div className="font-bold text-gray-800">{fiber.name}</div>
                    <div className="text-brand-pink font-bold text-lg">
                      {fiber.price > 0 ? `${fiber.price.toFixed(2)}€` : '-'}
                    </div>
                    {fiber.description && <div className="text-xs text-gray-500 mt-1">{fiber.description[lang]}</div>}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Mobile */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-brand-purple flex items-center gap-2">
                  <Smartphone className="text-brand-pink" /> {t.step2}
                </h3>
                <button 
                  onClick={addLine}
                  className="flex items-center gap-1 text-sm font-bold text-brand-pink bg-brand-pink/10 px-3 py-1.5 rounded-full hover:bg-brand-pink/20 transition-colors"
                >
                  <Plus size={16} /> {t.addMobile}
                </button>
              </div>

              <div className="space-y-3">
                {selection.mobileLines.length === 0 && (
                  <div className="p-6 border-2 border-dashed border-gray-200 rounded-xl text-center text-gray-400">
                    {t.noMobile}
                  </div>
                )}
                {selection.mobileLines.map((line, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="bg-brand-purple text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                      {idx + 1}
                    </div>
                    
                    {/* Changed from Slider to Select for better Mobile UX */}
                    <div className="flex-grow">
                        <select 
                            value={line.gb} 
                            onChange={(e) => updateLineGb(idx, parseInt(e.target.value))}
                            className="w-full p-2 bg-white border border-gray-300 rounded-lg text-gray-800 font-medium focus:ring-2 focus:ring-brand-purple focus:border-transparent outline-none"
                        >
                            {mobileRates.filter(r => r.price > 0).map(r => (
                                <option key={r.id} value={r.gb}>
                                    {r.gb === -1 ? 'Il·limitat' : `${r.gb} GB`} (+{r.price.toFixed(2)}€)
                                </option>
                            ))}
                        </select>
                    </div>

                    <button onClick={() => removeLine(idx)} className="text-gray-400 hover:text-red-500 p-2">
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RESULT CARD (Sticky) */}
          <div className="lg:col-span-5 sticky top-24">
            <div className="bg-brand-purple text-white rounded-2xl shadow-2xl p-1 relative overflow-hidden">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-brand-pink rounded-full opacity-20 blur-2xl"></div>
              
              {/* Result Content */}
              {calculatedResult ? (
                <div className="bg-brand-purple rounded-xl p-6 md:p-8 space-y-6 animate-fade-in relative z-10">
                  <h3 className="text-xl font-bold text-white/90 flex items-center gap-2 border-b border-white/10 pb-4">
                    <Award className="text-brand-pink" /> {t.step3}
                  </h3>

                  {/* COMPARISON SECTION */}
                  <div className="space-y-4">
                    
                    {/* 1. Custom Selection (Small) */}
                    <div className={`flex justify-between items-center ${calculatedResult.isSavings ? 'opacity-60 scale-95 origin-left' : ''}`}>
                      <div className="text-sm font-medium text-white/80">
                          {calculatedResult.customName}
                          {calculatedResult.isSavings && <div className="h-px bg-white/50 w-full absolute top-1/2"></div>}
                      </div>
                      <div className={`font-bold text-lg ${calculatedResult.isSavings ? 'line-through decoration-brand-pink' : ''}`}>
                          {calculatedResult.customPrice.toFixed(2)}€
                      </div>
                    </div>

                    {/* 2. Recommended Deal (Highlighted if savings) */}
                    {calculatedResult.isSavings && (
                        <div className="bg-white text-gray-900 rounded-xl p-5 border-l-8 border-green-500 shadow-lg animate-fade-in-up">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <div className="text-green-600 font-extrabold uppercase text-xs tracking-wider mb-1 flex items-center gap-1">
                                       <TrendingUp size={14} /> {t.bestDeal}
                                    </div>
                                    <div className="font-bold text-xl leading-tight text-gray-900">
                                        {calculatedResult.recommendedName}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-extrabold text-brand-purple">
                                        {calculatedResult.recommendedPrice.toFixed(2)}€
                                    </div>
                                    <div className="text-[10px] uppercase text-gray-500 font-bold">al mes</div>
                                </div>
                            </div>
                            
                            {/* Savings & Benefits Badge */}
                            <div className="mt-4 bg-green-50 border border-green-100 rounded-lg p-3">
                                <div className="flex items-center gap-2 text-green-700 font-bold text-sm mb-1">
                                    <Check size={16} className="bg-green-200 rounded-full p-0.5" />
                                    {lang === 'ca' 
                                        ? `Estalvies ${calculatedResult.savingsAmount.toFixed(2)}€ al mes!` 
                                        : `¡Ahorras ${calculatedResult.savingsAmount.toFixed(2)}€ al mes!`}
                                </div>
                                
                                {/* Service Upgrades */}
                                {(calculatedResult.speedDiff > 0 || calculatedResult.gbDiff > 0) && (
                                    <div className="mt-1 pl-6 text-xs font-medium text-green-600 space-y-0.5">
                                        {calculatedResult.speedDiff > 0 && (
                                            <div className="flex items-center gap-1">
                                                <Zap size={10} className="fill-current" />
                                                {lang === 'ca' ? 'Obtens' : 'Obtienes'} <span className="font-bold">+{calculatedResult.speedDiff} Mbps</span> extra
                                            </div>
                                        )}
                                        {calculatedResult.gbDiff > 0 && (
                                            <div className="flex items-center gap-1">
                                                <Smartphone size={10} className="fill-current" />
                                                {lang === 'ca' ? 'Obtens' : 'Obtienes'} <span className="font-bold">+{calculatedResult.gbDiff} GB</span> extra
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {!calculatedResult.isSavings && (
                        <div className="text-right">
                             <div className="text-5xl font-bold tracking-tight">
                                {calculatedResult.recommendedPrice.toFixed(2)}<span className="text-2xl">€</span>
                            </div>
                            <div className="text-white/60 text-sm">{t.monthly}</div>
                        </div>
                    )}

                  </div>

                  <div className="space-y-2 text-sm md:text-base text-white/80 border-t border-white/10 pt-4">
                    {calculatedResult.recommendedDetails.map((detail, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Check size={16} className="text-brand-pink shrink-0" />
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>

                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="w-full bg-white text-brand-purple hover:bg-brand-pink hover:text-white font-bold py-4 rounded-xl transition-all text-lg shadow-lg mt-4 flex items-center justify-center gap-2"
                  >
                    {t.contactToHire} <ArrowRight size={20} />
                  </button>
                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-white/50 p-8">
                  <Calculator size={48} className="mb-4 animate-pulse" />
                  <p>{t.calculating}</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};