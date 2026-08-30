import React, { useState } from 'react';
import { X, Ruler, CheckCircle, Info } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ isOpen, onClose }) => {
  const [cm, setCm] = useState<number>(58);

  if (!isOpen) return null;

  const getSizeRecommendation = (measure: number) => {
    if (measure < 55) return { size: 'S / Pequeña', usSize: '6 7/8 - 7', fit: 'Ajuste en puntos 1-2 del Snapback', desc: 'Recomendada: Dad Caps desestructuradas y 5-Panel con correa ajustable.' };
    if (measure <= 58) return { size: 'M / Talla Promedio Universal', usSize: '7 1/8 - 7 3/8', fit: 'Ajuste central puntos 3-4 del Snapback (Estándar)', desc: 'Ideal para todos los modelos: Snapback 80s, Trucker 70s y Corduroy.' };
    if (measure <= 60) return { size: 'L / Grande', usSize: '7 1/2 - 7 5/8', fit: 'Ajuste en puntos 5-6 del Snapback', desc: 'Excelente para Snapback Corona Alta 90s y Trucker con visera curva.' };
    return { size: 'XL / Extra Grande', usSize: '7 3/4 - 8', fit: 'Ajuste en punto 7 del Snapback', desc: 'Recomendada: Snapback de corona amplia y Trucker 6 paneles.' };
  };

  const rec = getSizeRecommendation(cm);

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#FAF7F0] border-4 border-stone-900 rounded-2xl max-w-xl w-full overflow-hidden shadow-[8px_8px_0px_0px_rgba(220,38,38,1)] my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-stone-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-amber-400 rounded-lg flex items-center justify-center text-stone-950 font-black">
              <Ruler className="w-4 h-4 text-red-700" />
            </div>
            <div>
              <h3 className="font-black text-sm text-amber-300 uppercase tracking-wider">
                GUÍA DE TALLAS Y AJUSTE CHAPÍN
              </h3>
              <p className="text-[10px] text-stone-400">Encuentra la medida exacta de tu cabeza</p>
            </div>
          </div>
          <button 
            id="close-size-guide-btn"
            onClick={onClose}
            className="text-stone-400 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          
          {/* Medidor Interactivo */}
          <div className="bg-white p-4 rounded-xl border-2 border-stone-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-black text-stone-900 uppercase">Circunferencia de tu cabeza:</span>
              <div className="bg-stone-900 text-amber-300 font-black px-3 py-1 rounded-lg text-sm border border-amber-400">
                {cm} cm / {(cm / 2.54).toFixed(1)}" pulgadas
              </div>
            </div>

            <input 
              type="range" 
              min={53} 
              max={63} 
              value={cm} 
              onChange={(e) => setCm(Number(e.target.value))}
              className="w-full accent-red-600 cursor-pointer h-2 bg-stone-200 rounded-lg"
            />

            <div className="flex justify-between text-[10px] font-bold text-stone-500">
              <span>53 cm (Junior)</span>
              <span>58 cm (Estándar GT)</span>
              <span>63 cm (Max)</span>
            </div>

            {/* Resultado */}
            <div className="bg-amber-50 border-2 border-amber-400 p-3 rounded-xl space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-stone-900">Talla recomendada:</span>
                <span className="text-xs font-black text-red-600 uppercase bg-white px-2 py-0.5 rounded border border-stone-900">
                  {rec.size} (US: {rec.usSize})
                </span>
              </div>
              <p className="text-[11px] font-bold text-emerald-800 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> {rec.fit}
              </p>
              <p className="text-[11px] text-stone-600">{rec.desc}</p>
            </div>
          </div>

          {/* Cómo Medirte */}
          <div className="space-y-2 text-xs text-stone-700">
            <h4 className="font-black text-stone-900 uppercase flex items-center gap-1.5">
              <Info className="w-4 h-4 text-emerald-600" />
              ¿Cómo medir tu cabeza en 1 minuto?
            </h4>
            <ol className="list-decimal list-inside space-y-1 pl-1 font-medium">
              <li>Usa una cinta métrica flexible (o un cordón con una regla).</li>
              <li>Pásala 1 cm por encima de tus orejas y a mitad de la frente.</li>
              <li>Todas nuestras gorras traen <strong>broches snapback de 7 puntos</strong> que abarcan desde 54 cm hasta 62 cm con total comodidad.</li>
            </ol>
          </div>

          <button
            id="got-it-size-guide-btn"
            onClick={onClose}
            className="w-full bg-stone-900 hover:bg-stone-800 text-amber-300 font-black py-3 rounded-xl border-2 border-stone-900 shadow-[3px_3px_0px_0px_rgba(220,38,38,1)] text-xs uppercase tracking-wider transition-all"
          >
            ¡Entendido! Volver a la tienda
          </button>
        </div>

      </div>
    </div>
  );
};
