import fs from 'fs';
import path from 'path';
import { neon } from '@neondatabase/serverless';

const DEFAULT_NEON_URL =
  'postgresql://neondb_owner:npg_9Hq0dAghKzsm@ep-curly-poetry-b4uv37dd-pooler.c-6.us-east-2.aws.neon.tech/nooreflames?sslmode=require';

export const ATTARS_DATA = [
  {
    id: 'prod-noor-oud',
    sku: 'NF-ATR-NOOR-OUD',
    slug: 'noor-oud-pure-attar',
    badge: 'OUD-LED · WARM & SMOKY',
    brand: 'NOOREFLAMES',
    image: '/images/products/attar-crystal-flacon.jpg',
    price: 999,
    title: 'NOOR OUD',
    rating: 5.0,
    volume: '8ML Pure Concentrated Oil',
    gallery: [
      '/images/products/attar-crystal-flacon.jpg',
      '/images/products/attar-crystal-flacon-2.jpg',
      '/images/products/attar-crystal-flacon-3.jpg',
      '/images/products/attar-crystal-flacon-7.jpg'
    ],
    inStock: true,
    sillage: 'Warm, Noticeable & Close to the Skin',
    category: 'royal-oud',
    subtitle: 'For those who prefer to smell different · Smooth, Deep Oud with Warm Smoky Character',
    topNotes: [
      'Subtle Tobacco',
      'Warm Spices',
      'Refined Resins'
    ],
    variants: [
      {
        name: '8ML Pure Crystal Flacon',
        price: 999,
        volume: '8ML',
        inStock: true,
        originalPrice: 1499
      }
    ],
    baseNotes: [
      'Warm Amber',
      'Smoky Cedar',
      'Skin-Close Earthy Woods'
    ],
    longevity: '14+ Hours Skin Contact',
    heartNotes: [
      'Deep Smoky Oud',
      'Aged Woods',
      'Bespoke Agarwood'
    ],
    stockCount: 50,
    description: `A smooth, deep Oud-led attar with a warm smoky character. The Oud gives it its distinctive depth, while subtle tobacco, spice and woody accords make it easier to wear and more balanced.

It is not overly sweet, not overly fresh, and not made to smell ordinary. The character stays close to the skin, creating a warm and noticeable scent without feeling excessive.

What makes it different:
A fragrance built around Oud rather than sweetness—giving you a more mature, refined and distinctive way to wear fragrance.

For:
Those who want a signature scent with character, especially for evenings, occasions, or everyday wear when you want something a little different.

Profile:
Oud-led • Woody • Smoky • Warm • Spiced

The idea:
Wear Oud. Keep your own character.`,
    ingredients: [
      'Pure Distilled Agarwood (Oud) Oil',
      'Tobacco Leaf Accord',
      'Natural Spice Resins',
      'Botanical Amber',
      'Jojoba Carrier Base'
    ],
    productType: 'ATTAR',
    scentFamily: 'Oud-led • Woody • Smoky • Warm • Spiced',
    usageRitual: 'Apply a drop with the crystal applicator rod to pulse points (wrist, neck, collarbone). Gently dab—do not rub—to allow the smoky oud character to bloom naturally.',
    reviewsCount: 186,
    targetGender: 'UNISEX',
    concentration: '100% Pure Concentrated Oil (Alcohol-Free)',
    originalPrice: 1499,
    countryOfOrigin: 'INDIA',
    shortDescription: 'Oud-led • Woody • Smoky • Warm • Spiced. A fragrance built around Oud rather than sweetness.'
  },
  {
    id: 'prod-khwaab',
    sku: 'NF-ATR-KHWAAB',
    slug: 'khwaab-pure-attar',
    badge: 'MODERN OUD · THE ESSENCE',
    brand: 'NOOREFLAMES',
    image: '/images/products/attar-crystal-flacon-4.jpg',
    price: 999,
    title: 'KHWAAB',
    rating: 5.0,
    volume: '8ML Pure Concentrated Oil',
    gallery: [
      '/images/products/attar-crystal-flacon-4.jpg',
      '/images/products/attar-crystal-flacon.jpg',
      '/images/products/attar-crystal-flacon-11.jpg',
      '/images/products/attar-crystal-flacon-12.jpg'
    ],
    inStock: true,
    sillage: 'Distinctive, Approachable & Memorable',
    category: 'royal-oud',
    subtitle: 'The Essence · A Modern Expression of Oud for Everyday Moments',
    topNotes: [
      'Clean Aromatic Dew',
      'Soft Citrus Sparkle',
      'Light Herbs'
    ],
    variants: [
      {
        name: '8ML Pure Crystal Flacon',
        price: 999,
        volume: '8ML',
        inStock: true,
        originalPrice: 1499
      }
    ],
    baseNotes: [
      'Golden Amber',
      'Creamy Sandalwood',
      'Subtle Skin Musk'
    ],
    longevity: '14+ Hours Wear',
    heartNotes: [
      'Refined Modern Oud',
      'Warm Cashmere Woods',
      'Soft Rose Touch'
    ],
    stockCount: 60,
    description: `A modern expression of Oud, created for everyday moments that deserve to feel special.

KHWAAB brings together the depth of Oud with a soft warmth and clean aromatic character. It feels rich without being too heavy, distinctive without being difficult to wear.

It is the kind of fragrance that can become your own smell—something familiar to you, yet different enough for people around you to notice.

Characteristics:
Oud-led • Warm • Woody • Smooth • Aromatic • Refined
The Oud gives KHWAAB its depth and individuality, while the surrounding warmth keeps it balanced and approachable.

The Impression:
KHWAAB is about leaving a good impression without trying too hard. You wear it to work, while meeting someone, going out in the evening, or simply when you want to feel well put together. It doesn’t need a special occasion. It makes an ordinary moment feel a little more like yours.

What Makes KHWAAB Different:
Many fragrances are made to immediately grab attention. KHWAAB is made to stay in memory. Its Oud character gives it something recognisable and different, while the smoother side makes it easy to wear again and again.

For someone who wants:
• A distinctive everyday fragrance
• The depth of Oud without it feeling overwhelming
• Something mature yet easy to wear
• A scent that works across different occasions
• A fragrance that can become their signature

When to Wear:
Day • Evening • Work • Gatherings • Special occasions
KHWAAB is intentionally versatile—one attar you don’t have to keep for only one type of occasion.

The Feeling:
”Something you wear for yourself, and others remember you by.”

KHWAAB — Oud with a feeling of its own.`,
    ingredients: [
      'Pure Agarwood (Oud) Distillate',
      'Botanical Aromatic Blends',
      'Amber Resin',
      'Australian Sandalwood Oil',
      'Natural Base'
    ],
    productType: 'ATTAR',
    scentFamily: 'Oud-led • Warm • Woody • Smooth • Aromatic • Refined',
    usageRitual: 'Dab directly onto pulse points before work, gatherings, or evenings. Transforms into an intimate, distinctive personal scent aura.',
    reviewsCount: 214,
    targetGender: 'UNISEX',
    concentration: '100% Pure Concentrated Oil (Alcohol-Free)',
    originalPrice: 1499,
    countryOfOrigin: 'INDIA',
    shortDescription: 'Oud-led • Warm • Woody • Smooth • Aromatic • Refined. Something you wear for yourself, and others remember you by.'
  },
  {
    id: 'prod-ruh-khus',
    sku: 'NF-ATR-RUH-KHUS',
    slug: 'ruh-khus-pure-attar',
    badge: '100% PURE KHUS · EARTHY & COOL',
    brand: 'NOOREFLAMES',
    image: '/images/products/citrus-ozone-attar.jpg',
    price: 999,
    title: 'RUH KHUS',
    rating: 5.0,
    volume: '8ML Pure Concentrated Oil',
    gallery: [
      '/images/products/citrus-ozone-attar.jpg',
      '/images/products/attar-crystal-flacon-5.jpg',
      '/images/products/attar-crystal-flacon-8.jpg',
      '/images/products/attar-crystal-flacon.jpg'
    ],
    inStock: true,
    sillage: 'Clean, Calm & Naturally Refreshing',
    category: 'ocean-fresh',
    subtitle: 'Fresh from the earth. Made for you. · Pure Alcohol-Free Khus Essential Oil',
    topNotes: [
      'Cool Green Vetiver',
      'Morning Dewdrop',
      'Fresh Rain Air'
    ],
    variants: [
      {
        name: '8ML Pure Crystal Flacon',
        price: 999,
        volume: '8ML',
        inStock: true,
        originalPrice: 1499
      }
    ],
    baseNotes: [
      'Deep Grounded Woods',
      'Forest Moss',
      'Cool Herbal Resins'
    ],
    longevity: '12+ Hours Earthy Freshness',
    heartNotes: [
      'Pure Wild Indian Khus Roots',
      'Moist Earth Accord'
    ],
    stockCount: 45,
    description: `The Essence:
A pure, alcohol-free Khus essential-oil attar with a naturally cool, green and earthy character. Its rooty depth gives the fragrance a calm, grounded feel, while its fresh side keeps it easy to wear.

Characteristics:
Earthy • Green • Cool • Woody • Fresh • Natural

The Impression:
Ruh Khus feels clean, calm and naturally refreshing. It is different from sweet or heavy fragrances—its earthy character gives you a more natural and understated way to smell good.

Why You’ll Choose It:
For anyone who wants a fragrance that feels fresh without being sharp, earthy without being heavy, and distinctive without being loud.

For:
Everyday wear, work, travel, summer days, after a shower, or whenever you want a quiet, refreshing scent close to the skin.

Pure & Alcohol-Free:
Made as a pure essential-oil-based attar, without alcohol, keeping the natural character of Khus at the centre.

RUH KHUS — Fresh from the earth. Made for you.`,
    ingredients: [
      '100% Pure Steam-Distilled Vetiver Root (Khus) Essential Oil',
      'Natural Botanical Essences'
    ],
    productType: 'ATTAR',
    scentFamily: 'Earthy • Green • Cool • Woody • Fresh • Natural',
    usageRitual: 'Touch the glass rod to your wrists, neck, and behind the ears after a warm shower or on warm days for a calm, grounded, natural freshness.',
    reviewsCount: 172,
    targetGender: 'UNISEX',
    concentration: '100% Pure Essential-Oil Attar (Alcohol-Free)',
    originalPrice: 1499,
    countryOfOrigin: 'INDIA',
    shortDescription: 'Earthy • Green • Cool • Woody • Fresh • Natural. Pure essential-oil-based attar without alcohol.'
  },
  {
    id: 'prod-musk-royal',
    sku: 'NF-ATR-MUSK-ROYAL',
    slug: 'musk-royal-pure-attar',
    badge: 'SKIN-CLOSE MUSK · SOFT & ELEGANT',
    brand: 'NOOREFLAMES',
    image: '/images/products/attar-crystal-flacon-2.jpg',
    price: 999,
    title: 'MUSK ROYAL',
    rating: 4.9,
    volume: '8ML Pure Concentrated Oil',
    gallery: [
      '/images/products/attar-crystal-flacon-2.jpg',
      '/images/products/attar-crystal-flacon-6.jpg',
      '/images/products/attar-crystal-flacon-7.jpg',
      '/images/products/attar-crystal-flacon-9.jpg'
    ],
    inStock: true,
    sillage: 'Intimate, Inviting & Softly Lingering',
    category: 'floral-rose',
    subtitle: 'Soft on the skin. Easy to remember. · Pure Comforting Musk with Soft Fruity Opening',
    topNotes: [
      'Soft Fruity Sparkle',
      'Fresh Morning Mist'
    ],
    variants: [
      {
        name: '8ML Pure Crystal Flacon',
        price: 999,
        volume: '8ML',
        inStock: true,
        originalPrice: 1499
      }
    ],
    baseNotes: [
      'Clean Skin Musk',
      'Golden Cashmere',
      'Subtle Warm Amber'
    ],
    longevity: '14+ Hours Skin Comfort',
    heartNotes: [
      'Royal White Musk',
      'Gentle Honeyed Warmth',
      'Velvet Petals'
    ],
    stockCount: 55,
    description: `The Essence:
A smooth, alcohol-free Musk attar with a soft fruity opening and a warm, subtly sweet character. The Musk remains at the heart of the fragrance, giving it a clean and comforting feel.

Characteristics:
Soft • Clean • Warm • Musky • Subtly Sweet • Elegant

The Impression:
Musk Royal is made for people who want to smell naturally pleasant without being overpowering. It feels smooth and inviting, making it easy to wear whether you’re heading to work, meeting someone, or simply going about your day.

The gentle sweetness adds warmth, while the Musk gives it a familiar, skin-like quality that makes the fragrance feel personal rather than excessive.

Why You’ll Choose It:
If you prefer fragrances that are easy to like, easy to wear and still have their own character, Musk Royal fits naturally into your collection.

For:
Everyday wear • Work • Gatherings • Dates • Evenings • Special occasions

Pure & Alcohol-Free:
A pure essential-oil-based attar, without alcohol, created for direct, traditional fragrance wear.

MUSK ROYAL — Soft on the skin. Easy to remember.`,
    ingredients: [
      'Pure Botanical Musk Oil',
      'Fruit Blossom Essences',
      'White Amber Accord',
      'Plant-Based Carrier Oil'
    ],
    productType: 'ATTAR',
    scentFamily: 'Soft • Clean • Warm • Musky • Subtly Sweet • Elegant',
    usageRitual: 'Apply directly to collarbones and pulse points. Blends with your natural skin chemistry to create an effortless, inviting scent trail.',
    reviewsCount: 195,
    targetGender: 'UNISEX',
    concentration: '100% Pure Essential-Oil Attar (Alcohol-Free)',
    originalPrice: 1499,
    countryOfOrigin: 'INDIA',
    shortDescription: 'Soft • Clean • Warm • Musky • Subtly Sweet • Elegant. Skin-like quality that makes fragrance feel personal.'
  },
  {
    id: 'prod-mizaaj',
    sku: 'NF-ATR-MIZAAJ',
    slug: 'mizaaj-pure-attar',
    badge: 'MODERN GOURMAND · COFFEE & CACAO',
    brand: 'NOOREFLAMES',
    image: '/images/products/attar-crystal-flacon-3.jpg',
    price: 999,
    title: 'MIZAAJ',
    rating: 5.0,
    volume: '8ML Pure Concentrated Oil',
    gallery: [
      '/images/products/attar-crystal-flacon-3.jpg',
      '/images/products/attar-crystal-flacon-10.jpg',
      '/images/products/attar-crystal-flacon-6.jpg',
      '/images/products/attar-crystal-flacon-9.jpg'
    ],
    inStock: true,
    sillage: 'Addictive, Warm & Comforting Projection',
    category: 'royal-oud',
    subtitle: 'Your kind of different · Rich Warm Coffee, Creamy Cacao, Golden Caramel & Bourbon Vanilla',
    topNotes: [
      'Warm Roasted Coffee',
      'Aromatic Cardamom & Spice'
    ],
    variants: [
      {
        name: '8ML Pure Crystal Flacon',
        price: 999,
        volume: '8ML',
        inStock: true,
        originalPrice: 1499
      }
    ],
    baseNotes: [
      'Bourbon Vanilla Pod',
      'Velvety Soft Woods',
      'Warm Amber'
    ],
    longevity: '14+ Hours Wear',
    heartNotes: [
      'Creamy Rich Cacao',
      'Golden Caramel Nectar'
    ],
    stockCount: 48,
    description: `Your kind of different

The Essence:
A rich, alcohol-free oil attar where warm coffee and spice meet creamy cacao, caramel and vanilla. It starts warm and inviting, then becomes softer, sweeter and more addictive on the skin. The result is a gourmand fragrance that feels comforting, modern and different from a typical sweet attar.

Characteristics:
Gourmand • Creamy • Warm • Cacao-rich • Spiced • Smooth • Addictive

The Impression:
MIZAaj is for the person who wants their fragrance to feel approachable but memorable. It has the warmth of something familiar—like coffee, chocolate and freshly made sweets—but is blended into a fragrance rather than simply smelling like dessert. Sweet enough to be enjoyable. Rich enough to have character.

What Makes It Different:
This isn’t simply “a chocolate fragrance.” The coffee-spice warmth gives the cacao depth, while the creamy vanilla and caramel side make it smooth and easy to wear. That balance makes it work for someone who normally wears woody/oud fragrances as well as someone who prefers sweet, modern fragrances.

For You:
For the customer who wants:
• Something different.
• Something easy to love.
• Something people remember.
Wear it when you want your fragrance to feel a little more personal, playful and contemporary.

The Gen-Z Side:
Coffee energy. Chocolate comfort. Your own vibe. Not overly formal. Not old-fashioned. Just a fragrance that fits your mood, your outfit and your moment.

When to Wear:
Evenings • Dates • Cafés • Gatherings • Winter • Casual nights • Special moments

Oil Attar:
Alcohol-free • Oil-based • Skin-friendly fragrance format`,
    ingredients: [
      'Roasted Coffee Extract',
      'Cacao Absolute',
      'Madagascar Vanilla',
      'Caramelized Accord',
      'Warm Spices',
      'Botanical Oil Base'
    ],
    productType: 'ATTAR',
    scentFamily: 'Gourmand • Creamy • Warm • Cacao-rich • Spiced • Smooth • Addictive',
    usageRitual: 'Dab on pulse points before café dates, evenings, and casual nights. Radiates an intoxicating, addictive chocolate and coffee warmth.',
    reviewsCount: 168,
    targetGender: 'UNISEX',
    concentration: '100% Pure Concentrated Oil (Alcohol-Free)',
    originalPrice: 1499,
    countryOfOrigin: 'INDIA',
    shortDescription: 'Gourmand • Creamy • Warm • Cacao-rich • Spiced • Smooth • Addictive. Coffee energy. Chocolate comfort. Your own vibe.'
  },
  {
    id: 'prod-gul-mehfil',
    sku: 'NF-ATR-GUL-MEHFIL',
    slug: 'gul-mehfil-pure-attar',
    badge: 'LIVING ROSE · TIMELESS PRESENCE',
    brand: 'NOOREFLAMES',
    image: '/images/products/imperial-jasmine-attar.jpg',
    price: 999,
    title: 'GUL MEHFIL',
    rating: 5.0,
    volume: '8ML Pure Concentrated Oil',
    gallery: [
      '/images/products/imperial-jasmine-attar.jpg',
      '/images/products/attar-crystal-flacon-2.jpg',
      '/images/products/attar-crystal-flacon-4.jpg',
      '/images/products/attar-crystal-flacon-5.jpg'
    ],
    inStock: true,
    sillage: 'Intimate, Graceful & Unforgettably Attractive',
    category: 'floral-rose',
    subtitle: 'Some roses bloom. Some stay in memory · Fresh Blooming Living Rose with Gentle Warmth',
    topNotes: [
      'Fresh Blooming Rose Petals',
      'Morning Dewdrop',
      'Crisp Green Touch'
    ],
    variants: [
      {
        name: '8ML Pure Crystal Flacon',
        price: 999,
        volume: '8ML',
        inStock: true,
        originalPrice: 1499
      }
    ],
    baseNotes: [
      'Intimate Warm Amber',
      'Clean Creamy Sandalwood',
      'Subtle Velvet Musk'
    ],
    longevity: '14+ Hours Wear',
    heartNotes: [
      'Living Damask Rose',
      'Soft-Spiced Floral Warmth',
      'Honeyed Nectar'
    ],
    stockCount: 52,
    description: `Some roses bloom. Some stay in memory.

The Essence:
A living rose, made for unforgettable presence.
GUL MEHFIL captures the feeling of walking into a gathering where everything feels warm, fresh and alive. The rose feels natural and blooming, while a gentle warmth underneath gives it depth instead of making it smell like a conventional rose perfume. It is soft enough to feel intimate, yet distinctive enough to become your signature.

What Makes GUL MEHFIL Different:
Most rose attars focus on making you smell like rose.
GUL MEHFIL focuses on what the rose does to your presence.
It creates an aura that feels fresh when first noticed, graceful as it settles, and warmly memorable on skin. That makes the fragrance less about a particular age, gender or occasion—and more about the impression you leave behind.

Characteristics:
Fresh • Rosy • Natural • Warm • Soft-Spiced • Elegant • Memorable

Overall Impression:
A fresh blooming rose with a warm, intimate character.
Not overly sweet.
Not too sharp.
Not an old-fashioned rose scent.
It feels clean, graceful and naturally attractive, with enough depth to stay interesting throughout the day.

For Her:
For girls who want their fragrance to feel feminine without being overly sweet or loud. Soft, graceful and effortlessly attractive—something that feels beautiful when you’re close to someone rather than filling the entire room.

For Him:
For men who prefer clean floral sophistication with warmth, rather than the usual heavy oud or musky attars. The rose gives it individuality without making it feel traditionally feminine.

For Everyone:
First meetings. Everyday wear. Work. Gatherings. Dates. Family occasions. Evenings.
Basically, the fragrance you reach for when you want people to remember how good you smelled, without wondering what you were trying to prove.

The Feeling:
“I don’t want everyone to notice my perfume. I want the right people to remember it.”`,
    ingredients: [
      'Damask Rose Petal Distillate',
      'Living Rose Essence',
      'Natural Sandalwood Oil',
      'Golden Ambergris Accord',
      'Pure Jojoba Carrier'
    ],
    productType: 'ATTAR',
    scentFamily: 'Fresh • Rosy • Natural • Warm • Soft-Spiced • Elegant • Memorable',
    usageRitual: 'Touch with glass applicator to wrists and collarbones. Creates a warm, natural rose presence that draws people in close.',
    reviewsCount: 220,
    targetGender: 'UNISEX',
    concentration: '100% Pure Concentrated Oil (Alcohol-Free)',
    originalPrice: 1499,
    countryOfOrigin: 'INDIA',
    shortDescription: 'Fresh • Rosy • Natural • Warm • Soft-Spiced • Elegant • Memorable. A fresh blooming rose with an intimate character.'
  }
];

