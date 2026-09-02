export type CapAngle = 'front' | 'side' | 'back' | 'undervisor' | 'detail' | 'box';

export interface CapColor {
  name: string;
  paletteKey: string;
  hexCrown?: string;
  hexVisor?: string;
  hexAccent?: string;
}

export interface ProductReview {
  id: string;
  author: string;
  location: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
  model: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  style: string;
  price: number;
  originalPrice: number;
  costPrice: number; // Costo unitario de inversión
  badge: string;
  badgeColor: string;
  rating: number;
  reviewsCount: number;
  colors: CapColor[];
  description: string;
  features: string[];
  fabric: string;
  fit: string;
  profile: 'Corona Alta' | 'Perfil Medio' | 'Desestructurada / Relajada' | '5-Panel Camper';
  stock: number;
  salesCount: number; // Cantidad vendida
  warehouse: string;
  svgType: string;
  imageUrl?: string;
  sideImageUrl?: string;
  backImageUrl?: string;
  undervisorImageUrl?: string;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
}

export interface CartItem extends Product {
  cartItemId: string;
  quantity: number;
  selectedColor: string;
  selectedPaletteKey: string;
  customPatchText?: string;
}

export interface SaleRecord {
  id: string;
  date: string;
  customerName: string;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    salePrice: number;
    costPrice: number;
  }[];
  totalAmount: number;
  totalCost: number;
  profit: number;
  department: string;
  paymentMethod: string;
}

export interface DepartmentDeliveryInfo {
  departamento: string;
  tiempo: string;
  costo: number;
  courier: string;
}

export interface FAQItem {
  question: string;
  answer: string;
  category: 'envios' | 'pagos' | 'calidad' | 'cambios';
}

export interface OrderFormData {
  nombre: string;
  telefono: string;
  departamento: string;
  direccion: string;
  notas: string;
  metodoPago: 'contra-entrega' | 'transferencia';
  referenciaTransferencia?: string;
}

export interface HeroConfig {
  badgeText: string;
  badgeSubtext: string;
  titleLine1: string;
  titleHighlight: string;
  description: string;
  featuredProductId: string;
  customImageUrl?: string;
  bannerBadgeText: string;
  ctaButtonText: string;
  announcementBarText: string;
  whatsappNumber: string;
  heroImageFit?: 'contain' | 'cover';
}



