import React, { useState, useMemo, useEffect } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Flame, 
  Truck, 
  ShieldCheck, 
  X, 
  Star, 
  Sparkles, 
  SlidersHorizontal,
  MapPin,
  Eye,
  PhoneCall,
  Heart,
  Ruler,
  MessageCircle,
  Lock
} from 'lucide-react';

import { Product, CartItem, ProductReview, SaleRecord, HeroConfig } from './types';
import { PRODUCTS as INITIAL_PRODUCTS, REVIEWS_DATA, INITIAL_SALES_RECORDS, DEFAULT_HERO_CONFIG } from './data/products';
import { CapVisualInteractive } from './components/CapVisualInteractive';
import { ProductDetailModal } from './components/ProductDetailModal';
import { SizeGuideModal } from './components/SizeGuideModal';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { WishlistDrawer } from './components/WishlistDrawer';
import { ReviewsSection } from './components/ReviewsSection';
import { FAQSection } from './components/FAQSection';
import { AdminPanel } from './components/AdminPanel';
import { 
  fetchProductsFromCloud, 
  fetchHeroConfigFromCloud, 
  fetchSalesFromCloud, 
  syncProductToCloud, 
  deleteProductFromCloud, 
  syncHeroConfigToCloud, 
  syncSaleToCloud, 
  seedDatabaseIfEmpty
} from './lib/supabase';

