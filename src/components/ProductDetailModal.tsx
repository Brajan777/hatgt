import React, { useState, useEffect } from 'react';
import { 
  X, 
  RotateCw, 
  ShieldCheck, 
  Star, 
  Minus, 
  Plus, 
  Check, 
  ShoppingBag, 
  Send, 
  Share2, 
  Heart, 
  MapPin, 
  Ruler
} from 'lucide-react';
import { CapVisualInteractive } from './CapVisualInteractive';
import { CapAngle, Product } from '../types';
import { DEPARTAMENTOS_GT } from '../data/products';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, colorObj: any, quantity: number) => void;
  onDirectCheckout: (product: Product, colorObj: any, quantity: number) => void;
  isFavorite: boolean;
  onToggleFavorite: (product: Product) => void;
  onOpenSizeGuide: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onDirectCheckout,
  isFavorite,
  onToggleFavorite,
  onOpenSizeGuide
}) => {
  if (!product) return null;

  const [modalAngle, setModalAngle] = useState<CapAngle>('front');
  const [modalColorIndex, setModalColorIndex] = useState(0);
  const [modalQuantity, setModalQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'detalles' | 'envio' | 'reviews'>('detalles');
  const [selectedDept, setSelectedDept] = useState(DEPARTAMENTOS_GT[0].departamento);
  const [isAutoSpinning, setIsAutoSpinning] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  const angles: { id: CapAngle; label: string; icon: string }[] = [
    { id: 'front', label: 'Frontal', icon: '🧢' },
    { id: 'side', label: 'Lateral 45°', icon: '📐' },
    { id: 'back', label: 'Broche', icon: '🔒' },
    { id: 'undervisor', label: 'Bajo-Visera', icon: '🟢' }
  ];

  // Auto spin through angles
  useEffect(() => {
    let interval: any;
    if (isAutoSpinning) {
      const order: CapAngle[] = ['front', 'side', 'back', 'undervisor'];
      interval = setInterval(() => {
        setModalAngle(prev => {
          const nextIdx = (order.indexOf(prev) + 1) % order.length;
          return order[nextIdx];
        });
      }, 1600);
    }
    return () => clearInterval(interval);
  }, [isAutoSpinning]);

  const currentDeptInfo = DEPARTAMENTOS_GT.find(d => d.departamento === selectedDept) || DEPARTAMENTOS_GT[0];

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2500);
  };

  const selectedColorObj = product.colors[modalColorIndex] || product.colors[0];

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-[#FAF7F0] border-4 border-stone-900 rounded-2xl max-w-4xl w-full overflow-hidden shadow-[10px_10px_0px_0px_rgba(220,38,38,1)] relative my-auto max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-stone-900 text-white p-3.5 sm:p-4 flex items-center justify-between border-b-2 border-stone-800">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-red-600 rounded-full" />
            <span className="w-3 h-3 bg-amber-400 rounded-full" />
            <span className="w-3 h-3 bg-emerald-600 rounded-full" />
            <span className="text-xs font-black text-amber-300 ml-2 uppercase tracking-widest hidden xs:inline">
              VISOR INTERACTIVO HATGT • GUATEMALA
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="toggle-favorite-modal-btn"
              onClick={() => onToggleFavorite(product)}
              className={`p-1.5 rounded-lg border transition-colors ${
                isFavorite 
                  ? 'bg-red-600 text-white border-red-500' 
                  : 'bg-stone-800 text-stone-300 border-stone-700 hover:text-red-400'
              }`}
              title="Guardar en Favoritas"
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>

            <button
              id="share-product-btn"
              onClick={handleShare}
              className="bg-stone-800 hover:bg-stone-700 text-stone-300 p-1.5 rounded-lg border border-stone-700 transition-colors"
              title="Compartir gorra"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button 
              id="close-product-modal-btn"
              onClick={onClose}
              className="bg-stone-800 hover:bg-red-600 text-white p-1.5 rounded-lg border border-stone-700 transition-colors"
              title="Cerrar ventana"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {copiedShare && (
          <div className="bg-emerald-600 text-white text-xs font-bold py-1.5 px-4 text-center">
            ✓ ¡Enlace copiado al portapapeles!
          </div>
        )}

        {/* Contenido Principal con Scroll */}
        <div className="overflow-y-auto p-4 sm:p-6 flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* COLUMNA IZQUIERDA: VISOR DE FOTOS / ÁNGULOS */}
            <div className="lg:col-span-7 space-y-4">
              
              {/* Visor Grande */}
              <div className="relative">
                <CapVisualInteractive 
                  type={product.svgType}
                  paletteKey={selectedColorObj.paletteKey}
                  crownHex={selectedColorObj.hexCrown}
                  visorHex={selectedColorObj.hexVisor}
                  viewAngle={modalAngle}
                  imageUrl={product.imageUrl}
                  sideImageUrl={product.sideImageUrl}
                  backImageUrl={product.backImageUrl}
                  undervisorImageUrl={product.undervisorImageUrl}
                  size="large"
                />

                {/* Sello de Garantía */}
                <div className="absolute bottom-3 left-3 bg-stone-900/90 text-amber-300 text-[10px] font-bold px-2.5 py-1 rounded border border-stone-700 flex items-center gap-1.5 backdrop-blur-md">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Fotografías Reales Modelo Hatgt
                </div>

                {/* Botón de Auto-Giro */}
                <button
                  id="auto-spin-btn"
                  onClick={() => setIsAutoSpinning(!isAutoSpinning)}
                  className={`absolute top-3 right-3 text-[10px] font-black px-2.5 py-1.5 rounded-lg border-2 border-stone-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-1.5 transition-all ${
                    isAutoSpinning 
                      ? 'bg-red-600 text-white animate-pulse' 
                      : 'bg-white hover:bg-stone-100 text-stone-900'
                  }`}
                >
                  <RotateCw className={`w-3 h-3 ${isAutoSpinning ? 'animate-spin' : ''}`} />
                  {isAutoSpinning ? 'Pausar Giro 360°' : 'Giro 360°'}
                </button>
              </div>

              {/* SELECTOR DE ÁNGULOS / MINIATURAS INTERACTIVAS */}
              <div>
                <span className="text-[11px] font-black text-stone-700 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                  <RotateCw className="w-3.5 h-3.5 text-red-600" />
                  Explorar Ángulos y Tomas de la Gorra:
                </span>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {angles.map((angle) => {
                    const isCurrent = modalAngle === angle.id;
                    return (
                      <button
                        key={angle.id}
                        id={`modal-angle-${angle.id}`}
                        onClick={() => {
                          setIsAutoSpinning(false);
                          setModalAngle(angle.id);
                        }}
                        className={`p-2 rounded-xl border-2 text-center transition-all flex flex-col items-center justify-center gap-1 ${
                          isCurrent 
                            ? 'bg-stone-900 text-amber-300 border-stone-900 shadow-[3px_3px_0px_0px_rgba(220,38,38,1)] translate-y-0.5' 
                            : 'bg-white text-stone-700 border-stone-300 hover:border-stone-900'
                        }`}
                      >
                        <span className="text-sm">{angle.icon}</span>
                        <span className="text-[9px] font-black leading-none">{angle.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SELECTOR INTERACTIVO DE COLOR */}
              <div className="bg-white p-4 rounded-xl border-2 border-stone-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <span className="text-xs font-black text-stone-900 uppercase block mb-2">
                  Color / Combinación: <span className="text-red-600 font-bold">{selectedColorObj.name}</span>
                </span>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color, idx) => (
                    <button
                      key={idx}
                      id={`modal-color-option-${idx}`}
                      onClick={() => setModalColorIndex(idx)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-black border-2 transition-all flex items-center gap-2 ${
                        modalColorIndex === idx 
                          ? 'bg-amber-400 text-stone-950 border-stone-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] scale-105' 
                          : 'bg-stone-100 text-stone-700 border-stone-300 hover:bg-stone-200'
                      }`}
                    >
                      <span 
                        className="w-3 h-3 rounded-full border border-stone-800" 
                        style={{ backgroundColor: color.hexCrown || '#166534' }}
                      />
                      {color.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Botón de Guía de Tallas */}
              <div className="flex justify-end">
                <button
                  id="open-size-guide-from-modal-btn"
                  onClick={onOpenSizeGuide}
                  className="text-xs font-bold text-stone-700 hover:text-red-700 flex items-center gap-1.5 underline underline-offset-4"
                >
                  <Ruler className="w-3.5 h-3.5 text-red-600" />
                  Ver Guía de Tallas & Ajuste de Cabeza
                </button>
              </div>

            </div>

            {/* COLUMNA DERECHA: INFORMACIÓN, COMPRA Y PESTAÑAS */}
            <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-emerald-700 uppercase tracking-wider bg-emerald-100 px-2.5 py-0.5 rounded border border-emerald-300">
                    {product.category}
                  </span>
                  <div className="flex items-center text-amber-500 font-bold text-xs gap-1">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span>{product.rating} ({product.reviewsCount} reseñas)</span>
                  </div>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-stone-900 leading-tight">
                  {product.name}
                </h2>

                {/* Precios y Ahorro */}
                <div className="bg-white p-3 rounded-xl border-2 border-stone-900 flex items-center justify-between shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                  <div>
                    <span className="text-xs text-stone-400 line-through font-bold block">
                      Precio Normal: Q{product.originalPrice}.00
                    </span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-red-600">Q{product.price}</span>
                      <span className="text-xs font-black text-stone-800">.00 GTQ</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] bg-red-600 text-white font-black px-2 py-0.5 rounded uppercase block">
                      Ahorras Q{product.originalPrice - product.price}
                    </span>
                    <span className="text-[10px] text-emerald-700 font-bold mt-1 block">
                      ✓ Pago Contra Entrega
                    </span>
                  </div>
                </div>

                {/* Selector de Cantidad */}
                <div className="flex items-center justify-between bg-stone-100 p-2.5 rounded-xl border border-stone-300">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black text-stone-800 uppercase">Cantidad:</span>
                    <div className="flex items-center border-2 border-stone-900 rounded-xl overflow-hidden bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      <button 
                        id="decrease-modal-qty-btn"
                        onClick={() => setModalQuantity(Math.max(1, modalQuantity - 1))}
                        className="px-3 py-1.5 hover:bg-stone-100 text-stone-900 font-black"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-4 text-xs font-black">{modalQuantity}</span>
                      <button 
                        id="increase-modal-qty-btn"
                        onClick={() => setModalQuantity(modalQuantity + 1)}
                        className="px-3 py-1.5 hover:bg-stone-100 text-stone-900 font-black"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <span className="text-[11px] text-stone-600 font-bold">
                    Stock: <strong className="text-emerald-700">{product.stock} unidades</strong>
                  </span>
                </div>

                {/* Pestañas Interactivas: Detalles / Envíos / Reseñas */}
                <div className="border-t-2 border-stone-200 pt-3">
                  <div className="flex border-b-2 border-stone-300 gap-2 mb-3">
                    <button
                      id="tab-btn-detalles"
                      onClick={() => setActiveTab('detalles')}
                      className={`pb-1.5 text-xs font-black uppercase tracking-wide border-b-2 -mb-[2px] transition-colors ${
                        activeTab === 'detalles' ? 'border-red-600 text-red-600' : 'border-transparent text-stone-500 hover:text-stone-800'
                      }`}
                    >
                      Especificaciones
                    </button>
                    <button
                      id="tab-btn-envio"
                      onClick={() => setActiveTab('envio')}
                      className={`pb-1.5 text-xs font-black uppercase tracking-wide border-b-2 -mb-[2px] transition-colors ${
                        activeTab === 'envio' ? 'border-red-600 text-red-600' : 'border-transparent text-stone-500 hover:text-stone-800'
                      }`}
                    >
                      Envíos por Departamento
                    </button>
                    <button
                      id="tab-btn-reviews"
                      onClick={() => setActiveTab('reviews')}
                      className={`pb-1.5 text-xs font-black uppercase tracking-wide border-b-2 -mb-[2px] transition-colors ${
                        activeTab === 'reviews' ? 'border-red-600 text-red-600' : 'border-transparent text-stone-500 hover:text-stone-800'
                      }`}
                    >
                      Opiniones ({product.reviewsCount})
                    </button>
                  </div>

                  {/* Tab: Detalles */}
                  {activeTab === 'detalles' && (
                    <div className="space-y-2 text-xs text-stone-700 animate-in fade-in duration-150">
                      <p className="font-medium text-stone-600">{product.description}</p>
                      <ul className="space-y-1.5 pt-1">
                        {product.features.map((f, i) => (
                          <li key={i} className="flex items-start gap-2 font-medium">
                            <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="bg-stone-100 p-2.5 rounded-lg border border-stone-200 text-[11px] font-semibold text-stone-600 mt-2 space-y-1">
                        <p>🧵 <strong>Material:</strong> {product.fabric}</p>
                        <p>📐 <strong>Corte & Perfil:</strong> {product.fit} ({product.profile})</p>
                        <p>📍 <strong>Despacho:</strong> {product.warehouse}</p>
                      </div>
                    </div>
                  )}

                  {/* Tab: Envíos */}
                  {activeTab === 'envio' && (
                    <div className="space-y-2.5 text-xs text-stone-700 animate-in fade-in duration-150">
                      <div className="bg-emerald-50 border border-emerald-300 p-3 rounded-xl space-y-2">
                        <label className="text-xs font-black text-emerald-950 flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-emerald-700" />
                          Selecciona tu Departamento:
                        </label>
                        <select
                          id="dept-delivery-select"
                          value={selectedDept}
                          onChange={(e) => setSelectedDept(e.target.value)}
                          className="w-full bg-white border-2 border-stone-800 rounded-lg p-2 font-bold text-xs focus:ring-2 focus:ring-amber-400"
                        >
                          {DEPARTAMENTOS_GT.map((d, i) => (
                            <option key={i} value={d.departamento}>{d.departamento}</option>
                          ))}
                        </select>
                        <div className="text-[11px] text-stone-800 space-y-0.5 pt-1">
                          <p>⏱️ <strong>Tiempo estimado:</strong> {currentDeptInfo.tiempo}</p>
                          <p>🚚 <strong>Empresa de entrega:</strong> {currentDeptInfo.courier}</p>
                          <p>💵 <strong>Costo:</strong> {currentDeptInfo.costo === 0 ? '¡GRATIS!' : `Q${currentDeptInfo.costo}.00 (¡GRATIS en compras de Q300+)`}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tab: Reseñas */}
                  {activeTab === 'reviews' && (
                    <div className="space-y-2 text-xs text-stone-700 max-h-36 overflow-y-auto pr-1 animate-in fade-in duration-150">
                      <div className="bg-white p-2.5 rounded-lg border border-stone-200 shadow-sm">
                        <div className="flex text-amber-500 mb-1">
                          {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-amber-400" />)}
                        </div>
                        <p className="italic text-[11px] text-stone-700">"La corona no se deforma para nada. El bordado en relieve es de primera."</p>
                        <span className="text-[10px] font-bold text-stone-500">- Diego M. (Mixco) ✓ Comprador Verificado</span>
                      </div>
                      <div className="bg-white p-2.5 rounded-lg border border-stone-200 shadow-sm">
                        <div className="flex text-amber-500 mb-1">
                          {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-amber-400" />)}
                        </div>
                        <p className="italic text-[11px] text-stone-700">"El broche snapback ajusta a la perfección. Me llegó al segundo día en Xela."</p>
                        <span className="text-[10px] font-bold text-stone-500">- Fernando T. (Quetzaltenango) ✓ Comprador Verificado</span>
                      </div>
                    </div>
                  )}

                </div>
              </div>

              {/* BOTONES DE ACCIÓN EN EL MODAL */}
              <div className="pt-4 border-t-2 border-stone-300 space-y-2">
                <button
                  id="add-to-cart-from-modal-btn"
                  onClick={() => {
                    onAddToCart(product, selectedColorObj, modalQuantity);
                    onClose();
                  }}
                  className="w-full bg-amber-400 hover:bg-amber-300 text-stone-950 font-black py-3.5 px-4 rounded-xl border-2 border-stone-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-2 text-sm tracking-wide active:translate-x-0.5 active:translate-y-0.5 transition-all"
                >
                  <ShoppingBag className="w-4 h-4 text-red-700" />
                  AGREGAR {modalQuantity} A LA BOLSA (Q{product.price * modalQuantity}.00)
                </button>

                <button
                  id="direct-whatsapp-from-modal-btn"
                  onClick={() => {
                    onDirectCheckout(product, selectedColorObj, modalQuantity);
                    onClose();
                  }}
                  className="w-full bg-red-600 hover:bg-red-500 text-white font-black py-2.5 px-4 rounded-xl border-2 border-stone-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-2 text-xs tracking-wide transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  PEDIR DIRECTO POR WHATSAPP (PAGO CONTRA ENTREGA)
                </button>
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
