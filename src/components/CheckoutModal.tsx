import React, { useState } from 'react';
import { 
  X, 
  Send, 
  Clock, 
  Phone, 
  MapPin, 
  Copy,
  CheckCircle2
} from 'lucide-react';
import { CartItem, OrderFormData } from '../types';
import { DEPARTAMENTOS_GT } from '../data/products';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onOrderCompleted: (orderRecord?: any) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cart,
  onOrderCompleted
}) => {
  const [formData, setFormData] = useState<OrderFormData>({
    nombre: '',
    telefono: '',
    departamento: DEPARTAMENTOS_GT[0].departamento,
    direccion: '',
    notas: '',
    metodoPago: 'contra-entrega'
  });

  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);

  if (!isOpen) return null;

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shippingCost = subtotal >= 300 ? 0 : 35;
  const total = subtotal + shippingCost;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre.trim() || !formData.telefono.trim() || !formData.direccion.trim()) {
      return;
    }

    const itemsSummary = cart.map(i => `• ${i.quantity}x ${i.name} [Color: ${i.selectedColor}]${i.customPatchText ? ` (Bordado: ${i.customPatchText})` : ''} = Q${(i.price * i.quantity).toFixed(2)}`).join('\n');
    
    const msg = `🇬🇹 *NUEVO PEDIDO HATGT - PAGO CONTRA ENTREGA*\n\n` +
                `*Cliente:* ${formData.nombre}\n` +
                `*Teléfono:* ${formData.telefono}\n` +
                `*Departamento:* ${formData.departamento}\n` +
                `*Dirección de Entrega:* ${formData.direccion}\n` +
                `*Notas / Referencia:* ${formData.notas || 'Sin notas adicionales'}\n` +
                `*Método de Pago:* ${formData.metodoPago === 'contra-entrega' ? '💵 Efectivo Contra Entrega al Mensajero' : '🏦 Transferencia Bancaria (BI / Banrural / G&T)'}\n\n` +
                `*Gorr@s Solicitadas:*\n${itemsSummary}\n\n` +
                `*Subtotal:* Q${subtotal.toFixed(2)}\n` +
                `*Envío:* ${shippingCost === 0 ? '¡GRATIS!' : `Q${shippingCost}.00`}\n` +
                `*TOTAL A COBRAR:* Q${total.toFixed(2)} GTQ\n\n` +
                `_¡Por favor confirmar mi pedido para despacho inmediato vía Cargo Expreso / Guatex!_`;

    const encodedMsg = encodeURIComponent(msg);
    const whatsappUrl = `https://wa.me/50255550199?text=${encodedMsg}`;

    setOrderSubmitted(true);
    window.open(whatsappUrl, '_blank');
    onOrderCompleted({
      customerName: formData.nombre,
      department: formData.departamento,
      paymentMethod: formData.metodoPago === 'contra-entrega' ? 'Contra Entrega' : 'Transferencia Bancaria',
      cart,
      totalAmount: total
    });
  };

  const handleCopySummary = () => {
    const text = `Pedido Hatgt #${Date.now().toString().slice(-5)} - Total Q${total.toFixed(2)} a nombre de ${formData.nombre}`;
    navigator.clipboard?.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white border-4 border-stone-900 rounded-2xl max-w-xl w-full overflow-hidden shadow-[10px_10px_0px_0px_rgba(245,158,11,1)] my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-stone-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🇬🇹</span>
            <div>
              <h3 className="font-black text-sm text-amber-400 uppercase tracking-wider">
                CONFIRMAR PEDIDO • HATGT GUATEMALA
              </h3>
              <p className="text-[10px] text-stone-400">Pagas en efectivo o transferencia al recibir</p>
            </div>
          </div>
          <button 
            id="close-checkout-modal-btn"
            onClick={onClose}
            className="text-stone-400 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {orderSubmitted ? (
          <div className="p-6 sm:p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto border-2 border-stone-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h3 className="text-2xl font-black text-stone-900 tracking-tight">
              ¡PEDIDO REGISTRADO CON ÉXITO!
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed max-w-md mx-auto">
              Se ha generado tu orden de despacho. Te hemos redirigido a WhatsApp para confirmar los detalles finales y enviarte el número de guía de <strong>Cargo Expreso / Guatex</strong>.
            </p>

            <div className="bg-amber-50 p-4 rounded-xl border-2 border-amber-300 text-left text-xs space-y-1.5 font-medium shadow-sm">
              <div className="flex justify-between items-center pb-1 border-b border-amber-200">
                <span className="font-black text-stone-900 uppercase">Recibo de Pedido:</span>
                <button 
                  onClick={handleCopySummary}
                  className="text-[10px] bg-white border border-stone-800 px-2 py-0.5 rounded font-bold hover:bg-stone-100 flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" /> {copiedSummary ? 'Copiado' : 'Copiar'}
                </button>
              </div>
              <p><strong>Total a cobrar al mensajero:</strong> <span className="text-red-600 font-black">Q{total.toFixed(2)} GTQ</span></p>
              <p><strong>Departamento:</strong> {formData.departamento}</p>
              <p><strong>Destinatario:</strong> {formData.nombre} ({formData.telefono})</p>
              <p><strong>Dirección:</strong> {formData.direccion}</p>
            </div>

            <div className="pt-2">
              <button 
                id="finish-order-btn"
                onClick={onClose}
                className="bg-stone-900 text-amber-300 font-black px-6 py-3 rounded-xl text-xs uppercase tracking-wider border-2 border-stone-900 shadow-[3px_3px_0px_0px_rgba(220,38,38,1)] hover:bg-stone-800"
              >
                Volver a la Tienda
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmitOrder} className="p-5 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            
            {/* Banner de Confianza */}
            <div className="bg-amber-100/80 border-2 border-amber-400 p-3 rounded-xl flex items-center gap-3">
              <Clock className="w-5 h-5 text-red-700 flex-shrink-0" />
              <p className="text-xs text-stone-900 font-bold">
                Pagas al recibir en tu casa o trabajo. Enviamos en caja rígida protegida anti-aplastamiento.
              </p>
            </div>

            {/* Campos del Formulario */}
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-black text-stone-800 mb-1 flex items-center gap-1">
                  <span>Nombre y Apellido *</span>
                </label>
                <input 
                  type="text" 
                  id="checkout-name-input"
                  required
                  placeholder="Ej: Rodrigo Morales Castillo"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full bg-stone-50 border-2 border-stone-800 rounded-lg p-2.5 font-medium focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-black text-stone-800 mb-1 flex items-center gap-1">
                    <Phone className="w-3 h-3 text-red-600" />
                    <span>Teléfono / WhatsApp *</span>
                  </label>
                  <input 
                    type="tel" 
                    id="checkout-phone-input"
                    required
                    placeholder="Ej: 5555 1234"
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    className="w-full bg-stone-50 border-2 border-stone-800 rounded-lg p-2.5 font-medium focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                <div>
                  <label className="block font-black text-stone-800 mb-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-emerald-600" />
                    <span>Departamento *</span>
                  </label>
                  <select 
                    id="checkout-dept-select"
                    value={formData.departamento}
                    onChange={(e) => setFormData({ ...formData, departamento: e.target.value })}
                    className="w-full bg-stone-50 border-2 border-stone-800 rounded-lg p-2.5 font-bold focus:ring-2 focus:ring-amber-400 text-xs"
                  >
                    {DEPARTAMENTOS_GT.map((dep, i) => (
                      <option key={i} value={dep.departamento}>{dep.departamento}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-black text-stone-800 mb-1">
                  Dirección Exacta de Entrega *
                </label>
                <input 
                  type="text" 
                  id="checkout-address-input"
                  required
                  placeholder="Zona, colonia, calle, número de casa, punto de referencia o garita"
                  value={formData.direccion}
                  onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                  className="w-full bg-stone-50 border-2 border-stone-800 rounded-lg p-2.5 font-medium focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div>
                <label className="block font-black text-stone-800 mb-1">
                  Notas para el Mensajero (Opcional)
                </label>
                <input 
                  type="text" 
                  id="checkout-notes-input"
                  placeholder="Ej: Dejar con el guardia de garita o llamar al llegar"
                  value={formData.notas}
                  onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                  className="w-full bg-stone-50 border-2 border-stone-800 rounded-lg p-2.5 font-medium"
                />
              </div>

              {/* Selector de Método de Pago */}
              <div>
                <label className="block font-black text-stone-800 mb-1.5">
                  Forma de Pago en Guatemala:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    id="payment-cod-btn"
                    onClick={() => setFormData({ ...formData, metodoPago: 'contra-entrega' })}
                    className={`p-2.5 rounded-xl border-2 text-left font-bold transition-all ${
                      formData.metodoPago === 'contra-entrega' 
                        ? 'bg-amber-400 border-stone-900 text-stone-950 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' 
                        : 'bg-stone-50 border-stone-300 text-stone-600 hover:border-stone-500'
                    }`}
                  >
                    💵 Efectivo al Recibir
                  </button>
                  <button
                    type="button"
                    id="payment-transfer-btn"
                    onClick={() => setFormData({ ...formData, metodoPago: 'transferencia' })}
                    className={`p-2.5 rounded-xl border-2 text-left font-bold transition-all ${
                      formData.metodoPago === 'transferencia' 
                        ? 'bg-amber-400 border-stone-900 text-stone-950 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' 
                        : 'bg-stone-50 border-stone-300 text-stone-600 hover:border-stone-500'
                    }`}
                  >
                    🏦 Transferencia Bancaria
                  </button>
                </div>
              </div>
            </div>

            {/* Resumen Final de Cobro */}
            <div className="pt-3 border-t-2 border-stone-200 flex flex-col sm:flex-row justify-between items-center gap-3">
              <div className="text-left w-full sm:w-auto">
                <p className="text-[10px] text-stone-500 font-bold uppercase">Total a Pagar:</p>
                <p className="text-2xl font-black text-red-600">Q{total.toFixed(2)} GTQ</p>
                <p className="text-[10px] text-emerald-700 font-bold">
                  {shippingCost === 0 ? '✓ Envío GRATIS Incluido' : `+ Q${shippingCost}.00 Envío nacional`}
                </p>
              </div>

              <button 
                type="submit"
                id="submit-order-whatsapp-btn"
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-black px-6 py-3.5 rounded-xl border-2 border-stone-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-2 text-xs uppercase tracking-wider active:translate-x-0.5 active:translate-y-0.5 transition-all"
              >
                <Send className="w-4 h-4" />
                ENVIAR PEDIDO POR WHATSAPP
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
