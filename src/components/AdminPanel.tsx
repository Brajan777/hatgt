import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Lock, 
  Unlock, 
  TrendingUp, 
  DollarSign, 
  Package, 
  ShoppingBag, 
  Edit3, 
  Plus, 
  Trash2, 
  Save, 
  RotateCcw, 
  Search, 
  CheckCircle2, 
  Eye, 
  BarChart3, 
  Layers, 
  Image as ImageIcon, 
  Upload, 
  Copy, 
  FileText, 
  Palette, 
  Sparkles,
  Smartphone,
  LayoutTemplate,
  MessageCircle,
  Check,
  ImagePlus
} from 'lucide-react';
import { CapAngle, CapColor, Product, SaleRecord, HeroConfig } from '../types';
import { CapVisualInteractive } from './CapVisualInteractive';
import { DEFAULT_HERO_CONFIG } from '../data/products';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  salesRecords: SaleRecord[];
  heroConfig: HeroConfig;
  onUpdateHeroConfig: (config: HeroConfig) => void;
  onUpdateProduct: (product: Product) => void;
  onAddProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onResetDefaults: () => void;
  onAddSaleRecord: (sale: SaleRecord) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  products,
  salesRecords,
  heroConfig,
  onUpdateHeroConfig,
  onUpdateProduct,
  onAddProduct,
  onDeleteProduct,
  onResetDefaults
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState(false);
  const [activeTab, setActiveTab] = useState<'products' | 'hero' | 'dashboard' | 'sales'>('products');
  
  // Hero Editing State
  const [editingHero, setEditingHero] = useState<HeroConfig>(() => ({ ...heroConfig }));

  useEffect(() => {
    setEditingHero({ ...heroConfig });
  }, [heroConfig]);

  const fileInputRefHero = useRef<HTMLInputElement>(null);

  // Product Edit State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [editorSubTab, setEditorSubTab] = useState<'general' | 'fotos' | 'precios' | 'colores'>('general');
  const [previewAngle, setPreviewAngle] = useState<CapAngle>('front');
  const [searchQuery, setSearchQuery] = useState('');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Hero Handlers
  const handleHeroFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setEditingHero(prev => ({
          ...prev,
          customImageUrl: event.target?.result as string
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveHero = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateHeroConfig(editingHero);
    setSaveSuccessMsg('✓ ¡Portada (Hero) actualizada con éxito! Ya se ve reflejada en la tienda.');
    setTimeout(() => setSaveSuccessMsg(''), 3500);
  };

  const handleResetHero = () => {
    if (confirm('¿Restablecer la portada a la configuración inicial?')) {
      setEditingHero({ ...DEFAULT_HERO_CONFIG });
      onUpdateHeroConfig(DEFAULT_HERO_CONFIG);
      setSaveSuccessMsg('✓ Portada restablecida a los valores iniciales.');
      setTimeout(() => setSaveSuccessMsg(''), 3500);
    }
  };


  // File input refs for uploading images
  const fileInputRefFront = useRef<HTMLInputElement>(null);
  const fileInputRefSide = useRef<HTMLInputElement>(null);
  const fileInputRefBack = useRef<HTMLInputElement>(null);
  const fileInputRefUndervisor = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === 'hatgorra26') {
      setIsAuthenticated(true);
      setAuthError(false);
      setPasswordInput('');
    } else {
      setAuthError(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    onClose();
  };

  // Financial Calculations
  const totalSalesRevenue = salesRecords.reduce((acc, s) => acc + s.totalAmount, 0);
  const totalCostOfSales = salesRecords.reduce((acc, s) => acc + s.totalCost, 0);
  const totalProfit = totalSalesRevenue - totalCostOfSales;
  const profitMargin = totalSalesRevenue > 0 ? ((totalProfit / totalSalesRevenue) * 100) : 0;
  const currentInventoryInvestment = products.reduce((acc, p) => acc + (p.stock * (p.costPrice || 0)), 0);
  const totalHistoricalInvestment = products.reduce((acc, p) => acc + (((p.stock) + (p.salesCount || 0)) * (p.costPrice || 0)), 0);
  const totalStockUnits = products.reduce((acc, p) => acc + p.stock, 0);
  const totalUnitsSold = products.reduce((acc, p) => acc + (p.salesCount || 0), 0);

  // Filtered products for admin list
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(JSON.parse(JSON.stringify(product)));
    setIsCreatingNew(false);
    setEditorSubTab('general');
    setPreviewAngle('front');
  };

  const handleDuplicateProduct = (product: Product) => {
    const duplicated: Product = {
      ...JSON.parse(JSON.stringify(product)),
      id: `gt-${Date.now().toString().slice(-4)}`,
      name: `${product.name} (Copia)`,
      salesCount: 0
    };
    setEditingProduct(duplicated);
    setIsCreatingNew(true);
    setEditorSubTab('general');
    setPreviewAngle('front');
  };

  const handleOpenCreate = () => {
    const newProd: Product = {
      id: `gt-${Date.now().toString().slice(-4)}`,
      name: 'Nueva Gorra Hatgt Retro',
      category: 'Colección Vintage GT',
      style: 'Snapback Clásico',
      price: 175,
      originalPrice: 220,
      costPrice: 70,
      badge: 'NUEVO LANZAMIENTO',
      badgeColor: 'bg-amber-400 text-stone-950',
      rating: 5.0,
      reviewsCount: 1,
      colors: [
        { name: 'Negro / Visera Café Ocre', paletteKey: 'classic-dark', hexCrown: '#18181B', hexVisor: '#D97706' },
        { name: 'Verde Quetzal / Mostaza', paletteKey: 'green-gold', hexCrown: '#166534', hexVisor: '#D97706' }
      ],
      description: 'Gorra estructurada de perfil medio con bordado de alta definición sobre tela 100% algodón.',
      features: [
        '100% Algodón peinado de alto calibre',
        'Cierre ajustable retro de 7 puntos',
        'Banda interior absorbente transpirable'
      ],
      fabric: '100% Algodón Peinado',
      fit: 'Estructurada / Perfil Medio',
      profile: 'Perfil Medio',
      stock: 12,
      salesCount: 0,
      warehouse: 'Bodega Central Zona 12, Guatemala',
      svgType: 'quetzal'
    };
    setEditingProduct(newProd);
    setIsCreatingNew(true);
    setEditorSubTab('general');
    setPreviewAngle('front');
  };

  // Image Upload Handler (reads as Base64 Data URL)
  const handleFileUpload = (field: 'imageUrl' | 'sideImageUrl' | 'backImageUrl' | 'undervisorImageUrl', e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingProduct || !e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setEditingProduct({
          ...editingProduct,
          [field]: event.target.result as string
        });
      }
    };
    reader.readAsDataURL(file);
  };

  // Features list helpers
  const handleAddFeature = () => {
    if (!editingProduct) return;
    setEditingProduct({
      ...editingProduct,
      features: [...(editingProduct.features || []), 'Nueva característica destacada']
    });
  };

  const handleUpdateFeature = (index: number, value: string) => {
    if (!editingProduct) return;
    const newFeatures = [...(editingProduct.features || [])];
    newFeatures[index] = value;
    setEditingProduct({ ...editingProduct, features: newFeatures });
  };

  const handleDeleteFeature = (index: number) => {
    if (!editingProduct) return;
    setEditingProduct({
      ...editingProduct,
      features: (editingProduct.features || []).filter((_, idx) => idx !== index)
    });
  };

  // Colors list helpers
  const handleAddColor = () => {
    if (!editingProduct) return;
    const newColor: CapColor = {
      name: 'Nueva Variante',
      paletteKey: 'custom',
      hexCrown: '#1e293b',
      hexVisor: '#d97706'
    };
    setEditingProduct({
      ...editingProduct,
      colors: [...editingProduct.colors, newColor]
    });
  };

  const handleUpdateColor = (index: number, field: keyof CapColor, value: string) => {
    if (!editingProduct) return;
    const newColors = [...editingProduct.colors];
    newColors[index] = { ...newColors[index], [field]: value };
    setEditingProduct({ ...editingProduct, colors: newColors });
  };

  const handleDeleteColor = (index: number) => {
    if (!editingProduct || editingProduct.colors.length <= 1) {
      alert('La gorra debe tener al menos 1 variante de color.');
      return;
    }
    setEditingProduct({
      ...editingProduct,
      colors: editingProduct.colors.filter((_, idx) => idx !== index)
    });
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    if (isCreatingNew) {
      onAddProduct(editingProduct);
    } else {
      onUpdateProduct(editingProduct);
    }

    setSaveSuccessMsg(`¡Gorra "${editingProduct.name}" guardada y actualizada en el catálogo!`);
    setTimeout(() => setSaveSuccessMsg(''), 3500);
    setEditingProduct(null);
    setIsCreatingNew(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/90 backdrop-blur-md flex items-center justify-center p-0 sm:p-4 overflow-y-auto">
      <div className="bg-stone-900 border-0 sm:border-4 border-amber-400 rounded-none sm:rounded-2xl w-full max-w-5xl h-full sm:h-auto sm:max-h-[94vh] overflow-hidden shadow-2xl text-stone-100 flex flex-col">
        
        {/* TOP BAR */}
        <div className="bg-stone-950 border-b-2 border-stone-800 p-3 sm:p-4 flex items-center justify-between gap-2 flex-shrink-0">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-amber-400 text-stone-950 rounded-xl border-2 border-stone-900 flex items-center justify-center flex-shrink-0 shadow-[2px_2px_0px_0px_rgba(220,38,38,1)]">
              {isAuthenticated ? <Unlock className="w-4 h-4 sm:w-5 sm:h-5" /> : <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-red-700" />}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h2 className="text-sm sm:text-base font-black text-amber-400 tracking-wider truncate">ADMINISTRADOR</h2>
                <span className="bg-red-600 text-white text-[9px] sm:text-[10px] font-black px-1.5 py-0.5 rounded-full border border-red-400">
                  HATGT 502
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-stone-400 font-medium truncate">Edición de Fotos, Textos, Portada y Catálogo</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="bg-stone-800 hover:bg-stone-700 text-stone-300 text-[11px] sm:text-xs font-bold px-2.5 py-1.5 rounded-lg border border-stone-700 transition-colors"
              >
                Salir
              </button>
            )}
            <button
              onClick={onClose}
              id="close-admin-panel-btn"
              className="bg-stone-800 hover:bg-red-600 text-stone-300 hover:text-white p-2 rounded-lg border border-stone-700 transition-colors active:scale-95"
              title="Cerrar panel"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* LOGIN SCREEN IF NOT AUTHENTICATED */}
        {!isAuthenticated ? (
          <div className="p-6 sm:p-12 flex flex-col items-center justify-center text-center max-w-md mx-auto my-auto space-y-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-amber-400/10 border-2 border-amber-400 rounded-full flex items-center justify-center text-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.2)]">
              <Lock className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg sm:text-xl font-black text-white">Acceso Administrador Hatgt</h3>
              <p className="text-xs text-stone-400">
                Ingresa la contraseña para editar la portada, catálogo, fotos, precios e inventario desde tu móvil o PC.
              </p>
            </div>

            <form onSubmit={handleLogin} className="w-full space-y-4">
              <div>
                <input
                  type="password"
                  placeholder="Contraseña..."
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full bg-stone-950 border-2 border-stone-700 focus:border-amber-400 rounded-xl px-4 py-3 text-center text-amber-400 font-black tracking-widest text-lg focus:outline-none transition-colors"
                  autoFocus
                />
                {authError && (
                  <p className="text-red-400 text-xs font-bold mt-2 animate-bounce">
                    ✕ Contraseña incorrecta. Intenta nuevamente.
                  </p>
                )}
              </div>

              <button
                type="submit"
                id="admin-login-submit-btn"
                className="w-full bg-amber-400 hover:bg-amber-300 text-stone-950 font-black py-3 rounded-xl border-2 border-stone-950 shadow-[4px_4px_0px_0px_rgba(220,38,38,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all text-sm uppercase tracking-wider"
              >
                Desbloquear Panel
              </button>
            </form>
          </div>
        ) : (
          /* AUTHENTICATED ADMIN DASHBOARD */
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* TABS NAVIGATION (TOUCH-FRIENDLY & SCROLLABLE ON MOBILE) */}
            <div className="bg-stone-950 px-2 sm:px-4 pt-2 sm:pt-3 border-b border-stone-800 flex gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar flex-shrink-0">
              <button
                onClick={() => { setActiveTab('products'); setEditingProduct(null); }}
                className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-t-xl font-black text-[11px] sm:text-xs uppercase tracking-wider whitespace-nowrap transition-colors border-t-2 border-x-2 ${
                  activeTab === 'products'
                    ? 'bg-stone-900 text-amber-400 border-amber-400'
                    : 'bg-stone-950 text-stone-400 border-transparent hover:text-stone-200'
                }`}
              >
                <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                <span>Gorras ({products.length})</span>
              </button>

              <button
                onClick={() => { setActiveTab('hero'); setEditingProduct(null); }}
                className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-t-xl font-black text-[11px] sm:text-xs uppercase tracking-wider whitespace-nowrap transition-colors border-t-2 border-x-2 ${
                  activeTab === 'hero'
                    ? 'bg-stone-900 text-amber-400 border-amber-400'
                    : 'bg-stone-950 text-stone-400 border-transparent hover:text-stone-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 text-amber-400" />
                <span>Portada (Hero)</span>
              </button>

              <button
                onClick={() => { setActiveTab('dashboard'); setEditingProduct(null); }}
                className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-t-xl font-black text-[11px] sm:text-xs uppercase tracking-wider whitespace-nowrap transition-colors border-t-2 border-x-2 ${
                  activeTab === 'dashboard'
                    ? 'bg-stone-900 text-amber-400 border-amber-400'
                    : 'bg-stone-950 text-stone-400 border-transparent hover:text-stone-200'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                <span>Finanzas</span>
              </button>

              <button
                onClick={() => { setActiveTab('sales'); setEditingProduct(null); }}
                className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-t-xl font-black text-[11px] sm:text-xs uppercase tracking-wider whitespace-nowrap transition-colors border-t-2 border-x-2 ${
                  activeTab === 'sales'
                    ? 'bg-stone-900 text-amber-400 border-amber-400'
                    : 'bg-stone-950 text-stone-400 border-transparent hover:text-stone-200'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                <span>Ventas ({salesRecords.length})</span>
              </button>
            </div>

            {/* TAB CONTENT WITH SCROLL */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
              
              {saveSuccessMsg && (
                <div className="bg-emerald-950/80 border-2 border-emerald-500 text-emerald-300 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  {saveSuccessMsg}
                </div>
              )}

              {/* TAB 1: PRODUCT MANAGEMENT & COMPLETE EDITOR */}
              {activeTab === 'products' && (
                <div className="space-y-6">
                  
                  {/* EDIT FORM (When editing or creating) */}
                  {editingProduct ? (
                    <form onSubmit={handleSaveProduct} className="bg-stone-950 p-4 sm:p-6 rounded-2xl border-2 border-amber-400 space-y-6 shadow-2xl">
                      
                      {/* Header of Edit Form */}
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-stone-800 pb-3">
                        <div className="flex items-center gap-2">
                          <Edit3 className="w-5 h-5 text-amber-400" />
                          <h3 className="text-base font-black text-amber-400 uppercase">
                            {isCreatingNew ? 'Crear Nueva Gorra para el Catálogo' : `Editar Gorra: ${editingProduct.name}`}
                          </h3>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setEditingProduct(null)}
                            className="bg-stone-800 hover:bg-stone-700 text-stone-300 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                          >
                            Cerrar Editor
                          </button>
                          <button
                            type="submit"
                            id="save-edited-product-btn-top"
                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-black px-4 py-1.5 rounded-lg text-xs flex items-center gap-1.5 border border-emerald-400 shadow-md"
                          >
                            <Save className="w-3.5 h-3.5" />
                            Guardar Gorra
                          </button>
                        </div>
                      </div>

                      {/* Sub-tabs within Product Editor */}
                      <div className="flex gap-2 border-b border-stone-800 pb-2 overflow-x-auto no-scrollbar">
                        <button
                          type="button"
                          onClick={() => setEditorSubTab('general')}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition-colors ${
                            editorSubTab === 'general'
                              ? 'bg-amber-400 text-stone-950'
                              : 'bg-stone-900 text-stone-400 hover:text-white'
                          }`}
                        >
                          <FileText className="w-3.5 h-3.5" />
                          Textos y Detalles
                        </button>

                        <button
                          type="button"
                          onClick={() => setEditorSubTab('fotos')}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition-colors ${
                            editorSubTab === 'fotos'
                              ? 'bg-amber-400 text-stone-950'
                              : 'bg-stone-900 text-stone-400 hover:text-white'
                          }`}
                        >
                          <ImageIcon className="w-3.5 h-3.5" />
                          Fotos y Ángulos
                        </button>

                        <button
                          type="button"
                          onClick={() => setEditorSubTab('precios')}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition-colors ${
                            editorSubTab === 'precios'
                              ? 'bg-amber-400 text-stone-950'
                              : 'bg-stone-900 text-stone-400 hover:text-white'
                          }`}
                        >
                          <DollarSign className="w-3.5 h-3.5" />
                          Precios, Costo y Stock
                        </button>

                        <button
                          type="button"
                          onClick={() => setEditorSubTab('colores')}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition-colors ${
                            editorSubTab === 'colores'
                              ? 'bg-amber-400 text-stone-950'
                              : 'bg-stone-900 text-stone-400 hover:text-white'
                          }`}
                        >
                          <Palette className="w-3.5 h-3.5" />
                          Variantes de Color ({editingProduct.colors.length})
                        </button>
                      </div>

                      {/* MAIN GRID: FORM INPUTS + LIVE PREVIEW */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        
                        {/* LEFT: SUBTAB CONTENT */}
                        <div className="lg:col-span-7 space-y-4">
                          
                          {/* --- SUBTAB: TEXTOS Y DETALLES GENERALES --- */}
                          {editorSubTab === 'general' && (
                            <div className="space-y-4 text-xs">
                              
                              {/* Nombre */}
                              <div>
                                <label className="block text-stone-300 font-bold mb-1">Nombre del Modelo:</label>
                                <input
                                  type="text"
                                  value={editingProduct.name}
                                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                                  placeholder="Ej: Quetzal Heritage '84"
                                  className="w-full bg-stone-900 border border-stone-700 rounded-xl p-2.5 text-white font-black text-sm focus:border-amber-400 focus:outline-none"
                                  required
                                />
                              </div>

                              {/* Categoría y Silueta */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-stone-300 font-bold mb-1">Categoría:</label>
                                  <input
                                    type="text"
                                    value={editingProduct.category}
                                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                                    placeholder="Ej: Colección Vintage GT"
                                    className="w-full bg-stone-900 border border-stone-700 rounded-lg p-2 text-white focus:border-amber-400 focus:outline-none"
                                    required
                                  />
                                </div>
                                <div>
                                  <label className="block text-stone-300 font-bold mb-1">Estilo / Silueta:</label>
                                  <input
                                    type="text"
                                    value={editingProduct.style}
                                    onChange={(e) => setEditingProduct({ ...editingProduct, style: e.target.value })}
                                    placeholder="Ej: Snapback Retro 6 Paneles"
                                    className="w-full bg-stone-900 border border-stone-700 rounded-lg p-2 text-white focus:border-amber-400 focus:outline-none"
                                    required
                                  />
                                </div>
                              </div>

                              {/* Perfil de Corona y Tipo de Tela */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-stone-300 font-bold mb-1">Perfil de Corona:</label>
                                  <select
                                    value={editingProduct.profile}
                                    onChange={(e) => setEditingProduct({ ...editingProduct, profile: e.target.value as any })}
                                    className="w-full bg-stone-900 border border-stone-700 rounded-lg p-2 text-white focus:border-amber-400 focus:outline-none"
                                  >
                                    <option value="Perfil Medio">Perfil Medio (Estándar)</option>
                                    <option value="Corona Alta">Corona Alta (Retro Trucker)</option>
                                    <option value="Desestructurada / Relajada">Desestructurada / Relajada (Dad Cap)</option>
                                    <option value="5-Panel Camper">5-Panel Camper</option>
                                  </select>
                                </div>

                                <div>
                                  <label className="block text-stone-300 font-bold mb-1">Material / Tela:</label>
                                  <input
                                    type="text"
                                    value={editingProduct.fabric}
                                    onChange={(e) => setEditingProduct({ ...editingProduct, fabric: e.target.value })}
                                    placeholder="Ej: 100% Algodón Peinado 380gsm"
                                    className="w-full bg-stone-900 border border-stone-700 rounded-lg p-2 text-white focus:border-amber-400 focus:outline-none"
                                  />
                                </div>
                              </div>

                              {/* Ajuste y Bodega */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-stone-300 font-bold mb-1">Tipo de Cierre / Ajuste:</label>
                                  <input
                                    type="text"
                                    value={editingProduct.fit}
                                    onChange={(e) => setEditingProduct({ ...editingProduct, fit: e.target.value })}
                                    placeholder="Ej: Broche Snapback 7 puntos (54-62cm)"
                                    className="w-full bg-stone-900 border border-stone-700 rounded-lg p-2 text-white focus:border-amber-400 focus:outline-none"
                                  />
                                </div>

                                <div>
                                  <label className="block text-stone-300 font-bold mb-1">Bodega / Ubicación:</label>
                                  <input
                                    type="text"
                                    value={editingProduct.warehouse}
                                    onChange={(e) => setEditingProduct({ ...editingProduct, warehouse: e.target.value })}
                                    placeholder="Ej: Bodega Central Zona 12, Guatemala"
                                    className="w-full bg-stone-900 border border-stone-700 rounded-lg p-2 text-white focus:border-amber-400 focus:outline-none"
                                  />
                                </div>
                              </div>

                              {/* Badge / Etiqueta */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-stone-300 font-bold mb-1">Texto de la Etiqueta (Badge):</label>
                                  <input
                                    type="text"
                                    value={editingProduct.badge || ''}
                                    onChange={(e) => setEditingProduct({ ...editingProduct, badge: e.target.value })}
                                    placeholder="Ej: 🔥 MÁS VENDIDA o NUEVO"
                                    className="w-full bg-stone-900 border border-stone-700 rounded-lg p-2 text-white focus:border-amber-400 focus:outline-none"
                                  />
                                </div>

                                <div>
                                  <label className="block text-stone-300 font-bold mb-1">Estilo Color de la Etiqueta:</label>
                                  <select
                                    value={editingProduct.badgeColor || 'bg-amber-400 text-stone-950'}
                                    onChange={(e) => setEditingProduct({ ...editingProduct, badgeColor: e.target.value })}
                                    className="w-full bg-stone-900 border border-stone-700 rounded-lg p-2 text-white focus:border-amber-400 focus:outline-none"
                                  >
                                    <option value="bg-amber-400 text-stone-950">Amarillo Dorado (Retro)</option>
                                    <option value="bg-red-600 text-white">Rojo Intenso (Destacado)</option>
                                    <option value="bg-emerald-600 text-white">Verde Esmeralda (Lanzamiento)</option>
                                    <option value="bg-stone-900 text-amber-400 border border-amber-400">Negro con Borde Oro</option>
                                  </select>
                                </div>
                              </div>

                              {/* Descripción */}
                              <div>
                                <label className="block text-stone-300 font-bold mb-1">Descripción de la Gorra:</label>
                                <textarea
                                  rows={3}
                                  value={editingProduct.description}
                                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                                  placeholder="Describe los detalles de la gorra, el bordado y su diseño..."
                                  className="w-full bg-stone-900 border border-stone-700 rounded-xl p-2.5 text-white focus:border-amber-400 focus:outline-none"
                                  required
                                />
                              </div>

                              {/* Features / Viñetas */}
                              <div className="bg-stone-900/60 p-3 rounded-xl border border-stone-800 space-y-2">
                                <div className="flex justify-between items-center">
                                  <span className="font-bold text-amber-400">Viñetas / Puntos Clave del Producto:</span>
                                  <button
                                    type="button"
                                    onClick={handleAddFeature}
                                    className="text-[11px] bg-amber-400 text-stone-950 font-bold px-2 py-1 rounded hover:bg-amber-300 flex items-center gap-1"
                                  >
                                    <Plus className="w-3 h-3" /> Agregar Punto
                                  </button>
                                </div>

                                <div className="space-y-1.5">
                                  {(editingProduct.features || []).map((feat, idx) => (
                                    <div key={idx} className="flex items-center gap-2">
                                      <input
                                        type="text"
                                        value={feat}
                                        onChange={(e) => handleUpdateFeature(idx, e.target.value)}
                                        className="flex-1 bg-stone-900 border border-stone-700 rounded-lg p-1.5 text-xs text-white focus:border-amber-400 focus:outline-none"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => handleDeleteFeature(idx)}
                                        className="text-stone-500 hover:text-red-400 p-1"
                                        title="Eliminar viñeta"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>

                            </div>
                          )}

                          {/* --- SUBTAB: FOTOS Y ÁNGULOS --- */}
                          {editorSubTab === 'fotos' && (
                            <div className="space-y-4 text-xs">
                              
                              <div className="bg-amber-400/10 border border-amber-400/30 p-3 rounded-xl text-amber-300">
                                <p className="font-bold text-xs flex items-center gap-1.5">
                                  <Sparkles className="w-4 h-4 text-amber-400" />
                                  Carga de Fotografías Reales o URLs
                                </p>
                                <p className="text-[11px] text-stone-300 mt-1">
                                  Puedes subir archivos de fotos directamente desde tu dispositivo o pegar enlaces web de imágenes. Si no asignas una foto, se mostrará el diseño gráfico interactivo Hatgt.
                                </p>
                              </div>

                              {/* Foto Frontal */}
                              <div className="bg-stone-900 p-3.5 rounded-xl border border-stone-800 space-y-2">
                                <div className="flex justify-between items-center">
                                  <label className="font-black text-amber-400 flex items-center gap-1.5">
                                    <ImageIcon className="w-4 h-4 text-emerald-400" />
                                    Foto Frontal (Principal del Catálogo):
                                  </label>
                                  {editingProduct.imageUrl && (
                                    <button
                                      type="button"
                                      onClick={() => setEditingProduct({ ...editingProduct, imageUrl: undefined })}
                                      className="text-red-400 hover:text-red-300 text-[10px] font-bold"
                                    >
                                      Quitar Foto (Usar SVG)
                                    </button>
                                  )}
                                </div>
                                <div className="flex gap-2 items-center">
                                  <input
                                    type="text"
                                    value={editingProduct.imageUrl || ''}
                                    onChange={(e) => setEditingProduct({ ...editingProduct, imageUrl: e.target.value })}
                                    placeholder="https://ejemplo.com/foto-frontal.jpg o sube archivo →"
                                    className="flex-1 bg-stone-950 border border-stone-700 rounded-lg p-2 text-white font-mono text-xs focus:border-amber-400 focus:outline-none"
                                  />
                                  <input
                                    type="file"
                                    ref={fileInputRefFront}
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => handleFileUpload('imageUrl', e)}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => fileInputRefFront.current?.click()}
                                    className="bg-stone-800 hover:bg-stone-700 text-amber-300 font-bold px-3 py-2 rounded-lg border border-stone-600 flex items-center gap-1 whitespace-nowrap"
                                  >
                                    <Upload className="w-3.5 h-3.5" /> Subir Foto
                                  </button>
                                </div>
                              </div>

                              {/* Foto Lateral */}
                              <div className="bg-stone-900 p-3.5 rounded-xl border border-stone-800 space-y-2">
                                <div className="flex justify-between items-center">
                                  <label className="font-black text-stone-200 flex items-center gap-1.5">
                                    <ImageIcon className="w-4 h-4 text-amber-400" />
                                    Foto Lateral 45°:
                                  </label>
                                  {editingProduct.sideImageUrl && (
                                    <button
                                      type="button"
                                      onClick={() => setEditingProduct({ ...editingProduct, sideImageUrl: undefined })}
                                      className="text-red-400 hover:text-red-300 text-[10px] font-bold"
                                    >
                                      Quitar
                                    </button>
                                  )}
                                </div>
                                <div className="flex gap-2 items-center">
                                  <input
                                    type="text"
                                    value={editingProduct.sideImageUrl || ''}
                                    onChange={(e) => setEditingProduct({ ...editingProduct, sideImageUrl: e.target.value })}
                                    placeholder="URL foto lateral o sube archivo →"
                                    className="flex-1 bg-stone-950 border border-stone-700 rounded-lg p-2 text-white font-mono text-xs focus:border-amber-400 focus:outline-none"
                                  />
                                  <input
                                    type="file"
                                    ref={fileInputRefSide}
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => handleFileUpload('sideImageUrl', e)}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => fileInputRefSide.current?.click()}
                                    className="bg-stone-800 hover:bg-stone-700 text-amber-300 font-bold px-3 py-2 rounded-lg border border-stone-600 flex items-center gap-1 whitespace-nowrap"
                                  >
                                    <Upload className="w-3.5 h-3.5" /> Subir
                                  </button>
                                </div>
                              </div>

                              {/* Foto Trasera / Broche */}
                              <div className="bg-stone-900 p-3.5 rounded-xl border border-stone-800 space-y-2">
                                <div className="flex justify-between items-center">
                                  <label className="font-black text-stone-200 flex items-center gap-1.5">
                                    <ImageIcon className="w-4 h-4 text-amber-400" />
                                    Foto Posterior (Broche de Ajuste):
                                  </label>
                                  {editingProduct.backImageUrl && (
                                    <button
                                      type="button"
                                      onClick={() => setEditingProduct({ ...editingProduct, backImageUrl: undefined })}
                                      className="text-red-400 hover:text-red-300 text-[10px] font-bold"
                                    >
                                      Quitar
                                    </button>
                                  )}
                                </div>
                                <div className="flex gap-2 items-center">
                                  <input
                                    type="text"
                                    value={editingProduct.backImageUrl || ''}
                                    onChange={(e) => setEditingProduct({ ...editingProduct, backImageUrl: e.target.value })}
                                    placeholder="URL foto posterior o sube archivo →"
                                    className="flex-1 bg-stone-950 border border-stone-700 rounded-lg p-2 text-white font-mono text-xs focus:border-amber-400 focus:outline-none"
                                  />
                                  <input
                                    type="file"
                                    ref={fileInputRefBack}
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => handleFileUpload('backImageUrl', e)}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => fileInputRefBack.current?.click()}
                                    className="bg-stone-800 hover:bg-stone-700 text-amber-300 font-bold px-3 py-2 rounded-lg border border-stone-600 flex items-center gap-1 whitespace-nowrap"
                                  >
                                    <Upload className="w-3.5 h-3.5" /> Subir
                                  </button>
                                </div>
                              </div>

                              {/* Foto Bajo-Visera */}
                              <div className="bg-stone-900 p-3.5 rounded-xl border border-stone-800 space-y-2">
                                <div className="flex justify-between items-center">
                                  <label className="font-black text-stone-200 flex items-center gap-1.5">
                                    <ImageIcon className="w-4 h-4 text-amber-400" />
                                    Foto Bajo-Visera / Etiqueta Interior:
                                  </label>
                                  {editingProduct.undervisorImageUrl && (
                                    <button
                                      type="button"
                                      onClick={() => setEditingProduct({ ...editingProduct, undervisorImageUrl: undefined })}
                                      className="text-red-400 hover:text-red-300 text-[10px] font-bold"
                                    >
                                      Quitar
                                    </button>
                                  )}
                                </div>
                                <div className="flex gap-2 items-center">
                                  <input
                                    type="text"
                                    value={editingProduct.undervisorImageUrl || ''}
                                    onChange={(e) => setEditingProduct({ ...editingProduct, undervisorImageUrl: e.target.value })}
                                    placeholder="URL foto bajo-visera o sube archivo →"
                                    className="flex-1 bg-stone-950 border border-stone-700 rounded-lg p-2 text-white font-mono text-xs focus:border-amber-400 focus:outline-none"
                                  />
                                  <input
                                    type="file"
                                    ref={fileInputRefUndervisor}
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => handleFileUpload('undervisorImageUrl', e)}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => fileInputRefUndervisor.current?.click()}
                                    className="bg-stone-800 hover:bg-stone-700 text-amber-300 font-bold px-3 py-2 rounded-lg border border-stone-600 flex items-center gap-1 whitespace-nowrap"
                                  >
                                    <Upload className="w-3.5 h-3.5" /> Subir
                                  </button>
                                </div>
                              </div>

                              {/* Modelo Gráfico SVG de respaldo */}
                              <div className="bg-stone-900 p-3 rounded-xl border border-stone-800">
                                <label className="block text-stone-300 font-bold mb-1">Diseño Gráfico Retro de Respaldo:</label>
                                <select
                                  value={editingProduct.svgType}
                                  onChange={(e) => setEditingProduct({ ...editingProduct, svgType: e.target.value })}
                                  className="w-full bg-stone-950 border border-stone-700 rounded-lg p-2 text-white font-bold focus:border-amber-400 focus:outline-none"
                                >
                                  <option value="quetzal">Quetzal Vintage 80s</option>
                                  <option value="sunset">Atitlán Sunset</option>
                                  <option value="trucker">Ruta 502 Trucker</option>
                                  <option value="camper">Antigua Gold Camper</option>
                                  <option value="roots">Tikal Roots 90s</option>
                                  <option value="pacaya">Pacaya Burnout</option>
                                </select>
                              </div>

                            </div>
                          )}

                          {/* --- SUBTAB: PRECIOS, COSTO Y STOCK --- */}
                          {editorSubTab === 'precios' && (
                            <div className="space-y-4 text-xs">
                              
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {/* Precio de Venta */}
                                <div className="bg-stone-900 p-3.5 rounded-xl border border-emerald-500/40">
                                  <label className="block text-emerald-400 font-black mb-1">Precio de Venta (Q):</label>
                                  <input
                                    type="number"
                                    min="1"
                                    step="0.5"
                                    value={editingProduct.price}
                                    onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) || 0 })}
                                    className="w-full bg-stone-950 border border-stone-700 rounded-lg p-2.5 text-emerald-400 font-black text-base focus:border-amber-400 focus:outline-none"
                                    required
                                  />
                                  <span className="text-[10px] text-stone-400 mt-1 block">Precio al cliente final</span>
                                </div>

                                {/* Precio Original */}
                                <div className="bg-stone-900 p-3.5 rounded-xl border border-stone-700">
                                  <label className="block text-stone-300 font-bold mb-1">Precio Original Tachado (Q):</label>
                                  <input
                                    type="number"
                                    min="1"
                                    step="0.5"
                                    value={editingProduct.originalPrice}
                                    onChange={(e) => setEditingProduct({ ...editingProduct, originalPrice: parseFloat(e.target.value) || 0 })}
                                    className="w-full bg-stone-950 border border-stone-700 rounded-lg p-2.5 text-stone-300 font-bold text-base focus:border-amber-400 focus:outline-none"
                                    required
                                  />
                                  <span className="text-[10px] text-stone-400 mt-1 block">Para mostrar descuento</span>
                                </div>

                                {/* Costo Unitario Inversión */}
                                <div className="bg-stone-900 p-3.5 rounded-xl border border-red-500/40">
                                  <label className="block text-red-400 font-black mb-1">Costo Unitario / Inversión (Q):</label>
                                  <input
                                    type="number"
                                    min="0"
                                    step="0.5"
                                    value={editingProduct.costPrice || 0}
                                    onChange={(e) => setEditingProduct({ ...editingProduct, costPrice: parseFloat(e.target.value) || 0 })}
                                    className="w-full bg-stone-950 border border-stone-700 rounded-lg p-2.5 text-red-400 font-black text-base focus:border-amber-400 focus:outline-none"
                                    required
                                  />
                                  <span className="text-[10px] text-stone-400 mt-1 block">Costo de compra/producción</span>
                                </div>
                              </div>

                              {/* Métricas Calculadas en Tiempo Real */}
                              <div className="bg-stone-900 p-4 rounded-xl border border-stone-800 grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div>
                                  <span className="text-[10px] text-stone-400 font-bold block uppercase">Ganancia Neta / Unidad:</span>
                                  <span className="text-xl font-black text-amber-400">
                                    +Q{(editingProduct.price - (editingProduct.costPrice || 0)).toFixed(2)}
                                  </span>
                                </div>

                                <div>
                                  <span className="text-[10px] text-stone-400 font-bold block uppercase">Margen Bruto de Ganancia:</span>
                                  <span className="text-xl font-black text-emerald-400">
                                    {editingProduct.price > 0 ? (((editingProduct.price - (editingProduct.costPrice || 0)) / editingProduct.price) * 100).toFixed(1) : 0}%
                                  </span>
                                </div>

                                <div>
                                  <span className="text-[10px] text-stone-400 font-bold block uppercase">Inversión en este Stock:</span>
                                  <span className="text-xl font-black text-stone-200">
                                    Q{(editingProduct.stock * (editingProduct.costPrice || 0)).toFixed(2)}
                                  </span>
                                </div>
                              </div>

                              {/* Stock e Historial de Ventas */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="bg-stone-900 p-3.5 rounded-xl border border-stone-800">
                                  <label className="block text-amber-400 font-black mb-1">Unidades en Stock (Inventario Activo):</label>
                                  <input
                                    type="number"
                                    min="0"
                                    value={editingProduct.stock}
                                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: parseInt(e.target.value) || 0 })}
                                    className="w-full bg-stone-950 border border-stone-700 rounded-lg p-2 text-amber-400 font-black text-base focus:border-amber-400 focus:outline-none"
                                    required
                                  />
                                </div>

                                <div className="bg-stone-900 p-3.5 rounded-xl border border-stone-800">
                                  <label className="block text-stone-300 font-bold mb-1">Unidades Vendidas Históricamente:</label>
                                  <input
                                    type="number"
                                    min="0"
                                    value={editingProduct.salesCount || 0}
                                    onChange={(e) => setEditingProduct({ ...editingProduct, salesCount: parseInt(e.target.value) || 0 })}
                                    className="w-full bg-stone-950 border border-stone-700 rounded-lg p-2 text-white font-bold text-base focus:border-amber-400 focus:outline-none"
                                  />
                                </div>
                              </div>

                            </div>
                          )}

                          {/* --- SUBTAB: VARIANTES DE COLOR --- */}
                          {editorSubTab === 'colores' && (
                            <div className="space-y-4 text-xs">
                              
                              <div className="flex justify-between items-center">
                                <span className="font-black text-amber-400 text-sm">Combinaciones y Variantes de Color:</span>
                                <button
                                  type="button"
                                  onClick={handleAddColor}
                                  className="bg-amber-400 hover:bg-amber-300 text-stone-950 font-black px-3 py-1.5 rounded-lg flex items-center gap-1"
                                >
                                  <Plus className="w-3.5 h-3.5" /> Agregar Variante
                                </button>
                              </div>

                              <div className="space-y-3">
                                {editingProduct.colors.map((col, idx) => (
                                  <div key={idx} className="bg-stone-900 p-3 rounded-xl border border-stone-800 space-y-2">
                                    <div className="flex justify-between items-center">
                                      <span className="font-bold text-stone-200 text-xs">Variante #{idx + 1}</span>
                                      {editingProduct.colors.length > 1 && (
                                        <button
                                          type="button"
                                          onClick={() => handleDeleteColor(idx)}
                                          className="text-red-400 hover:text-red-300 text-[11px] flex items-center gap-1 font-bold"
                                        >
                                          <Trash2 className="w-3 h-3" /> Eliminar
                                        </button>
                                      )}
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                      <div>
                                        <label className="block text-[10px] text-stone-400 mb-0.5">Nombre del Color:</label>
                                        <input
                                          type="text"
                                          value={col.name}
                                          onChange={(e) => handleUpdateColor(idx, 'name', e.target.value)}
                                          className="w-full bg-stone-950 border border-stone-700 rounded-lg p-1.5 text-white font-bold text-xs focus:border-amber-400 focus:outline-none"
                                        />
                                      </div>

                                      <div>
                                        <label className="block text-[10px] text-stone-400 mb-0.5">Color Corona:</label>
                                        <div className="flex items-center gap-1.5">
                                          <input
                                            type="color"
                                            value={col.hexCrown || '#18181B'}
                                            onChange={(e) => handleUpdateColor(idx, 'hexCrown', e.target.value)}
                                            className="w-8 h-8 rounded border border-stone-700 bg-stone-950 cursor-pointer"
                                          />
                                          <input
                                            type="text"
                                            value={col.hexCrown || '#18181B'}
                                            onChange={(e) => handleUpdateColor(idx, 'hexCrown', e.target.value)}
                                            className="flex-1 bg-stone-950 border border-stone-700 rounded-lg p-1 text-white font-mono text-[11px]"
                                          />
                                        </div>
                                      </div>

                                      <div>
                                        <label className="block text-[10px] text-stone-400 mb-0.5">Color Visera:</label>
                                        <div className="flex items-center gap-1.5">
                                          <input
                                            type="color"
                                            value={col.hexVisor || '#D97706'}
                                            onChange={(e) => handleUpdateColor(idx, 'hexVisor', e.target.value)}
                                            className="w-8 h-8 rounded border border-stone-700 bg-stone-950 cursor-pointer"
                                          />
                                          <input
                                            type="text"
                                            value={col.hexVisor || '#D97706'}
                                            onChange={(e) => handleUpdateColor(idx, 'hexVisor', e.target.value)}
                                            className="flex-1 bg-stone-950 border border-stone-700 rounded-lg p-1 text-white font-mono text-[11px]"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>

                            </div>
                          )}

                        </div>

                        {/* RIGHT: LIVE INTERACTIVE PREVIEW & ANGLE TESTER */}
                        <div className="lg:col-span-5 space-y-4">
                          <div className="bg-stone-900 p-4 rounded-2xl border-2 border-stone-800 space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-black uppercase text-amber-400 tracking-wider flex items-center gap-1.5">
                                <Eye className="w-4 h-4" />
                                Previsualización en Vivo:
                              </span>
                              <span className="text-[10px] bg-stone-950 px-2 py-0.5 rounded text-stone-400 font-mono">
                                {editingProduct.imageUrl ? 'FOTO CARGADA' : 'MODELO GRÁFICO'}
                              </span>
                            </div>

                            <CapVisualInteractive
                              type={editingProduct.svgType}
                              paletteKey={editingProduct.colors[0]?.paletteKey || 'classic-dark'}
                              crownHex={editingProduct.colors[0]?.hexCrown}
                              visorHex={editingProduct.colors[0]?.hexVisor}
                              viewAngle={previewAngle}
                              imageUrl={editingProduct.imageUrl}
                              sideImageUrl={editingProduct.sideImageUrl}
                              backImageUrl={editingProduct.backImageUrl}
                              undervisorImageUrl={editingProduct.undervisorImageUrl}
                              size="large"
                            />

                            {/* Angle Selector in Preview */}
                            <div className="grid grid-cols-4 gap-1.5 pt-1">
                              {(['front', 'side', 'back', 'undervisor'] as CapAngle[]).map((ang) => (
                                <button
                                  key={ang}
                                  type="button"
                                  onClick={() => setPreviewAngle(ang)}
                                  className={`py-1 rounded text-[10px] font-black uppercase transition-all ${
                                    previewAngle === ang
                                      ? 'bg-amber-400 text-stone-950 shadow-sm'
                                      : 'bg-stone-950 text-stone-400 hover:text-white'
                                  }`}
                                >
                                  {ang === 'front' ? 'Frontal' : ang === 'side' ? 'Lateral' : ang === 'back' ? 'Broche' : 'Visera'}
                                </button>
                              ))}
                            </div>

                            <div className="bg-stone-950 p-2.5 rounded-xl border border-stone-800 text-[11px] space-y-1">
                              <div className="flex justify-between">
                                <span className="text-stone-400">Nombre:</span>
                                <span className="font-bold text-white truncate max-w-[180px]">{editingProduct.name}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-stone-400">Precio Público:</span>
                                <span className="font-black text-emerald-400">Q{editingProduct.price}.00</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-stone-400">Inversión Costo:</span>
                                <span className="font-bold text-red-400">Q{editingProduct.costPrice}.00</span>
                              </div>
                            </div>
                          </div>
                        </div>

                      </div>

                      {/* BOTTOM ACTIONS */}
                      <div className="flex justify-between items-center pt-4 border-t border-stone-800">
                        <button
                          type="button"
                          onClick={() => setEditingProduct(null)}
                          className="bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold px-4 py-2.5 rounded-xl text-xs"
                        >
                          Cancelar Edición
                        </button>

                        <button
                          type="submit"
                          id="save-edited-product-btn"
                          className="bg-emerald-600 hover:bg-emerald-500 text-white font-black px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 border border-emerald-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all uppercase tracking-wider"
                        >
                          <Save className="w-4 h-4" />
                          Guardar Cambios en el Catálogo
                        </button>
                      </div>

                    </form>
                  ) : null}

                  {/* PRODUCTS LIST TABLE WITH SEARCH & ADD BUTTON */}
                  <div className="bg-stone-950 p-5 rounded-2xl border-2 border-stone-800 space-y-4 shadow-xl">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div className="relative flex-1 max-w-sm w-full">
                        <Search className="w-4 h-4 text-stone-500 absolute left-3 top-3" />
                        <input
                          type="text"
                          placeholder="Buscar por nombre, categoría o ID..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full bg-stone-900 border border-stone-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button
                          onClick={onResetDefaults}
                          className="bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-bold px-3 py-2 rounded-xl border border-stone-700 flex items-center gap-1.5 transition-colors"
                          title="Restablecer valores iniciales de fábrica"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          Restablecer Catálogo
                        </button>

                        <button
                          onClick={handleOpenCreate}
                          id="add-new-product-admin-btn"
                          className="bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-xs px-4 py-2 rounded-xl border-2 border-amber-500 flex items-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(220,38,38,1)] transition-transform active:translate-x-0.5 active:translate-y-0.5"
                        >
                          <Plus className="w-4 h-4" />
                          Nueva Gorra
                        </button>
                      </div>
                    </div>

                    {/* VISTA MÓVIL EN TARJETAS (TOUCH-FRIENDLY) */}
                    <div className="space-y-3 md:hidden">
                      {filteredProducts.map(p => {
                        const unitProfit = p.price - (p.costPrice || 0);
                        return (
                          <div 
                            key={p.id}
                            className="bg-stone-900 border-2 border-stone-800 rounded-xl p-3.5 space-y-3 shadow-md"
                          >
                            <div className="flex items-start gap-3">
                              <div className="w-14 h-14 rounded-lg bg-stone-950 border border-stone-700 overflow-hidden flex items-center justify-center flex-shrink-0">
                                {p.imageUrl ? (
                                  <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                ) : (
                                  <span className="text-xs font-black text-amber-400">SVG</span>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-1">
                                  <span className="text-[10px] bg-stone-800 text-stone-400 font-mono px-1.5 py-0.5 rounded">{p.id}</span>
                                  <span className={`text-[10px] font-black px-2 py-0.5 rounded ${p.stock <= 5 ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-stone-800 text-stone-200'}`}>
                                    {p.stock} disp.
                                  </span>
                                </div>
                                <h4 className="text-sm font-black text-white truncate mt-1">{p.name}</h4>
                                <p className="text-[11px] text-stone-400 truncate">{p.category} • {p.style}</p>
                              </div>
                            </div>

                            {/* Precios y Margen */}
                            <div className="grid grid-cols-3 gap-2 bg-stone-950 p-2.5 rounded-lg border border-stone-800/80 text-center">
                              <div>
                                <span className="text-[9px] text-stone-500 font-bold block uppercase">Precio</span>
                                <span className="text-xs font-black text-emerald-400">Q{p.price.toFixed(2)}</span>
                              </div>
                              <div>
                                <span className="text-[9px] text-stone-500 font-bold block uppercase">Costo</span>
                                <span className="text-xs font-bold text-red-400">Q{(p.costPrice || 0).toFixed(2)}</span>
                              </div>
                              <div>
                                <span className="text-[9px] text-stone-500 font-bold block uppercase">Ganancia</span>
                                <span className="text-xs font-black text-amber-400">+Q{unitProfit.toFixed(2)}</span>
                              </div>
                            </div>

                            {/* Botones de Acción Táctiles */}
                            <div className="flex gap-2 pt-1">
                              <button
                                type="button"
                                onClick={() => handleOpenEdit(p)}
                                className="flex-1 bg-amber-400 hover:bg-amber-300 text-stone-950 font-black py-2.5 px-3 rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-transform"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>Editar Gorra</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDuplicateProduct(p)}
                                className="bg-stone-800 hover:bg-stone-700 text-stone-300 p-2.5 rounded-lg border border-stone-700 text-xs active:scale-95"
                                title="Duplicar"
                              >
                                <Copy className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  if (confirm(`¿Estás seguro de eliminar la gorra "${p.name}"?`)) {
                                    onDeleteProduct(p.id);
                                  }
                                }}
                                className="bg-red-950/70 hover:bg-red-600 text-red-400 hover:text-white p-2.5 rounded-lg border border-red-800 text-xs active:scale-95"
                                title="Eliminar"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* VISTA ESCRITORIO EN TABLA */}
                    <div className="hidden md:block overflow-x-auto">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-stone-900 text-stone-400 font-black uppercase text-[10px] border-b border-stone-800">
                          <tr>
                            <th className="p-3">Gorra / Foto</th>
                            <th className="p-3">Categoría / Silueta</th>
                            <th className="p-3">Precio Venta</th>
                            <th className="p-3">Costo Inversión</th>
                            <th className="p-3">Ganancia Unitaria</th>
                            <th className="p-3">Stock Activo</th>
                            <th className="p-3 text-right">Acciones</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-800 font-medium text-stone-300">
                          {filteredProducts.map(p => {
                            const unitProfit = p.price - (p.costPrice || 0);
                            return (
                              <tr key={p.id} className="hover:bg-stone-900/60 transition-colors">
                                <td className="p-3 font-bold text-white">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-stone-900 border border-stone-700 overflow-hidden flex items-center justify-center flex-shrink-0">
                                      {p.imageUrl ? (
                                        <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                      ) : (
                                        <span className="text-[10px] font-black text-amber-400">SVG</span>
                                      )}
                                    </div>
                                    <div>
                                      <div className="text-white font-black">{p.name}</div>
                                      <span className="text-[10px] text-stone-500 font-mono">ID: {p.id}</span>
                                    </div>
                                  </div>
                                </td>
                                <td className="p-3">
                                  <div className="text-stone-200">{p.category}</div>
                                  <span className="text-[10px] text-stone-400">{p.style}</span>
                                </td>
                                <td className="p-3 font-black text-emerald-400">Q{p.price.toFixed(2)}</td>
                                <td className="p-3 font-bold text-red-400">Q{(p.costPrice || 0).toFixed(2)}</td>
                                <td className="p-3 font-bold text-amber-400">+Q{unitProfit.toFixed(2)}</td>
                                <td className="p-3">
                                  <span className={`px-2 py-0.5 rounded font-black ${p.stock <= 5 ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-stone-800 text-stone-200'}`}>
                                    {p.stock} unidades
                                  </span>
                                </td>
                                <td className="p-3 text-right">
                                  <div className="flex items-center justify-end gap-1.5">
                                    <button
                                      onClick={() => handleDuplicateProduct(p)}
                                      id={`duplicate-prod-${p.id}`}
                                      className="bg-stone-800 hover:bg-stone-700 text-stone-300 p-1.5 rounded-lg border border-stone-700 transition-colors"
                                      title="Duplicar como nueva gorra"
                                    >
                                      <Copy className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => handleOpenEdit(p)}
                                      id={`edit-prod-${p.id}`}
                                      className="bg-amber-400/20 hover:bg-amber-400 text-amber-300 hover:text-stone-950 p-1.5 rounded-lg border border-amber-400/40 transition-colors"
                                      title="Editar fotos, textos y precios"
                                    >
                                      <Edit3 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => {
                                        if (confirm(`¿Estás seguro de eliminar la gorra "${p.name}" del catálogo?`)) {
                                          onDeleteProduct(p.id);
                                        }
                                      }}
                                      id={`delete-prod-${p.id}`}
                                      className="bg-red-950/60 hover:bg-red-600 text-red-400 hover:text-white p-1.5 rounded-lg border border-red-800 transition-colors"
                                      title="Eliminar del catálogo"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: HERO PORTADA & CONFIGURATION */}
              {activeTab === 'hero' && (
                <form onSubmit={handleSaveHero} className="space-y-6">
                  
                  {/* Hero Config Header */}
                  <div className="bg-stone-950 p-4 sm:p-5 rounded-2xl border-2 border-stone-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-amber-400" />
                        <h3 className="text-base sm:text-lg font-black text-amber-400 uppercase tracking-wide">
                          Configuración y Portada (Hero) de HATGT
                        </h3>
                      </div>
                      <p className="text-xs text-stone-400 mt-1">
                        Personaliza en tiempo real la gorra destacada, foto de portada, textos, promociones y WhatsApp de contacto.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={handleResetHero}
                        className="bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-bold px-3 py-2.5 rounded-xl border border-stone-700 flex items-center gap-1.5 transition-colors flex-1 sm:flex-none justify-center"
                        title="Restablecer textos por defecto"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Restablecer
                      </button>
                      <button
                        type="submit"
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-black px-5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 border border-emerald-400 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:scale-95 transition-all uppercase tracking-wider flex-1 sm:flex-none justify-center"
                      >
                        <Save className="w-4 h-4" />
                        Guardar Portada
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* LEFT COLUMN: CONTROLS & INPUTS */}
                    <div className="lg:col-span-7 space-y-6">

                      {/* 1. SELECTOR DE GORRA DESTACADA */}
                      <div className="bg-stone-950 p-4 sm:p-5 rounded-2xl border-2 border-stone-800 space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-black uppercase text-amber-400 tracking-wider flex items-center gap-1.5">
                            <Package className="w-4 h-4" />
                            1. Gorra Destacada en la Portada:
                          </label>
                          <span className="text-[10px] text-stone-400 font-mono bg-stone-900 px-2 py-0.5 rounded">
                            Toca una para seleccionarla
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-64 overflow-y-auto pr-1">
                          {products.map(prod => {
                            const isSelected = editingHero.featuredProductId === prod.id;
                            return (
                              <div
                                key={prod.id}
                                onClick={() => setEditingHero(prev => ({ ...prev, featuredProductId: prod.id }))}
                                className={`p-2.5 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-3 ${
                                  isSelected
                                    ? 'bg-amber-400/10 border-amber-400 text-white shadow-md'
                                    : 'bg-stone-900 border-stone-800 text-stone-300 hover:border-stone-700'
                                }`}
                              >
                                <div className="w-12 h-12 rounded-lg bg-stone-950 border border-stone-700 overflow-hidden flex items-center justify-center flex-shrink-0">
                                  {prod.imageUrl ? (
                                    <img src={prod.imageUrl} alt={prod.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                  ) : (
                                    <span className="text-[10px] font-black text-amber-400">SVG</span>
                                  )}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <h5 className="text-xs font-black truncate">{prod.name}</h5>
                                  <p className="text-[10px] text-stone-400 truncate">{prod.style}</p>
                                  <span className="text-xs font-bold text-amber-400">Q{prod.price}.00</span>
                                </div>
                                {isSelected && (
                                  <div className="w-5 h-5 rounded-full bg-amber-400 text-stone-950 flex items-center justify-center flex-shrink-0">
                                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* 2. IMAGEN PERSONALIZADA DE PORTADA (OPCIONAL) */}
                      <div className="bg-stone-950 p-4 sm:p-5 rounded-2xl border-2 border-stone-800 space-y-4">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-black uppercase text-amber-400 tracking-wider flex items-center gap-1.5">
                            <ImagePlus className="w-4 h-4" />
                            2. Imagen de Portada (Foto o Banner):
                          </label>
                          {editingHero.customImageUrl && (
                            <button
                              type="button"
                              onClick={() => setEditingHero(prev => ({ ...prev, customImageUrl: undefined }))}
                              className="text-[11px] text-red-400 hover:text-red-300 font-bold underline"
                            >
                              Quitar foto (Usar modelo 3D)
                            </button>
                          )}
                        </div>

                        <div className="space-y-3">
                          {/* Upload from mobile / PC */}
                          <div className="flex flex-col sm:flex-row gap-3 items-center">
                            <input
                              ref={fileInputRefHero}
                              type="file"
                              accept="image/*"
                              onChange={handleHeroFileUpload}
                              className="hidden"
                            />
                            <button
                              type="button"
                              onClick={() => fileInputRefHero.current?.click()}
                              className="w-full sm:w-auto bg-stone-900 hover:bg-stone-800 text-amber-300 border-2 border-amber-400/50 hover:border-amber-400 font-bold px-4 py-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-all active:scale-95"
                            >
                              <Upload className="w-4 h-4" />
                              Subir Foto desde Celular o PC
                            </button>
                            <span className="text-[11px] text-stone-500">o ingresa el enlace directo abajo:</span>
                          </div>

                          {/* URL input */}
                          <input
                            type="url"
                            placeholder="https://ejemplo.com/mi-foto-portada.jpg"
                            value={editingHero.customImageUrl || ''}
                            onChange={(e) => setEditingHero(prev => ({ ...prev, customImageUrl: e.target.value || undefined }))}
                            className="w-full bg-stone-900 border border-stone-700 rounded-xl p-2.5 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-400"
                          />

                          {/* Modo de Adaptación al Marco */}
                          <div className="pt-2 border-t border-stone-800/80">
                            <label className="block text-[11px] font-bold text-stone-300 mb-2">
                              Formato y Ajuste de la Foto al Marco:
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                              <button
                                type="button"
                                onClick={() => setEditingHero(prev => ({ ...prev, heroImageFit: 'contain' }))}
                                className={`p-2.5 rounded-xl border text-left transition-all ${
                                  (editingHero.heroImageFit || 'contain') === 'contain'
                                    ? 'bg-amber-400/20 border-amber-400 text-amber-300 font-bold shadow-sm'
                                    : 'bg-stone-900 border-stone-700 text-stone-400 hover:text-white'
                                }`}
                              >
                                <span className="block text-xs font-black">Ajustar Completa (Recomendado)</span>
                                <span className="block text-[10px] text-stone-400">Sin recortes, la gorra se ve al 100%</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingHero(prev => ({ ...prev, heroImageFit: 'cover' }))}
                                className={`p-2.5 rounded-xl border text-left transition-all ${
                                  editingHero.heroImageFit === 'cover'
                                    ? 'bg-amber-400/20 border-amber-400 text-amber-300 font-bold shadow-sm'
                                    : 'bg-stone-900 border-stone-700 text-stone-400 hover:text-white'
                                }`}
                              >
                                <span className="block text-xs font-black">Llenar Marco (Banner)</span>
                                <span className="block text-[10px] text-stone-400">Expande de borde a borde</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 3. TEXTOS Y AVISOS DE LA PORTADA */}
                      <div className="bg-stone-950 p-4 sm:p-5 rounded-2xl border-2 border-stone-800 space-y-4">
                        <label className="text-xs font-black uppercase text-amber-400 tracking-wider flex items-center gap-1.5">
                          <FileText className="w-4 h-4" />
                          3. Textos, Titulares y WhatsApp Oficial:
                        </label>

                        <div className="space-y-3">
                          {/* Top announcement bar */}
                          <div>
                            <label className="block text-[11px] font-bold text-stone-400 mb-1">
                              Barra Superior de Aviso (Toda la tienda):
                            </label>
                            <input
                              type="text"
                              value={editingHero.announcementBarText}
                              onChange={(e) => setEditingHero(prev => ({ ...prev, announcementBarText: e.target.value }))}
                              className="w-full bg-stone-900 border border-stone-700 rounded-xl p-2.5 text-xs text-white font-medium focus:border-amber-400 focus:outline-none"
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[11px] font-bold text-stone-400 mb-1">
                                Etiqueta Superior 1 (Badge Rojo):
                              </label>
                              <input
                                type="text"
                                value={editingHero.badgeText}
                                onChange={(e) => setEditingHero(prev => ({ ...prev, badgeText: e.target.value }))}
                                className="w-full bg-stone-900 border border-stone-700 rounded-xl p-2.5 text-xs text-white font-medium focus:border-amber-400 focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-stone-400 mb-1">
                                Etiqueta Superior 2 (Badge Verde):
                              </label>
                              <input
                                type="text"
                                value={editingHero.badgeSubtext}
                                onChange={(e) => setEditingHero(prev => ({ ...prev, badgeSubtext: e.target.value }))}
                                className="w-full bg-stone-900 border border-stone-700 rounded-xl p-2.5 text-xs text-white font-medium focus:border-amber-400 focus:outline-none"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-stone-400 mb-1">
                              Título Principal (Línea 1 en blanco):
                            </label>
                            <input
                              type="text"
                              value={editingHero.titleLine1}
                              onChange={(e) => setEditingHero(prev => ({ ...prev, titleLine1: e.target.value }))}
                              className="w-full bg-stone-900 border border-stone-700 rounded-xl p-2.5 text-xs text-white font-bold focus:border-amber-400 focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-stone-400 mb-1">
                              Título Resaltado (En degradado llamativo):
                            </label>
                            <input
                              type="text"
                              value={editingHero.titleHighlight}
                              onChange={(e) => setEditingHero(prev => ({ ...prev, titleHighlight: e.target.value }))}
                              className="w-full bg-stone-900 border border-stone-700 rounded-xl p-2.5 text-xs text-amber-300 font-bold focus:border-amber-400 focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-stone-400 mb-1">
                              Descripción / Párrafo Persuasivo:
                            </label>
                            <textarea
                              rows={3}
                              value={editingHero.description}
                              onChange={(e) => setEditingHero(prev => ({ ...prev, description: e.target.value }))}
                              className="w-full bg-stone-900 border border-stone-700 rounded-xl p-2.5 text-xs text-stone-300 focus:border-amber-400 focus:outline-none"
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[11px] font-bold text-stone-400 mb-1">
                                Texto del Botón (Llamado a la acción):
                              </label>
                              <input
                                type="text"
                                value={editingHero.ctaButtonText}
                                onChange={(e) => setEditingHero(prev => ({ ...prev, ctaButtonText: e.target.value }))}
                                className="w-full bg-stone-900 border border-stone-700 rounded-xl p-2.5 text-xs text-white font-medium focus:border-amber-400 focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-stone-400 mb-1">
                                WhatsApp Oficial para Pedidos:
                              </label>
                              <input
                                type="text"
                                placeholder="+502 5555-0199"
                                value={editingHero.whatsappNumber}
                                onChange={(e) => setEditingHero(prev => ({ ...prev, whatsappNumber: e.target.value }))}
                                className="w-full bg-stone-900 border border-stone-700 rounded-xl p-2.5 text-xs text-emerald-400 font-bold focus:border-amber-400 focus:outline-none"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-stone-400 mb-1">
                              Etiqueta Flotante sobre la Foto de la Gorra:
                            </label>
                            <input
                              type="text"
                              value={editingHero.bannerBadgeText}
                              onChange={(e) => setEditingHero(prev => ({ ...prev, bannerBadgeText: e.target.value }))}
                              className="w-full bg-stone-900 border border-stone-700 rounded-xl p-2.5 text-xs text-white font-medium focus:border-amber-400 focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>

                      {/* BOTÓN GUARDAR FINAL */}
                      <div className="pt-2">
                        <button
                          type="submit"
                          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 border-2 border-emerald-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all uppercase tracking-wider"
                        >
                          <Save className="w-5 h-5" />
                          Guardar y Publicar Portada
                        </button>
                      </div>

                    </div>

                    {/* RIGHT COLUMN: LIVE PREVIEW OF HERO */}
                    <div className="lg:col-span-5 space-y-4">
                      <div className="sticky top-4 bg-stone-950 p-4 sm:p-5 rounded-2xl border-2 border-amber-400/80 space-y-4 shadow-xl">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black uppercase text-amber-400 tracking-wider flex items-center gap-1.5">
                            <Eye className="w-4 h-4" />
                            Vista Previa en Vivo:
                          </span>
                          <span className="text-[10px] bg-amber-400 text-stone-950 px-2 py-0.5 rounded font-black">
                            EN VIVO
                          </span>
                        </div>

                        {/* SIMULACIÓN DE LA PORTADA EN VIVO */}
                        {(() => {
                          const previewProd = products.find(p => p.id === editingHero.featuredProductId) || products[0];
                          return (
                            <div className="bg-stone-900 border-2 border-stone-700 rounded-xl p-4 space-y-3">
                              {/* Badges */}
                              <div className="flex flex-wrap gap-1.5">
                                <span className="bg-red-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full">
                                  {editingHero.badgeText}
                                </span>
                                <span className="bg-emerald-700 text-amber-200 text-[9px] font-bold px-2 py-0.5 rounded-full">
                                  {editingHero.badgeSubtext}
                                </span>
                              </div>

                              {/* Titles */}
                              <div className="space-y-0.5">
                                <h4 className="text-sm font-black text-white leading-tight">
                                  {editingHero.titleLine1}
                                </h4>
                                <h4 className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-amber-400 to-emerald-400 leading-tight">
                                  {editingHero.titleHighlight}
                                </h4>
                              </div>

                              <p className="text-[11px] text-stone-300 line-clamp-3 leading-relaxed">
                                {editingHero.description}
                              </p>

                              {/* Hero Showcase Card Preview */}
                              <div className="bg-stone-950 border-2 border-amber-400 rounded-xl p-3 relative overflow-hidden text-center mt-3">
                                <div className="absolute top-2 right-2 bg-red-600 text-white text-[8px] font-black px-2 py-0.5 rounded-full rotate-6 border border-white">
                                  {editingHero.bannerBadgeText}
                                </div>

                                <div className="mb-2">
                                  {editingHero.customImageUrl ? (
                                    <div className="w-full h-36 rounded-lg overflow-hidden bg-stone-900 border border-stone-700 flex items-center justify-center relative">
                                      {/* Ambient backdrop */}
                                      <img 
                                        src={editingHero.customImageUrl} 
                                        alt="" 
                                        aria-hidden="true"
                                        className="absolute inset-0 w-full h-full object-cover blur-lg opacity-30 scale-125 pointer-events-none"
                                      />
                                      <img 
                                        src={editingHero.customImageUrl} 
                                        alt="Gorra Portada" 
                                        className={`relative z-10 w-full h-full ${editingHero.heroImageFit === 'cover' ? 'object-cover' : 'object-contain p-2'} drop-shadow-md`}
                                        referrerPolicy="no-referrer"
                                      />
                                    </div>
                                  ) : (
                                    <CapVisualInteractive
                                      type={previewProd?.svgType}
                                      paletteKey={previewProd?.colors[0]?.paletteKey}
                                      viewAngle="front"
                                      imageUrl={previewProd?.imageUrl}
                                      size="small"
                                    />
                                  )}
                                </div>

                                <div className="text-left space-y-1">
                                  <div className="flex justify-between items-center">
                                    <span className="text-xs font-black text-white truncate max-w-[140px]">{previewProd?.name}</span>
                                    <span className="text-sm font-black text-amber-400">Q{previewProd?.price}.00</span>
                                  </div>
                                  <p className="text-[10px] text-stone-400 truncate">{previewProd?.style}</p>
                                </div>
                              </div>

                            </div>
                          );
                        })()}

                      </div>
                    </div>

                  </div>

                </form>
              )}

              {/* TAB 2: FINANCIAL OVERVIEW / INVERSION VS VENTAS */}
              {activeTab === 'dashboard' && (
                <div className="space-y-6">
                  {/* Top Stats Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    
                    {/* Inversión en Inventario Actual */}
                    <div className="bg-stone-950 p-4 rounded-xl border-2 border-stone-800 shadow-md space-y-2">
                      <div className="flex justify-between items-center text-stone-400">
                        <span className="text-xs font-bold uppercase tracking-wider">Inversión en Stock</span>
                        <div className="w-8 h-8 rounded-lg bg-amber-400/10 text-amber-400 flex items-center justify-center">
                          <Package className="w-4 h-4" />
                        </div>
                      </div>
                      <p className="text-2xl sm:text-3xl font-black text-amber-400">
                        Q{currentInventoryInvestment.toFixed(2)}
                      </p>
                      <p className="text-[11px] text-stone-400 font-medium">
                        Costo de {totalStockUnits} gorras disponibles
                      </p>
                    </div>

                    {/* Ventas Totales Registradas */}
                    <div className="bg-stone-950 p-4 rounded-xl border-2 border-stone-800 shadow-md space-y-2">
                      <div className="flex justify-between items-center text-stone-400">
                        <span className="text-xs font-bold uppercase tracking-wider">Ventas Cobradas</span>
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                          <DollarSign className="w-4 h-4" />
                        </div>
                      </div>
                      <p className="text-2xl sm:text-3xl font-black text-emerald-400">
                        Q{totalSalesRevenue.toFixed(2)}
                      </p>
                      <p className="text-[11px] text-emerald-400 font-bold">
                        {totalUnitsSold} unidades vendidas
                      </p>
                    </div>

                    {/* Ganancia / Utilidad Neta */}
                    <div className="bg-stone-950 p-4 rounded-xl border-2 border-stone-800 shadow-md space-y-2">
                      <div className="flex justify-between items-center text-stone-400">
                        <span className="text-xs font-bold uppercase tracking-wider">Utilidad Neta</span>
                        <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center">
                          <TrendingUp className="w-4 h-4" />
                        </div>
                      </div>
                      <p className="text-2xl sm:text-3xl font-black text-white">
                        Q{totalProfit.toFixed(2)}
                      </p>
                      <p className="text-[11px] text-amber-400 font-bold">
                        Margen Bruto: {profitMargin.toFixed(1)}%
                      </p>
                    </div>

                    {/* Inversión Total Histórica */}
                    <div className="bg-stone-950 p-4 rounded-xl border-2 border-stone-800 shadow-md space-y-2">
                      <div className="flex justify-between items-center text-stone-400">
                        <span className="text-xs font-bold uppercase tracking-wider">Inversión Histórica</span>
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                          <BarChart3 className="w-4 h-4" />
                        </div>
                      </div>
                      <p className="text-2xl sm:text-3xl font-black text-stone-200">
                        Q{totalHistoricalInvestment.toFixed(2)}
                      </p>
                      <p className="text-[11px] text-stone-400 font-medium">
                        Producción + compras totales
                      </p>
                    </div>
                  </div>

                  {/* Profit vs Investment Comparison Bar */}
                  <div className="bg-stone-950 p-5 rounded-xl border-2 border-stone-800 space-y-4">
                    <h4 className="text-sm font-black text-stone-200 uppercase tracking-wider flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-amber-400" />
                      Balance Financiero: Retorno de Inversión (ROI)
                    </h4>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-stone-400">Recuperación vs Inversión en Catálogo:</span>
                        <span className="text-amber-400 font-black">
                          {totalHistoricalInvestment > 0 ? ((totalSalesRevenue / totalHistoricalInvestment) * 100).toFixed(1) : 0}% recuperado
                        </span>
                      </div>
                      <div className="w-full bg-stone-800 h-3 rounded-full overflow-hidden flex border border-stone-700">
                        <div 
                          className="bg-emerald-500 h-full transition-all duration-500"
                          style={{ width: `${Math.min(100, totalHistoricalInvestment > 0 ? (totalSalesRevenue / totalHistoricalInvestment) * 100 : 0)}%` }}
                          title="Ventas Totales"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                      <div className="bg-stone-900 p-3 rounded-lg border border-stone-800">
                        <span className="text-stone-400 block text-[10px]">COSTO DE MERCADERÍA VENDIDA:</span>
                        <span className="text-base font-black text-red-400">Q{totalCostOfSales.toFixed(2)}</span>
                      </div>
                      <div className="bg-stone-900 p-3 rounded-lg border border-stone-800">
                        <span className="text-stone-400 block text-[10px]">INGRESOS BRUTOS:</span>
                        <span className="text-base font-black text-emerald-400">Q{totalSalesRevenue.toFixed(2)}</span>
                      </div>
                      <div className="bg-stone-900 p-3 rounded-lg border border-stone-800">
                        <span className="text-stone-400 block text-[10px]">GANANCIA LIMPIA:</span>
                        <span className="text-base font-black text-amber-400">Q{totalProfit.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Product Performance Table */}
                  <div className="bg-stone-950 p-5 rounded-xl border-2 border-stone-800 space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <h4 className="text-sm font-black text-stone-200 uppercase tracking-wider flex items-center gap-2">
                        <Layers className="w-4 h-4 text-red-500" />
                        Desempeño e Inversión por Modelo de Gorra
                      </h4>
                      <button
                        onClick={() => setActiveTab('products')}
                        className="text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors"
                      >
                        Editar catálogo completo →
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-stone-900 text-stone-400 font-black uppercase text-[10px] border-b border-stone-800">
                          <tr>
                            <th className="p-3">Gorra / Modelo</th>
                            <th className="p-3">Precio Venta</th>
                            <th className="p-3">Costo (Inversión)</th>
                            <th className="p-3">Ganancia / Unidad</th>
                            <th className="p-3">Stock Activo</th>
                            <th className="p-3">Vendidas</th>
                            <th className="p-3">Inversión en Bodega</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-800 font-medium text-stone-300">
                          {products.map(p => {
                            const unitProfit = p.price - (p.costPrice || 0);
                            const stockInv = p.stock * (p.costPrice || 0);
                            return (
                              <tr key={p.id} className="hover:bg-stone-900/60 transition-colors">
                                <td className="p-3 font-bold text-white flex items-center gap-2">
                                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                                  {p.name}
                                </td>
                                <td className="p-3 font-black text-emerald-400">Q{p.price.toFixed(2)}</td>
                                <td className="p-3 text-red-400">Q{(p.costPrice || 0).toFixed(2)}</td>
                                <td className="p-3 text-amber-400 font-bold">+Q{unitProfit.toFixed(2)}</td>
                                <td className="p-3">
                                  <span className={`px-2 py-0.5 rounded font-black ${p.stock <= 5 ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-stone-800 text-stone-200'}`}>
                                    {p.stock} unidades
                                  </span>
                                </td>
                                <td className="p-3 font-bold text-stone-100">{p.salesCount || 0}</td>
                                <td className="p-3 font-black text-stone-300">Q{stockInv.toFixed(2)}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: SALES HISTORY & RECORDS */}
              {activeTab === 'sales' && (
                <div className="bg-stone-950 p-5 rounded-xl border-2 border-stone-800 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-black text-stone-200 uppercase tracking-wider flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4 text-emerald-400" />
                      Historial Detallado de Ventas Registradas
                    </h4>
                    <span className="text-xs text-stone-400 font-bold">
                      Total Ventas: <strong className="text-emerald-400 font-black">Q{totalSalesRevenue.toFixed(2)}</strong>
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-stone-900 text-stone-400 font-black uppercase text-[10px] border-b border-stone-800">
                        <tr>
                          <th className="p-3">ID Pedido / Fecha</th>
                          <th className="p-3">Cliente</th>
                          <th className="p-3">Departamento GT</th>
                          <th className="p-3">Artículos</th>
                          <th className="p-3">Total Venta</th>
                          <th className="p-3">Costo Inversión</th>
                          <th className="p-3">Ganancia Neta</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-800 font-medium text-stone-300">
                        {salesRecords.map(sale => (
                          <tr key={sale.id} className="hover:bg-stone-900/60 transition-colors">
                            <td className="p-3 font-mono">
                              <span className="font-bold text-amber-400 block">{sale.id}</span>
                              <span className="text-[10px] text-stone-500">{sale.date}</span>
                            </td>
                            <td className="p-3 font-bold text-white">{sale.customerName}</td>
                            <td className="p-3 text-stone-300">{sale.department}</td>
                            <td className="p-3 text-[11px] text-stone-300">
                              {sale.items.map((it, idx) => (
                                <div key={idx}>
                                  {it.quantity}x {it.productName}
                                </div>
                              ))}
                            </td>
                            <td className="p-3 font-black text-emerald-400">Q{sale.totalAmount.toFixed(2)}</td>
                            <td className="p-3 text-red-400 font-bold">Q{sale.totalCost.toFixed(2)}</td>
                            <td className="p-3 font-black text-white bg-emerald-950/30">
                              +Q{sale.profit.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
