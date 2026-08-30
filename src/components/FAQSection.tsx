import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { FAQ_ITEMS } from '../data/products';

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-12 border-t-4 border-stone-900 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-8">
          <span className="text-xs font-black text-red-600 uppercase tracking-widest bg-red-100 px-3 py-1 rounded-full border border-red-300">
            Dudas Frecuentes • Envíos y Pagos en Guatemala
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900 mt-2 tracking-tight uppercase">
            PREGUNTAS FRECUENTES SOBRE COMPRAS Y PAGO CONTRA ENTREGA
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 font-medium max-w-xl mx-auto">
            Resolvemos tus dudas sobre tiempos de entrega en los 22 departamentos, cajas protegidas, tallas y cómo pagar en efectivo al recibir tu gorra.
          </p>
        </div>

        <div className="space-y-3">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <div 
                key={index}
                className="border-2 border-stone-900 rounded-2xl overflow-hidden shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] bg-[#FAF7F0] transition-all"
              >
                <button
                  id={`faq-accordion-toggle-${index}`}
                  onClick={() => toggleFAQ(index)}
                  className="w-full p-4 text-left flex justify-between items-center gap-4 bg-[#FAF7F0] hover:bg-amber-50/50 transition-colors"
                >
                  <span className="text-sm font-black text-stone-900 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                    {item.question}
                  </span>
                  <div className="w-6 h-6 rounded-full bg-stone-900 text-amber-300 flex items-center justify-center flex-shrink-0">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="p-4 pt-1 bg-white border-t border-stone-200 text-xs text-stone-700 font-medium leading-relaxed animate-in fade-in duration-150">
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
