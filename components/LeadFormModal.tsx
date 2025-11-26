
import React, { useState } from 'react';
import { Language } from '../types';
import { useContent } from '../contexts/ContentContext';
import { X, CheckCircle, AlertCircle, Send } from 'lucide-react';

interface LeadFormModalProps {
  lang: Language;
  isOpen: boolean;
  onClose: () => void;
  summary: string[];
  totalPrice: number;
}

export const LeadFormModal: React.FC<LeadFormModalProps> = ({ lang, isOpen, onClose, summary, totalPrice }) => {
  const { addLead, notificationEmail } = useContent();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    comments: ''
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    
    // 1. Add to internal Dashboard (localStorage)
    addLead({
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      comments: formData.comments,
      summary: summary,
      totalPrice: totalPrice
    });

    // 2. Send Email Notification via FormSubmit (Serverless)
    if (notificationEmail && notificationEmail.trim() !== '') {
      try {
        await fetch(`https://formsubmit.co/ajax/${notificationEmail}`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            _subject: `Nou Lead e-ports: ${formData.name}`,
            _template: 'table',
            nom: formData.name,
            telefon: formData.phone,
            email: formData.email,
            adreca: formData.address,
            comentaris: formData.comments || 'Cap',
            preu_total: `${totalPrice.toFixed(2)}€`,
            resum_tarifa: summary.join(', ')
          })
        });
      } catch (error) {
        console.error("Failed to send email notification", error);
        // We don't block the success UI if email fails, as data is saved in dashboard
      }
    }
    
    // Simulate UI delay
    setTimeout(() => {
      setStatus('success');
    }, 800);
  };

  const isCa = lang === 'ca';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Modal Content */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative z-10 animate-fade-in-up">
        
        {/* Header */}
        <div className="bg-brand-purple p-6 text-white flex justify-between items-center">
          <h3 className="text-xl font-bold">
            {isCa ? 'Sol·licitar Contractació' : 'Solicitar Contratación'}
          </h3>
          <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {status === 'success' ? (
          <div className="p-10 text-center">
            <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={48} />
            </div>
            <h4 className="text-2xl font-bold text-gray-800 mb-2">
              {isCa ? 'Sol·licitud Enviada!' : '¡Solicitud Enviada!'}
            </h4>
            <p className="text-gray-600 mb-8">
              {isCa 
                ? 'Gràcies per confiar en e-ports. Ens posarem en contacte amb tu molt aviat.'
                : 'Gracias por confiar en e-ports. Nos pondremos en contacto contigo muy pronto.'}
            </p>
            <button 
              onClick={onClose}
              className="bg-brand-purple text-white px-6 py-3 rounded-xl font-bold hover:bg-brand-pink transition-colors w-full"
            >
              {isCa ? 'Tancar' : 'Cerrar'}
            </button>
          </div>
        ) : (
          <div className="p-6">
            {/* Summary Card */}
            <div className="bg-brand-light p-4 rounded-xl border border-brand-pink/20 mb-6">
              <h4 className="text-xs font-bold uppercase text-brand-pink mb-2">
                {isCa ? 'Resum de la tarifa' : 'Resumen de la tarifa'}
              </h4>
              <ul className="space-y-1 mb-3">
                {summary.map((item, i) => (
                  <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                    <CheckCircle size={14} className="mt-1 shrink-0 text-brand-purple" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="pt-3 border-t border-gray-200 flex justify-between items-end">
                <span className="text-sm text-gray-500">Total estimat:</span>
                <span className="text-2xl font-extrabold text-brand-purple">{totalPrice.toFixed(2)}€</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {isCa ? 'Nom complet' : 'Nombre completo'} *
                </label>
                <input 
                  type="text" 
                  required 
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-purple focus:border-transparent outline-none transition-all"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  placeholder={isCa ? 'Joan Garcia' : 'Juan García'}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {isCa ? 'Telèfon' : 'Teléfono'} *
                  </label>
                  <input 
                    type="tel" 
                    required 
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-purple focus:border-transparent outline-none transition-all"
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    placeholder="600 000 000"
                  />
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                   <input 
                    type="email" 
                    required 
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-purple focus:border-transparent outline-none transition-all"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    placeholder="hola@exemple.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {isCa ? 'Adreça d\'instal·lació' : 'Dirección de instalación'}
                </label>
                <input 
                  type="text" 
                  required
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-purple focus:border-transparent outline-none transition-all"
                  value={formData.address}
                  onChange={e => setFormData({...formData, address: e.target.value})}
                  placeholder={isCa ? 'C/ Major 1, Tortosa' : 'C/ Mayor 1, Tortosa'}
                />
              </div>

              <button 
                type="submit" 
                disabled={status === 'submitting'}
                className="w-full bg-brand-pink text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-brand-pink/30 hover:bg-[#a00065] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
              >
                {status === 'submitting' ? (
                  <span>Enviant...</span>
                ) : (
                  <>
                    <Send size={18} /> {isCa ? 'Enviar Sol·licitud' : 'Enviar Solicitud'}
                  </>
                )}
              </button>
              <p className="text-xs text-center text-gray-400 mt-2">
                {isCa ? 'En enviar, acceptes la política de privacitat.' : 'Al enviar, aceptas la política de privacidad.'}
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
