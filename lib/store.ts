import fs from 'fs';
import path from 'path';

export interface Product {
  id: string;
  sku: string;
  title: string;
  subtitle: string;
  price: number;
  originalPrice?: number;
  rating?: number;
  reviewsCount?: number;
  badge?: string;
  image: string;
  category: 'candles' | 'ocean-fresh' | 'floral-rose' | 'royal-oud' | string;
  inStock: boolean;
  stockCount: number;
  slug?: string;
  description?: string;
  gallery?: string[];
  scentFamily?: string;
  topNotes?: string[];
  heartNotes?: string[];
  baseNotes?: string[];
  volume?: string;
  longevity?: string;
  sillage?: string;
  concentration?: string;
  usageRitual?: string;
  ingredients?: string[];
}

export interface Coupon {
  code: string;
  discountPercent: number;
  minOrder: number;
  description: string;
  freeShipping?: boolean;
  isActive: boolean;
}

export interface OrderItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  customer: string;
  email: string;
  phone: string;
  destination: string;
  address: string;
  pincode: string;
  amount: number;
  payment: string;
  deliveryStatus: 'confirmed' | 'dispatched' | 'in-transit' | 'delivered' | 'cancelled' | string;
  createdAt: string;
  items: OrderItem[];
}

export interface VideoPlaylistItem {
  id: string;
  title: string;
  label: string;
  url: string;
  badge?: string;
}

export interface HeroData {
  badge: string;
  headline: string;
  subtitle: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  image: string;
  video?: string;
  mediaType?: 'video' | 'image';
  videoPlaylist?: VideoPlaylistItem[];
  featuredProduct: {
    title: string;
    price: number;
    originalPrice: number;
    image: string;
    link: string;
  };
}

export interface CreativeSlideData {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  description?: string;
  desktopImage: string;
  mobileImage?: string;
  buttonText: string;
  buttonLink: string;
  tag?: string;
  themeColor?: string;
}

export interface DiscoveryBannerData {
  badge: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  backgroundImage: string;
  showcaseImage: string;
  slides?: CreativeSlideData[];
}

export interface SiteSettings {
  brandName: string;
  tagline: string;
  announcements: string[];
  phone: string;
  email: string;
  freeShippingThreshold: number;
  whyUsBadge?: string;
  whyUsTitle?: string;
  testimonialsTitle?: string;
  testimonialsBadge?: string;
  review1Photo?: string;
  review2Photo?: string;
  footerPhilosophy?: string;
  footerNewsletterTitle?: string;
  footerNewsletterDesc?: string;
  footerCopyright?: string;
  [key: string]: any;
}

export interface StoreData {
  siteSettings: SiteSettings;
  hero: HeroData;
  discoveryBanner: DiscoveryBannerData;
  products: Product[];
  coupons: Coupon[];
  orders: Order[];
}

const dataFilePath = path.join(process.cwd(), 'data', 'store.json');

// In-memory cache for serverless runtimes where fs might be read-only or reset
let memoryStore: StoreData | null = null;

export function getStoreData(): StoreData {
  if (
    memoryStore &&
    Array.isArray(memoryStore.orders) &&
    Array.isArray(memoryStore.products) &&
    Array.isArray(memoryStore.coupons)
  ) {
    return memoryStore;
  }

  try {
    if (fs.existsSync(dataFilePath)) {
      const raw = fs.readFileSync(dataFilePath, 'utf-8');
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object' && Array.isArray(parsed.products)) {
        const result: StoreData = {
          ...parsed,
          orders: Array.isArray(parsed.orders) ? parsed.orders : [],
          products: Array.isArray(parsed.products) ? parsed.products : [],
          coupons: Array.isArray(parsed.coupons) ? parsed.coupons : [],
        };
        memoryStore = result;
        return result;
      }
    }
  } catch (err) {
    console.error('Error reading store.json:', err);
  }

  // Fallback default
  return {
    siteSettings: {
      brandName: 'NOOR-E-FLAMES',
      tagline: 'Where Fragrance Meets Flames',
      announcements: ['🔥 Extra 10% off on order above ₹999'],
      phone: '+91 (800) 447-2372',
      email: 'concierge@nooreflames.com',
      freeShippingThreshold: 999,
    },
    hero: {
      badge: 'HANDCRAFTED LUXURY',
      headline: 'Where Fragrance Meets Flames',
      subtitle: 'Immerse in pure botanical extraits and sculptural candles.',
      primaryCtaText: 'EXPLORE ALL BLENDS',
      primaryCtaLink: '#edps',
      secondaryCtaText: 'TRY DISCOVERY SET — ₹999',
      secondaryCtaLink: '#discovery',
      image: '/images/hero/hero-candle.jpg',
      featuredProduct: {
        title: 'Whispered Surprises Candle',
        price: 1199,
        originalPrice: 1599,
        image: '/images/products/whispered-surprises.jpg',
        link: '#edps',
      },
    },
    discoveryBanner: {
      badge: 'SIGNATURE GIFT PACKAGING',
      title: 'Scented Leaves Pure Blends',
      subtitle: 'Unveil 5 handcrafted fragrance miniatures.',
      buttonText: 'EXPLORE DISCOVERY SET — ₹999',
      buttonLink: '#discovery',
      backgroundImage: '/images/banners/brand-packaging-banner.jpg',
      showcaseImage: '/images/products/signature-white-giftbox.jpg',
    },
    products: [],
    coupons: [],
    orders: [],
  };
}

