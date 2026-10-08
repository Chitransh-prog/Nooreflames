import fs from 'fs';
import path from 'path';

const DEFAULT_NEON_URL =
  'postgresql://neondb_owner:npg_9Hq0dAghKzsm@ep-curly-poetry-b4uv37dd-pooler.c-6.us-east-2.aws.neon.tech/nooreflames?sslmode=require';

export async function getDbClient() {
  const connStr =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.NEON_DATABASE_URL ||
    DEFAULT_NEON_URL;
  if (!connStr) return null;
  try {
    const { neon } = await import('@neondatabase/serverless');
    return neon(connStr);
  } catch (e) {
    console.error('Failed to initialize Neon DB client:', e);
    return null;
  }
}

export interface ProductVariant {
  name: string; // e.g. "Standard Jar (300g)", "Luxe Arch Gift Set", "50ml Eau De Parfum Flacon"
  price: number; // e.g. 899, 1298
  originalPrice?: number;
  volume?: string;
  inStock?: boolean;
}

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
  imageAlt?: string;
  category: 'candles' | 'ocean-fresh' | 'floral-rose' | 'royal-oud' | string;
  inStock: boolean;
  stockCount: number;
  slug?: string;
  metaTitle?: string;
  metaDescription?: string;
  description?: string;
  gallery?: string[];
  galleryAlt?: string[];
  variants?: ProductVariant[];
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
  productType?: 'PERFUME' | 'ATTAR' | 'CANDLE' | 'DISCOVERY' | 'GIFT_SET' | string;
  brand?: string;
  targetGender?: 'FEMALE' | 'MALE' | 'UNISEX' | string;
  countryOfOrigin?: string;
  materialComposition?: string;
  color?: string;
  shortDescription?: string;
}

export interface Coupon {
  code: string;
  discountPercent: number;
  discountAmount?: number;
  fixedPrice?: number;
  minOrder: number;
  description: string;
  freeShipping?: boolean;
  isActive: boolean;
}

export const DEFAULT_COUPONS: Coupon[] = [
  {
    code: 'NOOR20',
    discountPercent: 20,
    minOrder: 999,
    description: '20% off on all orders above ₹999',
    isActive: true,
  },
  {
    code: 'WELCOME10',
    discountPercent: 10,
    minOrder: 499,
    description: '10% off on your first fragrance order',
    isActive: true,
  },
  {
    code: 'EXTRA10',
    discountPercent: 10,
    minOrder: 999,
    description: 'Extra 10% off above ₹999',
    isActive: true,
  },
  {
    code: 'DUO1499',
    discountPercent: 0,
    fixedPrice: 1499,
    minOrder: 1499,
    description: 'Exclusive Bundle: Any 2 Flacons for ₹1,499',
    isActive: true,
  },
  {
    code: 'FREESHIP',
    discountPercent: 0,
    freeShipping: true,
    minOrder: 499,
    description: 'Free nationwide courier shipping',
    isActive: true,
  },
];

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
  paymentStatus?: 'paid' | 'pending' | 'failed' | 'advance_paid' | string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  advancePaymentId?: string;
  advanceAmount?: number;
  remainingCodAmount?: number;
  distanceKm?: number;
  zoneName?: string;
  isPartialCod?: boolean;
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
  imageAlt?: string;
  video?: string;
  mediaType?: 'video' | 'image';
  videoPlaylist?: VideoPlaylistItem[];
  featuredProduct: {
    title: string;
    price: number;
    originalPrice: number;
    image: string;
    imageAlt?: string;
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
  desktopImageAlt?: string;
  mobileImage?: string;
  mobileImageAlt?: string;
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
  backgroundImageAlt?: string;
  showcaseImage: string;
  showcaseImageAlt?: string;
  slides?: CreativeSlideData[];
}

