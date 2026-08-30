import React, { useState } from 'react';
import { X, Search, Truck, MapPin, CheckCircle2, ShieldCheck } from 'lucide-react';

interface OrderTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({ isOpen, onClose }) => {
  const [guideCode, setGuideCode] = useState('GT-502-8842');
  const [searched, setSearched] = useState(true);

  if (!isOpen) return null;

  const sampleTrackingSteps = [
    { title: 'Pedido Confirmado & Empacado', location: 'Bodega Central Hatgt, Zona 12, Ciudad de Guatemala', date: 'Hoy - 08:30 AM', status: 'completed', desc: 'Gorra protegida en caja rígida cúbica con precinto de seguridad.' },
    { title: 'Recibido por Courier (Cargo Expreso / Guatex)', location: 'Hub de Distribución Metropolitana', date: 'Hoy - 11:15 AM', status: 'completed', desc: 'Asignado a guía terrestre nacional con cobranza contra entrega.' },
    { title: 'En Tránsito hacia tu Departamento', location: 'Ruta Carretera Interamericana / Al Atlántico', date: 'Hoy - 02:45 PM', status: 'current', desc: 'Unidad de transporte blindada en camino hacia la agencia receptora.' },
    { title: 'En Ruta con el Mensajero Local', location: 'Tu zona o cabecera departamental', date: 'Estimado: Mañana 09:00 AM - 01:00 PM', status: 'pending', desc: 'El repartidor te llamará antes de llegar para cobrar en efectivo o transferencia.' },
    { title: 'Entregado & Cobrado', location: 'Dirección del cliente', date: 'Pendiente de entrega', status: 'pending', desc: '¡Gorra en tus manos, lista para lucir!' }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#FAF7F0] border-4 border-stone-900 rounded-2xl max-w-xl w-full overflow-hidden shadow-[8px_8px_0px_0px_rgba(245,158,11,1)] my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-stone-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-stone-950 font-black">
              <Truck className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-black text-sm text-amber-300 uppercase tracking-wider">
                RASTREADOR DE GUÍA GUATEMALA
              </h3>
              <p className="text-[10px] text-stone-400">Cargo Expreso / Guatex / Mensajería Hatgt</p>
            </div>
          </div>
          <button 
            id="close-order-tracker-btn"
            onClick={onClose}
            className="text-stone-400 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          
          {/* Input Buscador de Guía */}
          <div className="bg-white p-4 rounded-xl border-2 border-stone-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <label className="text-xs font-black text-stone-800 uppercase block mb-1.5">
              Número de Guía o Teléfono del Pedido:
            </label>
            <div className="flex gap-2">
              <input 
                type="text" 
                id="guide-tracking-input"
                value={guideCode}
                onChange={(e) => setGuideCode(e.target.value)}
                placeholder="Ej: GT-502-8842 o 55551234"
                className="flex-1 bg-stone-50 border-2 border-stone-800 rounded-lg px-3 py-2 text-xs font-black uppercase focus:ring-2 focus:ring-amber-400"
              />
              <button
                id="search-tracking-btn"
                onClick={() => setSearched(true)}
                className="bg-stone-900 hover:bg-stone-800 text-amber-300 font-black text-xs px-4 py-2 rounded-lg flex items-center gap-1.5"
              >
                <Search className="w-3.5 h-3.5" />
                Rastrear
              </button>
            </div>
            <p className="text-[10px] text-stone-500 mt-1">
              Guía de ejemplo: <strong className="text-red-600">GT-502-8842</strong> (Activa)
            </p>
          </div>

          {/* Timeline de Rastreo */}
          {searched && (
            <div className="space-y-4">
              
              {/* Tarjeta de Resumen */}
              <div className="bg-amber-50 border-2 border-stone-900 p-3.5 rounded-xl flex items-center justify-between shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <div>
                  <span className="text-[10px] bg-red-600 text-white font-black px-2 py-0.5 rounded uppercase">
                    EN TRÁNSITO
                  </span>
                  <h4 className="text-xs font-black text-stone-900 mt-1">Guía: {guideCode}</h4>
                  <p className="text-[11px] text-stone-600">Destino: Ciudad de Guatemala / Departamentos</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-stone-500 font-bold block">Cobro al recibir:</span>
                  <span className="text-sm font-black text-emerald-700">Q175.00 GTQ</span>
                </div>
              </div>

              {/* Pasos */}
              <div className="space-y-3 relative pl-4 border-l-2 border-stone-300 ml-2">
                {sampleTrackingSteps.map((step, index) => {
                  const isDone = step.status === 'completed';
                  const isCurrent = step.status === 'current';

                  return (
                    <div key={index} className="relative group">
                      {/* Punto de la línea */}
                      <div className={`absolute -left-[23px] top-1 w-4 h-4 rounded-full border-2 border-stone-900 flex items-center justify-center ${
                        isDone ? 'bg-emerald-500 text-white' :
                        isCurrent ? 'bg-amber-400 text-stone-900 animate-pulse' :
                        'bg-white text-stone-400'
                      }`}>
                        {isDone ? <CheckCircle2 className="w-2.5 h-2.5" /> : <div className="w-1.5 h-1.5 rounded-full bg-stone-900" />}
                      </div>

                      <div className={`p-3 rounded-xl border-2 transition-all ${
                        isCurrent ? 'bg-white border-stone-900 shadow-[3px_3px_0px_0px_rgba(220,38,38,1)]' :
                        isDone ? 'bg-stone-50 border-stone-200' :
                        'bg-white/60 border-dashed border-stone-300 opacity-65'
                      }`}>
                        <div className="flex justify-between items-start">
                          <h5 className="text-xs font-black text-stone-900">{step.title}</h5>
                          <span className="text-[10px] font-bold text-stone-500">{step.date}</span>
                        </div>
                        <p className="text-[11px] text-stone-600 mt-0.5 flex items-center gap-1 font-medium">
                          <MapPin className="w-3 h-3 text-red-600 flex-shrink-0" />
                          {step.location}
                        </p>
                        <p className="text-[10px] text-stone-500 mt-1 italic">{step.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}

          <div className="bg-stone-100 p-3 rounded-xl border border-stone-300 text-xs text-stone-600 space-y-1">
            <p className="font-bold flex items-center gap-1.5 text-stone-900">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              ¿Tienes dudas con tu número de guía?
            </p>
            <p className="text-[11px]">
              Escríbenos directamente a nuestro WhatsApp oficial <strong>+502 5555-0199</strong> con tu nombre o número de teléfono.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
