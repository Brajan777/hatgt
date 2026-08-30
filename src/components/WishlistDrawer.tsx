import React from 'react';
import { X, Heart, ShoppingBag, Eye, Trash2 } from 'lucide-react';
import { Product } from '../types';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: Product[];
  onRemoveFavorite: (productId: string) => void;
  onOpenProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  favorites,
  onRemoveFavorite,
  onOpenProduct,
  onAddToCart
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-950/75 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      <div className="bg-[#FAF7F0] border-l-4 border-stone-900 w-full max-w-md h-full flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b-2 border-stone-300 bg-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-red-600 rounded-xl border-2 border-stone-900 flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <Heart className="w-5 h-5 text-white fill-white" />
            </div>
            <div>
              <h3 className="text-lg font-black text-stone-900 leading-tight">MIS FAVORITAS CHAPINAS</h3>
              <p className="text-[11px] text-stone-500 font-bold">{favorites.length} gorra(s) guardadas</p>
            </div>
          </div>
          <button 
            id="close-wishlist-drawer-btn"
            onClick={onClose}
            className="p-2 hover:bg-stone-100 rounded-lg text-stone-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of Favorites */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {favorites.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-16 h-16 bg-red-50 text-red-400 rounded-full flex items-center justify-center mx-auto border-2 border-stone-300">
                <Heart className="w-8 h-8" />
              </div>
              <h4 className="text-base font-black text-stone-800">No tienes gorras guardadas</h4>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                Toca el corazón en cualquier gorra para guardarla en tu lista de favoritas.
              </p>
            </div>
          ) : (
            favorites.map((product) => (
              <div 
                key={product.id}
                className="bg-white border-2 border-stone-900 rounded-xl p-3.5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex gap-3 items-center justify-between"
              >
                <div className="flex-1 min-w-0">
                  <span className="text-[9px] bg-red-100 text-red-800 font-black px-1.5 py-0.5 rounded">
                    {product.category}
                  </span>
                  <h4 className="text-xs font-black text-stone-900 truncate mt-1">{product.name}</h4>
                  <p className="text-xs font-black text-red-600">Q{product.price}.00 GTQ</p>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    id={`view-fav-${product.id}`}
                    onClick={() => {
                      onClose();
                      onOpenProduct(product);
                    }}
                    className="p-2 bg-stone-100 hover:bg-stone-200 text-stone-900 rounded-lg border border-stone-800 text-xs font-bold"
                    title="Ver Fotos"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  <button
                    id={`add-fav-to-cart-${product.id}`}
                    onClick={() => onAddToCart(product)}
                    className="p-2 bg-amber-400 hover:bg-amber-300 text-stone-950 rounded-lg border border-stone-900 shadow-sm"
                    title="Añadir a la bolsa"
                  >
                    <ShoppingBag className="w-4 h-4 text-red-700" />
                  </button>

                  <button
                    id={`remove-fav-${product.id}`}
                    onClick={() => onRemoveFavorite(product.id)}
                    className="p-2 hover:bg-red-50 text-stone-400 hover:text-red-600 rounded-lg"
                    title="Eliminar de favoritos"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t-2 border-stone-300 bg-white">
          <button
            id="close-wishlist-bottom-btn"
            onClick={onClose}
            className="w-full bg-stone-900 text-amber-300 font-black py-3 rounded-xl border-2 border-stone-900 shadow-[3px_3px_0px_0px_rgba(220,38,38,1)] text-xs uppercase tracking-wider"
          >
            Volver a la Tienda
          </button>
        </div>

      </div>
    </div>
  );
};