export interface SiteSettings {
  brandName: string;
  tagline: string;
  metaTitle?: string;
  metaDescription?: string;
  defaultImageAlt?: string;
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

export interface CustomerRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  updatedAt?: string;
  welcomeSent?: boolean;
  lastBroadcastAt?: string;
  lastBroadcastMessage?: string;
}

export interface StoreData {
  siteSettings: SiteSettings;
  hero: HeroData;
  discoveryBanner: DiscoveryBannerData;
  products: Product[];
  coupons: Coupon[];
  orders: Order[];
  customers: CustomerRecord[];
}

export function getDataFilePath(): string {
  // If running in a serverless environment (Vercel / AWS Lambda), check /tmp/store.json first
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    const tmpPath = path.join('/tmp', 'store.json');
    if (fs.existsSync(tmpPath)) {
      return tmpPath;
    }
  }

  const candidates = [
    path.join(process.cwd(), 'data', 'store.json'),
    path.join(process.cwd(), 'Nooreflames', 'data', 'store.json'),
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }
  // If parent folder has Nooreflames child
  if (fs.existsSync(path.join(process.cwd(), 'Nooreflames'))) {
    return path.join(process.cwd(), 'Nooreflames', 'data', 'store.json');
  }
  return candidates[0];
}

// In-memory write-through store — always stays fresh and serves as safe fallback
let memoryStore: StoreData | null = null;

