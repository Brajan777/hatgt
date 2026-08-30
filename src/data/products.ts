import { Product, ProductReview, DepartmentDeliveryInfo, FAQItem, SaleRecord } from '../types';

export const PRODUCTS: Product[] = [
  {
    id: 'gt-01',
    name: 'Quetzal Vintage 80s Snapback',
    category: 'Ediciones Especiales GT',
    style: 'Snapback Clásico',
    price: 175,
    originalPrice: 220,
    costPrice: 75,
    badge: '🔥 MÁS VENDIDA',
    badgeColor: 'bg-red-600 text-white',
    rating: 4.9,
    reviewsCount: 142,
    colors: [
      { name: 'Verde Selva / Visera Ocre', paletteKey: 'green-gold', hexCrown: '#166534', hexVisor: '#D97706' },
      { name: 'Rojo Carmesí / Negro', paletteKey: 'roots', hexCrown: '#991B1B', hexVisor: '#166534' },
      { name: 'Negro Clásico / Dorado', paletteKey: 'classic-dark', hexCrown: '#18181B', hexVisor: '#D97706' }
    ],
    description: 'Bordado frontal en relieve de alta definición inspirado en el Quetzal con la vibra urbana retro de 1984. Estructura rígida de 6 paneles que no pierde la forma.',
    features: [
      '100% Algodón Peinado Pesado Premium (280g)',
      'Bordado con hilo metalizado dorado y verde',
      'Cierre retro snapback ajustable de 7 puntos',
      'Banda interna absorbente antihumedad Pro-Dry',
      'Bajo-visera verde botella clásico anti-reflejos'
    ],
    fabric: 'Algodón peinado y sarga reforzada de 280g',
    fit: 'Estructurada / Corona Alta Vintage',
    profile: 'Corona Alta',
    stock: 7,
    salesCount: 64,
    warehouse: 'Bodega Central Zona 12, Ciudad de Guatemala',
    svgType: 'quetzal',
    isBestSeller: true
  },
  {
    id: 'gt-02',
    name: 'Atitlán Sunset Corduroy Cap',
    category: 'Vintage Dad Caps',
    style: 'Dad Cap Pana / Corduroy',
    price: 160,
    originalPrice: 195,
    costPrice: 65,
    badge: '⚡ EDICIÓN LIMITADA',
    badgeColor: 'bg-amber-500 text-slate-900',
    rating: 4.8,
    reviewsCount: 98,
    colors: [
      { name: 'Mostaza Ocre / Visera Verde Pino', paletteKey: 'yellow-red', hexCrown: '#B45309', hexVisor: '#15803D' },
      { name: 'Rojo Terracota Lavado', paletteKey: 'volcano', hexCrown: '#B91C1C', hexVisor: '#78350F' },
      { name: 'Verde Bosque Nebuloso', paletteKey: 'heritage', hexCrown: '#14532D', hexVisor: '#991B1B' }
    ],
    description: 'Pana fina extra suave de 14 canales. Diseño relajado de perfil medio-bajo con hebilla metálica vintage grabada en bronce envejecido.',
    features: [
      'Pana acanalada suave de 14 canales de alta durabilidad',
      'Hebilla de latón macizo con pasador oculto',
      'Visera pre-curvada moldeable a tu estilo',
      'Lavado especial que aporta tonalidad desgastada 70s'
    ],
    fabric: '100% Pana Fina de Algodón Premium',
    fit: 'Desestructurada / Perfil Medio Confort',
    profile: 'Desestructurada / Relajada',
    stock: 4,
    salesCount: 42,
    warehouse: 'Enviado desde Quetzaltenango / Xela',
    svgType: 'sunset',
    isNewArrival: true
  },
  {
    id: 'gt-03',
    name: 'Ruta 502 Retro Trucker',
    category: 'Trucker 70s',
    style: 'Malla Clásica Trucker',
    price: 145,
    originalPrice: 180,
    costPrice: 55,
    badge: '🇬🇹 ORGULLO CHAPÍN',
    badgeColor: 'bg-emerald-600 text-white',
    rating: 5.0,
    reviewsCount: 210,
    colors: [
      { name: 'Blanco Crema / Malla Verde Bosque', paletteKey: 'tricolor', hexCrown: '#F5F5F4', hexVisor: '#166534' },
      { name: 'Negro Noche / Rojo Fuego', paletteKey: 'roots', hexCrown: '#991B1B', hexVisor: '#166534' },
      { name: 'Amarillo Tráfico / Azul Marino', paletteKey: 'yellow-red', hexCrown: '#B45309', hexVisor: '#15803D' }
    ],
    description: 'Parche frontal estilo estación de gasolina retro con las rutas emblemáticas de Guate. Malla reforzada para flujo de aire máximo en climas cálidos.',
    features: [
      'Malla de poliamida indeformable ultra transpirable',
      'Parche frontal termosellado con costura perimetral en hilo rojo',
      'Talla universal con broche doble punto',
      'Visera de poliuretano flexible de alta resistencia'
    ],
    fabric: 'Poliéster Espumado Frontal + Malla Nylon Balística',
    fit: 'Trucker Clásica Curva',
    profile: 'Perfil Medio',
    stock: 12,
    salesCount: 88,
    warehouse: 'Bodega Central Zona 12, Ciudad de Guatemala',
    svgType: 'trucker',
    isBestSeller: true
  },
  {
    id: 'gt-04',
    name: 'Antigua Gold Heritage 5-Panel',
    category: 'Gorras Planas Urbanas',
    style: 'Camper 5-Panel Urbana',
    price: 185,
    originalPrice: 230,
    costPrice: 80,
    badge: '👑 PREMIUM LINE',
    badgeColor: 'bg-red-700 text-amber-200',
    rating: 4.9,
    reviewsCount: 76,
    colors: [
      { name: 'Verde Militar / Cinta Amarilla', paletteKey: 'heritage', hexCrown: '#14532D', hexVisor: '#991B1B' },
      { name: 'Rojo Borgoña Colonial', paletteKey: 'volcano', hexCrown: '#B91C1C', hexVisor: '#78350F' },
      { name: 'Gris Grafito / Acento Esmeralda', paletteKey: 'classic-dark', hexCrown: '#18181B', hexVisor: '#D97706' }
    ],
    description: 'Silueta camper 5-panel preferida por ciclistas, fotógrafos y exploradores urbanos. Incluye ojales metálicos con acabado en oro viejo.',
    features: [
      'Cinta trasera de nylon balístico con broche click micrométrico',
      'Ojales de ventilación troquelados en latón envejecido',
      'Bolsillo interior oculto de seguridad',
      'Tratamiento repelente a llovizna ligera'
    ],
    fabric: 'Ripstop antidesgarro y lona encerada ligera',
    fit: '5-Panel Perfil Bajo Ajustado',
    profile: '5-Panel Camper',
    stock: 5,
    salesCount: 31,
    warehouse: 'Antigua Guatemala Hub',
    svgType: 'camper'
  },
  {
    id: 'gt-05',
    name: 'Tikal Roots 90s Street Snap',
    category: 'Snapbacks 90s',
    style: 'Corona Alta 90s',
    price: 190,
    originalPrice: 240,
    costPrice: 85,
    badge: '⭐ TOP COLECCIÓN',
    badgeColor: 'bg-amber-400 text-black',
    rating: 4.7,
    reviewsCount: 88,
    colors: [
      { name: 'Rojo Escarlata / Verde Esmeralda', paletteKey: 'roots', hexCrown: '#991B1B', hexVisor: '#166534' },
      { name: 'Verde Selva / Oro Solar', paletteKey: 'green-gold', hexCrown: '#166534', hexVisor: '#D97706' }
    ],
    description: 'Estructura rígida de los años 90 con visera recta ancha y contrastes de color vibrantes. El bajo-visera en tono vintage reduce el deslumbramiento.',
    features: [
      'Mezcla premium de lana y acrílico de alto calibre',
      'Bordado lateral exclusivo Hatgt Guatemala',
      'Bajo-visera retro en tono contrastado amarillo vintage',
      'Corona con entretela rígida de alto impacto'
    ],
    fabric: '80% Acrílico / 20% Lana Pesada de 320g',
    fit: 'Corona Alta Estructurada 6 Paneles',
    profile: 'Corona Alta',
    stock: 9,
    salesCount: 50,
    warehouse: 'Bodega Central Zona 12, Ciudad de Guatemala',
    svgType: 'roots',
    isNewArrival: true
  },
  {
    id: 'gt-06',
    name: 'Pacaya Burnout Washed Cap',
    category: 'Vintage Dad Caps',
    style: 'Desgastado Casual',
    price: 150,
    originalPrice: 185,
    costPrice: 60,
    badge: '🔥 DESCUENTO CHAPÍN',
    badgeColor: 'bg-red-500 text-white',
    rating: 4.8,
    reviewsCount: 115,
    colors: [
      { name: 'Rojo Lavado Volcánico', paletteKey: 'volcano', hexCrown: '#B91C1C', hexVisor: '#78350F' },
      { name: 'Verde Oliva Deslavado', paletteKey: 'green-gold', hexCrown: '#166534', hexVisor: '#D97706' },
      { name: 'Mostaza Tierra', paletteKey: 'yellow-red', hexCrown: '#B45309', hexVisor: '#15803D' }
    ],
    description: 'Lavado a la piedra con enzimas que le otorga un aspecto desgastado auténtico de los años 80, suave desde el primer uso y lista para la aventura.',
    features: [
      '100% Algodón Chino Washed de tacto aterciopelado',
      'Efecto deslavado único en cada pieza',
      'Cierre strapback con hebilla metálica Hatgt',
      'Costuras reforzadas a doble aguja'
    ],
    fabric: '100% Chino Twill Deslavado Enzimático',
    fit: 'Unstructured Relaxed Fit',
    profile: 'Desestructurada / Relajada',
    stock: 15,
    salesCount: 73,
    warehouse: 'Bodega Central Zona 12, Ciudad de Guatemala',
    svgType: 'pacaya'
  }
];