export default function App() {
  // Products State with LocalStorage Persistence
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('hatgt_products_catalog');
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  // Sales Records for Admin Dashboard
  const [salesRecords, setSalesRecords] = useState<SaleRecord[]>(() => {
    try {
      const saved = localStorage.getItem('hatgt_sales_history');
      return saved ? JSON.parse(saved) : INITIAL_SALES_RECORDS;
    } catch {
      return INITIAL_SALES_RECORDS;
    }
  });

  // Hero Portada & Settings State with LocalStorage Persistence
  const [heroConfig, setHeroConfig] = useState<HeroConfig>(() => {
    try {
      const saved = localStorage.getItem('hatgt_hero_config');
      return saved ? JSON.parse(saved) : DEFAULT_HERO_CONFIG;
    } catch {
      return DEFAULT_HERO_CONFIG;
    }
  });

  const featuredHeroProduct = useMemo(() => {
    return products.find(p => p.id === heroConfig.featuredProductId) || products[0];
  }, [products, heroConfig.featuredProductId]);

  const [activeCategory, setActiveCategory] = useState<string>('Todas');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('destacados');
  const [selectedProfile, setSelectedProfile] = useState<string>('all');

  // Modal States
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Cart & Wishlist State
  const [cart, setCart] = useState<CartItem[]>([
    { 
      ...INITIAL_PRODUCTS[0],
      cartItemId: `item-${INITIAL_PRODUCTS[0].id}-initial`,
      quantity: 1, 
      selectedColor: INITIAL_PRODUCTS[0].colors[0].name,
      selectedPaletteKey: INITIAL_PRODUCTS[0].colors[0].paletteKey 
    }
  ]);

  const [favorites, setFavorites] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('hatgt_favorites');
      return saved ? JSON.parse(saved) : [INITIAL_PRODUCTS[0], INITIAL_PRODUCTS[2]];
    } catch {
      return [INITIAL_PRODUCTS[0], INITIAL_PRODUCTS[2]];
    }
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [reviews, setReviews] = useState<ProductReview[]>(REVIEWS_DATA);

  // Persist Products to Local Storage
  useEffect(() => {
    try {
      localStorage.setItem('hatgt_products_catalog', JSON.stringify(products));
    } catch (e) {
      console.error(e);
    }
  }, [products]);

  // Persist Sales Records to Local Storage
  useEffect(() => {
    try {
      localStorage.setItem('hatgt_sales_history', JSON.stringify(salesRecords));
    } catch (e) {
      console.error(e);
    }
  }, [salesRecords]);

  // Sync favorites to local storage
  useEffect(() => {
    try {
      localStorage.setItem('hatgt_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.error(e);
    }
  }, [favorites]);

  // Persist Hero Configuration to Local Storage
  useEffect(() => {
    try {
      localStorage.setItem('hatgt_hero_config', JSON.stringify(heroConfig));
    } catch (e) {
      console.error(e);
    }
  }, [heroConfig]);

  // Carga inicial y sincronización con Supabase (Base de datos en la Nube)
  useEffect(() => {
    let isMounted = true;
    const initCloudSync = async () => {
      try {
        // 1. Si las tablas de Supabase están recién creadas, poblar con datos iniciales
        await seedDatabaseIfEmpty(INITIAL_PRODUCTS, DEFAULT_HERO_CONFIG);

        // 2. Cargar productos desde Supabase
        const cloudProducts = await fetchProductsFromCloud();
        if (isMounted && cloudProducts && cloudProducts.length > 0) {
          setProducts(cloudProducts);
        }

        // 3. Cargar configuración de la portada desde Supabase
        const cloudHero = await fetchHeroConfigFromCloud();
        if (isMounted && cloudHero) {
          setHeroConfig(cloudHero);
        }

        // 4. Cargar ventas desde Supabase
        const cloudSales = await fetchSalesFromCloud();
        if (isMounted && cloudSales && cloudSales.length > 0) {
          setSalesRecords(cloudSales);
        }
      } catch (err) {
        console.warn('Error inicializando datos de Supabase:', err);
      }
    };

    initCloudSync();
    return () => { isMounted = false; };
  }, []);

  const categories = [
    'Todas',
    'Ediciones Especiales GT',
    'Vintage Dad Caps',
    'Trucker 70s',
    'Snapbacks 90s',
    'Gorras Planas Urbanas'
  ];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Toggle favorite
  const handleToggleFavorite = (prod: Product) => {
    setFavorites(prev => {
      const exists = prev.some(p => p.id === prod.id);
      if (exists) {
        showToast(`Eliminada de tus favoritas`);
        return prev.filter(p => p.id !== prod.id);
      } else {
        showToast(`❤️ ¡"${prod.name}" guardada en tus favoritas!`);
        return [...prev, prod];
      }
    });
  };

  // Cart operations
  const handleAddToCart = (product: Product, colorObj: any = null, qty: number = 1, customText?: string) => {
    const chosenColor = colorObj ? (colorObj.name || colorObj) : product.colors[0].name;
    const chosenPalette = colorObj?.paletteKey || product.colors[0].paletteKey;
    const cartItemId = `${product.id}-${chosenColor}-${customText || ''}`;

    setCart(prev => {
      const existingIdx = prev.findIndex(item => item.cartItemId === cartItemId);
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += qty;
        return updated;
      }
      return [...prev, {
        ...product,
        cartItemId,
        quantity: qty,
        selectedColor: chosenColor,
        selectedPaletteKey: chosenPalette,
        customPatchText: customText
      }];
    });

    showToast(`¡${qty}x "${product.name}" agregada(s) a tu bolsa!`);
  };

  const handleDirectCheckout = (product: Product, colorObj: any, qty: number) => {
    handleAddToCart(product, colorObj, qty);
    setIsCheckoutOpen(true);
  };

  const handleUpdateQuantity = (cartItemId: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.cartItemId === cartItemId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean) as CartItem[];
    });
  };

  const handleRemoveItem = (cartItemId: string) => {
    setCart(prev => prev.filter(item => item.cartItemId !== cartItemId));
    showToast('Producto eliminado de la bolsa.');
  };

  const handleAddUpsell = (acc: any) => {
    const upsellProd: Product = {
      id: acc.id,
      name: acc.name,
      category: 'Accesorios Hatgt',
      style: acc.tag,
      price: acc.price,
      originalPrice: acc.price + 15,
      costPrice: 10,
      badge: '✨ RECOMENDADO',
      badgeColor: 'bg-emerald-600 text-white',
      rating: 5.0,
      reviewsCount: 45,
      colors: [{ name: 'Edición Estándar', paletteKey: 'classic-dark' }],
      description: acc.desc,
      features: ['Accesorio original Hatgt de colección'],
      fabric: 'Material premium duradero',
      fit: 'Universal',
      profile: 'Desestructurada / Relajada',
      stock: 50,
      salesCount: 15,
      warehouse: 'Bodega Central Zona 12',
      svgType: 'box'
    };

    handleAddToCart(upsellProd, upsellProd.colors[0], 1);
  };

  const handleAddReview = (newReview: ProductReview) => {
    setReviews(prev => [newReview, ...prev]);
    showToast('¡Gracias por tu reseña chapina!');
  };

  // Handle Order Completion & Record into Admin Analytics
  const handleOrderCompleted = (orderData?: any) => {
    if (orderData && cart.length > 0) {
      let totalCost = 0;
      const saleItems = cart.map(item => {
        const matchingProd = products.find(p => p.id === item.id);
        const unitCost = matchingProd?.costPrice || (item.price * 0.45);
        totalCost += (unitCost * item.quantity);
        return {
          productId: item.id,
          productName: item.name,
          quantity: item.quantity,
          salePrice: item.price,
          costPrice: unitCost
        };
      });

      const newSale: SaleRecord = {
        id: `VTA-${Date.now().toString().slice(-4)}`,
        date: new Date().toISOString().slice(0, 16).replace('T', ' '),
        customerName: orderData.customerName || 'Cliente Web Hatgt',
        department: orderData.department || 'Guatemala (Capital)',
        paymentMethod: orderData.paymentMethod || 'Contra Entrega Efectivo',
        items: saleItems,
        totalAmount: orderData.totalAmount || cart.reduce((sum, it) => sum + (it.price * it.quantity), 0),
        totalCost: totalCost,
        profit: (orderData.totalAmount || cart.reduce((sum, it) => sum + (it.price * it.quantity), 0)) - totalCost
      };

      setSalesRecords(prev => [newSale, ...prev]);
      syncSaleToCloud(newSale);

      // Decrement stock & increment sales count in products catalog
      setProducts(prevProds => {
        const updatedProds = prevProds.map(prod => {
          const purchasedItem = cart.find(c => c.id === prod.id);
          if (purchasedItem) {
            const newStock = Math.max(0, prod.stock - purchasedItem.quantity);
            const newSales = (prod.salesCount || 0) + purchasedItem.quantity;
            const up = { ...prod, stock: newStock, salesCount: newSales };
            syncProductToCloud(up);
            return up;
          }
          return prod;
        });
        return updatedProds;
      });
    }

    setCart([]);
    showToast('¡Pedido completado con éxito! Despachando a tu departamento.');
  };

  // Admin Management Functions
  const handleUpdateProduct = (updated: Product) => {
    setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
    syncProductToCloud(updated);
    showToast(`✓ Gorra "${updated.name}" guardada y sincronizada en la nube.`);
  };

  const handleAddProduct = (newProduct: Product) => {
    setProducts(prev => [newProduct, ...prev]);
    syncProductToCloud(newProduct);
    showToast(`✓ Nueva gorra "${newProduct.name}" publicada en la nube.`);
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    deleteProductFromCloud(productId);
    showToast(`Gorra eliminada del catálogo.`);
  };

  const handleUpdateHeroConfig = (config: HeroConfig) => {
    setHeroConfig(config);
    syncHeroConfigToCloud(config);
    showToast('✓ Portada actualizada y sincronizada en la nube.');
  };

  const handleResetDefaults = () => {
    if (confirm('¿Deseas restablecer todos los productos a los valores predeterminados?')) {
      setProducts(INITIAL_PRODUCTS);
      setSalesRecords(INITIAL_SALES_RECORDS);
      localStorage.removeItem('hatgt_products_catalog');
      localStorage.removeItem('hatgt_sales_history');
      showToast('Valores iniciales restablecidos.');
    }
  };

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchCat = activeCategory === 'Todas' || p.category === activeCategory;
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.style.toLowerCase().includes(searchQuery.toLowerCase());
      const matchProfile = selectedProfile === 'all' || p.profile === selectedProfile;
      return matchCat && matchSearch && matchProfile;
    }).sort((a, b) => {
      if (sortBy === 'precio-menor') return a.price - b.price;
      if (sortBy === 'precio-mayor') return b.price - a.price;
      if (sortBy === 'calificacion') return b.rating - a.rating;
      return 0;
    });
  }, [products, activeCategory, searchQuery, sortBy, selectedProfile]);

  const totalItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-stone-900 font-sans selection:bg-amber-400 selection:text-red-950 pb-12 relative">
      
      {/* --- NOTIFICACIÓN FLOTANTE (TOAST) --- */}
      {toastMessage && (
        <div className="fixed bottom-16 right-6 z-50 bg-stone-900 text-amber-300 px-5 py-3.5 rounded-xl shadow-2xl border-2 border-amber-400 flex items-center gap-3 animate-bounce">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <span className="text-sm font-black tracking-wide">{toastMessage}</span>
        </div>
      )}

      {/* --- TOP BAR DE CONFIANZA CHAPINA --- */}
      <div className="bg-gradient-to-r from-red-700 via-amber-600 to-emerald-700 text-amber-50 text-xs font-bold py-2 px-4 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="bg-red-950/70 px-2 py-0.5 rounded text-[10px] tracking-wider uppercase border border-amber-300/40">
              Guate 100%
            </span>
            <span>{heroConfig.announcementBarText}</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] hidden md:flex">
            <button 
              id="top-bar-tracker-btn"
              onClick={() => setIsTrackerOpen(true)}
              className="flex items-center gap-1 hover:text-amber-200 underline underline-offset-2"
            >
              <Truck className="w-3.5 h-3.5 text-amber-300" /> Rastrear Guía Cargo Expreso / Guatex
            </button>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" /> Envíos seguros a todo el país
            </span>
          </div>
        </div>
      </div>

      {/* --- HEADER RETRO --- */}
      <header className="sticky top-0 z-40 bg-[#FAF7F0]/95 backdrop-blur-md border-b-4 border-stone-900 shadow-lg">
        {/* Tricolor stripe flag */}
        <div className="h-1.5 w-full grid grid-cols-3">
          <div className="bg-red-600" />
          <div className="bg-amber-400" />
          <div className="bg-emerald-600" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          
          {/* Logo Hatgt */}
          <div className="flex items-center gap-3">
            <a href="#" className="flex items-center gap-2.5 group">
              <div className="w-11 h-11 bg-stone-900 rounded-xl border-2 border-amber-400 flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(220,38,38,1)] group-hover:rotate-6 transition-transform">
                <span className="text-2xl font-black text-amber-400 tracking-tighter">H</span>
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-2xl font-black tracking-tight text-stone-900">HAT<span className="text-red-600">GT</span></span>
                  <span className="text-[10px] bg-emerald-600 text-white font-extrabold px-1.5 py-0.5 rounded ml-1">EST. 2026</span>
                </div>
                <p className="text-[10px] tracking-widest text-stone-600 uppercase font-bold -mt-1">Solo Gorras • Estilo Retro Chapín</p>
              </div>
            </a>
          </div>

          {/* Buscador de escritorio */}
          <div className="flex-1 max-w-md mx-4 hidden lg:block">
            <div className="relative">
              <input 
                type="text"
                id="search-input-desktop"
                placeholder="Buscar gorra por modelo, color o corte (ej. pana, snapback)..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border-2 border-stone-800 rounded-xl pl-9 pr-8 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              />
              <Search className="w-4 h-4 text-stone-500 absolute left-3 top-2.5" />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2.5 text-stone-400 hover:text-stone-700"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Acciones del Header */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Guía de Tallas */}
            <button
              id="header-size-guide-btn"
              onClick={() => setIsSizeGuideOpen(true)}
              className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-stone-700 hover:text-stone-900 bg-white border-2 border-stone-800 px-3 py-2 rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all"
            >
              <Ruler className="w-3.5 h-3.5 text-red-600" />
              <span>Guía Tallas</span>
            </button>

            {/* Rastrear Pedido */}
            <button
              id="header-tracker-btn"
              onClick={() => setIsTrackerOpen(true)}
              className="hidden md:flex items-center gap-1.5 text-xs font-bold text-stone-700 hover:text-stone-900 bg-white border-2 border-stone-800 px-3 py-2 rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all"
            >
              <Truck className="w-3.5 h-3.5 text-amber-500" />
              <span>Rastreo</span>
            </button>

            {/* Wishlist Button */}
            <button
              id="header-wishlist-btn"
              onClick={() => setIsWishlistOpen(true)}
              className="relative p-2.5 bg-white text-stone-800 border-2 border-stone-800 rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-stone-50 transition-all active:scale-95"
              title="Mis Favoritas"
            >
              <Heart className="w-5 h-5 text-red-600" />
              {favorites.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                  {favorites.length}
                </span>
              )}
            </button>

            {/* Carrito Button */}
            <button 
              id="header-cart-drawer-btn"
              onClick={() => setIsCartOpen(true)}
              className="relative bg-amber-400 hover:bg-amber-300 text-stone-950 font-black px-3.5 sm:px-4 py-2 rounded-xl border-2 border-stone-900 shadow-[3px_3px_0px_0px_rgba(220,38,38,1)] flex items-center gap-2 transition-all active:translate-x-0.5 active:translate-y-0.5"
            >
              <ShoppingBag className="w-4 h-4 text-stone-900" />
              <span className="text-xs hidden sm:inline uppercase">Bolsa</span>
              <span className="bg-red-600 text-white text-xs font-black px-2 py-0.5 rounded-full border border-stone-900">
                {totalItemsCount}
              </span>
            </button>
          </div>
        </div>

        {/* Buscador móvil */}
        <div className="px-4 pb-3 lg:hidden">
          <div className="relative">
            <input 
              type="text"
              id="search-input-mobile"
              placeholder="Buscar gorra (ej. pana, snapback, quetzal)..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border-2 border-stone-800 rounded-xl pl-8 pr-3 py-1.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            />
            <Search className="w-3.5 h-3.5 text-stone-500 absolute left-2.5 top-2" />
          </div>
        </div>
      </header>

      {/* --- HERO SECTION RETRO --- */}
      <section className="relative overflow-hidden bg-stone-900 text-white border-b-4 border-stone-900 py-10 md:py-16">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:18px_18px]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex flex-wrap items-center gap-2">
                <span className="bg-red-600 text-white font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider border-2 border-amber-300 shadow-[2px_2px_0px_0px_rgba(245,158,11,1)]">
                  {heroConfig.badgeText}
                </span>
                <span className="bg-emerald-700 text-amber-200 font-bold text-xs px-3 py-1 rounded-full border border-emerald-400">
                  {heroConfig.badgeSubtext}
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.08] text-white">
                {heroConfig.titleLine1} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-amber-400 to-emerald-400">
                  {heroConfig.titleHighlight}
                </span>
              </h1>

              <p className="text-stone-300 text-sm sm:text-base md:text-lg max-w-xl font-medium leading-relaxed">
                {heroConfig.description}
              </p>

              <div className="flex flex-wrap gap-4 pt-2 items-center">
                <a 
                  href="#catalogo"
                  id="hero-explore-catalog-btn"
                  className="bg-amber-400 hover:bg-amber-300 text-stone-900 font-black text-base px-6 py-3.5 rounded-xl border-3 border-stone-900 shadow-[4px_4px_0px_0px_rgba(220,38,38,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-2"
                >
                  <Flame className="w-5 h-5 text-red-600 fill-red-600" />
                  {heroConfig.ctaButtonText || 'VER CATÁLOGO & PRECIOS (GTQ)'}
                </a>
                <span className="text-xs font-bold text-stone-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> Garantía de cambio y empaque en caja rígida
                </span>
              </div>
            </div>

            {/* Showcase Interactivo en Hero */}
            <div className="lg:col-span-5 relative">
              <div 
                id="hero-showcase-card"
                onClick={() => setSelectedProduct(featuredHeroProduct)}
                className="cursor-pointer bg-gradient-to-b from-stone-800 to-stone-900 border-4 border-amber-400 rounded-2xl p-6 shadow-[8px_8px_0px_0px_rgba(220,38,38,1)] hover:scale-[1.02] transition-all text-center relative overflow-hidden group"
              >
                <div className="absolute top-4 right-4 bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider rotate-12 border border-white z-10 shadow-md">
                  {heroConfig.bannerBadgeText || '¡Toca para Ver Fotos!'}
                </div>

                <div className="mb-4">
                  {heroConfig.customImageUrl ? (
                    <div className="w-full h-64 sm:h-72 rounded-xl overflow-hidden bg-stone-950 border-2 border-stone-700 flex items-center justify-center relative group">
                      {/* Fondo difuminado ambiental para adaptar cualquier formato de foto */}
                      <img 
                        src={heroConfig.customImageUrl} 
                        alt="" 
                        aria-hidden="true"
                        className="absolute inset-0 w-full h-full object-cover blur-xl opacity-35 scale-125 pointer-events-none"
                      />
                      {/* Imagen nítida adaptada al marco */}
                      <img 
                        src={heroConfig.customImageUrl} 
                        alt={featuredHeroProduct?.name || 'Gorra Hero'} 
                        className={`relative z-10 w-full h-full ${heroConfig.heroImageFit === 'cover' ? 'object-cover' : 'object-contain p-3'} drop-shadow-[0_16px_24px_rgba(0,0,0,0.6)] group-hover:scale-105 transition-transform duration-300`}
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  ) : (
                    <CapVisualInteractive 
                      type={featuredHeroProduct?.svgType} 
                      paletteKey={featuredHeroProduct?.colors[0]?.paletteKey} 
                      viewAngle="front" 
                      imageUrl={featuredHeroProduct?.imageUrl}
                      size="normal" 
                    />
                  )}
                </div>

                <div className="space-y-2 text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400 tracking-wider uppercase flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" /> Rotación 360° disponible
                    </span>
                    <span className="text-xs font-black text-stone-400 line-through">Q{featuredHeroProduct?.originalPrice || 220}.00</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-black text-white group-hover:text-amber-400 transition-colors">
                      {featuredHeroProduct?.name}
                    </h3>
                    <span className="text-2xl font-black text-amber-400">Q{featuredHeroProduct?.price || 175}.00</span>
                  </div>
                  <p className="text-xs text-stone-300">
                    {featuredHeroProduct?.description || 'Gorra estructurada retro con acabados premium y ajuste snapback.'}
                  </p>
                  <button 
                    type="button"
                    className="w-full mt-3 bg-red-600 group-hover:bg-red-500 text-white font-black py-3 rounded-xl border-2 border-stone-900 shadow-[3px_3px_0px_0px_rgba(245,158,11,1)] flex items-center justify-center gap-2 text-sm transition-all"
                  >
                    <Eye className="w-4 h-4" />
                    ABRIR VISOR INTERACTIVO MULTI-ÁNGULO
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- CATÁLOGO DE SELECCIÓN --- */}
      <main id="catalogo" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16">
        
        {/* Cabecera del Catálogo con Filtros */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 pb-4 border-b-2 border-stone-300">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 bg-red-600 rounded-full" />
              <div className="w-3 h-3 bg-amber-400 rounded-full" />
              <div className="w-3 h-3 bg-emerald-600 rounded-full" />
              <span className="text-xs font-black uppercase tracking-widest text-stone-600 ml-2">
                Colección Exclusiva de Gorras Chapinas
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-stone-900 tracking-tight uppercase">
              CATÁLOGO DE GORRAS RETRO • PAGO CONTRA ENTREGA
            </h2>
            <p className="text-sm text-stone-600 font-medium">
              Elige tu silueta preferida: Snapback, Dad Cap de pana, Trucker o Camper. Haz clic en cualquier gorra para ver fotos reales en todos los ángulos.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Perfil */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-stone-700">Corte:</span>
              <select
                id="filter-profile-select"
                value={selectedProfile}
                onChange={(e) => setSelectedProfile(e.target.value)}
                className="bg-white border-2 border-stone-800 rounded-lg px-2.5 py-1.5 text-xs font-bold focus:ring-2 focus:ring-amber-400 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              >
                <option value="all">Todos los Cortes</option>
                <option value="Corona Alta">Corona Alta 90s</option>
                <option value="Perfil Medio">Perfil Medio Confort</option>
                <option value="Desestructurada / Relajada">Pana / Relajada</option>
                <option value="5-Panel Camper">5-Panel Camper</option>
              </select>
            </div>

            {/* Ordenar */}
            <div className="flex items-center gap-1.5">
              <SlidersHorizontal className="w-4 h-4 text-stone-600" />
              <select 
                id="sort-by-select"
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border-2 border-stone-800 rounded-lg px-3 py-1.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              >
                <option value="destacados">⭐ Más Populares</option>
                <option value="precio-menor">💵 Menor Precio (Q)</option>
                <option value="precio-mayor">💎 Mayor Precio (Q)</option>
                <option value="calificacion">🔥 Mejor Calificadas</option>
              </select>
            </div>
          </div>
        </div>

        {/* Categorías Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                id={`category-filter-${cat.replace(/\s+/g, '-').toLowerCase()}`}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-black tracking-wide whitespace-nowrap transition-all border-2 border-stone-900 ${
                  isActive 
                    ? 'bg-stone-900 text-amber-300 shadow-[3px_3px_0px_0px_rgba(220,38,38,1)] translate-x-0.5 translate-y-0.5' 
                    : 'bg-white text-stone-700 hover:bg-stone-100 hover:text-stone-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* GRID DE GORRAS */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border-3 border-stone-800 p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="w-16 h-16 bg-amber-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-stone-900">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-black text-stone-900">No encontramos gorras con ese criterio</h3>
            <p className="text-xs text-stone-600 mt-1 max-w-sm mx-auto">
              Intenta buscar con otra palabra clave o restablece los filtros.
            </p>
            <button 
              id="reset-filters-btn"
              onClick={() => { setActiveCategory('Todas'); setSearchQuery(''); setSelectedProfile('all'); }}
              className="mt-4 bg-stone-900 text-amber-300 font-bold text-xs px-5 py-2.5 rounded-xl border-2 border-stone-900 shadow-[2px_2px_0px_0px_rgba(220,38,38,1)]"
            >
              Ver todas las gorras
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProducts.map((product) => {
              const isFav = favorites.some(f => f.id === product.id);

              return (
                <div 
                  key={product.id}
                  id={`product-card-${product.id}`}
                  onClick={() => setSelectedProduct(product)}
                  className="cursor-pointer bg-white border-3 border-stone-900 rounded-2xl overflow-hidden shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:shadow-[7px_7px_0px_0px_rgba(220,38,38,1)] hover:-translate-y-1 transition-all flex flex-col justify-between group relative"
                >
                  <div>
                    {/* Visual con Badge y Corazón */}
                    <div className="relative">
                      <CapVisualInteractive 
                        type={product.svgType} 
                        paletteKey={product.colors[0]?.paletteKey || 'classic-dark'} 
                        viewAngle="front"
                        imageUrl={product.imageUrl}
                        size="normal"
                      />
                      
                      {/* Overlay al hacer hover: "Ver Fotos y Detalles" */}
                      <div className="absolute inset-0 bg-stone-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                        <span className="bg-amber-400 text-stone-950 font-black text-xs px-3.5 py-2 rounded-xl border-2 border-stone-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                          <Eye className="w-4 h-4 text-red-600" />
                          VER DETALLES & FOTOS
                        </span>
                      </div>

                      {/* Badge flotante */}
                      {product.badge && (
                        <span className={`absolute top-3 left-3 text-[10px] font-black px-2.5 py-1 rounded-md border border-stone-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${product.badgeColor || 'bg-amber-400 text-black'}`}>
                          {product.badge}
                        </span>
                      )}

                      {/* Botón Favorito */}
                      <button
                        id={`card-fav-btn-${product.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleFavorite(product);
                        }}
                        className={`absolute top-3 right-3 p-2 rounded-xl border-2 border-stone-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-transform active:scale-90 z-20 ${
                          isFav ? 'bg-red-600 text-white' : 'bg-white hover:bg-stone-100 text-stone-700'
                        }`}
                        title="Guardar en Favoritas"
                      >
                        <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                      </button>

                      {/* Stock badge */}
                      <span className="absolute bottom-3 right-3 bg-stone-900/90 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-sm border border-stone-700">
                        {product.stock} disp. en Guate
                      </span>
                    </div>

                    {/* Contenido */}
                    <div className="p-5 space-y-3">
                      <div className="flex items-center justify-between text-xs text-stone-500 font-bold">
                        <span>{product.style}</span>
                        <div className="flex items-center text-amber-600 gap-1">
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          <span>{product.rating} ({product.reviewsCount})</span>
                        </div>
                      </div>

                      <h3 className="text-lg font-black text-stone-900 leading-snug group-hover:text-red-700 transition-colors">
                        {product.name}
                      </h3>

                      <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>

                      {/* Variantes de Color */}
                      <div className="pt-1">
                        <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block mb-1.5">
                          {product.colors.length} Colores Disponibles:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {product.colors.map((color, idx) => (
                            <span 
                              key={idx} 
                              className="text-[10px] bg-stone-100 text-stone-800 font-semibold px-2 py-0.5 rounded border border-stone-300 flex items-center gap-1"
                            >
                              <span className="w-2 h-2 rounded-full bg-stone-800" />
                              {color.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer de Tarjeta con Precios y Botón */}
                  <div className="p-5 pt-0 border-t border-stone-100 bg-stone-50/50 flex flex-col gap-3">
                    <div className="flex items-baseline justify-between pt-3">
                      <div>
                        <span className="text-xs text-stone-400 line-through font-bold block">Q{product.originalPrice}.00</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-black text-stone-900">Q{product.price}</span>
                          <span className="text-xs font-black text-emerald-600">.00 GTQ</span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-stone-700 flex items-center gap-1 underline underline-offset-2">
                        <Eye className="w-3.5 h-3.5 text-red-600" />
                        Ver Fotos
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        id={`card-details-btn-${product.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProduct(product);
                        }}
                        className="bg-white hover:bg-stone-100 text-stone-900 font-black py-2.5 px-3 rounded-xl border-2 border-stone-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-xs flex items-center justify-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5 text-stone-700" />
                        DETALLES
                      </button>
                      <button
                        type="button"
                        id={`card-add-to-cart-btn-${product.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(product);
                        }}
                        className="bg-amber-400 hover:bg-amber-300 text-stone-950 font-black py-2.5 px-3 rounded-xl border-2 border-stone-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 text-xs flex items-center justify-center gap-1.5"
                      >
                        <ShoppingBag className="w-3.5 h-3.5 text-red-700" />
                        AGREGAR
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </main>

      {/* --- POR QUÉ COMPRAR EN HATGT --- */}
      <section className="bg-stone-900 text-white py-14 relative overflow-hidden border-b-4 border-stone-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-black text-amber-400 uppercase tracking-widest bg-stone-800 px-3 py-1 rounded-full border border-stone-700">
              Garantía y Confianza HATGT
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-3 tracking-tight uppercase">
              ¿POR QUÉ COMPRAR TUS GORRAS RETRO EN HATGT GUATEMALA?
            </h2>
            <p className="text-xs sm:text-sm text-stone-400 mt-2 font-medium">
              No vendemos gorras genéricas sin forma. Cuidamos cada detalle: corona estructurada de alto gramaje, broche resistente, pana fina y empaque rígido anti-aplastamiento.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-stone-800/90 border-2 border-red-500/60 p-6 rounded-2xl shadow-[4px_4px_0px_0px_rgba(220,38,38,1)]">
              <div className="w-12 h-12 bg-red-600 text-white rounded-xl flex items-center justify-center font-black text-xl mb-4 border-2 border-white">
                💵
              </div>
              <h3 className="text-base font-black text-white mb-1">Pago Contra Entrega 100% Seguro</h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                Pide hoy sin tarjetas ni adelantos. Le pagas en efectivo o transferencia al mensajero cuando tengas tu paquete en tus manos en cualquier rincón de Guatemala.
              </p>
            </div>

            <div className="bg-stone-800/90 border-2 border-amber-400/60 p-6 rounded-2xl shadow-[4px_4px_0px_0px_rgba(245,158,11,1)]">
              <div className="w-12 h-12 bg-amber-400 text-stone-950 rounded-xl flex items-center justify-center font-black text-xl mb-4 border-2 border-stone-900">
                📦
              </div>
              <h3 className="text-base font-black text-white mb-1">Caja Rígida Protegida Anti-Deformación</h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                Cada gorra viaja en su caja reforzada cúbica de 450g con Cargo Expreso y Guatex para que la corona frontal y la visera lleguen 100% intactas.
              </p>
            </div>

            <div className="bg-stone-800/90 border-2 border-emerald-500/60 p-6 rounded-2xl shadow-[4px_4px_0px_0px_rgba(16,185,129,1)]">
              <div className="w-12 h-12 bg-emerald-600 text-white rounded-xl flex items-center justify-center font-black text-xl mb-4 border-2 border-white">
                🇬🇹
              </div>
              <h3 className="text-base font-black text-white mb-1">Cultura & Estilo Urbano Chapín</h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                Diseños retro inspirados en la historia, lugares emblemáticos (Atitlán, Tikal, Pacaya, Antigua) y la identidad urbana de nuestra Guate querida.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- SECCIÓN DE RESEÑAS DE CLIENTES --- */}
      <ReviewsSection 
        reviews={reviews} 
        onAddReview={handleAddReview} 
      />

      {/* --- SECCIÓN DE PREGUNTAS FRECUENTES --- */}
      <FAQSection />

      {/* --- FOOTER RETRO --- */}
      <footer className="bg-stone-900 text-stone-300 border-t-4 border-stone-900 pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-stone-800">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 bg-amber-400 text-stone-950 rounded-lg flex items-center justify-center font-black text-xl border-2 border-stone-900">
                  H
                </div>
                <span className="text-2xl font-black text-white">HAT<span className="text-red-500">GT</span></span>
              </div>
              <p className="text-xs text-stone-400 leading-relaxed">
                La tienda online líder en gorras retro, vintage dad caps, snapbacks y truckers con pago contra entrega en toda Guatemala.
              </p>
              <div className="flex gap-2">
                <div className="w-6 h-1.5 bg-red-600 rounded-full" />
                <div className="w-6 h-1.5 bg-amber-400 rounded-full" />
                <div className="w-6 h-1.5 bg-emerald-600 rounded-full" />
              </div>
            </div>

            <div>
              <h4 className="text-xs font-black text-amber-400 uppercase tracking-wider mb-3">Envíos a los 22 Departamentos</h4>
              <ul className="text-xs space-y-2 text-stone-400">
                <li className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-red-500" /> Ciudad de Guatemala, Mixco y Villa Nueva (24h)</li>
                <li className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-amber-400" /> Quetzaltenango (Xela), Sololá y Totonicapán</li>
                <li className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-emerald-500" /> Antigua Guatemala, Escuintla y Costa Sur</li>
                <li className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-emerald-500" /> Alta Verapaz (Cobán), Petén e Izabal</li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-black text-amber-400 uppercase tracking-wider mb-3">Atención & Pedidos WhatsApp</h4>
              <p className="text-xs text-stone-400">Lunes a Domingo: 8:00 AM - 9:00 PM</p>
              <p className="text-xs text-stone-300 font-bold mt-2 flex items-center gap-1.5">
                <PhoneCall className="w-3.5 h-3.5 text-emerald-400" /> WhatsApp Directo: +502 5555-0199
              </p>
              <button
                id="footer-track-guide-btn"
                onClick={() => setIsTrackerOpen(true)}
                className="text-xs text-amber-400 hover:text-amber-300 font-bold mt-2 flex items-center gap-1 underline underline-offset-4"
              >
                <Truck className="w-3.5 h-3.5" /> Rastrear guía Cargo Expreso / Guatex
              </button>
            </div>

            <div>
              <h4 className="text-xs font-black text-amber-400 uppercase tracking-wider mb-3">Garantía Chapina</h4>
              <div className="space-y-2 text-xs text-stone-400">
                <div className="bg-stone-800 p-2.5 rounded-lg border border-stone-700">
                  <span className="text-amber-300 font-black">💵 Cero Riesgo:</span> Pagas en efectivo al recibir.
                </div>
                <div className="bg-stone-800 p-2.5 rounded-lg border border-stone-700">
                  <span className="text-emerald-300 font-black">📦 Entrega Rápida:</span> 24 a 48 horas en toda Guatemala.
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
            <p>© 2026 HATGT Guatemala • Gorras Retro y Colección Urbana • Todos los derechos reservados.</p>
            <div className="flex items-center gap-1.5 text-[11px] text-stone-500">
              <span>Gorras Snapback, Dad Caps y Truckers en Guatemala.</span>
              <button
                id="admin-padlock-footer-btn"
                onClick={() => setIsAdminOpen(true)}
                className="text-stone-600 hover:text-amber-400 p-1 rounded transition-colors inline-flex items-center justify-center opacity-70 hover:opacity-100"
                title="Acceso Administrador"
              >
                <Lock className="w-3 h-3" />
                <span className="sr-only">Panel Administrador</span>
              </button>
            </div>
          </div>

        </div>
      </footer>

      {/* --- BOTÓN FLOTANTE DE WHATSAPP (ESQUINA INFERIOR DERECHA) --- */}
      <div className="fixed bottom-5 right-5 z-40">
        <a
          href={`https://wa.me/${heroConfig.whatsappNumber.replace(/[^0-9]/g, '') || '50255550199'}?text=Hola%20HATGT%20Guatemala,%20me%20gustar%C3%ADa%20consultar%20sobre%20las%20gorras%20retro`}
          target="_blank"
          rel="noopener noreferrer"
          id="whatsapp-floating-btn"
          className="bg-emerald-600 hover:bg-emerald-500 text-white p-3.5 sm:px-4 sm:py-3 rounded-full border-2 border-emerald-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2.5 transition-all hover:scale-105 active:scale-95 group font-black text-xs"
          title="Chatear por WhatsApp"
        >
          <MessageCircle className="w-5 h-5 text-white fill-white/20" />
          <span className="hidden sm:inline font-black tracking-wide">WhatsApp HATGT</span>
        </a>
      </div>

      {/* --- MODAL DETALLE DE PRODUCTO --- */}
      <ProductDetailModal 
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onDirectCheckout={handleDirectCheckout}
        isFavorite={selectedProduct ? favorites.some(f => f.id === selectedProduct.id) : false}
        onToggleFavorite={handleToggleFavorite}
        onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
      />

      {/* --- MODAL GUÍA DE TALLAS --- */}
      <SizeGuideModal 
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
      />

      {/* --- MODAL RASTREADOR DE GUÍA --- */}
      <OrderTrackerModal 
        isOpen={isTrackerOpen}
        onClose={() => setIsTrackerOpen(false)}
      />

      {/* --- DRAWER MIS FAVORITAS --- */}
      <WishlistDrawer 
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        favorites={favorites}
        onRemoveFavorite={(id) => setFavorites(prev => prev.filter(f => f.id !== id))}
        onOpenProduct={(prod) => setSelectedProduct(prod)}
        onAddToCart={(prod) => handleAddToCart(prod)}
      />

      {/* --- DRAWER BOLSA / CARRITO --- */}
      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
        onAddUpsell={handleAddUpsell}
      />

      {/* --- MODAL CHECKOUT GUATEMALA --- */}
      <CheckoutModal 
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        onOrderCompleted={handleOrderCompleted}
      />

      {/* --- PANEL DE ADMINISTRADOR CON CONTRASEÑA --- */}
      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        products={products}
        salesRecords={salesRecords}
        heroConfig={heroConfig}
        onUpdateHeroConfig={handleUpdateHeroConfig}
        onUpdateProduct={handleUpdateProduct}
        onAddProduct={handleAddProduct}
        onDeleteProduct={handleDeleteProduct}
        onResetDefaults={handleResetDefaults}
        onAddSaleRecord={(sale) => setSalesRecords(prev => [sale, ...prev])}
      />

    </div>
  );
}
