import React from 'react';
import { 
  X, 
  ShoppingBag, 
  Minus, 
  Plus, 
  Trash2, 
  Send, 
  Truck, 
  Sparkles, 
  ShieldCheck
} from 'lucide-react';
import { CartItem } from '../types';
import { UPSELL_ACCESSORIES } from '../data/products';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (cartItemId: string, delta: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onProceedToCheckout: () => void;
  onAddUpsell: (item: any) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  onAddUpsell
}) => {
  if (!isOpen) return null;

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const freeShippingThreshold = 300;
  const progressToFreeShipping = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const shippingCost = subtotal >= freeShippingThreshold ? 0 : 35;
  const total = subtotal + shippingCost;
  const totalItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-950/75 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      <div className="bg-[#FAF7F0] border-l-4 border-stone-900 w-full max-w-md h-full flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b-2 border-stone-300 bg-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-amber-400 rounded-xl border-2 border-stone-900 flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <ShoppingBag className="w-5 h-5 text-red-700" />
            </div>
            <div>
              <h3 className="text-lg font-black text-stone-900 leading-tight">TU BOLSA HATGT</h3>
              <p className="text-[11px] text-stone-500 font-bold">{totalItemsCount} producto(s) en tu bolsa</p>
            </div>
          </div>
          <button 
            id="close-cart-drawer-btn"
            onClick={onClose}
            className="p-2 hover:bg-stone-100 rounded-lg text-stone-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Bar */}
        <div className="bg-amber-100/90 border-b-2 border-amber-300 px-5 py-2.5 text-xs">
          <div className="flex justify-between items-center mb-1">
            <span className="font-bold text-stone-800 flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-emerald-700" />
              {remainingForFreeShipping === 0 ? (
                <strong className="text-emerald-800 font-black">¡CALIFICAS PARA ENVÍO GRATIS!</strong>
              ) : (
                <span>Agrega <strong className="text-red-700 font-black">Q{remainingForFreeShipping.toFixed(2)}</strong> más para Envío Gratis</span>
              )}
            </span>
            <span className="text-[10px] font-black text-stone-600">{Math.round(progressToFreeShipping)}%</span>
          </div>
          <div className="w-full bg-stone-300 rounded-full h-2 overflow-hidden border border-stone-400">
            <div 
              className="bg-gradient-to-r from-red-600 via-amber-500 to-emerald-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressToFreeShipping}%` }}
            />
          </div>
        </div>

        {/* Scrollable Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-16 h-16 bg-stone-200 text-stone-400 rounded-full flex items-center justify-center mx-auto border-2 border-stone-300">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h4 className="text-base font-black text-stone-800">Tu bolsa está vacía</h4>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                Explora el catálogo y elige tu gorra retro con pago contra entrega en toda Guatemala.
              </p>
              <button
                id="empty-cart-explore-btn"
                onClick={onClose}
                className="bg-stone-900 text-amber-300 font-black text-xs px-5 py-2.5 rounded-xl border-2 border-stone-900 shadow-[2px_2px_0px_0px_rgba(220,38,38,1)]"
              >
                Ver Catálogo de Gorras
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((item) => (
                <div 
                  key={item.cartItemId}
                  className="bg-white border-2 border-stone-900 rounded-xl p-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex gap-3 relative"
                >
                  {/* Cap Mini Thumbnail */}
                  <div className="w-16 h-16 bg-gradient-to-b from-amber-50 to-stone-100 rounded-lg border border-stone-800 flex items-center justify-center flex-shrink-0">
                    <span className="text-[11px] font-black text-stone-800 tracking-tighter">
                      HATGT
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h4 className="text-xs font-black text-stone-900 truncate pr-2">{item.name}</h4>
                      <button 
                        id={`remove-cart-item-${item.cartItemId}`}
                        onClick={() => onRemoveItem(item.cartItemId)}
                        className="text-stone-400 hover:text-red-600 p-0.5"
                        title="Eliminar de la bolsa"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-[10px] text-stone-500 font-bold truncate">
                      Color: {item.selectedColor}
                    </p>

                    {item.customPatchText && (
                      <p className="text-[10px] text-purple-700 font-black">
                        Bordado: "{item.customPatchText}"
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-stone-100">
                      <div className="flex items-center border border-stone-800 rounded-lg overflow-hidden bg-stone-50">
                        <button 
                          id={`decrease-cart-item-${item.cartItemId}`}
                          onClick={() => onUpdateQuantity(item.cartItemId, -1)}
                          className="px-2 py-0.5 hover:bg-stone-200 text-stone-700 font-black"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-black text-stone-900">{item.quantity}</span>
                        <button 
                          id={`increase-cart-item-${item.cartItemId}`}
                          onClick={() => onUpdateQuantity(item.cartItemId, 1)}
                          className="px-2 py-0.5 hover:bg-stone-200 text-stone-700 font-black"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs font-black text-red-600">
                        Q{(item.price * item.quantity).toFixed(2)} GTQ
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Upsells de Accesorios */}
          {cart.length > 0 && (
            <div className="bg-white border-2 border-dashed border-stone-400 rounded-xl p-3 space-y-2">
              <span className="text-[11px] font-black text-stone-800 uppercase flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Agrega a tu pedido (Opcional):
              </span>
              <div className="space-y-1.5">
                {UPSELL_ACCESSORIES.map(acc => (
                  <div key={acc.id} className="flex items-center justify-between text-xs bg-stone-50 p-2 rounded-lg border border-stone-200">
                    <div>
                      <p className="font-black text-stone-900">{acc.name}</p>
                      <p className="text-[10px] text-stone-500">{acc.desc}</p>
                    </div>
                    <button
                      id={`add-upsell-${acc.id}`}
                      onClick={() => onAddUpsell(acc)}
                      className="bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-[10px] px-2.5 py-1 rounded border border-stone-900 whitespace-nowrap shadow-sm"
                    >
                      + Q{acc.price}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer con Totales y Checkout */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t-2 border-stone-300 bg-white space-y-3 shadow-lg">
            <div className="space-y-1.5 text-xs font-bold text-stone-600">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="text-stone-900 font-black">Q{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Envío Nacional:</span>
                <span>
                  {shippingCost === 0 ? (
                    <span className="text-emerald-700 font-black">¡GRATIS!</span>
                  ) : (
                    `Q${shippingCost}.00`
                  )}
                </span>
              </div>
              <div className="flex justify-between text-base font-black text-stone-900 pt-2 border-t border-stone-200">
                <span>TOTAL A PAGAR:</span>
                <span className="text-red-600">Q{total.toFixed(2)} GTQ</span>
              </div>
            </div>

            <button 
              id="proceed-to-checkout-btn"
              onClick={() => {
                onClose();
                onProceedToCheckout();
              }}
              className="w-full bg-red-600 hover:bg-red-500 text-white font-black py-3.5 rounded-xl border-2 border-stone-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-2 text-sm tracking-wide active:translate-x-0.5 active:translate-y-0.5 transition-all"
            >
              <Send className="w-4 h-4" />
              CONFIRMAR PEDIDO (PAGO CONTRA ENTREGA)
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] text-stone-500 font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Garantía de satisfacción y pago al recibir</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