export const INITIAL_SALES_RECORDS: SaleRecord[] = [
  {
    id: 'VTA-1082',
    date: '2026-08-28 16:45',
    customerName: 'Carlos M. Velásquez',
    department: 'Guatemala (Capital)',
    paymentMethod: 'Contra Entrega Efectivo',
    items: [
      { productId: 'gt-01', productName: 'Quetzal Vintage 80s Snapback', quantity: 2, salePrice: 175, costPrice: 75 }
    ],
    totalAmount: 350,
    totalCost: 150,
    profit: 200
  },
  {
    id: 'VTA-1081',
    date: '2026-08-27 11:20',
    customerName: 'Manuel E. Sagastume',
    department: 'Quetzaltenango (Xela)',
    paymentMethod: 'Contra Entrega Cargo Expreso',
    items: [
      { productId: 'gt-03', productName: 'Ruta 502 Retro Trucker', quantity: 1, salePrice: 145, costPrice: 55 },
      { productId: 'gt-02', productName: 'Atitlán Sunset Corduroy Cap', quantity: 1, salePrice: 160, costPrice: 65 }
    ],
    totalAmount: 305,
    totalCost: 120,
    profit: 185
  },
  {
    id: 'VTA-1080',
    date: '2026-08-26 18:10',
    customerName: 'Bryan G. Fuentes',
    department: 'Sacatepéquez (Antigua)',
    paymentMethod: 'Transferencia BI',
    items: [
      { productId: 'gt-04', productName: 'Antigua Gold Heritage 5-Panel', quantity: 1, salePrice: 185, costPrice: 80 }
    ],
    totalAmount: 185,
    totalCost: 80,
    profit: 105
  },
  {
    id: 'VTA-1079',
    date: '2026-08-25 14:30',
    customerName: 'Kevin J. Monroy',
    department: 'Escuintla',
    paymentMethod: 'Contra Entrega Guatex',
    items: [
      { productId: 'gt-05', productName: 'Tikal Roots 90s Street Snap', quantity: 1, salePrice: 190, costPrice: 85 }
    ],
    totalAmount: 190,
    totalCost: 85,
    profit: 105
  },
  {
    id: 'VTA-1078',
    date: '2026-08-24 09:15',
    customerName: 'Andrea R. Morales',
    department: 'Guatemala (Mixco)',
    paymentMethod: 'Contra Entrega Efectivo',
    items: [
      { productId: 'gt-06', productName: 'Pacaya Burnout Washed Cap', quantity: 2, salePrice: 150, costPrice: 60 }
    ],
    totalAmount: 300,
    totalCost: 120,
    profit: 180
  }
];


