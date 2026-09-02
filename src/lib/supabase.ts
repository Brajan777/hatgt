import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Product, HeroConfig, SaleRecord } from '../types';

const DEFAULT_SUPABASE_URL = 'https://ximjvptxjqrcdmupvskn.supabase.co';
const DEFAULT_SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpbWp2cHR4anFyY2RtdXB2c2tuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgzMTU4MTIsImV4cCI6MjEwMzg5MTgxMn0.kS2eWbljqz533lT9N-IpiRhEyOHxKyAadSrqzGKDTP8';

// Obtiene credenciales de Vite ENV, localStorage o valores configurados
export const getSupabaseCredentials = () => {
  const metaEnv = (import.meta as any).env || {};
  const envUrl = (metaEnv.VITE_SUPABASE_URL || '').trim();
  const envKey = (metaEnv.VITE_SUPABASE_ANON_KEY || '').trim();
  const localUrl = (localStorage.getItem('hatgt_supabase_url') || '').trim();
  const localKey = (localStorage.getItem('hatgt_supabase_key') || '').trim();

  return {
    url: envUrl || localUrl || DEFAULT_SUPABASE_URL,
    key: envKey || localKey || DEFAULT_SUPABASE_KEY,
    source: envUrl ? 'env' : localUrl ? 'local' : 'configured'
  };
};

let supabaseInstance: SupabaseClient | null = null;
let lastUsedUrl = '';
let lastUsedKey = '';

export const getSupabaseClient = (): SupabaseClient | null => {
  const { url, key } = getSupabaseCredentials();
  if (!url || !key) return null;

  if (!supabaseInstance || lastUsedUrl !== url || lastUsedKey !== key) {
    try {
      supabaseInstance = createClient(url, key);
      lastUsedUrl = url;
      lastUsedKey = key;
    } catch (err) {
      console.error('Error al inicializar Supabase:', err);
      return null;
    }
  }
  return supabaseInstance;
};

export const saveSupabaseCredentials = (url: string, key: string) => {
  localStorage.setItem('hatgt_supabase_url', url.trim());
  localStorage.setItem('hatgt_supabase_key', key.trim());
  supabaseInstance = null;
};

export const clearSupabaseCredentials = () => {
  localStorage.removeItem('hatgt_supabase_url');
  localStorage.removeItem('hatgt_supabase_key');
  supabaseInstance = null;
};

// Conversión de BD (snake_case) a App (camelCase)
const mapRowToProduct = (r: any): Product => ({
  id: r.id,
  name: r.name,
  category: r.category,
  style: r.style,
  price: Number(r.price),
  originalPrice: Number(r.original_price || r.price),
  costPrice: Number(r.cost_price || 0),
  badge: r.badge || '',
  badgeColor: r.badge_color || 'bg-red-600',
  rating: Number(r.rating || 4.9),
  reviewsCount: Number(r.reviews_count || 0),
  colors: Array.isArray(r.colors) ? r.colors : [],
  description: r.description || '',
  features: Array.isArray(r.features) ? r.features : [],
  fabric: r.fabric || '',
  fit: r.fit || '',
  profile: r.profile || 'Perfil Medio',
  stock: Number(r.stock ?? 10),
  salesCount: Number(r.sales_count ?? 0),
  warehouse: r.warehouse || 'Bodega Central Zona 12, Ciudad de Guatemala',
  svgType: r.svg_type || 'quetzal',
  imageUrl: r.image_url || undefined,
  sideImageUrl: r.side_image_url || undefined,
  backImageUrl: r.back_image_url || undefined,
  undervisorImageUrl: r.undervisor_image_url || undefined,
  isBestSeller: Boolean(r.is_best_seller),
  isNewArrival: Boolean(r.is_new_arrival)
});

const mapProductToRow = (p: Product) => ({
  id: p.id,
  name: p.name,
  category: p.category,
  style: p.style,
  price: p.price,
  original_price: p.originalPrice,
  cost_price: p.costPrice,
  badge: p.badge,
  badge_color: p.badgeColor,
  rating: p.rating,
  reviews_count: p.reviewsCount,
  colors: p.colors,
  description: p.description,
  features: p.features,
  fabric: p.fabric,
  fit: p.fit,
  profile: p.profile,
  stock: p.stock,
  sales_count: p.salesCount,
  warehouse: p.warehouse,
  svg_type: p.svgType,
  image_url: p.imageUrl || null,
  side_image_url: p.sideImageUrl || null,
  back_image_url: p.backImageUrl || null,
  undervisor_image_url: p.undervisorImageUrl || null,
  is_best_seller: p.isBestSeller || false,
  is_new_arrival: p.isNewArrival || false,
  updated_at: new Date().toISOString()
});