export function saveStoreData(newData: StoreData): boolean {
  if (!newData || typeof newData !== 'object' || !Array.isArray(newData.products)) {
    console.warn('saveStoreData: ignored invalid store data payload');
    return false;
  }

  const sanitized: StoreData = {
    ...newData,
    orders: Array.isArray(newData.orders) ? newData.orders : [],
    products: Array.isArray(newData.products) ? newData.products : [],
    coupons: Array.isArray(newData.coupons) ? newData.coupons : [],
  };

  memoryStore = sanitized;
  try {
    const dir = path.dirname(dataFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(dataFilePath, JSON.stringify(sanitized, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error saving store.json:', err);
    return false;
  }
}

export function getOrders(): Order[] {
  const store = getStoreData();
  return store.orders || [];
}

export function createOrder(orderInput: Omit<Order, 'id' | 'createdAt' | 'deliveryStatus'> & { deliveryStatus?: string }): Order {
  const store = getStoreData();
  
  // Generate random Order ID like NF-9083
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const newOrder: Order = {
    ...orderInput,
    id: `NF-${randomNum}`,
    deliveryStatus: orderInput.deliveryStatus || 'confirmed',
    createdAt: new Date().toISOString(),
  };

  store.orders.unshift(newOrder); // Add to top
  saveStoreData(store);
  return newOrder;
}

export function updateOrderStatus(orderId: string, status: string): Order | null {
  const store = getStoreData();
  const order = store.orders.find((o) => o.id === orderId);
  if (!order) return null;

  order.deliveryStatus = status;
  saveStoreData(store);
  return order;
}

export function upsertProduct(product: Product): Product {
  const store = getStoreData();
  const index = store.products.findIndex((p) => p.id === product.id);
  if (index >= 0) {
    store.products[index] = product;
  } else {
    store.products.push(product);
  }
  saveStoreData(store);
  return product;
}

export function deleteProduct(productId: string): boolean {
  const store = getStoreData();
  const beforeLen = store.products.length;
  store.products = store.products.filter((p) => p.id !== productId);
  if (store.products.length !== beforeLen) {
    saveStoreData(store);
    return true;
  }
  return false;
}

export function getProductById(id: string): Product | undefined {
  const store = getStoreData();
  if (!id) return undefined;
  const cleanId = decodeURIComponent(id).toLowerCase().trim();

  // 1. Direct match by ID, SKU, Slug, or title slug
  const directMatch = store.products.find(
    (p) =>
      p.id.toLowerCase() === cleanId ||
      p.sku.toLowerCase() === cleanId ||
      (p.slug && p.slug.toLowerCase() === cleanId) ||
      p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === cleanId ||
      p.title.toLowerCase().replace(/[^a-z0-9]+/g, '') === cleanId.replace(/[^a-z0-9]+/g, '')
  );
  if (directMatch) return directMatch;

  // 2. Numeric match (e.g. '1' -> 'prod-1')
  if (/^\d+$/.test(cleanId)) {
    const numMatch = store.products.find((p) => p.id === `prod-${cleanId}`);
    if (numMatch) return numMatch;
  }

  // 3. Known aliases & legacy card IDs
  const legacyAliases: Record<string, string> = {
    'prod-candle-1': 'prod-5', // Strawberry Shortcake Soy Duo
    'prod-candle-2': 'prod-8', // Chocolate Romance Cupcake
    'prod-candle-3': 'prod-6', // Signature NF Luxe Arch Gift Box
    'prod-candle-4': 'prod-4', // Rose Bear & Velvet Heart Duo
    'prod-candle-5': 'prod-7', // Artisan Teddy & Balloon
    'prod-candle-6': 'prod-3', // Mango Berry Bliss Coupe
    'prod-candle-7': 'prod-2', // Cutting Chai
    'prod-candle-8': 'prod-1', // Whispered Surprises
    'cutting-chai-candle': 'prod-2',
    'strawberry-shortcake': 'prod-5',
    'strawberry-dessert-candle': 'prod-5',
    'chocolate-cupcake-candle': 'prod-8',
    'mango-berry-bliss': 'prod-3',
    'rose-bear-duo': 'prod-4',
    'whispered-surprises': 'prod-1',
    'teddy-bear-candle': 'prod-7',
    'velvet-rose': 'prod-12',
    'oceanic-breeze': 'prod-9',
    'oceanic-breeze-edp': 'prod-9',
    'aqua-noir': 'prod-10',
    'royal-smokey-oud': 'prod-14',
    'saffron-tobacco': 'prod-15',
    'amber-noir': 'prod-16',
    'imperial-jasmine': 'prod-13',
    'citrus-ozone': 'prod-11',
  };

  if (legacyAliases[cleanId]) {
    return store.products.find((p) => p.id === legacyAliases[cleanId]);
  }

  // 4. Fuzzy fallback search on ID/slug containment
  return store.products.find(
    (p) =>
      cleanId.includes(p.id.toLowerCase()) ||
      (p.slug && cleanId.includes(p.slug.toLowerCase()))
  );
}

export function getRelatedProducts(productId: string, limit = 8): Product[] {
  const store = getStoreData();
  const current = store.products.find((p) => p.id === productId);
  if (!current) return store.products.filter((p) => p.id !== productId).slice(0, limit);
  const sameCategory = store.products.filter((p) => p.id !== productId && p.category === current.category);
  const otherCategory = store.products.filter((p) => p.id !== productId && p.category !== current.category);
  return [...sameCategory, ...otherCategory].slice(0, limit);
}