export const REVIEWS_DATA: ProductReview[] = [
  {
    id: 'rev-1',
    author: 'Rodrigo M. Morales',
    location: 'Mixco, Guatemala',
    rating: 5,
    date: 'Hace 2 días',
    comment: 'La corona no se deforma para nada. El bordado del Quetzal en 3D se siente de lujo y el empaque rígido evitó que se aplastara en el camino.',
    verified: true,
    model: 'Quetzal Vintage 80s Snapback'
  },
  {
    id: 'rev-2',
    author: 'Fernando T. Castillo',
    location: 'Quetzaltenango (Xela)',
    rating: 5,
    date: 'Hace 4 días',
    comment: 'Me llegó en 48 horas exactas por Cargo Expreso. Le pagué al repartidor en efectivo. La tela de pana del Sunset Atitlán es súper cómoda.',
    verified: true,
    model: 'Atitlán Sunset Corduroy Cap'
  },
  {
    id: 'rev-3',
    author: 'Sofía Álvarez G.',
    location: 'Antigua Guatemala',
    rating: 5,
    date: 'Hace 1 semana',
    comment: 'Diseño 100% original. Me encanta la combinación de colores verde y ocre. Muy recomendados.',
    verified: true,
    model: 'Antigua Gold Heritage 5-Panel'
  },
  {
    id: 'rev-4',
    author: 'Carlos E. Sandoval',
    location: 'Cobán, Alta Verapaz',
    rating: 4,
    date: 'Hace 1 semana',
    comment: 'Excelente calidad de la malla en la Trucker Ruta 502, muy fresca para cuando voy a la costa.',
    verified: true,
    model: 'Ruta 502 Retro Trucker'
  },
  {
    id: 'rev-5',
    author: 'Mateo O. Barillas',
    location: 'Zona 10, Ciudad de Guatemala',
    rating: 5,
    date: 'Hace 2 semanas',
    comment: 'Compré 3 gorras con el cupón HATGT20. El envío fue gratis y vinieron en su caja de colección.',
    verified: true,
    model: 'Tikal Roots 90s Street Snap'
  }
];