export function getStoreData(): StoreData {
  const dataFilePath = getDataFilePath();

  try {
    if (fs.existsSync(dataFilePath)) {
      const raw = fs.readFileSync(dataFilePath, 'utf-8');
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        const result: StoreData = {
          siteSettings: parsed.siteSettings || {
            brandName: 'NOOR-E-FLAMES',
            tagline: 'Where Fragrance Meets Flames',
            announcements: ['🔥 Extra 10% off on order above ₹999'],
            phone: '+91 9289289800',
            email: 'nooreflames@gmail.com',
            contactPerson: 'NOOR-E-FLAMES Atelier',
            businessAddress: 'NEW DELHI-110043',
            freeShippingThreshold: 999,
          },
          hero: parsed.hero || {
            badge: 'HANDCRAFTED LUXURY',
            headline: 'Where Fragrance Meets Flames',
            subtitle: 'Immerse in pure botanical perfumes and sculptural candles.',
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
          discoveryBanner: parsed.discoveryBanner || {
            badge: 'SIGNATURE GIFT PACKAGING',
            title: 'Scented Leaves Pure Blends',
            subtitle: 'Unveil 5 handcrafted fragrance miniatures.',
            buttonText: 'EXPLORE DISCOVERY SET — ₹999',
            buttonLink: '#discovery',
            backgroundImage: '/images/banners/brand-packaging-banner.jpg',
            showcaseImage: '/images/products/signature-white-giftbox.jpg',
          },
          orders: Array.isArray(parsed.orders) ? parsed.orders : [],
          products: Array.isArray(parsed.products) ? parsed.products : [],
          coupons: Array.isArray(parsed.coupons) && parsed.coupons.length > 0 ? parsed.coupons : DEFAULT_COUPONS,
          customers: Array.isArray(parsed.customers) ? parsed.customers : [],
        };
        memoryStore = result;
        return result;
      }
    }
  } catch (err) {
    console.error('Error reading store.json from', dataFilePath, ':', err);
  }

  // If disk read failed but in-memory store exists, return memoryStore
  if (
    memoryStore &&
    Array.isArray(memoryStore.products) &&
    memoryStore.products.length > 0
  ) {
    return memoryStore;
  }

  // Fallback default
  return {
    siteSettings: {
      brandName: 'NOOR-E-FLAMES',
      tagline: 'Where Fragrance Meets Flames',
      announcements: ['🔥 Extra 10% off on order above ₹999'],
      phone: '+91 9289289800',
      email: 'nooreflames@gmail.com',
      contactPerson: 'NOOR-E-FLAMES Atelier',
      businessAddress: 'NEW DELHI-110043',
      freeShippingThreshold: 999,
    },
    hero: {
      badge: 'HANDCRAFTED LUXURY',
      headline: 'Where Fragrance Meets Flames',
      subtitle: 'Immerse in pure botanical perfumes and sculptural candles.',
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
    coupons: DEFAULT_COUPONS,
    orders: [],
    customers: [],
  };
}

/**
 * Asynchronously loads store data, prioritizing the live Neon PostgreSQL database
 * and falling back seamlessly to disk/tmp/in-memory caches.
 */
export async function getStoreDataAsync(): Promise<StoreData> {
  try {
    const sql = await getDbClient();
    if (sql) {
      const rows = await sql`SELECT data FROM store_data WHERE key = 'main' LIMIT 1;`;
      if (rows && rows.length > 0 && rows[0].data) {
        const parsed = rows[0].data as StoreData;
        memoryStore = parsed;
        // Mirror to /tmp/store.json if on serverless
        try {
          fs.writeFileSync(path.join('/tmp', 'store.json'), JSON.stringify(parsed, null, 2), 'utf-8');
        } catch (_) {}
        return parsed;
      }
    }
  } catch (dbErr) {
    console.warn('Neon DB read skipped or unavailable, using local/cached store:', dbErr);
  }

  return getStoreData();
}

export async function saveStoreData(newData: Partial<StoreData>): Promise<boolean> {
  if (!newData || typeof newData !== 'object') {
    console.warn('saveStoreData: ignored null or non-object store data payload');
    return false;
  }

  // Read current store data to perform a non-destructive safe deep merge
  const currentStore = getStoreData();

  const sanitized: StoreData = {
    ...currentStore,
    ...newData,
    siteSettings: {
      ...currentStore.siteSettings,
      ...(newData.siteSettings && typeof newData.siteSettings === 'object' ? newData.siteSettings : {}),
    },
    hero: {
      ...currentStore.hero,
      ...(newData.hero && typeof newData.hero === 'object' ? newData.hero : {}),
      featuredProduct: {
        ...(currentStore.hero?.featuredProduct || {}),
        ...(newData.hero?.featuredProduct && typeof newData.hero.featuredProduct === 'object'
          ? newData.hero.featuredProduct
          : {}),
      },
    },
    discoveryBanner: {
      ...currentStore.discoveryBanner,
      ...(newData.discoveryBanner && typeof newData.discoveryBanner === 'object' ? newData.discoveryBanner : {}),
    },
    orders: Array.isArray(newData.orders) ? newData.orders : currentStore.orders || [],
    products: Array.isArray(newData.products) ? newData.products : currentStore.products || [],
    coupons: Array.isArray(newData.coupons) ? newData.coupons : currentStore.coupons || [],
    customers: Array.isArray(newData.customers)
      ? newData.customers
      : Array.isArray(currentStore.customers)
      ? currentStore.customers
      : [],
  };

  memoryStore = sanitized;

  const jsonString = JSON.stringify(sanitized, null, 2);
  let writtenSuccessfully = false;

  // 1. Try writing to primary project path (local dev / writable fs)
  const dataFilePath = getDataFilePath();
  try {
    const dir = path.dirname(dataFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(dataFilePath, jsonString, 'utf-8');
    writtenSuccessfully = true;
  } catch (err: any) {
    // Expected on Vercel / serverless (read-only filesystem)
    console.warn(`Local disk write to ${dataFilePath} skipped (${err?.code || err?.message}). Using serverless storage.`);
  }

  // 2. Serverless / Vercel fallback: write to writable /tmp/store.json
  try {
    const tmpPath = path.join('/tmp', 'store.json');
    fs.writeFileSync(tmpPath, jsonString, 'utf-8');
    writtenSuccessfully = true;
  } catch (tmpErr) {
    // Non-fatal if /tmp is not available (e.g. Windows without /tmp)
  }

  // 3. Persist to Neon PostgreSQL Database (Live Cloud Persistence)
  let writtenToDb = false;
  try {
    const sql = await getDbClient();
    if (sql) {
      await sql`
        INSERT INTO store_data (key, data, updated_at)
        VALUES ('main', ${jsonString}::jsonb, NOW())
        ON CONFLICT (key) DO UPDATE
        SET data = EXCLUDED.data, updated_at = NOW();
      `;
      writtenToDb = true;
    }
  } catch (dbErr) {
    console.warn('Neon DB persistence error (fallback active):', dbErr);
  }

  // Success if written to DB, /tmp, local disk, or updated in-memory
  return writtenToDb || writtenSuccessfully || Boolean(memoryStore);
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
    // Legacy perfume card IDs mapped to authoritative perfumes
    'prod-9': 'prod-the-ninth-tide',
    'prod-10': 'prod-the-eclipse',
    'prod-11': 'prod-khwaab',
    'prod-12': 'prod-blush-hour',
    'prod-13': 'prod-bulgarian-rose-attar',
    'prod-14': 'prod-oud-regence',
    'prod-15': 'prod-pistachio-affair',
    'prod-16': 'prod-pralin-de-minuit',
    'prod-20': 'prod-golden-bakery',
    'prod-26': 'prod-disc-dual',
    'prod-27': 'prod-after-midnight',
    'prod-28': 'prod-rose-maudite',
    'prod-8': 'prod-25', // berry bliss
    'prod-24': 'prod-7', // floral teddy
    // Slugs and friendly keys
    'blush-hour': 'prod-blush-hour',
    'vanilla-covenant': 'prod-vanilla-covenant',
    'pistachio-affair': 'prod-pistachio-affair',
    'the-eclipse': 'prod-the-eclipse',
    'golden-bakery': 'prod-golden-bakery',
    'after-midnight': 'prod-after-midnight',
    'rose-maudite': 'prod-rose-maudite',
    'the-ninth-tide': 'prod-the-ninth-tide',
    'oud-regence': 'prod-oud-regence',
    'bulgarian-rose': 'prod-bulgarian-rose-attar',
    'bulgarian-rose-attar': 'prod-bulgarian-rose-attar',
    'pralin-de-minuit': 'prod-pralin-de-minuit',
    'khwaab': 'prod-khwaab',
    // Candles
    'prod-candle-1': 'prod-21',
    'prod-candle-2': 'prod-25',
    'prod-candle-3': 'prod-25',
    'prod-candle-4': 'prod-23',
    'prod-candle-5': 'prod-7',
    'prod-candle-6': 'prod-3',
    'prod-candle-7': 'prod-2',
    'prod-candle-8': 'prod-1',
    'cutting-chai-candle': 'prod-2',
    'cutting-chai': 'prod-2',
    'strawberry-shortcake': 'prod-21',
    'strawberry-dessert-candle': 'prod-21',
    'birthday-candle': 'prod-21',
    'evil-eye': 'prod-22',
    'evil-eye-candle': 'prod-22',
    'rose-whimsy': 'prod-23',
    'rose-whimsy-candle': 'prod-23',
    'floral-teddy': 'prod-7',
    'floral-teddy-candle': 'prod-7',
    'teddy-bear-candle': 'prod-7',
    'teddy-4-u': 'prod-7',
    'berry-bliss': 'prod-25',
    'chocolate-cupcake-candle': 'prod-25',
    'mango-berry-bliss': 'prod-3',
    'whispered-surprises': 'prod-1',
    'luxe-arch-vault': 'prod-6',
    'arch-gift-box': 'prod-6',
    'discovery-her': 'prod-disc-her',
    'discovery-him': 'prod-disc-him',
    'discovery-dual': 'prod-disc-dual',
    'complete-discovery-vault': 'prod-disc-dual',
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