async function sync() {
  const storePath = path.join(process.cwd(), 'data', 'store.json');
  const raw = fs.readFileSync(storePath, 'utf8');
  const store = JSON.parse(raw);

  // Filter out any old attars or duplicates
  const attarIds = new Set(ATTARS_DATA.map((a) => a.id));
  const oldAttarIds = new Set([
    'prod-oud-regence',
    'prod-bulgarian-rose-attar',
    'prod-pralin-de-minuit',
    'prod-khwaab',
    ...attarIds,
  ]);

  const nonAttarProducts = (store.products || []).filter(
    (p) => !oldAttarIds.has(p.id) && p.productType !== 'ATTAR'
  );

  // Combine non-attar products + 6 new attars
  store.products = [...nonAttarProducts, ...ATTARS_DATA];

  // Write to local data/store.json
  fs.writeFileSync(storePath, JSON.stringify(store, null, 2), 'utf8');
  console.log('Successfully updated local data/store.json with 6 Attars!');

  // Sync with Neon PostgreSQL if accessible
  try {
    const connStr = process.env.DATABASE_URL || DEFAULT_NEON_URL;
    const sql = neon(connStr);
    await sql`
      CREATE TABLE IF NOT EXISTS store_data (
        key VARCHAR(50) PRIMARY KEY,
        data JSONB NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await sql`
      INSERT INTO store_data (key, data, updated_at)
      VALUES ('main', ${JSON.stringify(store)}::jsonb, NOW())
      ON CONFLICT (key) DO UPDATE
      SET data = EXCLUDED.data, updated_at = NOW();
    `;
    console.log('Successfully updated live Neon PostgreSQL store_data with 6 Attars!');
  } catch (err) {
    console.warn('Neon DB sync warning (local store is saved):', err.message);
  }
}

if (process.argv[1] && process.argv[1].includes('update-attars.mjs')) {
  sync();
}