export const DEPARTAMENTOS_GT: DepartmentDeliveryInfo[] = [
  { departamento: 'Guatemala (Capital, Mixco, Villa Nueva, S.C.N)', tiempo: '24 horas hábiles', costo: 30, courier: 'Mensajería Express Hatgt' },
  { departamento: 'Sacatepéquez (Antigua Guatemala, Ciudad Vieja)', tiempo: '24 a 48 horas', costo: 35, courier: 'Cargo Expreso / Guatex' },
  { departamento: 'Quetzaltenango (Xela, Salcajá, La Esperanza)', tiempo: '24 a 48 horas', costo: 35, courier: 'Cargo Expreso' },
  { departamento: 'Chimaltenango', tiempo: '24 a 48 horas', costo: 35, courier: 'Cargo Expreso' },
  { departamento: 'Escuintla', tiempo: '24 a 48 horas', costo: 35, courier: 'Guatex' },
  { departamento: 'Alta Verapaz (Cobán, San Pedro Carchá)', tiempo: '48 horas', costo: 40, courier: 'Cargo Expreso' },
  { departamento: 'Baja Verapaz (Salamá)', tiempo: '48 horas', costo: 40, courier: 'Cargo Expreso' },
  { departamento: 'Petén (Flores, San Benito, Santa Elena)', tiempo: '48 a 72 horas', costo: 45, courier: 'Guatex Aéreo / Terrestre' },
  { departamento: 'Izabal (Puerto Barrios, Morales)', tiempo: '48 horas', costo: 40, courier: 'Guatex' },
  { departamento: 'Zacapa', tiempo: '48 horas', costo: 35, courier: 'Cargo Expreso' },
  { departamento: 'Chiquimula', tiempo: '48 horas', costo: 35, courier: 'Cargo Expreso' },
  { departamento: 'Jalapa', tiempo: '48 horas', costo: 35, courier: 'Cargo Expreso' },
  { departamento: 'Jutiapa', tiempo: '48 horas', costo: 35, courier: 'Cargo Expreso' },
  { departamento: 'Santa Rosa', tiempo: '48 horas', costo: 35, courier: 'Cargo Expreso' },
  { departamento: 'Sololá (Panajachel, Atitlán)', tiempo: '24 a 48 horas', costo: 35, courier: 'Cargo Expreso' },
  { departamento: 'Totonicapán', tiempo: '48 horas', costo: 35, courier: 'Cargo Expreso' },
  { departamento: 'San Marcos', tiempo: '48 horas', costo: 40, courier: 'Cargo Expreso' },
  { departamento: 'Huehuetenango', tiempo: '48 horas', costo: 40, courier: 'Cargo Expreso' },
  { departamento: 'Quiché (Santa Cruz, Chichicastenango)', tiempo: '48 horas', costo: 40, courier: 'Cargo Expreso' },
  { departamento: 'Retalhuleu', tiempo: '48 horas', costo: 35, courier: 'Guatex' },
  { departamento: 'Suchitepéquez (Mazatenango)', tiempo: '48 horas', costo: 35, courier: 'Guatex' },
  { departamento: 'El Progreso (Guastatoya)', tiempo: '24 a 48 horas', costo: 35, courier: 'Cargo Expreso' }
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    category: 'pagos',
    question: '¿Cómo funciona el Pago Contra Entrega en Guatemala?',
    answer: 'Haces tu pedido por la web o WhatsApp sin pagar nada por adelantado. Nosotros empacamos tu gorra en caja rígida y te la enviamos. Cuando el repartidor toque a tu puerta o trabajo, le pagas el monto exacto en efectivo o transferencia bancaria.'
  },
  {
    category: 'envios',
    question: '¿Cuánto tarda en llegar mi pedido?',
    answer: 'Para el Departamento de Guatemala (Capital, Mixco, Villa Nueva, Carretera a El Salvador) entregamos en 24 horas hábiles. Para el resto de los 21 departamentos (Xela, Cobán, Petén, Oriente, Costa Sur) el tiempo de tránsito es de 24 a 48 horas vía Cargo Expreso o Guatex.'
  },
  {
    category: 'calidad',
    question: '¿Las gorras vienen en caja protegida?',
    answer: '¡Sí, 100%! Todas las órdenes se despachan dentro de nuestra exclusiva caja cúbica reforzada Hatgt anti-aplastamiento con cinta de seguridad, garantizando que la visera y la corona lleguen intactas.'
  },
  {
    category: 'cambios',
    question: '¿Tienen garantía o cambio si no me queda?',
    answer: 'Nuestras gorras cuentan con broches snapback de 7 puntos y hebillas ajustables para adaptarse a cabezas de 54 a 62 cm. Si necesitas cambio por defecto de fábrica, te lo cambiamos sin costo adicional en los primeros 7 días hábiles.'
  }
];

export const UPSELL_ACCESSORIES = [
  {
    id: 'acc-01',
    name: 'Caja Rígida Coleccionista Hatgt',
    price: 35,
    tag: 'Recomendado',
    desc: 'Empaque de cartón prensado 450g para viaje y colección'
  },
  {
    id: 'acc-02',
    name: 'Kit Limpiador & Cepillo de Cerda Suave',
    price: 45,
    tag: 'Cuidado',
    desc: 'Especial para algodón peinado, pana y gamuza'
  },
  {
    id: 'acc-03',
    name: 'Llavero Mini-Gorra 502 Chapín',
    price: 25,
    tag: 'Edición Retro',
    desc: 'Bordado miniatura metálico con mosquetón'
  }
];
