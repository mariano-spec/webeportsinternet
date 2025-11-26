
import React, { useState } from 'react';
import { Language } from '../types';
import { MessageCircle, X } from 'lucide-react';

interface ChatAssistantProps {
  lang: Language;
}

export const ChatAssistant: React.FC<ChatAssistantProps> = ({ lang }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white w-[350px] sm:w-[400px] h-[600px] rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden mb-4 animate-fade-in-up">
           <div className="bg-brand-purple p-2 flex justify-between items-center text-white">
              <span className="font-bold text-sm ml-2">Assistent e-ports</span>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 rounded p-1">
                 <X size={18} />
              </button>
           </div>
           <iframe 
             src="https://tubular-macaron-38c780.netlify.app"
             className="w-full h-full border-0"
             title="Assistent Virtual"
           />
        </div>
      )}

      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-brand-pink hover:bg-brand-purple text-white p-4 rounded-full shadow-lg transition-all transform hover:scale-105 flex items-center justify-center"
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
      </button>

    </div>
  );
};