// --- OPERACIONES DE PRODUCTOS ---
export const fetchProductsFromCloud = async (): Promise<Product[] | null> => {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from('hatgt_products')
      .select('*')
      .order('created_at', { ascending: true });

    if (error || !data) {
      console.warn('Supabase fetchProducts error:', error?.message);
      return null;
    }
    return data.map(mapRowToProduct);
  } catch (err) {
    console.warn('Error conectando con Supabase para productos:', err);
    return null;
  }
};

export const syncProductToCloud = async (product: Product): Promise<boolean> => {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const row = mapProductToRow(product);
    const { error } = await client
      .from('hatgt_products')
      .upsert(row, { onConflict: 'id' });

    if (error) {
      console.error('Error guardando producto en Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Error en syncProductToCloud:', err);
    return false;
  }
};

export const deleteProductFromCloud = async (productId: string): Promise<boolean> => {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const { error } = await client
      .from('hatgt_products')
      .delete()
      .eq('id', productId);

    return !error;
  } catch (err) {
    console.error('Error eliminando producto en Supabase:', err);
    return false;
  }
};

// --- OPERACIONES DE PORTADA (HERO) ---
export const fetchHeroConfigFromCloud = async (): Promise<HeroConfig | null> => {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from('hatgt_hero_config')
      .select('config')
      .eq('id', 'main_hero')
      .single();

    if (error || !data?.config) return null;
    return data.config as HeroConfig;
  } catch (err) {
    console.warn('Error leyendo portada de Supabase:', err);
    return null;
  }
};

export const syncHeroConfigToCloud = async (config: HeroConfig): Promise<boolean> => {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const { error } = await client
      .from('hatgt_hero_config')
      .upsert({
        id: 'main_hero',
        config,
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' });

    return !error;
  } catch (err) {
    console.error('Error guardando portada en Supabase:', err);
    return false;
  }
};

// --- OPERACIONES DE VENTAS ---
export const fetchSalesFromCloud = async (): Promise<SaleRecord[] | null> => {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from('hatgt_sales_records')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) return null;

    return data.map((r: any) => ({
      id: r.id,
      date: r.date,
      customerName: r.customer_name,
      items: Array.isArray(r.items) ? r.items : [],
      totalAmount: Number(r.total_amount),
      totalCost: Number(r.total_cost || 0),
      profit: Number(r.profit || 0),
      department: r.department,
      paymentMethod: r.payment_method
    }));
  } catch (err) {
    console.warn('Error leyendo ventas de Supabase:', err);
    return null;
  }
};

export const syncSaleToCloud = async (sale: SaleRecord): Promise<boolean> => {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const { error } = await client
      .from('hatgt_sales_records')
      .insert({
        id: sale.id,
        date: sale.date,
        customer_name: sale.customerName,
        items: sale.items,
        total_amount: sale.totalAmount,
        total_cost: sale.totalCost,
        profit: sale.profit,
        department: sale.department,
        payment_method: sale.paymentMethod
      });

    return !error;
  } catch (err) {
    console.error('Error guardando venta en Supabase:', err);
    return false;
  }
};

// --- POBLADO INICIAL (SEED) ---
export const seedDatabaseIfEmpty = async (
  defaultProducts: Product[],
  defaultHero: HeroConfig
): Promise<boolean> => {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    // Comprobar si ya existen productos
    const { count, error } = await client
      .from('hatgt_products')
      .select('id', { count: 'exact', head: true });

    if (error) return false;

    // Si la tabla está vacía, subimos las gorras iniciales
    if ((count || 0) === 0) {
      const rows = defaultProducts.map(mapProductToRow);
      await client.from('hatgt_products').insert(rows);
      await client.from('hatgt_hero_config').upsert({
        id: 'main_hero',
        config: defaultHero
      });
      return true;
    }
    return false;
  } catch (err) {
    console.warn('Error en seedDatabaseIfEmpty:', err);
    return false;
  }
};
